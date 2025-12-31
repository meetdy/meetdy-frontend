import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  MessageSquare,
  Users,
  Settings,
  Lock,
  LogOut,
  User,
  Bell,
  Moon,
  Sun,
  HelpCircle,
  Shield,
  Palette,
} from 'lucide-react';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

import { setTabActive } from '@/app/globalSlice';
import { setToTalUnread } from '../../slice/chatSlice';

import ModalChangePassword from '@/components/ModalChangePassword';
import ModalUpdateProfile from '@/features/Chat/components/ModalUpdateProfile';
import PersonalIcon from '@/features/Chat/components/PersonalIcon';

import MenuItem from './MenuItem';
import NavButton from './NavButton';

export default function NavbarContainer() {
  const dispatch = useDispatch();
  const location = useLocation();

  const { user } = useSelector((state: any) => state.global);
  const { conversations, toTalUnread } = useSelector(
    (state: any) => state.chat,
  );
  const { amountNotify } = useSelector((state: any) => state.friend);

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isVisibleChangePass, setIsVisibleChangePass] = useState(false);
  const [isModalUpdateProfileVisible, setIsModalUpdateProfileVisible] =
    useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    dispatch(setToTalUnread());
  }, [conversations]);

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

  const profileContent = (
    <div className="w-64">
      <div className="p-4 flex items-center gap-3">
        <PersonalIcon
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

      <Separator />

      <div className="p-2 space-y-1">
        <MenuItem
          icon={<User className="h-4 w-4 text-blue-500" />}
          title="Thông tin tài khoản"
          subtitle="Xem và chỉnh sửa hồ sơ"
          onClick={() => {
            setProfileOpen(false);
            setIsModalUpdateProfileVisible(true);
          }}
        />

        <MenuItem
          icon={<Bell className="h-4 w-4 text-purple-500" />}
          title="Thông báo"
          subtitle="Cài đặt thông báo"
        />

        <MenuItem
          icon={<Shield className="h-4 w-4 text-green-500" />}
          title="Quyền riêng tư"
          subtitle="Bảo mật & quyền riêng tư"
        />
      </div>

      <Separator />

      <div className="p-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-destructive/10 text-destructive"
        >
          <LogOut className="h-4 w-4" />
          <span className="text-sm font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );

  const settingsContent = (
    <div className="w-64">
      <div className="p-3 border-b font-semibold text-sm">Cài đặt</div>

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
          <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
        </div>

        <MenuItem
          icon={<Lock className="h-4 w-4 text-red-500" />}
          title="Đổi mật khẩu"
          onClick={() => {
            setSettingsOpen(false);
            setIsVisibleChangePass(true);
          }}
        />

        <MenuItem
          icon={<Palette className="h-4 w-4 text-indigo-500" />}
          title="Giao diện"
        />

        <MenuItem
          icon={<HelpCircle className="h-4 w-4 text-teal-500" />}
          title="Trợ giúp & Hỗ trợ"
        />
      </div>
    </div>
  );

  return (
    <>
      <div className="h-full w-full bg-muted/30 border-r flex flex-col">
        <div className="p-3 flex justify-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-primary" />
          </div>
        </div>

        <Separator />

        <div className="p-3 flex justify-center">
          <Popover open={profileOpen} onOpenChange={setProfileOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="p-0 rounded-full ring-2 ring-transparent hover:ring-primary/30 transition"
              >
                <PersonalIcon
                  isActive
                  common={false}
                  avatar={user?.avatar}
                  name={user?.name}
                  color={user?.avatarColor}
                />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="right">{profileContent}</PopoverContent>
          </Popover>
        </div>

        <Separator />

        {/* Navigation */}
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

        {/* Settings */}
        <div className="p-3">
          <Popover open={settingsOpen} onOpenChange={setSettingsOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="w-full h-12 rounded-xl hover:bg-muted"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </PopoverTrigger>

            <PopoverContent side="right" sideOffset={12} className="p-0 z-50">
              {settingsContent}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Modals */}
      <ModalChangePassword
        visible={isVisibleChangePass}
        onCancel={() => setIsVisibleChangePass(false)}
        onSaveCodeRevoke={() => setIsVisibleChangePass(false)}
      />

      <ModalUpdateProfile
        isVisible={isModalUpdateProfileVisible}
        onCancel={() => setIsModalUpdateProfileVisible(false)}
        onSuccess={() => setIsModalUpdateProfileVisible(false)}
      />
    </>
  );
}
