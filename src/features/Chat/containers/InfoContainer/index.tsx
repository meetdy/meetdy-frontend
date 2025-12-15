import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
  onOpenInfoBlock?: () => void;
};

export default function InfoContainer({
  socket = {},
  onViewChannel = undefined,
}: Props) {
  const dispatch = useDispatch<AppDispatch>();

  const [navState, setNavState] = useState({ tabpane: 0, view: 0 }); // view: 0 => info, 1 => members, 2 => media
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
    () => conversations.find((ele) => ele._id === currentConversation) ?? null,
    [conversations, currentConversation],
  );

  const handleChoseUser = useCallback(async (value: { username: string }) => {
    try {
      const user = await userApi.getUser(value.username);
      setSelectedUser(user);
      setUserCardVisible(true);
    } catch (err) {
      setSelectedUser(null);
      setUserCardVisible(false);
    }
  }, []);

  const handleViewMemberClick = useCallback((view: number) => {
    setNavState({ view, tabpane: 0 });
  }, []);

  const handleViewMediaClick = useCallback((view: number, tabpane = 0) => {
    setNavState({ view, tabpane });
  }, []);

  const handleOnBack = useCallback((view = 0) => {
    setNavState({ view, tabpane: 0 });
  }, []);

  useEffect(() => {
    if (currentConversation) {
      dispatch(fetchAllMedia({ conversationId: currentConversation }));
    }
  }, [currentConversation, dispatch]);

  return (
    <div id="main-info">
      {navState.view === 0 && (
        <>
          <div className="info_title-wrapper">
            <InfoTitle
              onBack={() => handleOnBack(0)}
              text={
                currentConver?.type ? 'Thông tin nhóm' : 'Thông tin hội thoại'
              }
            />
          </div>

          <Scrollbars
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            style={{ width: '100%', height: 'calc(100vh - 68px)' }}
          >
            <div className="body-info">
              <div className="info_name-and-thumbnail-wrapper">
                <InfoNameAndThumbnail conversation={currentConver} />
              </div>

              {type && (
                <>
                  <div className="info_member-wrapper">
                    <InfoMember
                      viewMemberClick={handleViewMemberClick}
                      quantity={memberInConversation?.length ?? 0}
                    />
                  </div>

                  <div className="info_member-wrapper">
                    <Channel onViewChannel={onViewChannel} data={channels} />
                  </div>
                </>
              )}

              <div className="info_archive-media-wrapper">
                <ArchiveMedia
                  viewMediaClick={handleViewMediaClick}
                  name="Ảnh"
                  items={media.images}
                />
              </div>

              <div className="info_archive-media-wrapper">
                <ArchiveMedia
                  viewMediaClick={handleViewMediaClick}
                  name="Video"
                  items={media.videos}
                />
              </div>

              <div className="info_archive-file-wrapper">
                <ArchiveFile
                  viewMediaClick={handleViewMediaClick}
                  items={media.files}
                />
              </div>

              {currentConver?.type && (
                <div className="info_another-setting-wrapper">
                  <AnotherSetting socket={socket} />
                </div>
              )}
            </div>
          </Scrollbars>
        </>
      )}

      {navState.view === 2 && (
        <InfoMediaSearch
          onBack={() => handleOnBack(0)}
          tabpane={navState.tabpane}
        />
      )}

      {navState.view === 1 && (
        <InfoFriendSearch
          onBack={() => handleOnBack(0)}
          members={memberInConversation}
          onChoseUser={handleChoseUser}
        />
      )}

      {selectedUser && (
        <UserCard
          isVisible={isUserCardVisible}
          onCancel={() => setUserCardVisible(false)}
          user={selectedUser}
        />
      )}
    </div>
  );
}
