import { get } from "@/api/instance/httpMethod";

const PATH = "/stickers";

const ServiceSticker = {
    fetchAllSticker: async (): Promise<any> => {
        const url = PATH;
        const response = await get<any>(url);
        return response.data;
    },
};

export default ServiceSticker;
