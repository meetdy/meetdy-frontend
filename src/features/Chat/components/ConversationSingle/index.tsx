import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Tag } from "lucide-react"

import classifyUtils from "@/utils/classifyUtils"
import ConversationAvatar from "../ConversationAvatar"
import ShortMessage from "../ShortMessage"

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

  const { createdAt } = lastMessage
  const { classifies, conversations } = useSelector(
    (state: any) => state.chat
  )

  const [classify, setClassify] = useState<any>(null)

  useEffect(() => {
    if (classifies) {
      const temp = classifyUtils.getClassifyOfObject(_id, classifies)
      if (temp) setClassify(temp)
    }
  }, [conversation, conversations, classifies])

  const handleClick = () => {
    if (onClick) onClick(_id)
  }

  return (
    <div
      onClick={handleClick}
      className="
        flex items-center gap-3 px-3 py-2 cursor-pointer 
        hover:bg-gray-100 rounded-lg transition
      "
    >
      <div className="flex-shrink-0">
        <ConversationAvatar
          totalMembers={totalMembers}
          avatar={avatar}
          type={conversation.type}
          name={name}
          avatarColor={avatarColor}
        />
      </div>

      {lastMessage && (
        <>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="font-medium text-gray-900 truncate">
              {name}
            </span>

            <div className="flex items-center gap-1 text-sm text-gray-600 min-w-0">
              {classify && (
                <span className="flex items-center">
                  <Tag
                    className="w-3 h-3 mr-1"
                    style={{ color: classify.color?.code }}
                  />
                </span>
              )}

              <ShortMessage
                message={lastMessage}
                type={conversation.type}
              />
            </div>
          </div>

          <div className="flex flex-col items-end ml-3">
            <span className="text-xs text-gray-500">{createdAt}</span>

            {numberUnread > 0 && (
              <span
                className="
                  bg-red-500 text-white text-xs px-2 py-0.5 
                  rounded-full mt-1
                "
              >
                {numberUnread}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  )
}
