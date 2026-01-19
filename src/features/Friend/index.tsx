import { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { Icon } from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CardHeader, CardTitle } from '@/components/ui/card';

import conversationApi from '@/api/conversationApi';
import FilterContainer from '@/components/filter-container';
import SearchContainer from '@/features/Chat/containers/SearchContainer';

import HeaderFriend from './components/HeaderFiend';
import ContactItem from './components/ContactItem';
import ListFriend from './components/ListFriend';
import ListGroup from './components/ListGroup';
import ListMyFriendRequest from './components/ListMyRequestFriend';
import ListRequestFriend from './components/ListRequestFriend';
import SuggestList from './components/SuggestList';

import { useGetFriends } from '@/hooks/friend/useGetFriends';
import { useGetListRequestFriend } from '@/hooks/friend/useGetListRequestFriend';
import { useGetMyRequestFriend } from '@/hooks/friend/useGetMyRequestFriend';
import { useGetListConversations } from '@/hooks/conversation/useGetListConversations';
import { useGetContacts } from '@/hooks/contacts/useGetContacts';
import { useGetSuggestFriend } from '@/hooks/friend/useGetSuggestFriend';

import { getValueFromKey } from '@/constants/filterFriend';
import { sortGroup } from '@/utils/groupUtils';
import { Filter, Menu, PhoneOutgoing, UserCheck, Users } from 'lucide-react';

import { type LucideIcon } from 'lucide-react';

function Spinner() {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="h-6 w-6 animate-spin rounded-full border-4 border-muted border-t-primary" />
    </div>
  );
}

type TabKey = 0 | 1 | 2;

type SidebarItemProps = {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick?: () => void;
  count?: number;
};

type SectionProps = {
  title: string;
  children: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
};

function SidebarItem({
  icon,
  label,
  active,
  onClick,
  count,
}: SidebarItemProps) {
  return (
    <Button
      type="button"
      variant={active ? 'secondary' : 'ghost'}
      onClick={onClick}
      className="w-full justify-start gap-3 h-10 px-3"
    >
      <Icon icon={icon} className="text-lg" />
      <span className="text-sm font-medium truncate">{label}</span>
      {typeof count === 'number' && (
        <span className="ml-auto text-xs text-muted-foreground tabular-nums">
          {count}
        </span>
      )}
    </Button>
  );
}

function Section({ title, children, right, className }: SectionProps) {
  return (
    <div className={className}>
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold">{title}</CardTitle>
          {right}
        </div>
      </CardHeader>
      <div className="px-4 pb-4 pt-0">{children}</div>
    </div>
  );
}

type GroupFiltersProps = {
  groupCount: number;
  groupFilterType: string;
  sortFilterType: string;
  onLeftChange: (v: string) => void;
  onRightChange: (v: string) => void;
};

