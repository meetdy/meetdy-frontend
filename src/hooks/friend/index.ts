// Query hooks (data fetching)
export { useGetFriends, createKeyGetFriends } from './useGetFriends';
export {
  useGetListRequestFriend,
  createKeyListRequestFriend,
} from './useGetListRequestFriend';
export {
  useGetMyRequestFriend,
  createKeyMyRequestFriend,
} from './useGetMyRequestFriend';
export {
  useGetSuggestFriend,
  createKeySuggestFriend,
} from './useGetSuggestFriend';
export { useGetPhoneBook, createKeyPhoneBook } from './useGetPhoneBook';

// Mutation hooks (data modification)
export { useAcceptRequestFriend } from './useAcceptRequestFriend';
export { useDeleteFriend } from './useDeleteFriend';
export { useDeleteRequestFriend } from './useDeleteRequestFriend';
export { useDeleteSentRequestFriend } from './useDeleteSentRequestFriend';
export { useSendRequestFriend } from './useSendRequestFriend';
