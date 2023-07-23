import { Web5 } from "@tbd54566975/web5";

export type Web5Connection = {
    web5?: Web5;
    did?: string;
};

export type QGoLink = {
    name: string
    description?: string
    url: string
    isDeleted: boolean
}

export type QGoLinkResponse = {
    data: QGoLink
    id: string
    record: any
}

export type QGoApi = {
    web5: Web5Connection | null
    isLoading: boolean
    error: any
    links: QGoLinkResponse[]
    queryLinks: () => Promise<void>
    addLink: (value: QGoLink) => Promise<void>
    deleteLink: (link: any) => Promise<void>
}