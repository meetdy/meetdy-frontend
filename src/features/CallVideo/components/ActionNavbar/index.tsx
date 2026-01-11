import React from 'react';
import PropTypes from 'prop-types';
import { Video, Mic, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';

ActionNavbar.propTypes = {};

function ActionNavbar({ onToggleVideo, onToggleAudio, onShareScreen }) {
  const handleToggleVideo = () => {
    if (onToggleVideo) onToggleVideo();
  };

  const handleToggleAudio = () => {
    if (onToggleVideo) onToggleAudio();
  };

  const handleShareScreen = () => {
    if (onShareScreen) onShareScreen();
  };

  return (
    <div className="action-navbar flex items-center justify-center gap-3 py-3" style={{ width: '40%', margin: '0 auto' }}>
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggleVideo}
        className="flex items-center gap-2 rounded-xl"
      >
        <Video className="w-4 h-4" />
        <span>Tắt video</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleToggleAudio}
        className="flex items-center gap-2 rounded-xl"
      >
        <Mic className="w-4 h-4" />
        <span>Tắt audio</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={handleShareScreen}
        className="flex items-center gap-2 rounded-xl"
      >
        <Monitor className="w-4 h-4" />
        <span>Share màn hình</span>
      </Button>
    </div>
  );
}

export default ActionNavbar;
