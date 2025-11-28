import {
  AlignLeftOutlined,
  AppstoreAddOutlined,
  SearchOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons"
import { useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

import userApi from "@/api/userApi"
import ModalAddFriend from "@/components/ModalAddFriend"
import UserCard from "@/components/UserCard"
import ModalCreateGroup from "@/features/Chat/components/ModalCreateGroup"
import { createGroup } from "@/features/Chat/slice/chatSlice"

import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "sonner"

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

  return (
    <div className="w-full">
      <div className="p-3 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Tìm kiếm"
              className="pl-9"
              value={valueText}
              onChange={handleInputChange}
            />
          </div>

          <button
            className="p-2 hover:bg-gray-100 rounded-lg"
            onClick={handleOpenModalAddFriend}
          >
            <UserAddOutlined />
          </button>

          <button
            className="p-2 hover:bg-gray-100 rounded-lg"
            onClick={handleCreateGroup}
          >
            <UsergroupAddOutlined />
          </button>
        </div>

        {!isFriendPage && valueText.trim().length === 0 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2 text-gray-700">
                <AlignLeftOutlined />
                <span>Phân loại</span>
              </div>

              <button className="p-2 hover:bg-gray-100 rounded-md">
                <AppstoreAddOutlined />
              </button>
            </div>

            <div className="overflow-x-auto scrollbar-thin">
              <RadioGroup
                value={valueClassify}
                onValueChange={handleOnChangeClassify}
                className="flex items-center gap-4 py-1"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="0" id="all" />
                  <label htmlFor="all" className="text-sm">
                    Tất cả
                  </label>
                </div>

                {classifies?.map((ele: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-2">
                    <RadioGroupItem value={ele._id} id={ele._id} />
                    <label htmlFor={ele._id} className="text-sm break-keep">
                      {ele.name}
                    </label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          </div>
        )}
      </div>

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

      <UserCard
        user={userIsFind}
        isVisible={visibleUserCard}
        onCancel={() => setVisbleUserCard(false)}
      />
    </div>
  )
}
