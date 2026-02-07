import { get, post, del } from '@/api/instance/httpMethod';
import { TConversationId } from './messageApi';

const PATH = '/pin-messages';

export interface IPinMessage {
  id: string;
  content: string;
  senderId: string;
  conversationId: string;
  pinnedAt: string;
}

export type TPinMessageParams = {
  messageId: string;
};

const ServicePinMessage = {
  getPinMessages: async (params: TConversationId): Promise<IPinMessage[]> => {
    const url = `${PATH}/${params.conversationId}`;
    const response = await get<IPinMessage[]>(url);
    return response.data;
  },

  pinMessage: async (params: TPinMessageParams): Promise<void> => {
    const url = `${PATH}/${params.messageId}`;
    const response = await post<void>(url);
    return response.data;
  },

  unpinMessage: async (params: TPinMessageParams): Promise<void> => {
    const url = `${PATH}/${params.messageId}`;
    const response = await del<void>(url);
    return response.data;
  },
};

export default ServicePinMessage;
