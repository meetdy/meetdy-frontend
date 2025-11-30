import { get, post, del } from "@/api/instance/httpMethod";
import { IVote } from "@/models/vote.model";

const PATH = "/votes";

const ServiceVote = {
    createVote: async (
        content: string,
        options: string[],
        conversationId: string
    ): Promise<any> => {
        const url = PATH;
        const response = await post<any>(url, { content, options, conversationId });
        return response.data;
    },

    addVote: async (messageId: string, options: string[]): Promise<any> => {
        const url = `${PATH}/${messageId}`;
        const response = await post<any>(url, { options });
        return response.data;
    },

    selectVote: async (messageId: string, options: string[]): Promise<any> => {
        const url = `${PATH}/${messageId}/choices`;
        const response = await post<any>(url, { options });
        return response.data;
    },

    deleteSelect: async (messageId: string, options: string[]): Promise<any> => {
        const url = `${PATH}/${messageId}/choices`;
        const response = await del<any>(url, {
            data: { options },
        });
        return response.data;
    },

    getVotes: async (conversationId: string, page: number, size: number): Promise<IVote> => {
        const url = `${PATH}/${conversationId}`;
        const response = await get<IVote>(url, { params: { page, size } });
        return response.data;
    },
};

export default ServiceVote;
