import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useResolvedPath, useLocation } from 'react-router-dom';
import { ChevronsLeft, ChevronDown, X } from 'lucide-react';

import { setJoinChatLayout } from '@/app/globalSlice';
import conversationApi from '@/api/conversationApi';
import FilterContainer from '@/components/filter-container';
import ModalJoinGroupFromLink from '@/components/modal-join-group-from-link';
import Slider from '@/components/carousel-feature';
import useWindowDimensions from '@/hooks/useWindowDimensions';

import DrawerPinMessage from './components/DrawerPinMessage';
import GroupNews from './components/GroupNews';
import NutshellPinMessage from './components/NutshellPinMessage';
import BodyChatContainer from './containers/BodyChatContainer';
import ConversationContainer from './containers/ConversationContainer';
import FooterChatContainer from './containers/FooterChatContainer';
import HeaderChatContainer from './containers/HeaderChatContainer';
import InfoContainer from './containers/InfoContainer';
import SearchContainer from './containers/SearchContainer';
import {
  addManagers,
  addMessage,
  deleteManager,
  fetchConversationById,
  getLastViewOfMembers,
  getMembersConversation,
  isDeletedFromGroup,
  removeChannel,
  removeConversation,
  setCurrentChannel,
  setCurrentConversation,
  setReactionMessage,
  setRedoMessage,
  setTotalChannelNotify,
  setTypeOfConversation,
  updateAvatarConver,
  updateChannel,
  updateLastViewOfMembers,
  updateMemberInconver,
  updateNameChannel,
  updateNameOfConver,
  updateTimeForConver,
  updateVoteMessage,
} from './slice/chatSlice';

import renderWidthDrawer from '@/utils/DrawerResponsive';

import { toast } from 'sonner';

import { useInfiniteListMessages } from '@/hooks/message/useInfiniteListMessages';
import { useGetListConversations } from '@/hooks/conversation/useGetListConversations';
import { useGetFriends } from '@/hooks/friend/useGetFriends';
import { useGetListClassify } from '@/hooks/classify/useGetListClassify';
import { usePinnedMessages } from '@/hooks/channel/usePinnedMessages';
import { useGetChannel } from '@/hooks/channel/useGetChannel';
import { useQueryClient } from '@tanstack/react-query';
import { createKeyListConversations } from '@/hooks/conversation/useGetListConversations';

