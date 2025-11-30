import { get, post, del } from "@/api/instance/httpMethod";
import { IMessage } from "@/models/message.model";

const PATH = "/messages";

export interface IAttachInfo {
    type: string;
    conversationId: string;
    channelId?: string;
}

const ServiceMessages = {
    getListMessages: async (
        conversationId: string,
        page?: number,
        size?: number
    ): Promise<IMessage> => {
        const url = `${PATH}/${conversationId}`;
        const response = await get<IMessage>(url, { params: { page, size } });
        return response.data;
    },

    sendTextMessage: async (message: {
        content: string;
        conversationId: string;
    }): Promise<void> => {
        const url = `${PATH}/text`;
        const response = await post<void>(url, message);
        return response.data;
    },

    sendFileThroughMessage: async (
        file: File,
        attachInfo: IAttachInfo,
        cb: (progress: number) => void
    ): Promise<void> => {
        const { type, conversationId, channelId } = attachInfo;

        const formData = new FormData();
        formData.append("file", file);

        const response = await post<void>(`${PATH}/files`, formData, {
            params: { type, conversationId, channelId },
            onUploadProgress: (progressEvent) => {
                if (progressEvent?.total) {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    cb(percentCompleted);
                }
            },
        });

        return response.data;
    },

    redoMessage: async (idMessage: string): Promise<void> => {
        const url = `${PATH}/${idMessage}`;
        const response = await del<void>(url);
        return response.data;
    },

    deleteMessageClientSide: async (idMessage: string): Promise<void> => {
        const url = `${PATH}/${idMessage}/only`;
        const response = await del<void>(url);
        return response.data;
    },

    dropReaction: async (idMessage: string, type: string): Promise<void> => {
        const url = `${PATH}/${idMessage}/reacts/${type}`;
        const response = await post<void>(url);
        return response.data;
    },

    forwardMessage: async (messageId: string, conversationId: string): Promise<void> => {
        const url = `${PATH}/${messageId}/share/${conversationId}`;
        const response = await post<void>(url);
        return response.data;
    },
};

export default ServiceMessages;
