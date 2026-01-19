import FriendService from "@/api/friendApi";
import { createQueryKey, queryClient } from "@/queries/core";
import { useMutation } from "@tanstack/react-query";
import { fetchFriendsQueryKey } from "./useFetchFriends";

export function useDeleteFriend() {
    return useMutation({
        mutationKey: createQueryKey("deleteFriend", {}),
        mutationFn: async (userId: string) => {
            return await FriendService.deleteFriend(userId);
        },
        onSuccess: () => {
             queryClient.invalidateQueries({
                 queryKey: fetchFriendsQueryKey({ name: '' })
             });
        }
    });
}
