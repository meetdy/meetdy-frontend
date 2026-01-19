import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@/queries/core";
import { IRequestFriend } from "@/models/friend.model";
import FriendService from "@/api/friendApi";

export function useGetListRequestFriend() {
    const { data, isFetched, isFetching } = useQuery<IRequestFriend[]>({
        queryKey: createQueryKey("fetchListRequestFriend", {}),
        queryFn: async () => {
            return await FriendService.getListRequestFriend();
        },
    });

    return { requestFriends: (data || []) as IRequestFriend[], isFetched, isFetching };
}
