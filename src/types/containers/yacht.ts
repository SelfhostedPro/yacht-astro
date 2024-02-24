import { t, type Static } from 'elysia'

// ContainerGeneralConfig
export const ContainerGeneralConfigSchema = t.Object({
    hostname: t.String(),
    tty: t.Boolean(),
    user: t.String(),
    appArmorProfile: t.String(),
    platform: t.String(),
    driver: t.String(),
    path: t.String(),
    args: t.Array(t.String()),
    autoRemove: t.Boolean(),
    capabilities: t.Object({
        add: t.Array(t.String()),
        remove: t.Array(t.String())
    }),
    logConfig: t.Object({
        type: t.String(),
        config: t.Any()
    })
});

// ContainerMount
export const ContainerMountSchema = t.Object({
    type: t.Optional(t.String()),
    name: t.Optional(t.String()),
    source: t.String(),
    destination: t.String(),
    driver: t.Optional(t.String()),
    mode: t.String(),
    rw: t.Boolean(),
    propagation: t.String()
});
export type ContainerMount = Static<typeof ContainerMountSchema>

// ContainerPort
export const ContainerPortSchema = t.Object({
    containerPort: t.Number(),
    hostPort: t.Optional(t.Number()),
    hostIP: t.Optional(t.String()),
    type: t.Optional(t.String())
});
export type ContainerPort = Static<typeof ContainerPortSchema>

// IPAMConfig
export const IPAMConfigSchema = t.Object({
    ipv4Address: t.Optional(t.String()),
    ipv6Address: t.Optional(t.String()),
    linkLocalIps: t.Optional(t.Array(t.String()))
});

// NetworkInfo
export const NetworkInfoSchema = t.Object({
    IPAMConfig: t.MaybeEmpty(IPAMConfigSchema),
    Links: t.Optional(t.Any()),
    Aliases: t.Optional(t.Any()),
    NetworkID: t.String(),
    EndpointID: t.String(),
    Gateway: t.String(),
    IPAddress: t.String(),
    IPPrefixLen: t.Number(),
    IPv6Gateway: t.String(),
    GlobalIPv6Address: t.String(),
    GlobalIPv6PrefixLen: t.Number(),
    MacAddress: t.String()
});

// ContainerNetworkSettings
export const ContainerNetworkSettingsSchema = t.Object({
    mode: t.String(),
    macAddress: t.Optional(t.String()),
    hairpinmode: t.Optional(t.Boolean()),
    networks: t.Record(t.String(), NetworkInfoSchema)
});

// ContainerOciInfo
export const ContainerOciInfoSchema = t.Object({
    title: t.Optional(t.String()),
    description: t.Optional(t.String()),
    docs: t.Optional(t.String()),
    url: t.Optional(t.String()),
    source: t.Optional(t.String()),
    vendor: t.Optional(t.String()),
    icon: t.Optional(t.String()),
    notes: t.Optional(t.String()),
    external: t.Optional(t.String()),
    subdomain: t.Optional(t.String()),
});

// Container
export const ContainerSchema = t.Object({
    name: t.String(),
    id: t.String(),
    image: t.String(),
    shortId: t.String(),
    created: t.String(),
    status: t.String(),
    state: t.Optional(t.String()),
    info: ContainerOciInfoSchema,
    restart: t.Optional(t.Object({
        policy: t.Optional(t.String()),
        count: t.Number()
    })),
    config: t.Object({
        network: ContainerNetworkSettingsSchema,
        general: t.Optional(ContainerGeneralConfigSchema)
    }),
    mounts: t.Optional(t.Array(ContainerMountSchema)),
    ports: t.Optional(t.Array(ContainerPortSchema)),
    env: t.Optional(t.Array(t.String())),
    labels: t.Optional(t.Record(t.String(), t.String())),
});
export type Container = Static<typeof ContainerSchema>

// ContainerStat
export const ContainerStat = t.Object({
    name: t.String(),
    memoryPercentage: t.String(),
    cpuUsage: t.String()
});

// ContainerStats
export const ContainerStats = t.Record(t.String(), ContainerStat);