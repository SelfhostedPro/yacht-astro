import { createConsola } from 'consola'

export const _logger = (tag: string, from?: string) => createConsola().withTag(`${tag}${from ? ` - ${from}` : null}`)