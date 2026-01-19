import { useState } from 'react';
import ImageItem from './ImageItem';
import ModalVideoCustom from '@/components/modal-video-custom';
import ThumbnailCustom from '@/components/thumbnail-custom';

interface ContentTabPaneMediaProps {
    items?: any[];
    type?: string;
}

function ContentTabPaneMedia({ items = [], type = 'image' }: ContentTabPaneMediaProps) {
    const [visible, setVisible] = useState(false);
    const [currentVideo, setCurrentVideo] = useState('');

    const handleVisibleModal = (url: string) => {
        setVisible(true);
        setCurrentVideo(url);
    };

    const handleOnClose = () => {
        setVisible(false);
        setCurrentVideo('');
    };

    return (
        <div className="p-4">
            <div className="grid grid-cols-3 gap-2">
                {type === 'video' ? (
                    <>
                        {items.map((ele, index) => (
                            <ThumbnailCustom
                                key={index}
                                url={ele.content}
                                onVisibleVideoModal={handleVisibleModal}
                                height={110}
                                width={110}
                            />
                        ))}
                    </>
                ) : (
                    <>
                        {items.map((itemEle, index) => (
                            <ImageItem
                                key={index}
                                url={itemEle.content}
                                type={type}
                                onVisibleVideoModal={handleVisibleModal}
                            />
                        ))}
                    </>
                )}
            </div>

            <ModalVideoCustom
                isVisible={visible}
                url={currentVideo}
                onClose={handleOnClose}
            />
        </div>
    );
}

export default ContentTabPaneMedia;
