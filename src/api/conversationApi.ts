import { del, get, patch, post } from '@/api/instance/httpMethod';
import {
  IGroupConversation,
  IIndividualConversation,
  TCreateConversationResponse,
  TCreateGroup,
  TGetListConversations,
} from '@/models/conversation.model';
import { IFriend } from '@/models/friend.model';

const PATH = '/conversations';

const ServiceConversation = {
  getListConversations: async (
    params: TGetListConversations,
  ): Promise<Array<IIndividualConversation | IGroupConversation>> => {
    const url = PATH;
    const response = await get<
      Array<IIndividualConversation | IGroupConversation>
    >(url, { params });
    return response.data;
  },

  createConversationIndividual: async (
    userId: string,
  ): Promise<TCreateConversationResponse> => {
    const url = `${PATH}/individuals/${userId}`;
    const response = await post<TCreateConversationResponse>(url);
    return response.data;
  },

  createGroup: async (params: TCreateGroup): Promise<void> => {
    const url = `${PATH}/groups`;
    const response = await post<void>(url, params);
    return response.data;
  },

  getConversationById: async (
    id: string,
  ): Promise<IIndividualConversation | IGroupConversation> => {
    const url = `${PATH}/${id}`;
    const response = await get<IIndividualConversation | IGroupConversation>(
      url,
    );
    return response.data;
  },

  deleteConversation: async (id: string): Promise<void> => {
    const url = `${PATH}/${id}`;
    const response = await del<void>(url);
    return response.data;
  },

  getMemberInConversation: async (id: string): Promise<IFriend[]> => {
    const url = `${PATH}/${id}/members`;
    const response = await get<IFriend[]>(url);
    return response.data;
  },

  addMembersToConversation: async (
    userIds: Array<string>,
    conversationId: string,
  ): Promise<void> => {
    const url = `${PATH}/${conversationId}/members`;
    const response = await post<void>(url, { userIds });
    return response.data;
  },

  leaveGroup: async (conversationId: string): Promise<void> => {
    const url = `${PATH}/${conversationId}/members/leave`;
    const response = await del<void>(url);
    return response.data;
  },

  deleteMember: async (
    conversationId: string,
    userId: string,
  ): Promise<void> => {
    const url = `${PATH}/${conversationId}/members/${userId}`;
    const response = await del<void>(url);
    return response.data;
  },

  changeNameConversation: async (
    conversationId: string,
    name: string,
  ): Promise<void> => {
    const url = `${PATH}/${conversationId}/name`;
    const response = await patch<void>(url, { name });
    return response.data;
  },

  getLastViewOfMembers: async (conversationId: string): Promise<any> => {
    const url = `${PATH}/${conversationId}/last-view`;
    const response = await get<any>(url);
    return response.data;
  },

  getSummaryInfoGroup: async (conversationId: string): Promise<any> => {
    const url = `${PATH}/${conversationId}/summary`;
    const response = await get<any>(url);
    return response.data;
  },

  joinGroupFromLink: async (conversationId: string): Promise<void> => {
    const url = `${PATH}/${conversationId}/members/join-from-link`;
    const response = await post<void>(url);
    return response.data;
  },

  changeStatusForGroup: async (
    conversationId: string,
    isStatus: boolean,
  ): Promise<void> => {
    const url = `${PATH}/${conversationId}/join-from-link/${isStatus}`;
    const response = await patch<void>(url);
    return response.data;
  },

  changeAvatarGroup: async (
    conversationId: string,
    file: File,
  ): Promise<void> => {
    const url = `${PATH}/${conversationId}/avatar`;
    const formData = new FormData();
    formData.append('file', file);
    const response = await patch<void>(url, formData);
    return response.data;
  },

  addManagerGroup: async (
    conversationId: string,
    userIds: Array<string>,
  ): Promise<void> => {
    const url = `${PATH}/${conversationId}/managers`;
    const response = await post<void>(url, { managerIds: userIds });
    return response.data;
  },

  deleteManager: async (
    conversationId: string,
    userIds: Array<string>,
  ): Promise<void> => {
    const url = `${PATH}/${conversationId}/managers`;
    const response = await del<void>(url, {
      data: { managerIds: userIds },
    });
    return response.data;
  },
};

export default ServiceConversation;
