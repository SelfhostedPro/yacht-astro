import { useServers } from "../servers/service"

import type { ServerContainers } from "~/types/servers"
import type { Container } from '~/types/containers/yacht'

import { normalizeContainers } from "./formatter"

export const getContainers = async (): Promise<ServerContainers> => {
    const serversReturn = {} as ServerContainers
    const servers = Object.entries(await useServers())
    // Get containers from all servers in config
    const serverPromises = servers.map(
        async ([server, docker]) => {
            const containers = await docker?.listContainers({ all: true }).catch((e: unknown) => {
                // YachtError(e, '/services/containers - getContainers')
                return undefined
            })
            if (containers !== undefined) serversReturn[server] = await normalizeContainers(containers)
            else serversReturn[server] = [] as Container[]
        },
    )
    // Wait for containers to resolve
    await Promise.all(serverPromises)
    return serversReturn
}