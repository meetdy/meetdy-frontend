import React, { JSX } from 'react';
import ModalVideo from 'react-modal-video';
interface ModalVideoCustomProps {
  isVisible?: boolean;
  url?: string;
  onClose?: (() => void) | null;
}

function ModalVideoCustom({
  isVisible = false,
  url = '',
  onClose = null,
}: ModalVideoCustomProps): JSX.Element {
  const handleOnClose = () => {
    if (onClose) {
      onClose();
    }
  };
  return (
    <React.Fragment>
      <ModalVideo
        channel="custom"
        autoplay
        url={url}
        isOpen={isVisible}
        onClose={handleOnClose}
        animationSpeed
        ratio="16:9"
      />
    </React.Fragment>
  );
}

export default ModalVideoCustom;
