import { t, type Static } from 'elysia'
// Rebuilding Dockerode types as zod schemas.
// Used https://transform.tools/typescript-to-zod to simplify this.

export const portSchema = t.Object({
    IP: t.String(),
    PrivatePort: t.Number(),
    PublicPort: t.Number(),
    Type: t.String(),
});
export type Port = Static<typeof portSchema>

export const networkInfoSchema = t.Object({
    IPAMConfig: t.Optional(t.Any()),
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
    MacAddress: t.String(),
});

export const containerInfoSchema = t.Object({
    Id: t.String(),
    Names: t.Array(t.String()),
    Image: t.String(),
    ImageID: t.String(),
    Command: t.String(),
    Created: t.Number(),
    Ports: t.Array(portSchema),
    Labels: t.Record(t.String(), t.String()),
    State: t.String(),
    Status: t.String(),
    HostConfig: t.Object({
        NetworkMode: t.String(),
    }),
    NetworkSettings: t.Object({
        Networks: t.Record(t.String(), networkInfoSchema),
    }),
    Mounts: t.Array(
        t.Object({
            Name: t.Optional(t.String()),
            t: t.String(),
            Source: t.String(),
            Destination: t.String(),
            Driver: t.Optional(t.String()),
            Mode: t.String(),
            RW: t.Boolean(),
            Propagation: t.String(),
        })
    ),
});

export const hostRestartPolicySchema = t.Object({
    Name: t.String(),
    MaximumRetryCount: t.Optional(t.Union([t.Number(), t.Undefined()])),
});

export const deviceRequestSchema = t.Object({
    Driver: t.Optional(t.String()),
    Count: t.Optional(t.Number()),
    DeviceIDs: t.Optional(t.Array(t.String())),
    Capabilities: t.Optional(t.Array(t.Array(t.String()))),
    Options: t.Optional(t.Record(t.String(), t.Any())),
});

export const mounttSchema = t.Union([
    t.Literal('bind'),
    t.Literal('volume'),
    t.Literal('tmpfs'),
]);

export const mountConsistencySchema = t.Union([
    t.Literal('default'),
    t.Literal('consistent'),
    t.Literal('cached'),
    t.Literal('delegated'),
]);

export const mountPropagationSchema = t.Union([
    t.Literal('private'),
    t.Literal('rprivate'),
    t.Literal('shared'),
    t.Literal('rshared'),
    t.Literal('slave'),
    t.Literal('rslave'),
]);

export const mountSettingsSchema = t.Object({
    Target: t.String(),
    Source: t.String(),
    t: mounttSchema,
    ReadOnly: t.Optional(t.Boolean()),
    Consistency: t.Optional(mountConsistencySchema),
    BindOptions: t.Optional(t.Object({
        Propagation: mountPropagationSchema,
    })),
    VolumeOptions: t.Optional(t.Object({
        NoCopy: t.Boolean(),
        Labels: t.Record(t.String(), t.String()),
        DriverConfig: t.Object({
            Name: t.String(),
            Options: t.Record(t.String(), t.String()),
        }),
    })),
    TmpfsOptions: t.Optional(t.Object({
        SizeBytes: t.Number(),
        Mode: t.Number(),
    })),
});

export const mountConfigSchema = t.Array(mountSettingsSchema);


export const hostConfigSchema = t.Object({
    AutoRemove: t.Optional(t.Boolean()),
    Binds: t.Optional(t.Array(t.String())),
    ContainerIDFile: t.Optional(t.String()),
    LogConfig: t.Optional(t.Object({
        t: t.String(),
        Config: t.Any(),
    })),
    NetworkMode: t.Optional(t.String()),
    PortBindings: t.Any(),
    RestartPolicy: t.Optional(hostRestartPolicySchema),
    VolumeDriver: t.Optional(t.String()),
    VolumesFrom: t.Any(),
    Mounts: t.Optional(mountConfigSchema),
    CapAdd: t.Any(),
    CapDrop: t.Any(),
    Dns: t.Optional(t.Array(t.Any())),
    DnsOptions: t.Optional(t.Array(t.Any())),
    DnsSearch: t.Optional(t.Array(t.String())),
    ExtraHosts: t.Any(),
    GroupAdd: t.Optional(t.Array(t.String())),
    IpcMode: t.Optional(t.String()),
    Cgroup: t.Optional(t.String()),
    Links: t.Any(),
    OomScoreAdj: t.Optional(t.Number()),
    PidMode: t.Optional(t.String()),
    Privileged: t.Optional(t.Boolean()),
    PublishAllPorts: t.Optional(t.Boolean()),
    ReadonlyRootfs: t.Optional(t.Boolean()),
    SecurityOpt: t.Any(),
    StorageOpt: t.Optional(t.Record(t.String(), t.String())),
    Tmpfs: t.Optional(t.Record(t.String(), t.String())),
    UTSMode: t.Optional(t.String()),
    UsernsMode: t.Optional(t.String()),
    ShmSize: t.Optional(t.Number()),
    Sysctls: t.Optional(t.Record(t.String(), t.String())),
    Runtime: t.Optional(t.String()),
    ConsoleSize: t.Optional(t.Array(t.Number())),
    Isolation: t.Optional(t.String()),
    MaskedPaths: t.Optional(t.Array(t.String())),
    ReadonlyPaths: t.Optional(t.Array(t.String())),
    CpuShares: t.Optional(t.Number()),
    CgroupParent: t.Optional(t.String()),
    BlkioWeight: t.Optional(t.Number()),
    BlkioWeightDevice: t.Any(),
    BlkioDeviceReadBps: t.Any(),
    BlkioDeviceWriteBps: t.Any(),
    BlkioDeviceReadIOps: t.Any(),
    BlkioDeviceWriteIOps: t.Any(),
    CpuPeriod: t.Optional(t.Number()),
    CpuQuota: t.Optional(t.Number()),
    CpusetCpus: t.Optional(t.String()),
    CpusetMems: t.Optional(t.String()),
    Devices: t.Any(),
    DeviceCgroupRules: t.Optional(t.Array(t.String())),
    DeviceRequests: t.Optional(t.Array(deviceRequestSchema)),
    DiskQuota: t.Optional(t.Number()),
    KernelMemory: t.Optional(t.Number()),
    Memory: t.Optional(t.Number()),
    MemoryReservation: t.Optional(t.Number()),
    MemorySwap: t.Optional(t.Number()),
    MemorySwappiness: t.Optional(t.Number()),
    NanoCpus: t.Optional(t.Number()),
    OomKillDisable: t.Optional(t.Boolean()),
    Init: t.Optional(t.Boolean()),
    PidsLimit: t.Optional(t.Number()),
    Ulimits: t.Any(),
    CpuCount: t.Optional(t.Number()),
    CpuPercent: t.Optional(t.Number()),
    CpuRealtimePeriod: t.Optional(t.Number()),
    CpuRealtimeRuntime: t.Optional(t.Number()),
});


