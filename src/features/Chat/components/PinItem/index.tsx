import React from 'react';
import PropTypes from 'prop-types';

import PersonalIcon from '../PersonalIcon';
import { Pin } from 'lucide-react';
import dateUtils from '@/utils/dateUtils';

PinItem.propTypes = {
  message: PropTypes.object,
};

PinItem.defaultProps = {
  message: {},
};

function PinItem({ children, message }) {
  const time = new Date(message.createdAt);
  const tempTime = new Date(message.createdAt);
  const currentTime = new Date();

  return (
    <div className="pin-item">
      <div className="pin-item_top">
        <div className="pin-item_avatar">
          <PersonalIcon avatar={message.user.avatar} name={message.user.name} />
        </div>

        <div className="pin-item_info">
          <div className="pin-item_name">{message.user.name}</div>

          <div className="pin-item_icon">
            <Pin className="w-4 h-4 text-primary" />
            &nbsp;Tin ghim
          </div>
        </div>
      </div>
      <div className="pin-item_body">{children}</div>
      <div className="pin-item_bottom">
        {`${
          dateUtils.compareDate(tempTime, currentTime)
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
