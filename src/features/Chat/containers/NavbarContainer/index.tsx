import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  MessageSquare,
  Users,
  Settings,
  Lock,
  LogOut,
  Moon,
  Sun,
  HelpCircle,
  Palette,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

import { setTabActive } from '@/app/globalSlice';


import ModalChangePassword from '@/components/modal-change-password';
import ModalUpdateProfile from '@/features/Chat/components/ModalUpdateProfile';
import PersonalAvatar from '@/features/Chat/components/PersonalAvatar';

import NavButton from './NavButton';

import { useGetListConversations } from '@/hooks/conversation/useGetListConversations';

// ...

export default function NavbarContainer() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { user } = useSelector((state: any) => state.global);
  const { amountNotify } = useSelector((state: any) => state.friend);

  const { conversations = [] } = useGetListConversations({ params: {} });

  const toTalUnread = (conversations || []).reduce((acc: number, curr: any) => {
    return acc + (curr.numberUnread || 0);
  }, 0);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVisibleChangePass, setIsVisibleChangePass] = useState(false);
  const [isModalProfileVisible, setIsModalProfileVisible] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  // Removed useEffect dispatching setToTalUnread as we derive it now

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const next = !isDarkMode;
    setIsDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <>
      <div className="h-full w-full border-r flex flex-col">
        <div className="p-3 flex justify-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
        </div>

        <Separator />

        <div className="p-3 flex justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <PersonalAvatar
                  isActive
                  common={false}
                  avatar={user?.avatar}
                  name={user?.name}
                  color={user?.avatarColor}
                />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-64"
              side="right"
              align="end"
              sideOffset={12}
            >
              <DropdownMenuLabel className="p-0">
                <div className="p-4 flex items-center gap-3">
                  <PersonalAvatar
                    isActive
                    common={false}
                    avatar={user?.avatar}
                    name={user?.name}
                    color={user?.avatarColor}
                  />
                  <div className="min-w-0">
                    <p className="font-semibold truncate">{user?.name}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {user?.username}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setIsModalProfileVisible(true)}
                className="flex flex-col items-start gap-0 py-2.5"
              >
                <span className="font-medium text-sm">Thông tin tài khoản</span>
                <span className="text-xs text-muted-foreground">
                  Xem và chỉnh sửa hồ sơ
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex flex-col items-start gap-0 py-2.5">
                <span className="font-medium text-sm">Thông báo</span>
                <span className="text-xs text-muted-foreground">
                  Cài đặt thông báo
                </span>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex flex-col items-start gap-0 py-2.5">
                <span className="font-medium text-sm">Quyền riêng tư</span>
                <span className="text-xs text-muted-foreground">
                  Bảo mật & quyền riêng tư
                </span>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleLogout}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator />

        <nav className="flex-1 p-3 flex flex-col gap-2">
          <NavButton
            to="/chat"
            active={isActive('/chat')}
            badge={toTalUnread}
            onClick={() => dispatch(setTabActive(1))}
          >
            <MessageSquare className="h-5 w-5" />
          </NavButton>

          <NavButton
            to="/chat/friends"
            active={isActive('/chat/friends')}
            badge={amountNotify}
            onClick={() => dispatch(setTabActive(2))}
          >
            <Users className="h-5 w-5" />
          </NavButton>
        </nav>

        <Separator />

        <div className="p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full h-12 rounded-xl hover:bg-muted">
                <Settings className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="right"
              align="end"
              sideOffset={12}
              className="w-64 p-0"
            >
              <DropdownMenuLabel className="p-3 font-semibold text-sm">
                Cài đặt
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <div className="p-2 space-y-1">
                <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-muted">
                  <div className="flex items-center gap-3">
                    {isDarkMode ? (
                      <Moon className="h-4 w-4 text-amber-500" />
                    ) : (
                      <Sun className="h-4 w-4 text-amber-500" />
                    )}
                    <span className="text-sm font-medium">Chế độ tối</span>
                  </div>
                  <Switch
                    checked={isDarkMode}
                    onCheckedChange={toggleDarkMode}
                  />
                </div>

                <DropdownMenuItem onClick={() => setIsVisibleChangePass(true)}>
                  <Lock className="h-4 w-4 mr-2 text-red-500" />
                  Đổi mật khẩu
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <Palette className="h-4 w-4 mr-2 text-indigo-500" />
                  Giao diện
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <HelpCircle className="h-4 w-4 mr-2 text-teal-500" />
                  Trợ giúp & Hỗ trợ
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ModalChangePassword
        visible={isVisibleChangePass}
        onCancel={() => setIsVisibleChangePass(false)}
        onSaveCodeRevoke={() => setIsVisibleChangePass(false)}
      />

      <ModalUpdateProfile
        isVisible={isModalProfileVisible}
        onCancel={() => setIsModalProfileVisible(false)}
        onSuccess={() => setIsModalProfileVisible(false)}
      />
    </>
  );
}
