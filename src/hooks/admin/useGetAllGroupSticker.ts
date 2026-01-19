import { useQuery } from "@tanstack/react-query";
import { createQueryKey } from "@/queries/core";
import ServiceAdmin from "@/api/adminApi";

export function useGetAllGroupSticker({ enabled = true }: { enabled?: boolean } = {}) {
    return useQuery({
        queryKey: createQueryKey("allGroupSticker", {}),
        queryFn: () => ServiceAdmin.getAllGroupSticker(),
        enabled,
    });
}
