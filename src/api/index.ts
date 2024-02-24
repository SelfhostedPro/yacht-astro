import { Elysia, t } from 'elysia'
import { swagger } from '@elysiajs/swagger'
import { containersController } from './containers'
import { _logger } from './utils/logger'
import { serversController } from './servers'
import { settingsController } from './settings'

const logger = _logger.bind(this, 'core')

export const api = new Elysia({ prefix: '/api' })
    .use(swagger({
        provider: 'scalar',
        documentation: {
            openapi: "3.1.0",
            tags: [
                { name: 'Core', description: 'Endpoints for core functions like healthchecks.' },
                { name: 'Containers', description: 'Endpoints for interacting with containers.' },
                { name: 'Servers', description: 'Endpoints for interacting with servers.' },
                { name: 'Settings', description: 'Endpoints for interacting with settings' }
            ]
        }
    }))
    .get('/healthz', () => {
        logger('healthcheck').info('Healthcheck returned success')
        return { status: 'success' }
    }, {
        detail: { tags: ['Core'] }, response: {
            200: t.Object({ status: t.String({ examples: ['sucess'] }) }),
            500: t.Object({ status: t.String({ examples: ['failure'] }) })
        }
    })
    .use(serversController)
    .use(containersController)
    .use(settingsController)