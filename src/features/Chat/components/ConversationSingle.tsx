import React, { useMemo } from "react"
import { useSelector } from "react-redux"
import { Tag } from "lucide-react"

import { useGetListClassify } from "@/hooks/classify"
import ConversationAvatar from "./ConversationAvatar"
import ShortMessage from "./ShortMessage"
import { cn } from "@/lib/utils"
import { getClassifyOfObject } from "@/utils"

type Props = {
    conversation: any
    onClick?: (id: string) => void
}

const ConversationSingle = React.memo(({ conversation, onClick }: Props) => {
    const {
        _id,
        name,
        avatar,
        numberUnread = 0,
        lastMessage,
        totalMembers,
        avatarColor,
        type,
    } = conversation

    const { data: classifies } = useGetListClassify()
    const currentConversation = useSelector(
        (state: any) => state.chat.currentConversation
    )

    const isActive = currentConversation === _id
    const createdAt = lastMessage?.createdAt

    const classify = useMemo(() => {
        if (!classifies) return null
        return getClassifyOfObject(_id, classifies)
    }, [_id, classifies])

    return (
        <div
            onClick={() => onClick?.(_id)}
            className={cn(
                "group relative flex items-center gap-3 px-3 py-2 cursor-pointer",
                "rounded-md transition-colors",
                "hover:bg-muted/60",
                isActive && "bg-primary/10"
            )}
        >
            <div className="relative flex-shrink-0">
                <ConversationAvatar
                    totalMembers={totalMembers}
                    avatar={avatar}
                    type={type}
                    name={name}
                    avatarColor={avatarColor}
                />

                {numberUnread > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1
                        flex items-center justify-center rounded-full
                        bg-destructive text-white text-[10px] font-medium">
                        {numberUnread > 99 ? "99+" : numberUnread}
                    </span>
                )}
            </div>

            {lastMessage && (
                <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                    {/* Title row */}
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium truncate">
                            {name}
                        </span>
                        {createdAt && (
                            <span
                                className={cn(
                                    "text-[11px] whitespace-nowrap",
                                    numberUnread > 0
                                        ? "text-primary font-medium"
                                        : "text-muted-foreground"
                                )}
                            >
                                {createdAt}
                            </span>
                        )}
                    </div>

                    {/* Message row */}
                    <div className="flex items-center gap-1.5 min-w-0">
                        {classify && (
                            <Tag
                                className="w-3 h-3 flex-shrink-0"
                                style={{ color: classify.color?.code }}
                            />
                        )}

                        <div
                            className={cn(
                                "text-[13px] truncate",
                                numberUnread > 0
                                    ? "text-foreground"
                                    : "text-muted-foreground"
                            )}
                        >
                            <ShortMessage
                                message={lastMessage}
                                type={type}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
})

ConversationSingle.displayName = "ConversationSingle"

export default ConversationSingle
