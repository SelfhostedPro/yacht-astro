import { Elysia } from 'elysia'
import { api } from '~/api'

const app = new Elysia({ name: 'root' })
    .use(api)

const handle = ({ request }: { request: Request }) => app.handle(request)
export const GET = handle