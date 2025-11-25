import React from 'react';
import { Avatar, Tooltip } from 'antd';
import getSummaryName from '@/utils/nameHelper';

function AvatarCustom(props) {
  const { src = '', name = '', style = {}, color = '#408ec6', ...rest } = props;

  return (
    <>
      {src ? (
        <Avatar {...props} />
      ) : (
        <Tooltip title={name} placement="top">
          <Avatar style={{ backgroundColor: color, ...style }} {...rest}>
            {getSummaryName(name)}
          </Avatar>
        </Tooltip>
      )}
    </>
  );
}

export default AvatarCustom;
