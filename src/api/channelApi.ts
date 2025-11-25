import { get, post, put, del } from "@/api/instance/httpMethod";
import { IMessage } from "@/models/message.model";

const PATH = "/channels";

const ServiceChannel = {
    fetchChannel: async (conversationId: string): Promise<any> => {
        const url = `${PATH}/${conversationId}`;
        const response = await get<any>(url);
        return response.data;
    },

    addChannel: async (name: string, conversationId: string): Promise<any> => {
        const url = PATH;
        const response = await post<any>(url, { name, conversationId });
        return response.data;
    },

    renameChannel: async (name: string, _id: string): Promise<any> => {
        const url = PATH;
        const response = await put<any>(url, { _id, name });
        return response.data;
    },

    deleteChannel: async (channelId: string): Promise<void> => {
        const url = `${PATH}/${channelId}`;
        const response = await del<void>(url);
        return response.data;
    },

    fetchMessageInChannel: async (
        channelId: string,
        page: number,
        size: number
    ): Promise<{ data: IMessage[]; total: number }> => {
        const url = `/messages/channel/${channelId}`;
        const response = await get<{ data: IMessage[]; total: number }>(url, {
            params: { page, size },
        });
        return response.data;
    },

    fetchLastViewChannel: async (channelId: string): Promise<{ lastViewedAt: string }> => {
        const url = `${PATH}/${channelId}/last-view`;
        const response = await get<{ lastViewedAt: string }>(url);
        return response.data;
    },
};

export default ServiceChannel;
