import { get, post, del } from '@/api/instance/httpMethod';
import { IMessage } from '@/models/message.model';

const PATH = '/messages';

export type TSendMessagePayload = {
  content: string;
  conversationId: string;
  type?: string;
  channelId?: string;
  tags?: string[];
  replyMessageId?: string;
};

export interface IAttachInfo {
  type: string;
  conversationId: string;
  channelId?: string;
}

const ServiceMessages = {
  getListMessages: async (
    conversationId: string,
    page?: number,
    size?: number,
  ): Promise<IMessage> => {
    const url = `${PATH}/${conversationId}`;
    const params = { page, size };
    const response = await get<IMessage>(url, params);
    return response.data;
  },

  sendTextMessage: async <T = any>(
    message: TSendMessagePayload,
  ): Promise<T> => {
    const url = `${PATH}/text`;
    const response = await post<T>(url, message);
    return response.data;
  },

  sendFileThroughMessage: async (
    file: File,
    attachInfo: IAttachInfo,
    cb: (progress: number) => void,
  ): Promise<void> => {
    const { type, conversationId, channelId } = attachInfo;

    const formData = new FormData();
    formData.append('file', file);

    const response = await post<void>(`${PATH}/files`, formData, {
      params: { type, conversationId, channelId },
      onUploadProgress: (progressEvent) => {
        if (progressEvent?.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          cb(percentCompleted);
        }
      },
    });

    return response.data;
  },

  redoMessage: async (idMessage: string): Promise<void> => {
    const url = `${PATH}/${idMessage}`;
    const response = await del<void>(url);
    return response.data;
  },

  deleteMessageClientSide: async (idMessage: string): Promise<void> => {
    const url = `${PATH}/${idMessage}/only`;
    const response = await del<void>(url);
    return response.data;
  },

  dropReaction: async (idMessage: string, type: string): Promise<void> => {
    const url = `${PATH}/${idMessage}/reacts/${encodeURIComponent(type)}`;
    const response = await post<void>(url);
    return response.data;
  },

  forwardMessage: async (
    messageId: string,
    conversationId: string,
  ): Promise<void> => {
    const url = `${PATH}/${messageId}/share/${conversationId}`;
    const response = await post<void>(url);
    return response.data;
  },
};

export default ServiceMessages;
