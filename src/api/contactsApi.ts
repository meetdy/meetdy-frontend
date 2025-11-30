import { get } from '@/api/instance/httpMethod';
import { IContact } from '@/models/friend.model';

const PATH = '/me/phone-books';

const ServiceContacts = {
  getContacts: async (): Promise<IContact[]> => {
    const url = PATH;
    const response = await get<IContact[]>(url);
    return response.data;
  },
};

export default ServiceContacts;
