import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { resolve } from "node:path";

export const env = createEnv({
    server: {
        NODE_ENV: z.enum(["development", "test", "production"]),
        AUTH_ENABLED: z.coerce.boolean().optional().default(true),
        CONFIG_PATH: z.string().optional(),
        CONFIG_FILE: z.string().optional().default('config.yml'),
        SECRETS_FILE: z.string().optional().default('.secrets.json'),
        SSH_PATH: z.string().optional().default('.ssh/'),
        AUTH_PATH: z.string().optional().default('.auth/'),
        BACKUP_CONFIG_PATH: z.string().optional().default('backups/config'),
        BACKUP_INSTANCE_PATH: z.string().optional().default('backups/instance'),
        TEMPLATE_PATH: z.string().optional().default('templates/'),
    },
    /**
     * The prefix that client-side variables must have. This is enforced both at
     * a type-level and at runtime.
     */
    //   clientPrefix: "PUBLIC_",

    //   client: {
    //     PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    //   },

    /**
     * What object holds the environment variables at runtime. This is usually
     * `process.env` or `import.meta.env`.
     */
    runtimeEnv: {
        NODE_ENV: process.env.NODE_ENV,
        AUTH_ENABLED: process.env.AUTH_ENABLED,
        CONFIG_PATH: process.env.CONFIG_PATH
            ? resolve(process.env.CONFIG_PATH)
            : process.env.NODE_ENV === "development"
                ? resolve("./config")
                : resolve("../config"),
        CONFIG_FILE: process.env.CONFIG_FILE,
        SECRETS_FILE: process.env.SECRETS_FILE,
        SSH_PATH: process.env.SSH_PATH,
        AUTH_PATH: process.env.AUTH_PATH,
        BACKUP_CONFIG_PATH: process.env.BACKUP_CONFIG_PATH,
        BACKUP_INSTANCE_PATH: process.env.BACKUP_INSTANCE_PATH,
        TEMPLATE_PATH: process.env.TEMPLATE_PATH,
    },

    /**
     * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
     * useful for Docker builds.
     */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,

    /**
     * By default, this library will feed the environment variables directly to
     * the Zod validator.
     *
     * This means that if you have an empty string for a value that is supposed
     * to be a number (e.g. `PORT=` in a ".env" file), Zod will incorrectly flag
     * it as a type mismatch violation. Additionally, if you have an empty string
     * for a value that is supposed to be a string with a default value (e.g.
     * `DOMAIN=` in an ".env" file), the default value will never be applied.
     *
     * In order to solve these issues, we recommend that all new projects
     * explicitly specify this option as true.
     */
    emptyStringAsUndefined: true,
});