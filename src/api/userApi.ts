import { get } from "@/api/instance/httpMethod";
import { ISuggestFriend } from "@/models/friend.model";

const PATH = "/users/search/username";

const ServiceUser = {
    fetchUser: async (username: string): Promise<ISuggestFriend> => {
        const url = `${PATH}/${username}`;
        const response = await get<ISuggestFriend>(url);
        return response.data;
    },
};

export default ServiceUser;
