import { useCallback, useEffect, useMemo, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useDispatch, useSelector } from 'react-redux';

import userApi from '@/api/userApi';

import Channel from '@/features/Chat/components/Channel';
import AnotherSetting from '@/features/Chat/components/AnotherSetting';
import ArchiveFile from '@/features/Chat/components/ArchiveFile';
import ArchiveMedia from '@/features/Chat/components/ArchiveMedia';
import InfoFriendSearch from '@/features/Chat/components/InfoFriendSearch';
import InfoMediaSearch from '@/features/Chat/components/InfoMediaSearch';
import InfoMember from '@/features/Chat/components/InfoMember';
import InfoNameAndThumbnail from '@/features/Chat/components/InfoNameAndThumbnail';
import InfoTitle from '@/features/Chat/components/InfoTitle';
import { fetchAllMedia } from '@/features/Chat/slice/mediaSlice';
import UserCard from '@/components/UserCard';

import type { RootState, AppDispatch } from '@/store';

type Props = {
  socket?: any;
  onViewChannel?: (id?: string) => void;
};

export default function InfoContainer({ socket = {}, onViewChannel }: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [navState, setNavState] = useState({ view: 0, tabpane: 0 });
  const [isUserCardVisible, setUserCardVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const {
    memberInConversation,
    type,
    currentConversation,
    conversations,
    channels,
  } = useSelector((state: RootState) => state.chat);

  const { media } = useSelector((state: RootState) => state.media);

  const currentConver = useMemo(
    () => conversations.find((c) => c._id === currentConversation) ?? null,
    [conversations, currentConversation],
  );

  const handleChoseUser = useCallback(
    async ({ username }: { username: string }) => {
      try {
        const user = await userApi.getUser(username);
        setSelectedUser(user);
        setUserCardVisible(true);
      } catch {
        setSelectedUser(null);
        setUserCardVisible(false);
      }
    },
    [],
  );

  const goInfo = () => setNavState({ view: 0, tabpane: 0 });
  const goMembers = (view: number) => setNavState({ view, tabpane: 0 });
  const goMedia = (view: number, tabpane = 0) => setNavState({ view, tabpane });

  useEffect(() => {
    if (currentConversation) {
      dispatch(fetchAllMedia({ conversationId: currentConversation }));
    }
  }, [currentConversation, dispatch]);

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* ===== INFO VIEW ===== */}
      {navState.view === 0 && (
        <>
          {/* Header */}
          <div className="border-b border-zinc-200 px-5 py-3">
            <InfoTitle
              onBack={goInfo}
              text={
                currentConver?.type ? 'Thông tin nhóm' : 'Thông tin hội thoại'
              }
            />
          </div>

          {/* Body */}
          <Scrollbars
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            style={{ height: 'calc(100vh - 56px)' }}
          >
            <div className="space-y-6 px-5 py-4">
              {/* Name + Avatar */}
              <div>
                <InfoNameAndThumbnail conversation={currentConver} />
              </div>

              {/* Members & Channels */}
              {type && (
                <>
                  <div className="border-t border-zinc-200 pt-4">
                    <InfoMember
                      viewMemberClick={goMembers}
                      quantity={memberInConversation?.length ?? 0}
                    />
                  </div>

                  <div className="border-t border-zinc-200 pt-4">
                    <Channel onViewChannel={onViewChannel} data={channels} />
                  </div>
                </>
              )}

              {/* Media */}
              <div className="border-t border-zinc-200 pt-4 space-y-4">
                <ArchiveMedia
                  name="Ảnh"
                  items={media.images}
                  viewMediaClick={goMedia}
                />

                <ArchiveMedia
                  name="Video"
                  items={media.videos}
                  viewMediaClick={goMedia}
                />

                <ArchiveFile items={media.files} viewMediaClick={goMedia} />
              </div>

              {/* Settings */}
              {currentConver?.type && (
                <div className="border-t border-zinc-200 pt-4">
                  <AnotherSetting socket={socket} />
                </div>
              )}
            </div>
          </Scrollbars>
        </>
      )}

      {/* ===== MEDIA SEARCH ===== */}
      {navState.view === 2 && (
        <InfoMediaSearch onBack={goInfo} tabpane={navState.tabpane} />
      )}

      {/* ===== MEMBER SEARCH ===== */}
      {navState.view === 1 && (
        <InfoFriendSearch
          onBack={goInfo}
          members={memberInConversation}
          onChoseUser={handleChoseUser}
        />
      )}

      {/* ===== USER CARD ===== */}
      {selectedUser && (
        <UserCard
          isVisible={isUserCardVisible}
          user={selectedUser}
          onCancel={() => setUserCardVisible(false)}
        />
      )}
    </div>
  );
}
