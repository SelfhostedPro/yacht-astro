import { t, type Static } from 'elysia';

export const KeyObjectSchema = t.Object({
  pem: t.Optional(t.String()),
  passphrase: t.Optional(t.String()),
});

export const ThemeSettingsSchema = t.Object({
  type: t.Union([t.Literal('light'), t.Literal('dark'), t.Literal('custom')]),
  primary: t.Optional(t.String()),
  secondary: t.Optional(t.String()),
  surface: t.Optional(t.String()),
  foreground: t.Optional(t.String()),
  background: t.Optional(t.String()),
  error: t.Optional(t.String()),
  info: t.Optional(t.String()),
  warning: t.Optional(t.String()),
  success: t.Optional(t.String()),
});

export const DockerOptionsSchema = t.Object({
  socketPath: t.Optional(t.String()),
  host: t.Optional(t.String()),
  port: t.Optional(t.Union([t.String(), t.Number()])),
  username: t.Optional(t.String()),
  headers: t.Optional(t.Record(t.String(), t.String())),
  ca: t.Optional(t.Union([t.String(), t.Array(t.String())])),
  cert: t.Optional(t.Union([t.String(), t.Array(t.String())])),
  key: t.Optional(t.Union([t.String(), t.Array(t.String()), t.Array(KeyObjectSchema)])),
  protocol: t.Optional(t.Union([t.Literal('https'), t.Literal('http'), t.Literal('ssh')])),
  timeout: t.Optional(t.Number()),
  version: t.Optional(t.String()),
  sshAuthAgent: t.Optional(t.String()),
  Promise: t.Optional(t.Promise(t.Any())),
});

export const ServerConfigSchema = t.Object({
  name: t.String(),
  options: t.Optional(DockerOptionsSchema),
  key: t.Optional(t.String()),
});

export type ServerConfig = Static<typeof ServerConfigSchema>

export const TemplateVariablesSchema = t.Object({
  variable: t.String(),
  replacement: t.String(),
});

export const SettingSchema = t.Object({
  name: t.String(),
  auth: t.Boolean(),
  servers: t.Array(ServerConfigSchema),
  theme: ThemeSettingsSchema,
  plugins: t.Array(t.String()),
  sessionTimeout: t.Number(),
  templates: t.Optional(t.Array(t.Object({
    url: t.String(),
    name: t.String(),
    apps: t.Array(t.Any()),
  }))),
  templateVariables: t.Optional(t.Array(TemplateVariablesSchema)),
})


export const YachtConfigSchema =
  t.Object({
    ...SettingSchema.properties,
    secrets: t.Object({
      authSecret: t.String(),
      accessSecret: t.String(),
      refreshSecret: t.String(),
      passphraseSecret: t.Object({
        key: t.String(),
        iv: t.String()
      })
    }),
    static: t.Object({
      paths: t.Object({
        config: t.String(),
        secrets: t.String(),
        ssh: t.String(),
        auth: t.String(),
        backups: t.Object({
          config: t.String(),
          instance: t.String()
        }),
        templates: t.String()
      })
    }),
  })
export type YachtConfig = Static<typeof YachtConfigSchema>

export type YachtSettings = Static<typeof SettingSchema>