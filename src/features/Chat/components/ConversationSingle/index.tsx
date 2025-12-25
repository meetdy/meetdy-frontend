import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Tag } from "lucide-react"

import classifyUtils from "@/utils/classifyUtils"
import ConversationAvatar from "../ConversationAvatar"
import ShortMessage from "../ShortMessage"
import { cn } from "@/lib/utils"

type Props = {
  conversation: any
  onClick?: (id: string) => void
}

export default function ConversationSingle({ conversation, onClick }: Props) {
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
  const { classifies, conversations, currentConversation } = useSelector(
    (state: any) => state.chat
  )

  const [classify, setClassify] = useState<any>(null)
  const isActive = currentConversation === _id

  useEffect(() => {
    if (classifies) {
      const temp = classifyUtils.getClassifyOfObject(_id, classifies)
      if (temp) setClassify(temp)
    }
  }, [conversation, conversations, classifies, _id])

  const handleClick = () => {
    if (onClick) onClick(_id)
  }

  return (
    <div
      onClick={handleClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-xl transition-all duration-150",
        "hover:bg-slate-100/80",
        isActive && "bg-primary/10 hover:bg-primary/15 border border-primary/20",
        !isActive && "border border-transparent"
      )}
    >
      <div className="flex-shrink-0 relative">
        <ConversationAvatar
          totalMembers={totalMembers}
          avatar={avatar}
          type={conversation.type}
          name={name}
          avatarColor={avatarColor}
        />
        {numberUnread > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-semibold px-1 rounded-full shadow-sm">
            {numberUnread > 99 ? '99+' : numberUnread}
          </span>
        )}
      </div>

      {lastMessage && (
        <div className="flex-1 min-w-0 flex flex-col gap-0.5">
          <div className="flex items-center justify-between gap-2">
            <span className={cn(
              "font-medium text-sm truncate",
              numberUnread > 0 ? "text-slate-900" : "text-slate-700",
              isActive && "text-primary"
            )}>
              {name}
            </span>
            <span className={cn(
              "text-xs flex-shrink-0",
              numberUnread > 0 ? "text-primary font-medium" : "text-slate-400"
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
              "text-sm truncate",
              numberUnread > 0 ? "text-slate-700 font-medium" : "text-slate-500"
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
}
