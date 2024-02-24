import { Elysia } from "elysia";
import { configController } from "./config";
import { _logger } from "./logger";

interface EndpointProps {
    name: string,
    prefix?: string,
}

export const endpoint = ({ name, prefix }: EndpointProps) => new Elysia({ name, prefix })
    .decorate('logger', _logger.bind(this, name))
    .use(configController)
