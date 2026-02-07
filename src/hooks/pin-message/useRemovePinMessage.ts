import ServicePinMessage from "@/api/pinMessageApi";
import { createQueryKey } from "@/queries/core";
import { useMutation } from "@tanstack/react-query";

export function useUnpinMessage() {
    return useMutation<void, unknown, string>({
        mutationKey: createQueryKey("removePinMessage", {}),
        mutationFn: (messageId: string) => ServicePinMessage.removePinMessage(messageId),
    });
}
