import { get, post } from "@/api/instance/httpMethod";
import {
    TLogin,
    TRegister,
    TConfirmAccount,
    TConfirmPassword,
    IUser,
    TLoginResponse,
} from "@/models/auth.model";

const PATH = "/auth";

const ServiceAuth = {
    login: async (params: TLogin): Promise<TLoginResponse> => {
        const url = `${PATH}/login`;
        const response = await post<TLoginResponse>(url, params);
        return response.data;
    },

    register: async (params: TRegister): Promise<void> => {
        const url = `${PATH}/registry`;
        const response = await post<void>(url, params);
        return response.data;
    },

    forgot: async (username: string): Promise<void> => {
        const url = `${PATH}/reset-otp`;
        const response = await post<void>(url, { username });
        return response.data;
    },

    confirmAccount: async (params: TConfirmAccount): Promise<void> => {
        const url = `${PATH}/confirm-account`;
        const response = await post<void>(url, params);
        return response.data;
    },

    confirmPassword: async (params: TConfirmPassword): Promise<void> => {
        const url = `${PATH}/confirm-password`;
        const response = await post<void>(url, params);
        return response.data;
    },

    getUser: async (username: string): Promise<IUser> => {
        const url = `${PATH}/users/${username}`;
        const response = await get<IUser>(url);
        return response.data;
    },
};

export default ServiceAuth;
