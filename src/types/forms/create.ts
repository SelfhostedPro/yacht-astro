import { t } from 'elysia';
import { OptionalNameValueSchema, NameValueSchema, CapAddSchema, CapDropSchema } from '../containers/shared'
import { ContainerOciInfoSchema } from '../containers/yacht'

export const ContainerFormEnvsSchema = t.Object({
    name: t.String({ minLength: 1 }),
    value: t.String({ minLength: 1 }),
    description: t.Optional(t.String()),
    label: t.Optional(t.String())
});
export const ContainerFormUnchangableSchema = t.Object({
    property: t.Union([
        t.Literal("host"),
        t.Literal("container"),
        t.Literal("protocol")
    ])
});
export const ContainerFormPortsSchema = t.Object({
    label: t.Optional(t.String()),
    host: t.Optional(t.Number({ minimum: 0, maximum: 65535 })),
    container: t.Optional(t.Number({ minimum: 0, maximum: 65535 })),
    protocol: t.Optional(t.Union([t.Literal("tcp"), t.Literal("udp")])),
    description: t.Optional(t.String()),
    unchangable: t.Optional(t.Union([
        t.Boolean(),
        t.Array(t.Union([
            t.Literal("host"),
            t.Literal("container"),
            t.Literal("protocol")
        ]))
    ]))
});
export const ContainerFormVolumesSchema = t.Object({
    label: t.Optional(t.String()),
    source: t.Optional(t.String()),
    destination: t.Optional(t.String()),
    read_only: t.Optional(t.Boolean())
});
export const CetworkModesSchema = t.Object({
    network_modes: t.Union([
        t.Literal("bridge"),
        t.Literal("host"),
        t.Literal("none")
    ])
});
export const DevicesSchema = t.Object({
    host: t.Optional(t.String()),
    container: t.Optional(t.String()),
    permissions: t.Optional(t.Union([
        t.Literal('r'),
        t.Literal('w'),
        t.Literal('m'),
        t.Literal('mw'),
        t.Literal('rm'),
        t.Literal('rwm'),
        t.Literal('rw'),
    ]))
});
export const CreateContainerFormSchema = t.Object({
    name: t.Optional(t.String()),
    image: t.String(),
    info: t.Optional(ContainerOciInfoSchema),
    restart: t.Optional(t.String()),
    server: t.String({ minLength: 1 }),
    network: t.Optional(t.String()),
    network_mode: t.Optional(t.String()),
    mounts: t.Optional(t.Array(ContainerFormVolumesSchema)),
    ports: t.Optional(t.Array(ContainerFormPortsSchema)),
    env: t.Optional(t.Array(ContainerFormEnvsSchema)),
    labels: t.Optional(t.Array(OptionalNameValueSchema)),
    command: t.Optional(t.Array(t.String())),
    devices: t.Optional(t.Array(DevicesSchema)),
    sysctls: t.Optional(t.Array(NameValueSchema)),
    capabilities: t.Optional(t.Object({
        add: t.Optional(t.Array(CapAddSchema)),
        drop: t.Optional(t.Array(CapDropSchema))
    })),
    limits: t.Optional(t.Object({
        cpus: t.Optional(t.Number()),
        mem_limit: t.Optional(t.Number())
    }))
});