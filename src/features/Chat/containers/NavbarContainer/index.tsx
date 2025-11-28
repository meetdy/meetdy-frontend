import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
  ContactsOutlined,
  LockOutlined,
  LogoutOutlined,
  MessageOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';

import { setTabActive } from '@/app/globalSlice';
import { setToTalUnread } from '../../slice/chatSlice';

import ModalChangePassword from '@/components/ModalChangePassword';
import ModalUpdateProfile from '@/features/Chat/components/ModalUpdateProfile';
import PersonalIcon from '@/features/Chat/components/PersonalIcon';

export default function NavbarContainer({ onSaveCodeRevoke }) {
  const dispatch = useDispatch();
  const location = useLocation();

  const { user } = useSelector((state: any) => state.global);
  const { conversations, toTalUnread } = useSelector(
    (state: any) => state.chat,
  );
  const { amountNotify } = useSelector((state: any) => state.friend);

  const [visibleModalChangePassword, setVisibleModalChangePassword] =
    useState(false);
  const [isModalUpdateProfileVisible, setIsModalUpdateProfileVisible] =
    useState(false);

  const checkCurrentPage = (iconName: string) => {
    if (iconName === 'MESSAGE' && location.pathname === '/chat') return true;
    if (iconName === 'FRIEND' && location.pathname === '/chat/friends')
      return true;
    return false;
  };

  useEffect(() => {
    dispatch(setToTalUnread());
  }, [conversations]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    window.location.reload();
  };

  const handleSetTabActive = (value: number) => {
    dispatch(setTabActive(value));
  };

  const content = (
    <div className="flex flex-col w-40">
      <button
        onClick={() => setIsModalUpdateProfileVisible(true)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md"
      >
        <UserOutlined />
        <span>Tài khoản</span>
      </button>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md"
      >
        <LogoutOutlined />
        <span>Đăng xuất</span>
      </button>
    </div>
  );

  return (
    <div className="h-full w-full">
      <div className="flex flex-col items-center justify-between h-full py-4 bg-white border-r">
        <ul className="flex flex-col gap-4">
          <li>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="p-0 hover:bg-transparent rounded-full"
                >
                  <PersonalIcon
                    isActive={true}
                    common={false}
                    avatar={user.avatar}
                    name={user.name}
                    color={user.avatarColor}
                  />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="right">{content}</PopoverContent>
            </Popover>
          </li>

          <Link to="/chat">
            <li
              className={`flex items-center justify-center h-10 w-10 rounded-xl cursor-pointer transition 
              ${
                checkCurrentPage('MESSAGE')
                  ? 'bg-blue-100 text-blue-600'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => handleSetTabActive(1)}
            >
              <div className="relative">
                <MessageOutlined />
                {toTalUnread > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                    {toTalUnread}
                  </span>
                )}
              </div>
            </li>
          </Link>

          <Link to="/chat/friends">
            <li
              className={`flex items-center justify-center h-10 w-10 rounded-xl cursor-pointer transition 
              ${
                checkCurrentPage('FRIEND')
                  ? 'bg-blue-100 text-blue-600'
                  : 'hover:bg-gray-100'
              }`}
              onClick={() => handleSetTabActive(2)}
            >
              <div className="relative">
                <ContactsOutlined />
                {amountNotify > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 rounded-full">
                    {amountNotify}
                  </span>
                )}
              </div>
            </li>
          </Link>
        </ul>

        <ul>
          <li>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 w-10 flex items-center justify-center hover:bg-gray-100 rounded-xl"
                >
                  <SettingOutlined />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="right">
                <button
                  onClick={() => setVisibleModalChangePassword(true)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-md"
                >
                  <LockOutlined />
                  <span>Đổi mật khẩu</span>
                </button>
              </PopoverContent>
            </Popover>
          </li>
        </ul>
      </div>

      <ModalChangePassword
        visible={visibleModalChangePassword}
        onSaveCodeRevoke={setVisibleModalChangePassword}
        onCancel={undefined}
      />

      <ModalUpdateProfile
        isVisible={isModalUpdateProfileVisible}
        onCancel={setIsModalUpdateProfileVisible}
        onOk={setIsModalUpdateProfileVisible}
      />
    </div>
  );
}
