import { useEffect, useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useSelector } from 'react-redux';
import { ArrowLeft, Image, Video, FileText } from 'lucide-react';
import MediaService from '@/api/mediaApi';
import ContentTabPaneFile from './ContentTabPaneFile';
import ContentTabPaneMedia from './ContentTabPaneMedia';
import TabPaneMedia from './TabPaneMedia';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';


const getTypeWithTabPane = (value: number) => {
    if (value === 1) return 'IMAGE';
    if (value === 2) return 'VIDEO';
    if (value === 3) return 'FILE';
    return 'IMAGE';
};

const getType = (key: string) => {
    if (key === '2') return 'VIDEO';
    if (key === '3') return 'FILE';
    return 'IMAGE';
};

interface InfoMediaSearchProps {
    onBack?: (value?: any) => void;
    tabpane: number;
}

function InfoMediaSearch({ onBack, tabpane }: InfoMediaSearchProps) {
    const [activeKey, setActiveKey] = useState(tabpane.toString());
    const { memberInConversation, currentConversation } = useSelector(
        (state: any) => state.chat,
    );
    const [medias, setMedias] = useState<any[]>([]);



    const [query, setQuery] = useState<any>({
        conversationId: currentConversation,
        type: getTypeWithTabPane(tabpane),
    });

    const handleOnBack = (value?: any) => {
        onBack?.(value);
    };

    const handleChangeTab = (key: string) => {
        setQuery({ ...query, type: getType(key), senderId: '' });
        setActiveKey(key);
    };

    const handleQueryChange = async (queryResult: any) => {
        setQuery({ ...query, ...queryResult });
    };



    useEffect(() => {
        const fetchMedia = async () => {
            const mediasResult = await MediaService.getAllMedia({
                conversationId: query.conversationId,
                type: query.type,
                senderId: query.senderId,
                startTime: query.startTime,
                endTime: query.endTime,
            });
            setMedias(mediasResult);
        };
        fetchMedia();
    }, [query]);

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOnBack()}
                    className="h-8 w-8 rounded-lg hover:bg-slate-100"
                >
                    <ArrowLeft className="w-4 h-4 text-slate-600" />
                </Button>
                <h3 className="font-semibold text-slate-900">Kho lưu trữ</h3>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                <Tabs value={activeKey} onValueChange={handleChangeTab} className="flex-1 flex flex-col">
                    <div className="px-4 pt-3">
                        <TabsList className="w-full grid grid-cols-3 h-10 rounded-md bg-slate-100/80 p-1">
                            <TabsTrigger
                                value="1"
                                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-1.5"
                            >
                                <Image className="w-4 h-4" />
                                <span>Ảnh</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="2"
                                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-1.5"
                            >
                                <Video className="w-4 h-4" />
                                <span>Video</span>
                            </TabsTrigger>
                            <TabsTrigger
                                value="3"
                                className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm flex items-center gap-1.5"
                            >
                                <FileText className="w-4 h-4" />
                                <span>File</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="px-4 py-3 border-b border-slate-100">
                        <TabPaneMedia
                            members={memberInConversation}
                            onQueryChange={handleQueryChange}
                        />
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <Scrollbars
                            autoHide
                            autoHideTimeout={1000}
                            autoHideDuration={200}
                            style={{ width: '100%', height: '100%' }}
                        >
                            <div className="p-4">
                                {activeKey === '1' && (
                                    <ContentTabPaneMedia items={medias} type="image" />
                                )}
                                {activeKey === '2' && (
                                    <ContentTabPaneMedia items={medias} type="video" />
                                )}
                                {activeKey === '3' && <ContentTabPaneFile items={medias} />}

                                {medias.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                                        {activeKey === '1' && <Image className="w-12 h-12 mb-3 opacity-50" />}
                                        {activeKey === '2' && <Video className="w-12 h-12 mb-3 opacity-50" />}
                                        {activeKey === '3' && <FileText className="w-12 h-12 mb-3 opacity-50" />}
                                        <p className="text-sm">Không có dữ liệu</p>
                                    </div>
                                )}
                            </div>
                        </Scrollbars>
                    </div>
                </Tabs>
            </div>
        </div>
    );
}

export default InfoMediaSearch;
