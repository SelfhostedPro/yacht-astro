import { generateKeyPairSync } from 'crypto';
import { createCipheriv, createDecipheriv } from 'crypto';
import * as sshpk from 'sshpk';
import * as path from 'path';
import { Client } from 'ssh2';

import { _logger } from '~/api/utils/logger';
import { configStorage } from '~/api/utils/storage';
import { useConfig } from '../utils/config/service';


// Utils
const logger = _logger.bind(this, 'config')
const storage = await configStorage()

type PassphraseFile = Map<string, string>;

interface SSHKeyInfo {
    privateKey: {
        path: string;
        value: string | null;
    },
    publicKey: {
        path: string;
        value: string | null;
    }
}

// const logger = useLog('servers:keys')
// Generate an SSH key
export const createSSHKey = async (keyName: string, passphrase: string) => {
    // Check if key already exists
    const { privateKey, publicKey } = await getSSHKeyInfo(keyName)
    if (privateKey.value && publicKey.value) {
        // YachtError('SSH key already exists', 'servers:keys#createSSHKey')
        return;
    }

    // If not, generate a new key pair
    const newKeys = generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: passphrase,
        },
    });

    // Save the keys to the filesystem
    await storage.setItem(privateKey.path, newKeys.privateKey);
    await storage.setItem(publicKey.path, newKeys.publicKey);
    logger('createSSHKey').info(`SSH key ${keyName} created`);

    // Save the passphrase to a file if requested
    if (!(await checkSavedPassphrases(keyName))) {
        logger('createSSHKey#2').info(`Saving passphrase for ${keyName}`);
        const encryptedPassphrase = await encryptPassphrase(passphrase);
        await writePassphraseToFile(keyName, encryptedPassphrase);
    }
}

export const removeSSHKey = async (keyName: string): Promise<void> => {
    const { privateKey, publicKey } = await getSSHKeyInfo(keyName);
    if (privateKey.value && publicKey.value) {
        await Promise.all([
            storage.removeItem(privateKey.path),
            storage.removeItem(publicKey.path),
            removePassphrase(keyName),
        ]);
    } else {
        logger('removeSSHKey').error('SSH key does not exist');
    }
}

export const removePublicKeyFromRemoteServer = async (
    keyName: string,
    remoteHost: string,
    port: string | number,
    username: string,
): Promise<void> => {
    const { publicKey, privateKey } = await getSSHKeyInfo(keyName);
    if (!publicKey.value || privateKey.value) {
        logger('removePublicKeyFromRemoteServer').warn('SSH key does not exist');
        return;
    }
    const decryptedPrivateKey = await getPrivateKey(keyName);
    const conn = new Client();
    // Remove public key from remote server
    logger('removePublicKeyFromRemoteServer').info(`Removing SSH key from ${remoteHost}`);
    await new Promise<void>((resolve, reject) => {
        conn
            .on('ready', async () => {
                logger('removePublicKeyFromRemoteServer#2').info(`Connected to ${remoteHost}`);
                conn.exec(
                    `sed -i '/${publicKey}/d' ~/.ssh/authorized_keys`,
                    (err, stream) => {
                        if (err) reject(err);
                        stream
                            .on('close', () => {
                                logger('removePublicKeyFromRemoteServer#3').info('SSH key removed');
                                conn.end();
                                resolve();
                            })
                            .on('data', (data: string) => {
                                logger('removePublicKeyFromRemoteServer#4').info('STDOUT: ' + data);
                            })
                            .stderr.on('data', (data: string) => {
                                logger('removePublicKeyFromRemoteServer#5').error('STDERR: ' + data);
                            });
                    },
                );
            })
            .on('error', (err) => {
                logger('removePublicKeyFromRemoteServer#6').error(`Connection error: \${err}`);
                reject(err);
            })
            .connect({
                host: remoteHost,
                port: Number(port),
                username: username,
                privateKey: decryptedPrivateKey,
            });
    });
}

export const copyPublicKeyToRemoteServer = async (
    keyName: string,
    remoteHost: string,
    port: string | number,
    username: string,
    password: string,
): Promise<void> => {
    // Get ssh public key
    const { publicKey } = await getSSHKeyInfo(keyName);
    if (!publicKey.value) {
        // YachtError('SSH key does not exist', 'servers:keys#copyPublicKeyToRemoteServer')
        return;
    }
    const convertedPublicKey = sshpk.parseKey(publicKey.value, 'pem').toString('ssh');
    const conn = new Client();
    // Copy the public key to the remote server
    logger('copyPublicKeyToRemoteServer').info(`Copying SSH key to ${remoteHost}`);
    await new Promise<void>((resolve, reject) => {
        conn
            .on('ready', async () => {
                logger('copyPublicKeyToRemoteServer#2').info(`Connected to ${remoteHost}`);
                conn.exec(
                    `mkdir -p ~/.ssh/ && echo "${convertedPublicKey}" >> ~/.ssh/authorized_keys`,
                    (err, stream) => {
                        if (err) reject(err);
                        stream
                            .on('close', () => {
                                logger('copyPublicKeyToRemoteServer#3').info('SSH key copied');
                                conn.end();
                                resolve();
                            })
                            .on('data', (data: string) => {
                                logger('copyPublicKeyToRemoteServer#4').info('STDOUT: ' + data);
                            })
                            .stderr.on('data', (data) => {
                                logger('copyPublicKeyToRemoteServer#5').error('STDERR: ' + data);
                            });
                    },
                );
            })
            .on('error', (err) => {
                logger('copyPublicKeyToRemoteServer#6').error(`Connection error: \${err}`);
                reject(err);
            })
            .connect({
                host: remoteHost,
                port: Number(port),
                username: username,
                password: password,
            })
    });
}

