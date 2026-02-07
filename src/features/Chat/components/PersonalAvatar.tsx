import { Key, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getSummaryName } from '@/utils/ui-utils';

type Props = {
  avatar?: string;
  isActive?: boolean;
  dimension?: number;
  common?: boolean;
  isHost?: boolean;
  name?: string;
  color?: string;
  noneUser?: boolean;
};

export default function PersonalAvatar({
  avatar = '',
  isActive = false,
  dimension = 48,
  common = true,
  isHost = false,
  name = '',
  color = '',
  noneUser = false,
}: Props) {
  const wrapClass =
    isActive && common
      ? 'user-icon common'
      : !isActive && common
        ? 'user-icon no-online common'
        : isActive && !common
          ? 'user-icon'
          : 'user-icon no-online';

  return (
    <div className={wrapClass}>
      <div className="relative inline-block">
        {isActive && (
          <span className="absolute w-2 h-2 bg-green-500 rounded-full bottom-0 right-1 z-1"></span>
        )}

        {isHost && (
          <span className="absolute -right-1 -bottom-1 bg-black/30 p-1 rounded-full">
            <Key className="w-3 h-3 text-yellow-300" />
          </span>
        )}

        {noneUser ? (
          <Avatar
            style={{ width: dimension, height: dimension }}
            className="bg-green-300"
          >
            <AvatarFallback className="flex items-center justify-center">
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
        ) : avatar ? (
          <Avatar style={{ width: dimension, height: dimension }}>
            <AvatarImage src={avatar} />
            <AvatarFallback>{getSummaryName(name)}</AvatarFallback>
          </Avatar>
        ) : (
          <Avatar
            style={{ width: dimension, height: dimension }}
            className="flex items-center justify-center"
          >
            <AvatarFallback
              className="text-white font-medium"
              style={{
                backgroundColor: color || '#4c92ff',
                width: dimension,
                height: dimension,
              }}
            >
              {getSummaryName(name)}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
