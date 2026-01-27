import React, { useMemo } from "react"
import { useSelector } from "react-redux"
import { Tag } from "lucide-react"

import classifyUtils from "@/utils/classifyUtils"
import ConversationAvatar from "./ConversationAvatar"
import ShortMessage from "./ShortMessage"
import { cn } from "@/lib/utils"

type Props = {
    conversation: any
    onClick?: (id: string) => void
}

const ConversationSingle = React.memo(({ conversation, onClick }: Props) => {
    const {
        _id,
        name,
        avatar,
        numberUnread,
        lastMessage,
        totalMembers,
        avatarColor,
    } = conversation

    const { createdAt } = lastMessage || {}

    // OPTIMIZATION: Select only necessary fields to prevent re-renders on unrelated store changes
    const classifies = useSelector((state: any) => state.chat.classifies)
    const currentConversation = useSelector((state: any) => state.chat.currentConversation)

    const isActive = currentConversation === _id

    // OPTIMIZATION: Derive classify directly instead of using useEffect/useState
    const classify = useMemo(() => {
        if (classifies) {
            return classifyUtils.getClassifyOfObject(_id, classifies)
        }
        return null
    }, [_id, classifies])

    const handleClick = () => {
        if (onClick) onClick(_id)
    }

    return (
        <div
            onClick={handleClick}
            className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-xl transition-colors",
                "hover:bg-accent/60",
                isActive && "bg-accent text-foreground",
                !isActive && "text-foreground"
            )}
        >
            <span
                className={cn(
                    "absolute left-0 top-2.5 bottom-2.5 w-0.5 rounded-full transition-opacity",
                    isActive ? "bg-primary opacity-100" : "opacity-0 group-hover:opacity-40 bg-primary"
                )}
            />
            <div className="flex-shrink-0 relative">
                <ConversationAvatar
                    totalMembers={totalMembers}
                    avatar={avatar}
                    type={conversation.type}
                    name={name}
                    avatarColor={avatarColor}
                />
                {numberUnread > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[20px] h-[20px] bg-destructive text-destructive-foreground text-[10px] font-semibold px-1.5 rounded-full shadow-sm ring-2 ring-background">
                        {numberUnread > 99 ? '99+' : numberUnread}
                    </span>
                )}
            </div>

            {lastMessage && (
                <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                        <span className={cn(
                            "font-semibold text-[14px] truncate leading-tight",
                            numberUnread > 0 ? "text-foreground" : "text-foreground",
                            isActive && "text-foreground"
                        )}>
                            {name}
                        </span>
                        <span className={cn(
                            "text-[11px] flex-shrink-0",
                            numberUnread > 0 ? "text-primary font-semibold" : "text-muted-foreground"
                        )}>
                            {createdAt}
                        </span>
                    </div>

                    <div className="flex items-center gap-1.5 min-w-0">
                        {classify && (
                            <span className="flex items-center flex-shrink-0">
                                <Tag
                                    className="w-3 h-3"
                                    style={{ color: classify.color?.code }}
                                />
                            </span>
                        )}

                        <div className={cn(
                            "text-[13px] truncate leading-snug",
                            numberUnread > 0 ? "text-foreground/80 font-medium" : "text-muted-foreground"
                        )}>
                            <ShortMessage
                                message={lastMessage}
                                type={conversation.type}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
})

ConversationSingle.displayName = 'ConversationSingle'

export default ConversationSingle
