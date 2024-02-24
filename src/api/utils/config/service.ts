import { YachtConfigSchema, type YachtConfig, type YachtSettings } from "~/types/config"
import yaml from 'js-yaml'
import * as crypto from 'crypto';
import { env } from "~/t3env";
import { configStorage } from "../storage";
import { _logger } from "../logger";
import { getSchemaValidator } from 'elysia'

//// Config Service

// Utils
const logger = _logger.bind(this, 'config')
const storage = await configStorage()

// Variables
const paths: YachtConfig['static']['paths'] = {
    config: env.CONFIG_FILE || 'config.yml',
    secrets: env.SECRETS_FILE || '.secrets.json',
    ssh: env.SSH_PATH || '.ssh/',
    auth: env.AUTH_PATH || '.auth/',
    backups: {
        config: env.BACKUP_CONFIG_PATH || 'backups/config',
        instance: env.BACKUP_INSTANCE_PATH || 'backups/instance'
    },
    templates: env.TEMPLATE_PATH || 'templates/'
}

const defaultSettings: YachtSettings = {
    name: 'Yacht',
    servers: [
        {
            name: 'local',
            options: {
                socketPath: process.env.DOCKER_HOST ?? '/var/run/docker.sock',
            },
        },
    ],
    auth: true,
    theme: {
        type: 'dark',
    },
    plugins: [],
    sessionTimeout: 3600,
};

// Loaded Config Cache
let _config: YachtConfig

// Exported Functions
export const useConfig = async (): Promise<YachtConfig> => {
    if (!_config) {
        _config = await getConfig()
    }
    return _config
}

// Internal Functions
const getConfig = async (): Promise<YachtConfig> => {
    const configFile = await storage.getItem('config.yml')
    if (configFile) {
        const _config = yaml.load(configFile?.toString() || "") as YachtSettings
        const isValid = await validateConfig(_config)
        if (isValid) {
            const config: YachtConfig = {
                ..._config,
                secrets: await getSecrets(),
                static: {
                    paths: paths
                }
            }
            return config
        } else {
            logger('getConfig #1').warn(`Config at ${storage.getMount('config').base}/config.yml is invalid! Backing up and replacing with default...`)
            await backupConfig(_config)
            return await createConfig()
        }
    } else {
        logger('getConfig #2').warn(`Config at ${storage.getMount('config').base}/config.yml not found! Creating new config...`)
        return await createConfig()
    }
}

const backupConfig = async (oldConfig: YachtSettings) => {
    await storage.setItem('config.yml.bak', yaml.dump(oldConfig), {})
}

const validateConfig = async (config: YachtSettings) => {
    const validator = getSchemaValidator(YachtConfigSchema.type, {})
    return config
}

const createConfig = async () => {
    await storage.setItem('config.yml', yaml.dump(defaultSettings), {})
    _config = {
        ...defaultSettings,
        secrets: await getSecrets(),
        static: {
            paths: paths
        }
    }
    logger('createConfig').info(`New config created at: ${storage.getMount('config').base}/config.yml`)
    return _config
}

const getSecrets = async () => {
    const secrets = await storage.getItem<YachtConfig['secrets']>(paths.secrets)
    if (secrets && typeof secrets === 'object') {
        try {
            if (!secrets.accessSecret || !secrets.refreshSecret || !secrets.passphraseSecret || !secrets.authSecret) {
                return generateSecretTokens()
            } else return secrets
        } catch (e) {
            return generateSecretTokens();
        }
    } else return generateSecretTokens();
}

/**
 * Generates the secret token for signing JWTs
 */
const generateSecretTokens = () => {
    const secrets = {
        authSecret: crypto.randomBytes(256).toString('base64'),
        accessSecret: crypto.randomBytes(256).toString('base64'),
        refreshSecret: crypto.randomBytes(256).toString('base64'),
        passphraseSecret: {
            key: crypto.randomBytes(32).toString('base64'),
            iv: crypto.randomBytes(16).toString('base64'),
        },
    };

    // Write the secrets to a file
    storage.setItem<YachtConfig['secrets']>(paths.secrets, secrets)
    return secrets;
}