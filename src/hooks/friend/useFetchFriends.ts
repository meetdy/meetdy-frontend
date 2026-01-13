import { useQuery } from "@tanstack/react-query";
import { TFetchFriends, IFriend } from "@/models/friend.model";
import FriendService from "@/api/friendApi";
import { createQueryKey } from "@/queries/core";

const fetchFriendsQueryKey = (params: TFetchFriends) => createQueryKey("fetchFriends", params);

interface UseFetchFriendsProps {
    params: TFetchFriends;
    enabled?: boolean;
}
export function useFetchFriends({ params, enabled = true }: UseFetchFriendsProps) {
    const { data, isFetched, isFetching } = useQuery<IFriend[]>({
        queryKey: fetchFriendsQueryKey(params),
        queryFn: () => FriendService.getFriends(params),
        enabled,
    });

    return { friends: (data || []) as IFriend[], isFetched, isFetching };
}
