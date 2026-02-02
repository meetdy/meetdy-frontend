import { useRef, useState } from 'react'
import { useDispatch, useSelector, shallowEqual } from 'react-redux'
import { Search, UserPlus, Users, Plus } from 'lucide-react'

import userApi from '@/api/userApi'
import { createGroup } from '@/app/chatSlice'

import ModalClassify from '../components/modal/ModalClassify'
import ModalAddFriend from '@/components/modal-add-friend'
import ModalCreateGroup from '../components/modal/ModalCreateGroup'
import UserCard from '@/components/user-card'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

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
  const dispatch = useDispatch()
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  const { classifies } = useSelector(
    (state: any) => ({ classifies: state.chat.classifies }),
    shallowEqual
  )

  const [modal, setModal] = useState({
    createGroup: false,
    addFriend: false,
    classify: false,
  })

  const [loadingCreateGroup, setLoadingCreateGroup] = useState(false)
  const [foundUser, setFoundUser] = useState<any>({})
  const [showUserCard, setShowUserCard] = useState(false)

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    onSearchChange(value)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(onSubmitSearch, 400)
  }

  const handleFindUser = async (value: string) => {
    try {
      const user = await userApi.getUser(value)
      setFoundUser(user)
      setShowUserCard(true)
      setModal((m) => ({ ...m, addFriend: false }))
    } catch {
      toast.error('Không tìm thấy người dùng')
    }
  }

  const handleCreateGroup = async (payload: any) => {
    setLoadingCreateGroup(true)
    await dispatch(createGroup(payload) as any)
    setLoadingCreateGroup(false)
    setModal((m) => ({ ...m, createGroup: false }))
  }

  return (
    <div className="w-full space-y-3 border-b border-border">
      {/* Search + Actions */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={valueText}
            onChange={handleSearchChange}
            placeholder="Tìm kiếm..."
            className="
              h-9 pl-9 rounded-md
              bg-muted/50 border-border
              focus:bg-background
            "
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setModal((m) => ({ ...m, addFriend: true }))}
          className="h-9 w-9 rounded-md hover:bg-muted"
        >
          <UserPlus className="w-4 h-4 text-muted-foreground" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setModal((m) => ({ ...m, createGroup: true }))}
          className="h-9 w-9 rounded-md hover:bg-muted"
        >
          <Users className="w-4 h-4 text-muted-foreground" />
        </Button>
      </div>

      {/* Classify Filter */}
      {!isFriendPage && !valueText && (
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide pb-1">
          <FilterButton
            active={!valueClassify || valueClassify === '0'}
            onClick={() => onFilterClasify?.('0')}
          >
            Tất cả
          </FilterButton>

          {classifies?.map((item: any) => (
            <FilterButton
              key={item._id}
              active={valueClassify === item._id}
              onClick={() => onFilterClasify?.(item._id)}
            >
              {item.color?.code && (
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.color.code }}
                />
              )}
              {item.name}
            </FilterButton>
          ))}

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setModal((m) => ({ ...m, classify: true }))}
                className="h-8 w-8 rounded-md hover:bg-muted"
              >
                <Plus className="w-4 h-4 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Quản lý phân loại</TooltipContent>
          </Tooltip>
        </div>
      )}

      {/* Modals */}
      <ModalCreateGroup
        isVisible={modal.createGroup}
        onCancel={() => setModal((m) => ({ ...m, createGroup: false }))}
        onOk={handleCreateGroup}
        loading={loadingCreateGroup}
      />

      <ModalAddFriend
        isVisible={modal.addFriend}
        onCancel={() => setModal((m) => ({ ...m, addFriend: false }))}
        onSearch={handleFindUser}
        onEnter={handleFindUser}
      />

      <ModalClassify
        isVisible={modal.classify}
        onCancel={() => setModal((m) => ({ ...m, classify: false }))}
        onOpen={() => setModal((m) => ({ ...m, classify: true }))}
      />

      <UserCard
        user={foundUser}
        isVisible={showUserCard}
        onCancel={() => setShowUserCard(false)}
      />
    </div>
  )
}

function FilterButton({
  active,
  children,
  onClick,
}: {
  active?: boolean
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <Button
      onClick={onClick}
      size="sm"
      variant="ghost"
      className={cn(
        'h-8 px-3 rounded-md flex items-center gap-1.5 bg-muted cursor-pointer',
        active ? 'bg-primary/30 text-primary' : 'bg-muted'
      )}
    >
      {children}
    </Button>
  )
}
