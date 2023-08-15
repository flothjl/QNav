import { Web5 } from "@tbd54566975/web5";
import { Record } from "@tbd54566975/web5/dist/types/record";

export type Web5Connection = {
    web5: Web5;
    did: string;
};

export type QNavLink = {
    name: string
    description?: string
    url: string
}

export type QNavFollow = {
    did: string
    nickname?: string
}

export type BaseRecordResponse<T> = {
    data: T
    id: string
    record: Record
}

export type QNavLinkResponse = BaseRecordResponse<QNavLink>
export type QNavFollowsResponse = BaseRecordResponse<QNavFollow>

export type QNavHook = {
    web5: Web5 | null
    did: string | null
    isLoading: boolean
    error: any
    links: QNavLinkResponse[]
    follows: QNavFollowsResponse[]
    queryLinks: () => Promise<boolean>
    addLink: (value: QNavLink) => Promise<boolean>
    deleteLink: (link: any) => Promise<boolean>
    addFollow: (data: QNavFollow) => Promise<boolean>
    deleteFollow: (follow: any) => Promise<boolean>
    queryFollows: () => Promise<boolean>
}