import { t } from 'elysia';

// keyValueSchema
export const KeyValueSchema = t.Object({
    key: t.String(),
    value: t.String()
});

// nameValueSchema
export const NameValueSchema = t.Object({
    name: t.String(),
    value: t.String()
});

// optionalNameValueSchema
export const OptionalNameValueSchema = t.Object({
    name: t.Optional(t.String()),
    value: t.Optional(t.String())
});

// capDropSchema
export const CapDropSchema = t.Union([
    t.Literal("AUDIT_WRITE"),
    t.Literal("CHOWN"),
    t.Literal("DAC_OVERRIDE"),
    t.Literal("FOWNER"),
    t.Literal("FSETID"),
    t.Literal("KILL"),
    t.Literal("SETGID"),
    t.Literal("SETUID"),
    t.Literal("SETPCAP"),
    t.Literal("NET_BIND_SERVICE"),
    t.Literal("NET_RAW"),
    t.Literal("SYS_CHROOT")
]);

// capAddSchema
export const CapAddSchema = t.Union([
    t.Literal("SYS_MODULE"),
    t.Literal("SYS_RAWIO"),
    t.Literal("SYS_PACCT"),
    t.Literal("SYS_ADMIN"),
    t.Literal("SYS_NICE"),
    t.Literal("SYS_RESOURCE"),
    t.Literal("SYS_TIME"),
    t.Literal("SYS_TTY_CONFIG"),
    t.Literal("AUDIT_CONTROL"),
    t.Literal("MAC_ADMIN"),
    t.Literal("MAC_OVERRIDE"),
    t.Literal("NET_ADMIN"),
    t.Literal("SYSLOG"),
    t.Literal("DAC_READ_SEARCH"),
    t.Literal("LINUX_IMMUTABLE"),
    t.Literal("NET_BROADCAST"),
    t.Literal("IPC_LOCK"),
    t.Literal("IPC_OWNER"),
    t.Literal("SYS_PTRACE"),
    t.Literal("SYS_BOOT"),
    t.Literal("LEASE"),
    t.Literal("WAKE_ALARM"),
    t.Literal("BLOCK_SUSPEND")
]);