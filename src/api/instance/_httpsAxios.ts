import { colorMethodHttp } from "@/api/instance/utils";
import { API_URL } from "@/config/env";
import axios, { type AxiosError, type AxiosResponse } from "axios";
import qs from "query-string";

declare module "axios" {
    export interface AxiosRequestConfig {
        metadata?: {
            startTime?: number | Date | string;
        };
    }
}

const _httpsAxios = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 60000,
    paramsSerializer: (params) => qs.stringify(params),
});

_httpsAxios.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        config.metadata = { startTime: new Date().getTime() };
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

_httpsAxios.interceptors.response.use(
    (response) => {
        const endTime = new Date().getTime();
        const startTime = Number(response.config.metadata?.startTime);
        const method = response.config.method?.toUpperCase() || "";
        const duration = endTime - startTime;

        console.log(
            `${colorMethodHttp(method)} [${response.config.url}]: ${
                duration < 500
                    ? "\x1b[32m"
                    : duration > 500 && duration < 1000
                      ? "\x1b[33m"
                      : "\x1b[31m"
            }${duration} ms\x1b[0m`
        );

        // if (isSuccess(response.status)) {
        //     return response.data;
        // }

        return response;
    },
    async (error: AxiosError) => {
        const { config, response } = error;
        if (!response || !config) {
            return Promise.reject(error);
        }

        const url = `${config.baseURL || ""}${config.url || ""}`;
        console.error(`[${url}]`, response.status);

        const errorResponse = response as AxiosResponse<{
            code: string;
            message: string;
            name: string;
        }>;

        const errorData = errorResponse.data || {
            code: "UNKNOWN_ERROR",
            message: "Unknown error occurred",
            name: "Error",
        };

        const { code, message, name } = errorData;

        console.error(`Error Code: ${code}, Message: ${message}`);

        return Promise.reject({
            code,
            message,
            name,
            status: response.status,
        });
    }
);

export default _httpsAxios;
export { _httpsAxios as axiosClient };
