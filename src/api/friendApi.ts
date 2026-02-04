import { get, post, del } from '@/api/instance/httpMethod';
import {
  TFetchFriends,
  IFriend,
  IRequestFriend,
  ISuggestFriend,
} from '@/models/friend.model';

const PATH = '/friends';

const FriendService = {
  getFriends: async (params: TFetchFriends): Promise<IFriend[]> => {
    const url = PATH;
    const response = await get<IFriend[]>(url, params);
    return response.data;
  },

  acceptRequestFriend: async (userId: string): Promise<void> => {
    const url = `${PATH}/${userId}`;
    const response = await post<void>(url);
    return response.data;
  },

  deleteFriend: async (userId: string): Promise<void> => {
    const url = `${PATH}/${userId}`;
    const response = await del<void>(url);
    return response.data;
  },

  getListRequestFriend: async (): Promise<IRequestFriend[]> => {
    const url = `${PATH}/invites`;
    const response = await get<IRequestFriend[]>(url);
    return response.data;
  },

  deleteRequestFriend: async (userId: string): Promise<void> => {
    const url = `${PATH}/invites/${userId}`;
    const response = await del<void>(url);
    return response.data;
  },

  sendRequestFriend: async (userId: string): Promise<void> => {
    const url = `${PATH}/invites/me/${userId}`;
    const response = await post<void>(url);
    return response.data;
  },

  deleteSentRequestFriend: async (userId: string): Promise<void> => {
    const url = `${PATH}/invites/me/${userId}`;
    const response = await del<void>(url);
    return response.data;
  },

  getMyRequestFriend: async (): Promise<IRequestFriend[]> => {
    const url = `${PATH}/invites/me`;
    const response = await get<IRequestFriend[]>(url);
    return response.data;
  },

  getSuggestFriend: async (page = 0, size = 12): Promise<ISuggestFriend[]> => {
    const url = `${PATH}/suggest`;
    const response = await get<ISuggestFriend[]>(url, {
      params: { page, size },
    });
    return response.data;
  },
};

export default FriendService;
