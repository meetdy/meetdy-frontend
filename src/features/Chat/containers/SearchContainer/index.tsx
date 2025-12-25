import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Search, UserPlus, Users, SlidersHorizontal, Plus, Filter } from "lucide-react"

import userApi from "@/api/userApi"
import ModalClassify from "../../components/ModalClassify"
import ModalAddFriend from "@/components/ModalAddFriend"
import UserCard from "@/components/UserCard"
import ModalCreateGroup from "@/features/Chat/components/ModalCreateGroup"
import { createGroup } from "@/features/Chat/slice/chatSlice"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Props = {
  valueText: string
  onSearchChange: (text: string) => void
  onSubmitSearch: () => void
  isFriendPage?: boolean
  onFilterClasify?: (value: string) => void
  valueClassify?: string
}

export default function SearchContainer({
  valueText,
  onSearchChange,
  onSubmitSearch,
  isFriendPage,
  onFilterClasify,
  valueClassify,
}: Props) {
  const refDebounce = useRef<any>(null)
  const dispatch = useDispatch()
  const { classifies } = useSelector((state: any) => state.chat)

  const [isModalCreateGroup, setIsModalCreateGroup] = useState(false)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [isShowModalAddFriend, setShowModalAddFriend] = useState(false)
  const [userIsFind, setUserIsFind] = useState<any>({})
  const [visibleUserCard, setVisbleUserCard] = useState(false)
  const [isModalClassify, setIsModalClassify] = useState(false)

  const handleOnChangeClassify = (value: string) => {
    onFilterClasify?.(value)
  }

  const handleCreateGroup = () => setIsModalCreateGroup(true)
  const handleCancelCreateGroup = () => setIsModalCreateGroup(false)
  const handleOkCreateGroup = (value: any) => {
    setConfirmLoading(true)
    dispatch(createGroup(value))
    setConfirmLoading(false)
    setIsModalCreateGroup(false)
  }

  const handleOpenModalAddFriend = () => setShowModalAddFriend(true)
  const handleCancelAddFriend = () => setShowModalAddFriend(false)

  const handFindUser = async (value: string) => {
    try {
      const user = await userApi.fetchUser(value)
      setUserIsFind(user)
      setVisbleUserCard(true)
      setShowModalAddFriend(false)
    } catch (error) {
      toast.error("Không tìm thấy người dùng")
    }
  }

  const handleInputChange = (e: any) => {
    const value = e.target.value
    onSearchChange?.(value)

    if (refDebounce.current) clearTimeout(refDebounce.current)

    refDebounce.current = setTimeout(() => {
      onSubmitSearch?.()
    }, 400)
  }

  const handleOpenModalClassify = () => setIsModalClassify(true)
  const handleCancelModalClassify = () => setIsModalClassify(false)

  const activeClassify = classifies?.find((ele: any) => ele._id === valueClassify)

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Tìm kiếm cuộc trò chuyện..."
            className="pl-9 h-10 rounded-xl border-slate-200 bg-slate-50/50 focus:bg-white transition-colors"
            value={valueText}
            onChange={handleInputChange}
          />
        </div>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleOpenModalAddFriend}
              className="h-10 w-10 rounded-xl hover:bg-slate-100"
            >
              <UserPlus className="w-5 h-5 text-slate-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Thêm bạn</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCreateGroup}
              className="h-10 w-10 rounded-xl hover:bg-slate-100"
            >
              <Users className="w-5 h-5 text-slate-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">Tạo nhóm</TooltipContent>
        </Tooltip>
      </div>

      {!isFriendPage && valueText.trim().length === 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <button
            onClick={() => handleOnChangeClassify("0")}
            className={cn(
              "flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
              valueClassify === "0" || !valueClassify
                ? "bg-primary text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            )}
          >
            Tất cả
          </button>

          {classifies?.map((ele: any) => (
            <button
              key={ele._id}
              onClick={() => handleOnChangeClassify(ele._id)}
              className={cn(
                "flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5",
                valueClassify === ele._id
                  ? "bg-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {ele.color?.code && (
                <span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: ele.color.code }}
                />
              )}
              {ele.name}
            </button>
          ))}

          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleOpenModalClassify}
                className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <Plus className="w-4 h-4 text-slate-500" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">Quản lý phân loại</TooltipContent>
          </Tooltip>
        </div>
      )}

      <ModalCreateGroup
        isVisible={isModalCreateGroup}
        onCancel={handleCancelCreateGroup}
        onOk={handleOkCreateGroup}
        loading={confirmLoading}
      />

      <ModalAddFriend
        isVisible={isShowModalAddFriend}
        onCancel={handleCancelAddFriend}
        onSearch={handFindUser}
        onEnter={handFindUser}
      />

      <ModalClassify
        isVisible={isModalClassify}
        onCancel={handleCancelModalClassify}
        onOpen={handleOpenModalClassify}
      />

      <UserCard
        user={userIsFind}
        isVisible={visibleUserCard}
        onCancel={() => setVisbleUserCard(false)}
      />
    </div>
  )
}
