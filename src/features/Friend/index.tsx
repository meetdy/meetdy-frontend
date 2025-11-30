import { CaretDownOutlined, FilterOutlined } from '@ant-design/icons';
import { useEffect, useRef, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useDispatch, useSelector } from 'react-redux';

import { Icon } from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

import conversationApi from '@/api/conversationApi';
import FilterContainer from '@/components/FilterContainer';
import SearchContainer from '@/features/Chat/containers/SearchContainer';

import HeaderFriend from './components/HeaderFiend';
import ContactItem from './components/ContactItem';
import ListFriend from './components/ListFriend';
import ListGroup from './components/ListGroup';
import ListMyFriendRequest from './components/ListMyRequestFriend';
import ListRequestFriend from './components/ListRequestFriend';
import SuggestList from './components/SuggestList';

import {
  fetchFriends,
  fetchListGroup,
  fetchListMyRequestFriend,
  fetchListRequestFriend,
  fetchPhoneBook,
  fetchSuggestFriend,
} from './friendSlice';

import { getValueFromKey } from '@/constants/filterFriend';
import { sortGroup } from '@/utils/groupUtils';

function Spinner() {
  return (
    <div className="flex items-center justify-center py-10">
      <div className="h-6 w-6 animate-spin rounded-full border-4 border-gray-300 border-t-gray-700" />
    </div>
  );
}

