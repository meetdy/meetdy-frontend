import React from 'react';
import PersonalAvatar from './PersonalAvatar';
import { Pin } from 'lucide-react';
import dateUtils from '@/utils/dateUtils';

function PinItem({ children, message }) {
  const time = new Date(message.createdAt);
  const tempTime = new Date(message.createdAt);
  const currentTime = new Date();

  return (
    <div>
      <div>
        <div>
          <PersonalAvatar avatar={message.user.avatar} name={message.user.name} />
        </div>

        <div>
          <div>{message.user.name}</div>
          <div>
            <Pin className="w-4 h-4 text-primary" />
            &nbsp;Tin ghim
          </div>
        </div>
      </div>
      <div>{children}</div>
      <div className="text-sm text-muted-foreground mt-2">
        {`${dateUtils.compareDate(tempTime, currentTime)
          ? 'Hôm nay'
          : dateUtils.transferDateString(
            time.getDate(),
            time.getMonth(),
            time.getFullYear(),
          )
          } lúc ${time.getHours()} giờ : ${time.getMinutes()} phút `}
      </div>
    </div>
  );
}

export default PinItem;
