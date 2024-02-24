import { endpoint } from '~/api/utils/endpoint'
import { YachtConfigSchema } from "~/types/config";
export const settingsController = endpoint({ name: 'settingsController' })
    .group('/settings', { detail: { tags: ['Settings'] } }, (app) =>
        app
            .get('/config', ({ store: { config } }) => {
                return config
            }, { response: YachtConfigSchema })
    )