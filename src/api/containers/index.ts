import { endpoint } from '~/api/utils/endpoint'
import { t } from 'elysia'
import { getContainers } from './service'
import { YachtConfigSchema, type YachtConfig } from '~/types/config'
import { ServerContainersSchema, type ServerContainers } from "~/types/servers"

export const containersController = endpoint({ name: 'containersController' })
    .group('/containers', { detail: { tags: ['Containers'] } }, (app) =>
        app
            .get('/', () => getContainers(), { response: ServerContainersSchema })
            .get('/hi', 'hi from containersController')
    )
