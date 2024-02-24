import { Elysia } from 'elysia'
import { useConfig } from './service'

export const configController = new Elysia({ name: 'ConfigController', prefix: '/config' })
    .state('config', await useConfig())