export default function Friend() {
  const dispatch = useDispatch();
  const refOriginalGroups = useRef(null);

  const {
    requestFriends,
    myRequestFriend,
    groups,
    friends,
    phoneBook,
    isLoading,
    suggestFriends,
  } = useSelector((state: any) => state.friend);

  const { user } = useSelector((state: any) => state.global);

  const [activeTab, setActiveTab] = useState(0); // 0: friend, 1: group, 2: contact
  const [groupFilterType, setGroupFilterType] = useState('1');
  const [sortFilterType, setSortFilterType] = useState('1');

  const [filteredGroups, setFilteredGroups] = useState([]);
  const [sortKey, setSortKey] = useState(1);

  const [searchText, setSearchText] = useState('');
  const [isFilterVisible, setFilterVisible] = useState(false);

  const [singleRoomResults, setSingleRoomResults] = useState([]);
  const [groupRoomResults, setGroupRoomResults] = useState([]);

  useEffect(() => {
    if (groups.length > 0) {
      const sorted = sortGroup(groups, 1);
      setFilteredGroups(sorted);
      refOriginalGroups.current = sorted;
    }
  }, [groups]);

  useEffect(() => {
    if (activeTab === 2) dispatch(fetchPhoneBook());
  }, [activeTab]);

  useEffect(() => {
    dispatch(fetchListRequestFriend());
    dispatch(fetchListMyRequestFriend());
    dispatch(fetchFriends({ name: '' }));
    dispatch(fetchListGroup({ name: '', type: 2 }));
    dispatch(fetchPhoneBook());
    dispatch(fetchSuggestFriend());
  }, []);

  const handleLeftFilter = (key: string) => {
    setGroupFilterType(key);

    if (key === '2') {
      setFilteredGroups(
        refOriginalGroups.current.filter((g) => g.leaderId === user._id),
      );
    } else {
      setFilteredGroups(sortGroup(refOriginalGroups.current, sortKey));
    }
  };

  const handleRightFilter = (key: string) => {
    setSortFilterType(key);
    const newSort = key === '1' ? 1 : 0;
    setSortKey(newSort);
    setFilteredGroups(sortGroup(filteredGroups, newSort));
  };

  const handleSearchTextChange = (value: string) => {
    setSearchText(value);
    setFilterVisible(value.trim().length > 0);
  };

  const handleSearchSubmit = async () => {
    try {
      const single = await conversationApi.getListConversations({
        name: searchText,
        type: 1,
      });
      const multiple = await conversationApi.getListConversations({
        name: searchText,
        type: 2,
      });
      setSingleRoomResults(single);
      setGroupRoomResults(multiple);
    } catch (_) {}
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-12 w-full">
          <div className="col-span-12 sm:col-span-6 md:col-span-7 lg:col-span-6 xl:col-span-5">
            <div className="border-r h-full p-3">
              {/* Search */}
              <SearchContainer
                onSearchChange={handleSearchTextChange}
                valueText={searchText}
                onSubmitSearch={handleSearchSubmit}
                isFriendPage
              />

              {isFilterVisible ? (
                <FilterContainer
                  dataSingle={singleRoomResults}
                  dataMulti={groupRoomResults}
                  valueText={searchText}
                />
              ) : (
                <div className="mt-4 space-y-4">
                  <div className="h-px bg-gray-200" />

                  {/* Menu Items */}
                  <div className="space-y-3">
                    <SidebarItem
                      icon="mdi:user"
                      label="Danh sách kết bạn"
                      onClick={() => {
                        setActiveTab(0);
                      }}
                    />

                    <SidebarItem
                      icon="mdi:account-group"
                      label="Danh sách nhóm"
                      onClick={() => {
                        setActiveTab(1);
                      }}
                    />

                    <SidebarItem
                      icon="mdi:contacts"
                      label="Danh bạ"
                      onClick={() => {
                        setActiveTab(2);
                      }}
                    />

                    <div className="h-px bg-gray-200 my-4" />

                    {/* Friend List */}
                    <div>
                      <div className="text-sm font-medium mb-2">
                        Bạn bè ({friends.length})
                      </div>
                      <ListFriend data={friends} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ---------------- Body ---------------- */}
          <div
            className={
              'hidden sm:block sm:col-span-6 md:col-span-5 lg:col-span-6 xl:col-span-7'
            }
          >
            <div className="h-full flex flex-col">
              <div className="border-b p-3">
                <HeaderFriend subtab={activeTab} />
              </div>

              <div className="flex-1 overflow-hidden">
                <Scrollbars
                  autoHide
                  autoHideTimeout={800}
                  autoHideDuration={200}
                >
                  {/* --- Group Tab --- */}
                  {activeTab === 1 && (
                    <>
                      <GroupFilters
                        groupCount={filteredGroups.length}
                        groupFilterType={groupFilterType}
                        sortFilterType={sortFilterType}
                        onLeftChange={handleLeftFilter}
                        onRightChange={handleRightFilter}
                      />

                      <div className="p-3">
                        <ListGroup data={filteredGroups} />
                      </div>
                    </>
                  )}

                  {/* --- Friend Tab --- */}
                  {activeTab === 0 && (
                    <div className="p-3 space-y-6">
                      <Section
                        title={`Lời mời kết bạn (${requestFriends.length})`}
                      >
                        <ListRequestFriend data={requestFriends} />
                      </Section>

                      <Section
                        title={`Đã gửi yêu cầu (${myRequestFriend.length})`}
                      >
                        <ListMyFriendRequest data={myRequestFriend} />
                      </Section>

                      <Section
                        title={`Gợi ý kết bạn (${suggestFriends.length})`}
                      >
                        <SuggestList data={suggestFriends} />
                      </Section>
                    </div>
                  )}

                  {/* --- Contact Tab --- */}
                  {activeTab === 2 && (
                    <div className="p-3">
                      {phoneBook &&
                        phoneBook.length > 0 &&
                        phoneBook.map((ele, index) => {
                          if (ele.isExists) {
                            return <ContactItem key={index} data={ele} />;
                          }
                        })}
                    </div>
                  )}
                </Scrollbars>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarItem({ icon, label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition"
    >
      <Icon icon={icon} className="text-xl" />
      <span>{label}</span>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <div className="text-sm font-medium mb-2">{title}</div>
      {children}
    </div>
  );
}

function GroupFilters({
  groupCount,
  groupFilterType,
  sortFilterType,
  onLeftChange,
  onRightChange,
}) {
  return (
    <div className="flex justify-between p-3">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <CaretDownOutlined />
            {getValueFromKey('LEFT', groupFilterType)} ({groupCount})
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => onLeftChange('1')}>
            Theo tên nhóm A → Z
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onLeftChange('2')}>
            Nhóm tôi quản lý
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2">
            <FilterOutlined />
            {getValueFromKey('RIGHT', sortFilterType)}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
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
