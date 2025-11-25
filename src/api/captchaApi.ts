import { get } from "@/api/instance/httpMethod";

export type ICaptcha = {
    enableGoogleCaptcha: string;
    siteKeyV2: string;
    siteKeyV3: string;
};

const PATH = "/common/google-captcha";

const ServiceCaptcha = {
    fetchCaptcha: async (): Promise<ICaptcha> => {
        const url = PATH;
        const response = await get<ICaptcha>(url);
        return response.data;
    },
};

export default ServiceCaptcha;
