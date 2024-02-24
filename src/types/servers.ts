import type Docker from 'dockerode'
import { t, type Static } from 'elysia'
import { ContainerSchema, type Container } from "~/types/containers/yacht"

export const ServerDictSchema = t.Record(t.String(), t.Any())
export type ServerDict = Static<typeof ServerDictSchema>

export const ServerContainersSchema = t.Record(t.String(), t.Array(ContainerSchema))

export type ServerContainers = Static<typeof ServerContainersSchema>
// export type ServerContainers = {
//     [key: string]: Container[]
// }


// Resources
export type ServerImages = {
    [key: string]: Docker.ImageInfo[]
}
export type ServerVolumes = {
    [key: string]: Docker.VolumeInspectInfo[]
}
export type ServerNetworks = {
    [key: string]: Docker.NetworkInspectInfo[]
}