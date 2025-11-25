import { get, post, del } from "@/api/instance/httpMethod";

const PATH = "/pin-messages";

export interface IPinMessage {
    id: string;
    content: string;
    senderId: string;
    conversationId: string;
    pinnedAt: string;
}

const ServicePinMessage = {
    fetchPinMessages: async (conversationId: string): Promise<IPinMessage[]> => {
        const url = `${PATH}/${conversationId}`;
        const response = await get<IPinMessage[]>(url);
        return response.data;
    },

    pinMessage: async (messageId: string): Promise<void> => {
        const url = `${PATH}/${messageId}`;
        const response = await post<void>(url);
        return response.data;
    },

    removePinMessage: async (messageId: string): Promise<void> => {
        const url = `${PATH}/${messageId}`;
        const response = await del<void>(url);
        return response.data;
    },
};

export default ServicePinMessage;
