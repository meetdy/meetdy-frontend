import { ILastGroupMessage, ILastIndividualMessage } from "@/models/message.model";

export interface IIndividualConversation {
    _id: string;
    name: string;
    avatar: string;
    avatarColor: string;
    userId: string;
    type: boolean;
    friendStatus: string;
    totalMembers: number;
    numberUnread: number;
    managerIds: Array<string>;
    isJoinFromLink: boolean;
    isNotify: boolean;
    lastMessage: ILastIndividualMessage;
    isOnline?: boolean;
    lastLogin?: string;
}

export interface IGroupConversation {
    _id: string;
    name: string;
    avatar: Array<{ avatar: string; avatarColor: string }>;
    type: boolean;
    totalMembers: number;
    numberUnread: number;
    leaderId: string;
    managerIds: Array<string>;
    isJoinFromLink: boolean;
    isNotify: boolean;
    lastMessage: ILastGroupMessage;
}

export type TGetListConversations = {
    name?: string;
    type?: number;
};

export type TGetConversation = {
    avatar: string;
    totalMembers: number;
};

export type TCreateGroup = {
    name: string;
    userIds: Array<string>;
};

export type TCreateConversationResponse = {
    _id: string;
    isExists: boolean;
};
