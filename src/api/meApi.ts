import { get, put, patch, del } from "@/api/instance/httpMethod";
import { IUserProfile } from "@/models/auth.model";
import {
    TUpdateProfile,
    IAvatarResponse,
    ICoverImageResponse,
    IChangePassword,
    IRevokeTokenResponse,
    TRevokeToken,
} from "@/models/me.model";

const PATH = "/me";

const ServiceMe = {
    getProfile: async (): Promise<IUserProfile> => {
        const url = `${PATH}/profile`;
        const response = await get<IUserProfile>(url);
        return response.data;
    },

    updateProfile: async ({ gender, ...params }: TUpdateProfile): Promise<void> => {
        const url = `${PATH}/profile`;
        const response = await put<void>(url, {
            gender: gender ? 1 : 0,
            ...params,
        });
        return response.data;
    },

    updateAvatar: async (data: FormData): Promise<IAvatarResponse> => {
        const url = `${PATH}/avatar`;
        const response = await patch<IAvatarResponse>(url, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },

    updateCoverImage: async (data: FormData): Promise<ICoverImageResponse> => {
        const url = `${PATH}/cover-image`;
        const response = await patch<ICoverImageResponse>(url, data, {
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data;
    },

    changePassword: async (params: IChangePassword): Promise<void> => {
        const url = `${PATH}/password`;
        const response = await patch<void>(url, params);
        return response.data;
    },

    revokeToken: async (params: TRevokeToken): Promise<IRevokeTokenResponse> => {
        const url = `${PATH}/revoke-token`;
        const response = await del<IRevokeTokenResponse>(url, {
            data: params,
        });
        return response.data;
    },
};

export default ServiceMe;