export const containerInspectInfoSchema = t.Object({
    Id: t.String(),
    Created: t.String(),
    Path: t.String(),
    Args: t.Array(t.String()),
    State: t.Object({
        Status: t.String(),
        Running: t.Boolean(),
        Paused: t.Boolean(),
        Restarting: t.Boolean(),
        OOMKilled: t.Boolean(),
        Dead: t.Boolean(),
        Pid: t.Number(),
        ExitCode: t.Number(),
        Error: t.String(),
        StartedAt: t.String(),
        FinishedAt: t.String(),
        Health: t.Optional(t.Object({
            Status: t.String(),
            FailingStreak: t.Number(),
            Log: t.Array(t.Object({
                Start: t.String(),
                End: t.String(),
                ExitCode: t.Number(),
                Output: t.String(),
            })),
        })),
    }),
    Image: t.String(),
    ResolvConfPath: t.String(),
    HostnamePath: t.String(),
    HostsPath: t.String(),
    LogPath: t.String(),
    Name: t.String(),
    RestartCount: t.Number(),
    Driver: t.String(),
    Platform: t.String(),
    MountLabel: t.String(),
    ProcessLabel: t.String(),
    AppArmorProfile: t.String(),
    ExecIDs: t.Optional(t.Array(t.String())),
    HostConfig: hostConfigSchema,
    GraphDriver: t.Object({
        Name: t.String(),
        Data: t.Object({
            DeviceId: t.String(),
            DeviceName: t.String(),
            DeviceSize: t.String(),
        }),
    }),
    Mounts: t.Array(
        t.Object({
            Name: t.Optional(t.String()),
            Source: t.String(),
            Destination: t.String(),
            Mode: t.String(),
            RW: t.Boolean(),
            Propagation: t.String(),
        })
    ),
    Config: t.Object({
        Hostname: t.String(),
        Domainname: t.String(),
        User: t.String(),
        AttachStdin: t.Boolean(),
        AttachStdout: t.Boolean(),
        AttachStderr: t.Boolean(),
        ExposedPorts: t.Record(t.String(), t.Object({})),
        Tty: t.Boolean(),
        OpenStdin: t.Boolean(),
        StdinOnce: t.Boolean(),
        Env: t.Array(t.String()),
        Cmd: t.Array(t.String()),
        Image: t.String(),
        Volumes: t.Record(t.String(), t.Object({})),
        WorkingDir: t.String(),
        Entrypoint: t.Optional(t.Union([t.String(), t.Array(t.String())])),
        OnBuild: t.Any(),
        Labels: t.Record(t.String(), t.String()),
    }),
    NetworkSettings: t.Object({
        Bridge: t.String(),
        SandboxID: t.String(),
        HairpinMode: t.Boolean(),
        LinkLocalIPv6Address: t.String(),
        LinkLocalIPv6PrefixLen: t.Number(),
        Ports: t.Record(
            t.String(),
            t.Array(
                t.Object({
                    HostIp: t.String(),
                    HostPort: t.String(),
                })
            )
        ),
        SandboxKey: t.String(),
        SecondaryIPAddresses: t.Any(),
        SecondaryIPv6Addresses: t.Any(),
        EndpointID: t.String(),
        Gateway: t.String(),
        GlobalIPv6Address: t.String(),
        GlobalIPv6PrefixLen: t.Number(),
        IPAddress: t.String(),
        IPPrefixLen: t.Number(),
        IPv6Gateway: t.String(),
        MacAddress: t.String(),
        Networks: t.Record(
            t.String(),
            t.Object({
                IPAMConfig: t.Optional(t.Any()),
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
                MacAddress: t.String(),
            })
        ),
        Node: t.Optional(t.Object({
            ID: t.String(),
            IP: t.String(),
            Addr: t.String(),
            Name: t.String(),
            Cpus: t.Number(),
            Memory: t.Number(),
            Labels: t.Any(),
        })),
    }),
});

export type ContainerInfo = Static<typeof containerInfoSchema>;
export type ContainerInspectInfo = Static<typeof containerInspectInfoSchema>;