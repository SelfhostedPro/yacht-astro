import { endpoint } from '~/api/utils/endpoint'

export const serversController = endpoint({ name: 'serversController' })
    .group('/servers', { detail: { tags: ['Servers'] } }, (app) =>
        app
            .get('/hi', 'hi from serversController')
    )
