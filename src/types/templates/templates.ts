import { t, type Static } from 'elysia'
export const addTemplateSchema = t.Object({
    url: t.String(),
    name: t.String(),
    title: t.Optional(t.String())
})

export type AddTemplate = Static<typeof addTemplateSchema>

export const yachtTemplateLinkSchema = t.Object({
    url: t.String(),
    text: t.Optional(t.String()),
    icon: t.Optional(t.String()),
    color: t.Optional(t.String())
})

export const yachtTemplateAuthorSchema = t.Object({
    name: t.String(),
    url: t.Optional(t.String()),
    avatar: t.Optional(t.String())
})

export const yachtV2TemplatePortValueSchema = t.Object({
    host: t.Optional(t.String()),
    container: t.Optional(t.String()),
    protocol: t.Optional(t.Union([t.Literal("tcp"), t.Literal("udp")])),
    description: t.Optional(t.String()),
    unchangable: t.Optional(
        t.Union([
            t.Boolean(),
            t.Array(
                t.Union([
                    t.Literal("host"),
                    t.Literal("container"),
                    t.Literal("protocol")
                ])
            )
        ])
    )
})

export const yachtV2TemplatePortSchema = t.Record(t.String(), yachtV2TemplatePortValueSchema)
export type YachtV2TemplatePort = Static<typeof yachtV2TemplatePortSchema>

export const yachtV1TemplatePortSchema = t.Union([t.String(), t.Record(t.String(), t.String())])
export type YachtV1TemplatePort = Static<typeof yachtV1TemplatePortSchema>

export const yachtV1TemplatePortsSchema = t.Array(t.Union([yachtV1TemplatePortSchema, t.String()]))
export type yachtV1TemplatePorts = Static<typeof yachtV1TemplatePortsSchema>

export const yachtTemplateVolumeSchema = t.Object({
    container: t.String(),
    bind: t.Optional(t.String()),
    readonly: t.Optional(t.Boolean()),
    label: t.Optional(t.String())
})

export const yachtTemplateLabelsSchema = t.Object({
    name: t.Optional(t.String()),
    value: t.Optional(t.String())
})

export const yachtTemplateEnvironmentSchema = t.Object({
    name: t.String(),
    label: t.Optional(t.String()),
    description: t.Optional(t.String()),
    default: t.Optional(t.String()),
    preset: t.Optional(t.Boolean()),
    set: t.Optional(t.String()),
    value: t.Optional(t.String())
})

export const portainerTemplateStackSchema = t.Object({
    url: t.String(),
    stackfile: t.String()
})

export const portainerTemplateAccessControlSchema = t.Object({
    enabled: t.Boolean()
})

export const devicesSchema = t.Object({
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
})

export const yachtV1TemplateSchema = t.Object({
    type: t.Optional(t.Union([t.String(), t.Number()])),
    title: t.String(),
    name: t.Optional(t.String()),
    description: t.Optional(t.Nullable(t.String())),
    logo: t.Optional(t.String()),
    note: t.Optional(t.String()),
    image: t.String(),
    registry: t.Optional(t.String()),
    administrator_only: t.Optional(t.Boolean()),
    access_control: t.Optional(portainerTemplateAccessControlSchema),
    command: t.Optional(t.String()),
    network: t.Optional(t.String()),
    repository: t.Optional(portainerTemplateStackSchema),
    categories: t.Optional(t.Array(t.String())),
    platform: t.Optional(t.Union([t.Literal("linux"), t.Literal("windows")])),
    restart_policy: t.Optional(t.String()),
    featured_image: t.Optional(t.String()), //TODO: See about moving this to just v2 templates
    ports: t.Optional(t.Union([yachtV1TemplatePortsSchema, yachtV2TemplatePortSchema])),
    volumes: t.Optional(t.Array(yachtTemplateVolumeSchema)),
    env: t.Optional(t.Array(yachtTemplateEnvironmentSchema)),
    labels: t.Optional(t.Array(yachtTemplateLabelsSchema)),
    privileged: t.Optional(t.Boolean()),
    interactive: t.Optional(t.Boolean()),
    hostname: t.Optional(t.String()),
    cap_add: t.Optional(t.Array(t.Any())),
    cap_drop: t.Optional(t.Array(t.Any())),
    sysctls: t.Optional(t.Array(t.Record(t.String(), t.String()))),
    devices: t.Optional(t.Array(devicesSchema)),
    limits: t.Optional(
        t.Object({
            cpus: t.Optional(t.Number()),
            mem_limit: t.Optional(t.Number())
        })
    )
})

export type YachtV1Template = Static<typeof yachtV1TemplateSchema>

export const yachtV2TemplateSchema = yachtV1TemplateSchema.Extend({
    featured_image: t.Optional(t.String()),
    ports: t.Optional(yachtV2TemplatePortSchema)
});

export type YachtV2Template = Static<typeof yachtV2TemplateSchema>

export const portainerV1TemplateSchema = yachtV1TemplateSchema.Extend({
    type: t.Number(),
    ports: t.Optional(t.Array(t.String()))
})

export type PortainerV1Template = Static<typeof portainerV1TemplateSchema>

export const portainerV2TemplateSchema = t.Object({
    version: t.Literal("2"),
    templates: t.Array(portainerV1TemplateSchema)
})

export type PortainerV2Template = Static<typeof portainerV2TemplateSchema>

export const yachtTemplateSchema = t.Object({
    name: t.String(),
    url: t.String(),
    title: t.Optional(t.String()),
    description: t.Optional(t.String()),
    image: t.Optional(t.String()),
    created: t.Optional(t.String()),
    updated: t.Optional(t.String()),
    type: t.Optional(
        t.Union([
            t.Literal("portainerv1"),
            t.Literal("portainerv2"),
            t.Literal("yachtv1"),
            t.Literal("yachtv2")
        ])
    ),
    authors: t.Optional(t.Array(yachtTemplateAuthorSchema)),
    links: t.Optional(t.Array(yachtTemplateLinkSchema)),
    featured: t.Optional(t.Array(t.Number())),
    templates: t.Union([
        t.Array(portainerV1TemplateSchema),
        portainerV2TemplateSchema.properties.templates,
        t.Array(yachtV1TemplateSchema),
        t.Array(yachtV2TemplateSchema)
    ])
})

export type YachtTemplate = Static<typeof yachtTemplateSchema>

// const test: YachtTemplate['templates'][0]['ports'] = [
//   {
//     "WebUI": "32400:32400/tcp",
//     "DNLA": "1900:1900/udp",
//     "Companion": "3005:3005/tcp",
//     "Bonjour/Avahi": "5353:5353/udp",
//     "Roku Control": "8324:8324/tcp",
//     "GDM-1": "32410:32410/udp",
//     "GDM-2": "32412:32412/udp",
//     "GDM-3": "32413:32413/udp",
//     "GDM-4": "32414:32414/udp",
//     "DNLA TCP": "32469:32469/udp"
//   }
// ]