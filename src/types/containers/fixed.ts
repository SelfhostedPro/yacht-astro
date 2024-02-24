import { t, type Static } from 'elysia';
import { containerInfoSchema, containerInspectInfoSchema } from './dockerode';
// readableContainerInfoSchema
export const ReadableContainerInfoSchema = t.Object({
    ...containerInfoSchema.properties,
    CreatedDate: t.Optional(t.Union([t.String(), t.Number()])),
    ShortId: t.Optional(t.String()),
    ShortName: t.Optional(t.String()),
    PortDetails: t.Optional(t.String())
});

// fixedContainerInfoSchema
export const FixedContainerInfoSchema = t.Object({
    ...containerInfoSchema.properties,
    Mounts: t.Optional(t.Array(t.Object({
        Name: t.Optional(t.String()),
        Type: t.String(),
        Source: t.String(),
        Destination: t.String(),
        Driver: t.Optional(t.String()),
        Mode: t.String(),
        RW: t.Boolean(),
        Propagation: t.String()
    })))
});
export type FixedContainerInfo = Static<typeof FixedContainerInfoSchema>

// fixedContainerInspectInfoSchema
export const FixedContainerInspectInfoSchema = t.Object({
    ...containerInspectInfoSchema.properties,
    Mounts: t.Optional(t.Array(t.Object({
        Name: t.Optional(t.String()),
        Type: t.Optional(t.Union([t.Literal("volume"), t.Literal("bind"), t.Literal("tmpfs")])),
        Source: t.String(),
        Destination: t.String(),
        Driver: t.Optional(t.String()),
        Mode: t.String(),
        RW: t.Boolean(),
        Propagation: t.String()
    })))
});
export type FixedContainerInspectInfo = Static<typeof FixedContainerInfoSchema>

const VolumeInspectInfo = t.Object({
    Name: t.String(),
    Driver: t.String(),
    Mountpoint: t.String(),
    Status: t.Optional(t.Index(t.String(), t.String())),
    Labels: t.Index(t.String(), t.String()),
    Scope: t.Union([t.Literal('local'), t.Literal('global')]),
    // Field is always present, but sometimes is null
    Options: t.MaybeEmpty(t.Record(t.String(), t.String())),
    // Field is sometimes present, and sometimes null
    UsageData: t.MaybeEmpty(t.Object({
        Size: t.Number(),
        RefCount: t.Number()
    }))
})

// FixedVolumeInspectInfo
export const FixedVolumeInspectInfo = t.Object({
    ...VolumeInspectInfo.properties, // Spread the properties of VolumeInspectInfo
    CreatedAt: t.Optional(t.String()) // Additional property
});