function GroupFilters(props: GroupFiltersProps) {
  const {
    groupCount,
    groupFilterType,
    sortFilterType,
    onLeftChange,
    onRightChange,
  } = props;

  return (
    <div className="flex justify-between items-center gap-2 px-4 py-3 border-b bg-white">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="gap-2">
            <Icon icon={Menu} />
            <span className="truncate">
              {getValueFromKey('LEFT', groupFilterType)} ({groupCount})
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => onLeftChange('1')}>
            Tất cả nhóm
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onLeftChange('2')}>
            Nhóm tôi quản lý
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="gap-2">
            <Icon icon={Filter} className="text-base" />
            <span className="truncate">
              {getValueFromKey('RIGHT', sortFilterType)}
            </span>
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onRightChange('1')}>
            A → Z
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onRightChange('2')}>
            Z → A
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default function Friend() {
  const dispatch = useDispatch();
  const refOriginalGroups = useRef<any[]>([]);

  const { requestFriends = [], isFetching: isFetchingRequest } = useGetListRequestFriend();
  const { myRequestFriends: myRequestFriend = [], isFetching: isFetchingMyRequest } = useGetMyRequestFriend({});
  const { friends = [], isFetching: isFetchingFriends } = useGetFriends({ params: { name: '' } });
  const { conversations: groups = [], isFetching: isFetchingGroups } = useGetListConversations({
    params: { name: '', type: 2 }
  });
  const { contacts: phoneBook = [], isFetching: isFetchingContacts } = useGetContacts();
  const { suggestFriends = [], isFetching: isFetchingSuggest } = useGetSuggestFriend({ params: { page: 0, size: 12 } });

  const isLoading = isFetchingRequest || isFetchingMyRequest || isFetchingFriends || isFetchingGroups || isFetchingContacts || isFetchingSuggest;

  const [activeTab, setActiveTab] = useState<TabKey>(0);
  const [groupFilterType, setGroupFilterType] = useState('1');
  const [sortFilterType, setSortFilterType] = useState('1');
  const [filteredGroups, setFilteredGroups] = useState<any[]>([]);

  const [searchValue, setSearchValue] = useState('');
  const [showFilterResult, setShowFilterResult] = useState(false);

  const [singleSearchResult, setSingleSearchResult] = useState<any[]>([]);
  const [groupSearchResult, setGroupSearchResult] = useState<any[]>([]);

  useEffect(() => {
    if (groups.length) {
      const sorted = sortGroup(groups, 1);
      refOriginalGroups.current = sorted;
      setFilteredGroups(sorted);
    }
  }, [groups]);

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    setShowFilterResult(value.trim().length > 0);
  };

  const handleSearchSubmit = async () => {
    try {
      const single = await conversationApi.getListConversations({
        name: searchValue,
        type: 1,
      });
      const multiple = await conversationApi.getListConversations({
        name: searchValue,
        type: 2,
      });

      setSingleSearchResult(single);
      setGroupSearchResult(multiple);
    } catch { }
  };

  const counts = useMemo(
    () => ({
      friends: friends?.length ?? 0,
      request: requestFriends?.length ?? 0,
      sent: myRequestFriend?.length ?? 0,
      suggest: suggestFriends?.length ?? 0,
    }),
    [friends, requestFriends, myRequestFriend, suggestFriends],
  );

  if (isLoading) return <Spinner />;

  return (
    <div className="min-h-screen h-screen flex bg-white">
      <aside className="w-full sm:w-72 lg:w-80 border-r border-slate-200/80 bg-white">
        <div className="h-full flex flex-col">
          <div className="px-4 pt-4 pb-3">
            <SearchContainer
              onSearchChange={handleSearchChange}
              valueText={searchValue}
              onSubmitSearch={handleSearchSubmit}
              isFriendPage
            />
          </div>

          <div className="flex-1 overflow-auto">
            {showFilterResult ? (
              <div className="px-2 pb-4">
                <FilterContainer
                  dataSingle={singleSearchResult}
                  dataMulti={groupSearchResult}
                />
              </div>
            ) : (
              <div className="px-2 pb-4 space-y-3">
                <SidebarItem
                  active={activeTab === 0}
                  icon={UserCheck}
                  label="Danh sách kết bạn"
                  onClick={() => setActiveTab(0)}
                  count={counts.request + counts.sent + counts.suggest}
                />
                <SidebarItem
                  active={activeTab === 1}
                  icon={Users}
                  label="Danh sách nhóm"
                  onClick={() => setActiveTab(1)}
                  count={filteredGroups.length}
                />
                <SidebarItem
                  active={activeTab === 2}
                  icon={PhoneOutgoing}
                  label="Danh bạ"
                  onClick={() => setActiveTab(2)}
                />

                <Separator />

                <Section title={`Bạn bè (${counts.friends})`}>
                  <ListFriend data={friends} />
                </Section>
              </div>
            )}
          </div>
        </div>
      </aside>

      <main className="flex-1 hidden sm:flex flex-col bg-white">
        <header className="border-b border-slate-200/80 bg-white shadow-sm">
          <HeaderFriend subtab={activeTab} />
        </header>

        <section className="flex-1 overflow-hidden bg-slate-50/40">
          {activeTab === 0 && (
            <div className="p-4 space-y-4">
              <Section title={`Lời mời (${counts.request})`}>
                <ListRequestFriend data={requestFriends} />
              </Section>

              <Section title={`Đã gửi (${counts.sent})`}>
                <ListMyFriendRequest data={myRequestFriend} />
              </Section>

              <Section title={`Gợi ý (${counts.suggest})`}>
                <SuggestList data={suggestFriends} />
              </Section>
            </div>
          )}

          {activeTab === 1 && (
            <>
              <GroupFilters
                groupCount={filteredGroups.length}
                groupFilterType={groupFilterType}
                sortFilterType={sortFilterType}
                onLeftChange={setGroupFilterType}
                onRightChange={setSortFilterType}
              />
              <div className="p-4">
                <Section title="Nhóm">
                  <ListGroup data={filteredGroups} />
                </Section>
              </div>
            </>
          )}

          {activeTab === 2 && (
            <div className="p-4">
              <Section title="Danh bạ">
                <div className="space-y-3">
                  {phoneBook?.map((ele: any) =>
                    ele.isExists ? (
                      <ContactItem
                        key={ele._id ?? ele.id ?? ele.username}
                        data={ele}
                      />
                    ) : null,
                  )}
                </div>
              </Section>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
