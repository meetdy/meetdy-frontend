import { get } from "@/api/instance/httpMethod";

export type IWebInfoValue = Record<string, any> | any[];

export interface IWebInfo {
    _id: string;
    name: string;
    value: IWebInfoValue;
}

const PATH = "/common/web-info";

const ServiceInfoWeb = {
    fetchInfoWeb: async (): Promise<IWebInfo[]> => {
        const url = PATH;
        const response = await get<IWebInfo[]>(url);
        return response.data;
    },
};

export default ServiceInfoWeb;
