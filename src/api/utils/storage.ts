import { createStorage } from 'unstorage'
import fsLiteDriver from "unstorage/drivers/fs-lite";
import { env } from '~/t3env'


console.log(env.CONFIG_PATH)
export const configStorage = async () => {
    const storage = createStorage({ driver: fsLiteDriver({ base: env.CONFIG_PATH }) })
    return storage
}