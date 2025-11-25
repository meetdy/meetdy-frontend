import { IUserProfile } from "@/models/auth.model";

export interface IMessage {
    page: any;
    totalPages: any;
    data: any;
}

export interface ILastIndividualMessage {
    _id: string;
    content: string;
    type: string;
    conversationId: string;
    reacts: Array<any>;
    createdAt: string;
    replyMessage: any;
    user: Pick<IUserProfile, "_id" | "name" | "avatar">;
    isDeleted?: boolean;
}

export interface ILastGroupMessage {
    _id: string;
    content: string;
    type: string;
    conversationId: string;
    reacts: Array<any>;
    options: Array<any>;
    createdAt: string;
    user: Pick<IUserProfile, "_id" | "name" | "avatar" | "avatarColor">;
    manipulatedUsers: Array<any>;
    userOptions: Array<any>;
    replyMessage: any;
    tagUsers: Array<any>;
    isDeleted?: boolean;
}
