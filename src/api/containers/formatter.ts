import type { ContainerInfo, Port } from "~/types/containers/dockerode";
import type { Container, ContainerMount, ContainerPort } from '~/types/containers/yacht'
import type { FixedContainerInfo, FixedContainerInspectInfo } from '~/types/containers/fixed'
import { format, parseISO } from 'date-fns';

export const normalizeContainers = async (
    data: FixedContainerInfo[],
): Promise<Container[]> => {
    const promises = data.map(normalizeContainerInfo, this);
    return Promise.all(promises);
}

export const normalizeContainerInfo = async (data: FixedContainerInfo): Promise<Container> => {
    return {
        name: data.Names[0].slice(1),
        id: data.Id,
        shortId: data['Id'].substring(0, 10),
        image: data['Image'],
        created: format(new Date(data.Created * 1000), 'MM/dd/yyyy'),
        status: data.State,
        state: data.Status,
        info: {
            title:
                data.Labels['sh.yacht.title'] ||
                data.Labels['org.opencontainers.image.title'],
            notes: data.Labels['sh.yacht.notes'],
            description: data.Labels['org.opencontainers.image.description'],
            external: data.Labels['sh.yacht.external'],
            subdomain: data.Labels['sh.yacht.subdomain'],
            docs: data.Labels['org.opencontainers.image.documentation'],
            url: data.Labels['org.opencontainers.image.url'],
            source: data.Labels['org.opencontainers.image.source'],
            vendor: data.Labels['org.opencontainers.image.vendor'],
            icon: await getIconUrl(data.Labels),
        },
        config: {
            network: {
                mode: data.HostConfig.NetworkMode,
                networks: data.NetworkSettings.Networks,
            },
        },
        mounts: data.Mounts ? formatMounts(data.Mounts) : null,
        ports: data.Ports ? formatInfoPorts(data.Ports) : null,
        labels: data.Labels,
    } as Container;
}

/**
* Transform ports data from inspect to ContainerPort type.
*/
const formatInfoPorts = (data: Port[]): ContainerPort[] => {
    return data.reduce(
        (
            acc: ContainerPort[],
            { PrivatePort, PublicPort, IP, Type },
        ) => {
            if (IP !== '::1') {
                acc.push({
                    containerPort: PrivatePort,
                    hostPort: PublicPort,
                    hostIP: IP,
                    type: Type,
                });
            }
            return acc;
        },
        [],
    );
}

/**
 * Transform mounts data to ContainerMount type.
 */
const formatMounts = (data: FixedContainerInfo['Mounts'] | FixedContainerInspectInfo['Mounts']): ContainerMount[] => {
    return data?.map(
        ({ Type, Name, Source, Destination, Driver, Mode, RW, Propagation }) => ({
            type: Type,
            name: Name,
            source: Source ?? null,
            destination: Destination ?? null,
            driver: Driver,
            mode: Mode,
            rw: RW,
            propagation: Propagation,
        }),
    ) || [];
}

/**
 * Checks to see if the icon url is valid and loads.
 * (Used in order to grab the default LSIO icon if the app's icon returns a 404)
 */
const checkUrl = async (url: string): Promise<string> => {
    const DEFAULT_IMAGE_URL = 'https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/linuxserver-ls-logo.png';
    try {
        new URL(url);
        const response = await fetch(url);
        return response.ok && response.status !== 404 ? url : DEFAULT_IMAGE_URL;
    } catch {
        return DEFAULT_IMAGE_URL;
    }
}

/**
 * Checks for an icon url in the container's labels.
 * Includes some special cases for certain vendors.
 */
const getIconUrl = async (labels: Container['labels']) => {
    if (labels && labels['sh.yacht.icon']) {
        return checkUrl(labels['sh.yacht.icon']);
    }
    if (
        labels && labels['org.opencontainers.image.vendor'] &&
        labels['org.opencontainers.image.title']
    ) {
        const vendor = labels['org.opencontainers.image.vendor']?.toLowerCase();
        const title = labels['org.opencontainers.image.title']?.toLowerCase();
        switch (vendor) {
            case 'linuxserver.io': {
                const url = `https://raw.githubusercontent.com/linuxserver/docker-templates/master/linuxserver.io/img/${title}-logo.png`;
                return await checkUrl(url);
            }
            case 'portainer.io': {
                return labels['com.docker.desktop.extension.icon']
            }
            default: {
                return labels['sh.yacht.icon']
            }
        }
    }
}