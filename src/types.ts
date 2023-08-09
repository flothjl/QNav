import { Web5 } from "@tbd54566975/web5";
import { Record } from "@tbd54566975/web5/dist/types/record";

export type Web5Connection = {
    web5: Web5;
    did: string;
};

export type QGoLink = {
    name: string
    description?: string
    url: string
}

export type QGoFollow = {
    did: string
    nickname?: string
}

export type BaseRecordResponse<T> = {
    data: T
    id: string
    record: Record
}

export type QGoLinkResponse = BaseRecordResponse<QGoLink>
export type QGoFollowsResponse = BaseRecordResponse<QGoFollow>

export type QGoApi = {
    web5: Web5Connection | null
    isLoading: boolean
    error: any
    links: QGoLinkResponse[]
    follows: QGoFollowsResponse[]
    queryLinks: () => Promise<boolean>
    addLink: (value: QGoLink) => Promise<boolean>
    deleteLink: (link: any) => Promise<boolean>
    addFollow: (data: QGoFollow) => Promise<boolean>
    deleteFollow: (follow: any) => Promise<boolean>
    queryFollows: () => Promise<boolean>
}