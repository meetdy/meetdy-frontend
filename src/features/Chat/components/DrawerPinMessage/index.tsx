import { useRef } from 'react';
import { Drawer } from 'antd';

import DrawerPinMessageStyle from './DrawerPinMessageStyle';
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons';
import NutshellPinMessage from '../NutshellPinMessage/NutshellPinMessage';

const DrawerPinMessageStyle = {
  BODY_STYLE: {
    minHeight: '5rem',
  },
  WRAPPER_STYLE: {
    padding: 0,
  },
  HEIGHT: '50px',
};

function DrawerPinMessage({ isOpen, onClose, message }) {
  const handlViewNews = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleOnCloseDrawer = () => {
    if (onClose) {
      onClose();
    }
  };
  const myElem = useRef();

  return (
    <div id="drawer-pin">
      <div id="drawer-container" ref={myElem}>
        <Drawer
          onClose={handleOnCloseDrawer}
          visible={isOpen}
          placement="top"
          closable={false}
          getContainer={() => myElem.current}
          style={{ position: 'absolute', overflow: 'hidden' }}
          bodyStyle={DrawerPinMessageStyle.WRAPPER_STYLE}
        >
          <div className="drawer-header">
            <div className="drawer-header-title">
              {`Danh sách ghim (${message.length})`}
            </div>

            <div
              className="drawer-header-collapse"
              onClick={handleOnCloseDrawer}
            >
              Thu gọn <CaretUpOutlined />
            </div>
          </div>

          <div className="drawer-body">
            {message.map((ele, index) => (
              <NutshellPinMessage key={index} message={ele} isItem={true} />
            ))}
          </div>

          <div className="drawer-footer" onClick={handlViewNews}>
            <CaretDownOutlined />
          </div>
        </Drawer>
      </div>
    </div>
  );
}

export default DrawerPinMessage;
