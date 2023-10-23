import { Web5 } from "@web5/api";
import { Record } from "@web5/api/dist/types/record";

export type Web5Connection = {
    web5: Web5;
    did: string;
};

export type QNavLink = {
    name: string
    description?: string
    url: string
}

export type QNavLinkRequest = {
    data: QNavLink
    isPrivate?: boolean
}

export type QNavFollow = {
    did: string
    nickname?: string
}

export type BaseRecordResponse<T> = {
    data: T
    id: string
    record: Record
    isExternal?: boolean
}

export type QNavLinkResponse = BaseRecordResponse<QNavLink>
export type QNavFollowsResponse = BaseRecordResponse<QNavFollow>

export type QNavHook = {
    web5: Web5 | undefined
    did: string | undefined
    isLoading: boolean
    error: any
    links: QNavLinkResponse[]
    follows: QNavFollowsResponse[]
    queryLinks: () => Promise<boolean>
    addLink: (value: QNavLink, isPrivate?: boolean) => Promise<boolean>
    deleteLink: (link: any) => Promise<boolean>
    addFollow: (data: QNavFollow) => Promise<boolean>
    deleteFollow: (follow: any) => Promise<boolean>
    queryFollows: () => Promise<boolean>
}