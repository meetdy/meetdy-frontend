import { get, patch, post, put, del } from "@/api/instance/httpMethod";
import { IUser } from "@/models/auth.model";

const PATH = "/admin";

const ServiceAdmin = {
    fetchUsersByUsername: async (
        username: string,
        page: number,
        size: number
    ): Promise<{ data: IUser[]; total: number }> => {
        const url = `${PATH}/users-manager`;
        const response = await get<{ data: IUser[]; total: number }>(url, {
            params: { username, page, size },
        });
        return response.data;
    },
    active: async (id: string, isActived: boolean): Promise<void> => {
        const url = `${PATH}/users-manager/${id}/${isActived}`;
        const response = await patch<void>(url);
        return response.data;
    },

    delete: async (id: string, isDeleted: boolean): Promise<void> => {
        const url = `${PATH}/users-manager/${id}/${isDeleted}`;
        const response = await patch<void>(url);
        return response.data;
    },

    fetchAllGroupSticker: async () => {
        const url = "/stickers";
        const response = await get(url);
        return response.data;
    },

    createGroupSticker: async (name: string, description: string): Promise<void> => {
        const url = `${PATH}/stickers-manager`;
        const response = await post<void>(url, { name, description });
        return response.data;
    },

    updateGroupSticker: async (id: string, name: string, description: string): Promise<void> => {
        const url = `${PATH}/stickers-manager/${id}`;
        const response = await put<void>(url, { name, description });
        return response.data;
    },

    deleteGroupSticker: async (id: string): Promise<void> => {
        const url = `${PATH}/stickers-manager/${id}`;
        const response = await del<void>(url);
        return response.data;
    },

    deleteSticker: async (id: string, url: string): Promise<void> => {
        const endpoint = `${PATH}/stickers-manager/${id}/sticker`;
        const response = await del<void>(endpoint, {
            params: { url },
        });
        return response.data;
    },

    addSticker: async (id: string, file: File): Promise<void> => {
        const url = `${PATH}/stickers-manager/${id}`;
        const formData = new FormData();
        formData.append("file", file);

        const response = await post<void>(url, formData);
        return response.data;
    },
};

export default ServiceAdmin;