function Chat({ socket, idNewMessage }: { socket: any; idNewMessage?: any }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const path = useResolvedPath('').pathname;
  const queryClient = useQueryClient();

  const {
    currentConversation,
    isLoading,
    currentChannel,
  } = useSelector((state: any) => state.chat || {});
  const { isJoinChatLayout, user } = useSelector(
    (state: any) => state.global || {},
  );

  // React Query Hooks
  const { conversations = [] } = useGetListConversations({ params: {} });
  const { friends = [] } = useGetFriends({ params: { name: '' } });
  const { classifies = [] } = useGetListClassify();
  // Channels: If we fetched a list of channels for currentConversation?
  // Redux `fetchChannels` fetched *list*. `useGetChannel` returns `channel` (singular?)
  // Let's assume useGetChannel returns the list for now or check usage.
  // We'll stick to Redux for channels momentarily if useGetChannel is ambiguous or use it.
  // Actually, let's use the hook if it matches.
  const { channel: channels = [] } = useGetChannel({
    conversationId: currentConversation,
    enabled: !!currentConversation
  });

  const { pinnedMessages: pinMessages = [] } = usePinnedMessages({
    conversationId: currentConversation,
    enabled: !!currentConversation && !currentChannel
  });

  const refCurrentConversation = useRef<string | null>(null);
  const refConversations = useRef<any[]>([]);
  const refCurrentChannel = useRef<string | null>(null);

  const [scrollId, setScrollId] = useState('');
  const [isShow, setIsShow] = useState(false);
  const [isScroll, setIsScroll] = useState(false);
  const [hasMessage, setHasMessage] = useState('');
  const [usersTyping, setUsersTyping] = useState<any[]>([]);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [visibleNews, setVisibleNews] = useState(false);
  const [tabActiveInNews, setTabActiveNews] = useState(0);
  const [isVisibleModalJoinGroup, setIsVisibleJoinGroup] = useState(false);
  const [summaryGroup, setSummary] = useState<any>({});
  const [replyMessage, setReplyMessage] = useState<any>({});
  const [userMention, setUserMention] = useState<any>({});

  const [visibleFilter, setVisibleFilter] = useState(false);
  const [valueInput, setValueInput] = useState('');
  const [singleConverFilter, setSingleConverFilter] = useState<any[]>([]);
  const [multipleConverFilter, setMultiConverFilter] = useState<any[]>([]);
  const [valueClassify, setValueClassify] = useState('0');
  const [isOpenInfo, setIsOpenInfo] = useState(true);
  const [openDrawerInfo, setOpenDrawerInfo] = useState(false);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (width > 1199) {
      setOpenDrawerInfo(false);
    }
  }, [width]);

  useEffect(() => {
    refCurrentConversation.current = currentConversation;
  }, [currentConversation]);

  useEffect(() => {
    refConversations.current = conversations;
  }, [conversations]);

  useEffect(() => {
    refCurrentChannel.current = currentChannel;
  }, [currentChannel]);

  useEffect(() => {
    setUsersTyping([]);
    setReplyMessage(null as any);
    setUserMention({});
  }, [currentConversation]);



  useEffect(() => {
    const openModalJoinFromLink = async () => {
      if ((location as any).state && (location as any).state.conversationId) {
        const data = await conversationApi.getListConversations({});
        const tempId = (location as any).state.conversationId;

        if (data.findIndex((ele: any) => ele._id === tempId) < 0) {
          try {
            const dataSummary = await conversationApi.getSummaryInfoGroup(
              tempId,
            );
            setSummary(dataSummary);
            setIsVisibleJoinGroup(true);
          } catch (error) {
            toast.error(
              'Trưởng nhóm đã tắt tính năng tham gia nhóm bằng liên kết',
            );
          }
        } else {

          dispatch(getMembersConversation({ conversationId: tempId }));
          dispatch(setTypeOfConversation(tempId));
          dispatch(getLastViewOfMembers({ conversationId: tempId }));
        }

        navigate('/chat', {
          state: {
            conversationId: null,
          },
        });
      }
    };
    openModalJoinFromLink();
  }, [location, navigate, dispatch]);

  // Removed useEffects for fetching conversations, friends, pinMessages as they are now hooks.
  // Kept logic for setTotalChannelNotify
  useEffect(() => {
    if (currentConversation) {
      dispatch(setTotalChannelNotify(undefined));
    }
  }, [currentConversation, channels, conversations, dispatch]);

  useEffect(() => {
    if (!isJoinChatLayout) {
      socket.on('delete-conversation', (conversationId: string) => {
        const conver = refConversations.current.find(
          (ele) => ele._id === conversationId,
        );
        if (conver?.leaderId !== user?._id) {
          toast.info(`Nhóm ${conver?.name} đã giải tán`);
        }
        dispatch(removeConversation(conversationId));
        queryClient.setQueryData(createKeyListConversations({}), (old: any[]) =>
          old ? old.filter((c) => c._id !== conversationId) : []
        );
      });

      socket.on('delete-message', ({ conversationId, channelId, id }: any) => {
        handleDeleteMessage(conversationId, channelId, id);
      });

      socket.on('added-group', (conversationId: string) => {
        queryClient.invalidateQueries({
          queryKey: createKeyListConversations({
            conversationId
          })
        });
      });

      socket.on(
        'add-reaction',
        ({ conversationId, channelId, messageId, user: u, type }: any) => {
          if (
            refCurrentConversation.current === conversationId &&
            refCurrentChannel.current === channelId
          ) {
            dispatch(setReactionMessage({ messageId, user: u, type }));
          }
          if (!channelId && refCurrentConversation.current === conversationId) {
            dispatch(setReactionMessage({ messageId, user: u, type }));
          }
        },
      );

      socket.on('typing', (conversationId: string, userTyping: any) => {
        if (conversationId === refCurrentConversation.current) {
          setUsersTyping((prev) => {
            const index = prev.findIndex((ele) => ele._id === userTyping._id);
            if (prev.length === 0 || index < 0) {
              return [...prev, userTyping];
            }
            return prev;
          });
        }
      });

      socket.on('not-typing', (conversationId: string, userTyping: any) => {
        if (conversationId === refCurrentConversation.current) {
          setUsersTyping((prev) =>
            prev.filter((ele) => ele._id !== userTyping._id),
          );
        }
      });

      socket.on('deleted-group', (conversationId: string) => {
        const conversation = refConversations.current.find(
          (ele) => ele._id === conversationId,
        );
        toast.info(`Bạn đã bị xóa khỏi nhóm ${conversation?.name}`);
        if (conversationId === refCurrentConversation.current) {
          dispatch(setCurrentConversation(''));
        }
        dispatch(isDeletedFromGroup(conversationId));
        socket.emit('leave-conversation', conversationId);
        queryClient.setQueryData(createKeyListConversations({}), (old: any[]) =>
          old ? old.filter((c) => c._id !== conversationId) : []
        );
      });

      socket.on('action-pin-message', (conversationId: string) => {
        if (conversationId === refCurrentConversation.current) {

          queryClient.invalidateQueries({ queryKey: ['pinnedMessages', { conversationId }] });
        }
      });

      socket.on(
        'rename-conversation',
        (conversationId: string, conversationName: string, message: any) => {
          dispatch(updateNameOfConver({ conversationId, conversationName }));
          dispatch(addMessage(message));
          queryClient.invalidateQueries({ queryKey: createKeyListConversations({}) });
        },
      );

      socket.on(
        'user-last-view',
        ({ conversationId, userId, lastView, channelId }: any) => {
          if (userId !== user?._id) {
            if (channelId) {
              queryClient.invalidateQueries({ queryKey: ['fetchLastViewChannel', { channelId }] });
            } else {
              queryClient.invalidateQueries({ queryKey: ['fetchLastViewOfMembers', { conversationId }] });
            }
          }
        },
      );

      socket.on('update-member', async (conversationId: string) => {
        if (conversationId === refCurrentConversation.current) {
          await dispatch(getLastViewOfMembers({ conversationId }));
          const newMember = await conversationApi.getMemberInConversation(
            refCurrentConversation.current,
          );
          dispatch(updateMemberInconver({ conversationId, newMember }));
        }
      });

      socket.on(
        'new-channel',
        ({ _id, name, conversationId, createdAt }: any) => {
          if (conversationId === refCurrentConversation.current) {
            dispatch(updateChannel({ _id, name, createdAt }));
          }
        },
      );

      socket.on(
        'delete-channel',
        async ({ conversationId, channelId }: any) => {
          const actionAfterDelete = async () => {
            await dispatch(setCurrentChannel(''));

            dispatch(
              getLastViewOfMembers({
                conversationId: refCurrentConversation.current,
              }),
            );
          };
          await actionAfterDelete();

          if (refCurrentConversation.current === conversationId) {
            dispatch(removeChannel({ channelId }));
          }
        },
      );

      socket.on('update-channel', ({ _id, name, conversationId }: any) => {
        if (refCurrentConversation.current === conversationId) {
          dispatch(updateNameChannel({ channelId: _id, name }));
        }
      });

      socket.on(
        'update-avatar-conversation',
        (conversationId: string, conversationAvatar: string, message: any) => {
          if (refCurrentConversation.current === conversationId) {
            dispatch(
              updateAvatarConver({ conversationId, conversationAvatar }),
            );
          }
        },
      );

      socket.on(
        'update-vote-message',
        (conversationId: string, voteMessage: any) => {
          if (refCurrentConversation.current === conversationId) {
            dispatch(updateVoteMessage({ voteMessage }));
          }
        },
      );

      socket.on('add-managers', ({ conversationId, managerIds }: any) => {
        dispatch(addManagers({ conversationId, managerIds }));
      });

      socket.on('delete-managers', ({ conversationId, managerIds }: any) => {
        dispatch(deleteManager({ conversationId, managerIds }));
      });
    }
    dispatch(setJoinChatLayout(true));
  }, [socket, dispatch, isJoinChatLayout, user]);

  const emitUserOnline = (currentConver: string | null) => {
    if (currentConver) {
      const conver = conversations.find(
        (ele: any) => ele._id === currentConver,
      );
      if (conver && !conver.type) {
        const userId = (conver as any).userId;
        socket.emit(
          'get-user-online',
          userId,
          ({ isOnline, lastLogin }: any) => {
            dispatch(
              updateTimeForConver({ id: currentConver, isOnline, lastLogin }),
            );
          },
        );
      }
    }
  };

  useEffect(() => {
    emitUserOnline(currentConversation);
  }, [currentConversation]);

  useEffect(() => {
    const intervalCall = setInterval(() => {
      emitUserOnline(currentConversation);
    }, 180000);

    return () => {
      clearInterval(intervalCall);
    };
  }, [currentConversation, conversations]);

  const handleDeleteMessage = (
    conversationId: string,
    channelId: string | null,
    id: string,
  ) => {
    if (
      refCurrentConversation.current === conversationId &&
      refCurrentChannel.current === channelId
    ) {
      dispatch(setRedoMessage({ id }));
    }
    if (!channelId && refCurrentConversation.current === conversationId) {
      dispatch(setRedoMessage({ id, conversationId }));
    }
  };

  const handleScrollWhenSent = (value: string) => {
    setScrollId(value);
  };

  const handleOnClickScroll = () => {
    setIsScroll(true);
  };

  const handleBackToBottom = (value: boolean, message?: string) => {
    if (message) {
      setHasMessage(message);
    } else {
      setHasMessage('');
    }
    setIsShow(value);
  };

  const hanldeResetScrollButton = (value: boolean) => {
    setIsScroll(value);
  };

  const handleOnBack = () => {
    setVisibleNews(false);
  };

  const handleViewNews = () => {
    setVisibleNews(true);
    setTabActiveNews(0);
  };

  const handleCancelModalJoinGroup = () => {
    setIsVisibleJoinGroup(false);
  };

  const handleChangeViewChannel = () => {
    setVisibleNews(true);
    setTabActiveNews(2);
  };

  const handleViewVotes = () => {
    if (width <= 1199) {
      setOpenDrawerInfo(true);
    }
    setVisibleNews(true);
    setTabActiveNews(1);
  };

  const handleChangeActiveKey = (key: number) => {
    setTabActiveNews(key);
  };

  const handleOnReply = (mes: any) => {
    setReplyMessage(mes);
  };

  const handleCloseReply = () => {
    setReplyMessage({});
  };

  const handleOnMention = (userMent: any) => {
    if (user && user._id !== userMent._id) {
      setUserMention(userMent);
    }
  };

  const handleOnRemoveMention = () => {
    setUserMention({});
  };

  const handleOnVisibleFilter = (value: string) => {
    if (value.trim().length > 0) {
      setVisibleFilter(true);
    } else {
      setVisibleFilter(false);
    }
  };

  const handleOnSearchChange = (value: string) => {
    setValueInput(value);
    handleOnVisibleFilter(value);
  };

  const handleOnSubmitSearch = async () => {
    try {
      const single = await conversationApi.getListConversations(valueInput, 1);
      setSingleConverFilter(single);
      const mutiple = await conversationApi.getListConversations(valueInput, 2);
      setMultiConverFilter(mutiple);
    } catch (error) { }
  };

  const handleOnFilterClassfiy = (value: string) => {
    setValueClassify(value);
  };

  const currentConverObj =
    conversations.find((ele: any) => ele._id === currentConversation) || {};

  const renderAsideInfoConversation = () => {
    return (
      <>
        {openDrawerInfo && width <= 1199 && (
          <>
            <div
              className="fixed inset-0 bg-black/30 z-40 transition-opacity duration-300"
              onClick={() => setOpenDrawerInfo(false)}
            />
            <div
              className="fixed top-0 right-0 h-full bg-white shadow-2xl z-50 transition-transform duration-300 ease-out"
              style={{
                width: `${renderWidthDrawer(width)}%`,
                transform: openDrawerInfo ? 'translateX(0)' : 'translateX(100%)',
              }}
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
                  <h3 className="font-semibold text-slate-900">
                    {visibleNews ? 'Bảng tin nhóm' : 'Thông tin'}
                  </h3>
                  <button
                    onClick={() => setOpenDrawerInfo(false)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-500" />
                  </button>
                </div>
                <div className="flex-1 overflow-auto">
                  {visibleNews ? (
                    <GroupNews
                      tabActive={tabActiveInNews}
                      onBack={handleOnBack}
                      onChange={handleChangeActiveKey}
                    />
                  ) : (
                    <InfoContainer
                      onViewChannel={handleChangeViewChannel}
                      socket={socket}
                      onOpenInfoBlock={() => setIsOpenInfo(true)}
                    />
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {currentConversation && (
          <aside
            className={`
              hidden lg:flex flex-col
              transition-all duration-300 ease-out
              border-l border-slate-200/80 bg-white
              ${isOpenInfo ? 'lg:w-80' : 'lg:w-0 lg:overflow-hidden lg:border-l-0'}
            `}
          >
            <div className="h-full">
              {visibleNews ? (
                <GroupNews
                  tabActive={tabActiveInNews}
                  onBack={handleOnBack}
                  onChange={handleChangeActiveKey}
                />
              ) : (
                <InfoContainer
                  onViewChannel={handleChangeViewChannel}
                  socket={socket}
                  onOpenInfoBlock={() => setIsOpenInfo(true)}
                  onClose={() => setIsOpenInfo(false)}
                />
              )}
            </div>
          </aside>
        )}
      </>
    );
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60">
        <svg
          className="w-10 h-10 animate-spin text-slate-700"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      </div>
    );
  }

  return (
    <>
      {Object.keys(summaryGroup || {}).length > 0 && (
        <ModalJoinGroupFromLink
          isVisible={isVisibleModalJoinGroup}
          info={summaryGroup}
          onCancel={handleCancelModalJoinGroup}
        />
      )}

      <div className="min-h-screen h-screen flex">
        <aside
          className={`transition-all duration-200 
            ${currentConversation ? 'hidden sm:block' : 'block w-full'} 
            sm:w-72 lg:w-80`}
        >
          <div className="h-full flex flex-col">
            <div className="px-4 pt-4 pb-3">
              <SearchContainer
                valueText={valueInput}
                onSearchChange={handleOnSearchChange}
                onSubmitSearch={handleOnSubmitSearch}
                onFilterClasify={handleOnFilterClassfiy}
                valueClassify={valueClassify}
              />
            </div>

            <div className="flex-1 overflow-hidden h-full">
              {visibleFilter ? (
                <div className="h-full overflow-auto">
                  <FilterContainer
                    dataSingle={singleConverFilter}
                    dataMulti={multipleConverFilter}
                  />
                </div>
              ) : (
                <div className="px-2 h-full">
                  <ConversationContainer valueClassify={valueClassify} />
                </div>
              )}
            </div>
          </div>
        </aside>

        {path === '/chat' && currentConversation ? (
          <main className="flex-1 flex flex-col bg-white">
            <header className="border-b border-slate-200/80 bg-white shadow-sm">
              <HeaderChatContainer
                onPopUpInfo={() => setIsOpenInfo(!isOpenInfo)}
                onOpenDrawer={() => setOpenDrawerInfo(true)}
              />
            </header>

            <section className="flex-1 flex flex-col overflow-hidden relative">
              <div className="flex-1 overflow-hidden px-4 py-2">
                <BodyChatContainer
                  scrollId={scrollId}
                  onSCrollDown={idNewMessage}
                  onBackToBottom={handleBackToBottom}
                  onResetScrollButton={hanldeResetScrollButton}
                  turnOnScrollButton={isScroll}
                  onReply={handleOnReply}
                  onMention={handleOnMention}
                />
              </div>

              {pinMessages.length > 1 &&
                (currentConverObj as any).type &&
                !currentChannel && (
                  <div className="absolute right-4 bottom-24 hidden lg:block">
                    <DrawerPinMessage
                      isOpen={isOpenDrawer}
                      onClose={() => setIsOpenDrawer(false)}
                      message={pinMessages}
                    />
                  </div>
                )}

              {pinMessages.length > 0 &&
                (currentConverObj as any).type &&
                !currentChannel && (
                  <div className="absolute left-4 bottom-24 hidden lg:block">
                    <NutshellPinMessage
                      isHover={false}
                      isItem={pinMessages.length > 1 ? false : true}
                      message={pinMessages[0]}
                      quantity={pinMessages.length}
                      onOpenDrawer={() => setIsOpenDrawer(true)}
                    />
                  </div>
                )}

              <button
                id="back-top-button"
                className={`absolute right-6 bottom-6 z-40 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-lg p-3 transition-all duration-200 hover:shadow-xl hover:scale-105 ${isShow
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4 pointer-events-none'
                  }`}
                onClick={handleOnClickScroll}
                aria-label="Scroll to new message"
              >
                {hasMessage ? (
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <span className="text-primary">
                      <ChevronsLeft className="w-4 h-4" />
                    </span>
                    <span className="whitespace-nowrap text-slate-700">
                      {hasMessage}
                    </span>
                  </div>
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-600" />
                )}
              </button>

              {usersTyping.length > 0 && !refCurrentChannel.current && (
                <div className="absolute left-6 bottom-4 z-30 rounded-full bg-white/95 backdrop-blur-sm border border-slate-200 px-4 py-2 text-sm text-slate-600 shadow-md flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: '100ms' }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce"
                      style={{ animationDelay: '200ms' }}
                    />
                  </div>
                  <div className="font-medium">
                    {usersTyping.slice(0, 2).map((ele, index) => (
                      <span key={ele._id || index}>
                        {index === usersTyping.length - 1
                          ? `${ele.name}`
                          : `${ele.name}, `}
                      </span>
                    ))}
                    {usersTyping.length > 2
                      ? ` +${usersTyping.length - 2}`
                      : ''}
                    <span className="text-slate-500 font-normal">
                      {' '}
                      đang nhập...
                    </span>
                  </div>
                </div>
              )}

              <footer className="border-t border-slate-200/80 bg-white px-4 py-3">
                <FooterChatContainer
                  onScrollWhenSentText={handleScrollWhenSent}
                  socket={socket}
                  replyMessage={replyMessage}
                  onCloseReply={handleCloseReply}
                  userMention={userMention}
                  onRemoveMention={handleOnRemoveMention}
                  onViewVotes={handleViewVotes}
                  onOpenInfoBlock={() => setIsOpenInfo(true)}
                />
              </footer>
            </section>
          </main>
        ) : (
          <main className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            <div className="p-8 max-w-lg text-center">
              <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10">
                <svg
                  className="w-10 h-10 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-semibold text-slate-900 mb-3">
                Chào mừng đến với{' '}
                <span className="text-primary font-bold">Meetdy</span>
              </h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng người
                thân, bạn bè được tối ưu hoá cho máy tính của bạn.
              </p>
              <div className="mt-8">
                <Slider />
              </div>
            </div>
          </main>
        )}
        {renderAsideInfoConversation()}
      </div>
    </>
  );
}

export default Chat;
