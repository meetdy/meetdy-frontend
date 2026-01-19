import ServiceAdmin from "@/api/adminApi";
import { IUser } from "@/models/auth.model";
import { createQueryKey } from "@/queries/core";
import { useQuery } from "@tanstack/react-query";

type TFetchUsersByUsername = {
    username: string;
    page: number;
    size: number;
};

const fetchUsersByUsernameKey = ({ username, page, size }: TFetchUsersByUsername) =>
    createQueryKey("users", { username, page, size });

interface UseFetchUsersByUsernameProps {
    params: TFetchUsersByUsername;
    enabled?: boolean;
}
export function useGetUsersByUsername({
    params: { username, page, size },
    enabled = true,
}: UseFetchUsersByUsernameProps) {
    return useQuery<{
        data: IUser[];
        total: number;
    }>({
        queryKey: fetchUsersByUsernameKey({ username, page, size }),
        queryFn: () => ServiceAdmin.getUsersByUsername(username, page, size),
        enabled,
    });
}
