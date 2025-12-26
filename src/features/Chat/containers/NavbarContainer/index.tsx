import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  ChevronRight,
} from 'lucide-react';

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';

import { setTabActive } from '@/app/globalSlice';
import { setToTalUnread } from '../../slice/chatSlice';

import ModalChangePassword from '@/components/ModalChangePassword';
import ModalUpdateProfile from '@/features/Chat/components/ModalUpdateProfile';
import PersonalIcon from '@/features/Chat/components/PersonalIcon';

export default function NavbarContainer({ onSaveCodeRevoke }: any) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useSelector((state: any) => state.global);
  const { conversations, toTalUnread } = useSelector(
    (state: any) => state.chat,
  );
  const { amountNotify } = useSelector((state: any) => state.friend);

  const [visibleModalChangePassword, setVisibleModalChangePassword] =
    useState(false);
  const [isModalUpdateProfileVisible, setIsModalUpdateProfileVisible] =
    useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfilePopoverOpen, setIsProfilePopoverOpen] = useState(false);
  const [isSettingsPopoverOpen, setIsSettingsPopoverOpen] = useState(false);

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

  const handleOpenProfile = () => {
    setIsProfilePopoverOpen(false);
    setIsModalUpdateProfileVisible(true);
  };

  const handleOpenChangePassword = () => {
    setIsSettingsPopoverOpen(false);
    setVisibleModalChangePassword(true);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const profileContent = (
    <div className="w-64">
      {/* User Info Header */}
      <div className="p-4 flex items-center gap-3">
        <PersonalIcon
          isActive={true}
          common={false}
          avatar={user?.avatar}
          name={user?.name}
          color={user?.avatarColor}
        />
        <div className="flex-1 min-w-0">
          <p className="font-semibold truncate">{user?.name}</p>
          <p className="text-sm text-muted-foreground truncate">
            {user?.username}
          </p>
        </div>
      </div>

      <Separator />

      {/* Menu Items */}
      <div className="p-2">
        <button
          onClick={handleOpenProfile}
          className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-muted rounded-lg transition-colors text-left"
        >
          <div className="p-1.5 bg-blue-500/10 rounded-lg">
            <User className="h-4 w-4 text-blue-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Thông tin tài khoản</p>
            <p className="text-xs text-muted-foreground">
              Xem và chỉnh sửa hồ sơ
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>

        <button
          onClick={() => {}}
          className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-muted rounded-lg transition-colors text-left"
        >
          <div className="p-1.5 bg-purple-500/10 rounded-lg">
            <Bell className="h-4 w-4 text-purple-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Thông báo</p>
            <p className="text-xs text-muted-foreground">Cài đặt thông báo</p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>

        <button
          onClick={() => {}}
          className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-muted rounded-lg transition-colors text-left"
        >
          <div className="p-1.5 bg-green-500/10 rounded-lg">
            <Shield className="h-4 w-4 text-green-500" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">Quyền riêng tư</p>
            <p className="text-xs text-muted-foreground">
              Bảo mật & quyền riêng tư
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <Separator />

      {/* Logout */}
      <div className="p-2">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-destructive/10 rounded-lg transition-colors text-left group"
        >
          <div className="p-1.5 bg-destructive/10 rounded-lg">
            <LogOut className="h-4 w-4 text-destructive" />
          </div>
          <span className="text-sm font-medium text-destructive">
            Đăng xuất
          </span>
        </button>
      </div>
    </div>
  );

  const settingsContent = (
    <div className="w-64">
      <div className="p-3 border-b">
        <p className="font-semibold text-sm">Cài đặt</p>
      </div>

      <div className="p-2">
        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between px-3 py-2.5 hover:bg-muted rounded-lg transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-amber-500/10 rounded-lg">
              {isDarkMode ? (
                <Moon className="h-4 w-4 text-amber-500" />
              ) : (
                <Sun className="h-4 w-4 text-amber-500" />
              )}
            </div>
            <span className="text-sm font-medium">Chế độ tối</span>
          </div>
          <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
        </div>

        <button
          onClick={handleOpenChangePassword}
          className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-muted rounded-lg transition-colors text-left"
        >
          <div className="p-1.5 bg-red-500/10 rounded-lg">
            <Lock className="h-4 w-4 text-red-500" />
          </div>
          <span className="text-sm font-medium">Đổi mật khẩu</span>
        </button>

        <button
          onClick={() => {}}
          className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-muted rounded-lg transition-colors text-left"
        >
          <div className="p-1.5 bg-indigo-500/10 rounded-lg">
            <Palette className="h-4 w-4 text-indigo-500" />
          </div>
          <span className="text-sm font-medium">Giao diện</span>
        </button>

        <button
          onClick={() => {}}
          className="flex items-center gap-3 w-full px-3 py-2.5 hover:bg-muted rounded-lg transition-colors text-left"
        >
          <div className="p-1.5 bg-teal-500/10 rounded-lg">
            <HelpCircle className="h-4 w-4 text-teal-500" />
          </div>
          <span className="text-sm font-medium">Trợ giúp & Hỗ trợ</span>
        </button>
      </div>
    </div>
  );

  return (
    <TooltipProvider delayDuration={200}>
      <div className="h-full w-16 bg-muted/30 border-r flex flex-col">
        {/* Logo/Brand at top */}
        <div className="p-3 flex justify-center">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>

        <Separator className="mx-3" />

        {/* User Avatar */}
        <div className="p-3 flex justify-center">
          <Popover
            open={isProfilePopoverOpen}
            onOpenChange={setIsProfilePopoverOpen}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="p-0 hover:bg-transparent rounded-full h-auto w-auto ring-2 ring-transparent hover:ring-primary/20 transition-all"
                  >
                    <PersonalIcon
                      isActive={true}
                      common={false}
                      avatar={user?.avatar}
                      name={user?.name}
                      color={user?.avatarColor}
                    />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Tài khoản của bạn</p>
              </TooltipContent>
            </Tooltip>
            <PopoverContent side="right" align="start" className="p-0">
              {profileContent}
            </PopoverContent>
          </Popover>
        </div>

        <Separator className="mx-3" />

        {/* Main Navigation */}
        <nav className="flex-1 p-3 flex flex-col gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/chat">
                <Button
                  variant="ghost"
                  className={`w-full h-12 flex items-center justify-center rounded-xl transition-all
                    ${
                      checkCurrentPage('MESSAGE')
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/25'
                        : 'hover:bg-muted'
                    }`}
                  onClick={() => handleSetTabActive(1)}
                >
                  <div className="relative">
                    <MessageSquare className="h-5 w-5" />
                    {toTalUnread > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-destructive text-destructive-foreground text-[10px] font-medium px-1 rounded-full flex items-center justify-center">
                        {toTalUnread > 99 ? '99+' : toTalUnread}
                      </span>
                    )}
                  </div>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Tin nhắn</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/chat/friends">
                <Button
                  variant="ghost"
                  className={`w-full h-12 flex items-center justify-center rounded-xl transition-all
                    ${
                      checkCurrentPage('FRIEND')
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/25'
                        : 'hover:bg-muted'
                    }`}
                  onClick={() => handleSetTabActive(2)}
                >
                  <div className="relative">
                    <Users className="h-5 w-5" />
                    {amountNotify > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-destructive text-destructive-foreground text-[10px] font-medium px-1 rounded-full flex items-center justify-center">
                        {amountNotify > 99 ? '99+' : amountNotify}
                      </span>
                    )}
                  </div>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Bạn bè</p>
            </TooltipContent>
          </Tooltip>
        </nav>

        <Separator className="mx-3" />

        {/* Bottom Actions */}
        <div className="p-3 flex flex-col gap-2">
          <Popover
            open={isSettingsPopoverOpen}
            onOpenChange={setIsSettingsPopoverOpen}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full h-12 flex items-center justify-center hover:bg-muted rounded-xl"
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Cài đặt</p>
              </TooltipContent>
            </Tooltip>
            <PopoverContent side="right" align="end" className="p-0">
              {settingsContent}
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <ModalChangePassword
        visible={visibleModalChangePassword}
        onSaveCodeRevoke={() => setVisibleModalChangePassword(false)}
        onCancel={() => setVisibleModalChangePassword(false)}
      />

      <ModalUpdateProfile
        isVisible={isModalUpdateProfileVisible}
        onCancel={() => setIsModalUpdateProfileVisible(false)}
        onOk={() => setIsModalUpdateProfileVisible(false)}
      />
    </TooltipProvider>
  );
}
