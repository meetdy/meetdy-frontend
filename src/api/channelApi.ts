import { get, post, put, del } from '@/api/instance/httpMethod';
import { IMessage } from '@/models/message.model';

const PATH = '/channels';

export type TChannelId = {
  id: string;
};

export type TChannelParams = {
  id: string;
  name: string;
};

const ServiceChannel = {
  getChannel: async (params: TChannelId): Promise<any> => {
    const url = `${PATH}/${params.id}`;
    const response = await get<any>(url);
    return response.data;
  },

  addChannel: async (params: TChannelParams): Promise<any> => {
    const url = PATH;
    const response = await post<any>(url, {
      name: params.name,
      conversationId: params.id,
    });
    return response.data;
  },

  renameChannel: async (params: TChannelParams): Promise<any> => {
    const url = PATH;
    const response = await put<any>(url, { _id: params.id, name: params.name });
    return response.data;
  },

  deleteChannel: async (params: TChannelId): Promise<void> => {
    const url = `${PATH}/${params.id}`;
    const response = await del<void>(url);
    return response.data;
  },

  getMessageInChannel: async (
    channelId: string,
    page: number,
    size: number,
  ): Promise<{ data: IMessage[]; total: number }> => {
    const url = `/messages/channel/${channelId}`;
    const response = await get<{ data: IMessage[]; total: number }>(url, {
      params: { page, size },
    });
    return response.data;
  },

  getLastViewChannel: async (
    channelId: string,
  ): Promise<{ lastViewedAt: string }> => {
    const url = `${PATH}/${channelId}/last-view`;
    const response = await get<{ lastViewedAt: string }>(url);
    return response.data;
  },
};

export default ServiceChannel;
