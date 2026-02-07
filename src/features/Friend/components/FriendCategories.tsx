import { Icon } from '@/components/ui/icon';
import { User, Users, PhoneCall } from 'lucide-react';

function FriendCategories({ subtab = 0 }) {
  const icon = subtab === 0 ? User : subtab === 1 ? Users : PhoneCall;

  const title =
    subtab === 0
      ? 'Danh sách kết bạn'
      : subtab === 1
        ? 'Danh sách nhóm'
        : 'Danh bạ';

  return (
    <div className="flex items-center gap-4 p-3 border-b bg-white">
      <div className="w-10 h-10 flex items-center justify-center">
        <Icon icon={icon} className="w-6 h-6 text-blue-600" />
      </div>

      <div className="flex-1 text-lg font-medium">{title}</div>
    </div>
  );
}

export default FriendCategories;