export const getAllKeys = async (): Promise<string[]> => {
    const passphrases = await readPassphraseFile();
    return Array.from(passphrases.keys());
}

export const getPrivateKey = async (keyName: string, passphrase?: string) => {
    passphrase = passphrase || (await getSavedPassphrase(keyName));
    const { privateKey } = await getSSHKeyInfo(keyName);
    if (!privateKey.value) {
        // YachtError('SSH key does not exist', 'servers:keys#getPrivateKey')
        return;
    }
    // Decrypt and return the private key
    return sshpk.parsePrivateKey(privateKey.value, 'pem', {
        passphrase: passphrase,
    }).toString('ssh-private');
}

const getSSHKeyInfo = async (keyName: string): Promise<SSHKeyInfo> => {
    const config = await useConfig();
    const privateKeyPath = path.join(config.static.paths.ssh, keyName);
    const publicKeyPath = `${privateKeyPath}.pub`;

    const [privateKey, publicKey] = await Promise.all([
        storage.getItem<string>(privateKeyPath).then(
            (value) => ({ path: privateKeyPath, value }),
            () => ({ path: privateKeyPath, value: null }),
        ),
        storage.getItem<string>(publicKeyPath).then(
            (value) => ({ path: privateKeyPath, value }),
            () => ({ path: privateKeyPath, value: null }),
        )
    ]);
    return { privateKey, publicKey };
}

const readPassphraseFile = async (): Promise<PassphraseFile> => {
    const config = await useConfig()
    const passphraseFile = await storage.getItem<object>(path.join(config.static.paths.ssh, 'passphrases'))
    if (!passphraseFile || typeof passphraseFile !== 'object') {
        return new Map();
    }
    const passphrases = passphraseFile;
    return new Map(Object.entries(passphrases));
}

const getSavedPassphrase = async (keyName: string): Promise<string> => {
    const passphrases = await readPassphraseFile();
    const encryptedPassphrase = passphrases.get(keyName);
    if (!encryptedPassphrase) {
        logger('getSavedPassphrase').error(`No passphrase found for ${keyName}`);
        return '';
    }
    const passphrase = decryptPassphrase(encryptedPassphrase);
    return passphrase;
}

const removePassphrase = async (keyName: string): Promise<void> => {
    const config = await useConfig()
    const passphrases = await readPassphraseFile();
    const currentPassphrase = passphrases.get(keyName);
    if (currentPassphrase) {
        passphrases.delete(keyName);
        storage.setItem(path.join(config.static.paths.ssh, 'passphrases'), Object.fromEntries(passphrases))
    } else {
        logger('removePassphrase').error(`No passphrase found for ${keyName}`);

    }

}

const checkSavedPassphrases = async (keyName: string): Promise<boolean> => {
    const passphrases = await readPassphraseFile();
    return passphrases.has(keyName);
}

const writePassphraseToFile = async (
    keyName: string,
    encryptedPassphrase: string,
): Promise<void> => {
    const config = await useConfig()
    const passphraseFile = await storage.getItem<PassphraseFile>(path.join(config.static.paths.ssh, 'passphrases'));
    if (passphraseFile) {
        passphraseFile.set(keyName, encryptedPassphrase);
    }
    storage.setItem(path.join(config.static.paths.ssh, 'passphrases'), passphraseFile)
}

const encryptPassphrase = async (passphrase: string): Promise<string> => {
    const config = await useConfig()
    const encrypt = createCipheriv(
        'aes-256-cbc',
        Buffer.from(config.secrets.passphraseSecret.key, 'base64'),
        Buffer.from(config.secrets.passphraseSecret.iv, 'base64'),
    );
    return encrypt.update(passphrase, 'utf8', 'hex') + encrypt.final('hex');
}
const decryptPassphrase = async (name: string): Promise<string> => {
    const config = await useConfig()
    const decrypt = createDecipheriv(
        'aes-256-cbc',
        Buffer.from(config.secrets.passphraseSecret.key, 'base64'),
        Buffer.from(config.secrets.passphraseSecret.iv, 'base64'),
    );
    return decrypt.update(name, 'hex', 'utf8') + decrypt.final('utf8');
}
