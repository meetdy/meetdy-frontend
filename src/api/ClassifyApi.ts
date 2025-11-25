import { get, post, put, del } from "@/api/instance/httpMethod";
import { IAddClassify, IClassify, IColor } from "@/models/classify.model";

const PATH = "/classifies";

const ServiceClassify = {
    fetchColors: async (): Promise<IColor[]> => {
        const url = `${PATH}/colors`;
        const response = await get<IColor[]>(url);
        return response.data;
    },

    fetchClassifies: async (): Promise<IClassify[]> => {
        const url = PATH;
        const response = await get<IClassify[]>(url);
        return response.data;
    },

    addClassify: async (params: IAddClassify): Promise<IClassify> => {
        const url = PATH;
        const response = await post<IClassify>(url, params);
        return response.data;
    },

    deleteClassify: async (id: string): Promise<void> => {
        const url = `${PATH}/${id}`;
        const response = await del<void>(url);
        return response.data;
    },

    addClassifyForConversation: async (
        classifyId: string,
        conversationId: string
    ): Promise<void> => {
        const url = `${PATH}/${classifyId}/conversations/${conversationId}`;
        const response = await post<void>(url);
        return response.data;
    },

    removeClassifyFromConversation: async (
        classifyId: string,
        conversationId: string
    ): Promise<void> => {
        const url = `${PATH}/${classifyId}/conversations/${conversationId}`;
        const response = await del<void>(url);
        return response.data;
    },

    updateClassify: async (classifyId: string, params: IAddClassify): Promise<IClassify> => {
        const url = `${PATH}/${classifyId}`;
        const response = await put<IClassify>(url, params);
        return response.data;
    },
};

export default ServiceClassify;
