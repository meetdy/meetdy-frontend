import { get } from "@/api/instance/httpMethod";

export type TFetchMediaParams = {
    conversationId: string;
    type?: "ALL" | "IMAGE" | "VIDEO" | "FILE";
    senderId?: string;
    startTime?: string;
    endTime?: string;
};

export interface IMedia {
    id: string;
    name: string;
    type: string;
    url: string;
    createdAt: string;
    senderId: string;
}

const PATH = "/messages";

const ServiceMedia = {
    fetchAllMedia: async ({
        conversationId,
        type = "ALL",
        senderId,
        startTime,
        endTime,
    }: TFetchMediaParams): Promise<IMedia[]> => {
        const url = `${PATH}/${conversationId}/files`;
        const response = await get<IMedia[]>(url, {
            params: { type, senderId, startTime, endTime },
        });
        return response.data;
    },
};

export default ServiceMedia;
