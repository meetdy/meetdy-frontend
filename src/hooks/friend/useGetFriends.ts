import { useQuery } from "@tanstack/react-query";
import { TFetchFriends, IFriend } from "@/models/friend.model";
import FriendService from "@/api/friendApi";
import { createQueryKey } from "@/queries/core";

export const createKeyGetFriends = (params: TFetchFriends) => createQueryKey("getFriends", params);

interface UseGetFriendsProps {
    params: TFetchFriends;
    enabled?: boolean;
}
export function useGetFriends({ params, enabled = true }: UseGetFriendsProps) {
    const { data, isFetched, isFetching } = useQuery<IFriend[]>({
        queryKey: createKeyGetFriends(params),
        queryFn: () => FriendService.getFriends(params),
        enabled,
    });

    return { friends: (data || []) as IFriend[], isFetched, isFetching };
}
