import { Icon } from '@/components/ui/icon';
import { ChevronLeft } from 'lucide-react';

import { User, Users, TriangleAlert } from 'lucide-react';

function HeaderFriend({ subtab = 0, onBack = null }) {
  const handleOnClick = () => {
    if (onBack) onBack();
  };

  const icon = subtab === 0 ? User : subtab === 1 ? Users : TriangleAlert;

  const title =
    subtab === 0
      ? 'Danh sách kết bạn'
      : subtab === 1
      ? 'Danh sách nhóm'
      : 'Danh bạ';

  return (
    <div className="flex items-center gap-4 p-3 border-b bg-white">
      <button
        onClick={handleOnClick}
        className="p-2 rounded-full hover:bg-gray-100 transition"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="w-10 h-10 flex items-center justify-center">
        <Icon icon={icon} className="w-6 h-6 text-blue-600" />
      </div>

      <div className="flex-1 text-lg font-medium">{title}</div>
    </div>
  );
}

export default HeaderFriend;
