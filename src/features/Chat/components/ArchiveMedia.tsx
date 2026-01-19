import { useState } from 'react';
import { ChevronDown, Image as ImageIcon, Video } from 'lucide-react';
import ImageItem from './ImageItem';
import ModalVideoCustom from '@/components/modal-video-custom';
import ThumbnailCustom from '@/components/thumbnail-custom';

interface ArchiveMediaProps {
    viewMediaClick?: (type: number, subtype: number) => void;
    name?: string;
    items?: any[];
}

function ArchiveMedia({ viewMediaClick, name = '', items = [] }: ArchiveMediaProps) {
    const [isDrop, setIsDrop] = useState(true);
    const [visible, setVisible] = useState(false);
    const [currentVideo, setCurrentVideo] = useState('');

    const handleOnClick = () => {
        setIsDrop(!isDrop);
    };

    const handleViewAllOnClick = () => {
        if (viewMediaClick) {
            if (name === 'Ảnh') {
                viewMediaClick(2, 1);
            } else if (name === 'Video') {
                viewMediaClick(2, 2);
            }
        }
    };

    const handleVisibleModal = (url: string) => {
        setVisible(true);
        setCurrentVideo(url);
    };

    const handleOnClose = () => {
        setVisible(false);
        setCurrentVideo('');
    };

    const displayItems = items.slice(0, 8);
    const IconComponent = name === 'Video' ? Video : ImageIcon;

    return (
        <div className="border-b border-slate-100">
            <button
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                onClick={handleOnClick}
            >
                <div className="flex items-center gap-2">
                    <IconComponent className="w-4 h-4 text-slate-500" />
                    <span className="font-medium text-sm text-slate-700">{name}</span>
                    {items.length > 0 && (
                        <span className="text-xs text-slate-400">({items.length})</span>
                    )}
                </div>
                <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${!isDrop ? '-rotate-90' : ''}`}
                />
            </button>

            <div
                className={`overflow-hidden transition-all duration-200 ${isDrop ? 'max-h-[400px]' : 'max-h-0'}`}
            >
                {displayItems.length > 0 ? (
                    <>
                        <div className="grid grid-cols-4 gap-1.5 px-4 py-2">
                            {name === 'Video' ? (
                                <>
                                    {displayItems.map((ele, index) => (
                                        <div
                                            key={index}
                                            className="aspect-square rounded-lg overflow-hidden bg-slate-100 hover:opacity-90 transition-opacity cursor-pointer"
                                        >
                                            <ThumbnailCustom
                                                url={ele.content}
                                                onVisibleVideoModal={handleVisibleModal}
                                            />
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <>
                                    {displayItems.map((itemEle, index) => (
                                        <div
                                            key={index}
                                            className="aspect-square rounded-lg overflow-hidden bg-slate-100 hover:opacity-90 transition-opacity cursor-pointer"
                                        >
                                            <ImageItem
                                                width={80}
                                                height={80}
                                                url={itemEle.content}
                                                type="image"
                                                onVisibleVideoModal={handleVisibleModal}
                                            />
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>

                        <div className="px-4 pb-3">
                            <button
                                onClick={handleViewAllOnClick}
                                className="text-sm text-primary font-medium hover:underline"
                            >
                                Xem tất cả {items.length > 8 && `(${items.length})`}
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="px-4 pb-3 text-sm text-slate-400">
                        Chưa có {name.toLowerCase()} nào
                    </div>
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

export default ArchiveMedia;
