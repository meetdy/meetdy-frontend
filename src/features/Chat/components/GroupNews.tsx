import { BarChart2, Hash } from 'lucide-react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useSelector } from 'react-redux';
import InfoTitle from './InfoTitle';
import ListChannel from './ListChannel';
import TabPaneVote from './TabPaneVote';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GroupNewsProps {
    onBack?: () => void;
    tabActive?: number;
    onChange?: (key: string) => void;
}

function GroupNews({ onBack, tabActive = 0, onChange }: GroupNewsProps) {
    const { channels } = useSelector((state: any) => state.chat);

    const handleChangeActiveKey = (key: string) => {
        onChange?.(key);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="border-b">
                <InfoTitle
                    isBack={true}
                    text="Bảng tin nhóm"
                    onBack={onBack}
                    type="broadcast"
                />
            </div>
            <Scrollbars
                autoHide={true}
                autoHideTimeout={1000}
                autoHideDuration={200}
                style={{
                    width: '100%',
                    height: 'calc(100vh - 68px)',
                }}
            >
                <div className="p-4">
                    <Tabs
                        defaultValue={tabActive.toString()}
                        onValueChange={handleChangeActiveKey}
                    >
                        <TabsList className="w-full grid grid-cols-2">
                            <TabsTrigger value="1" className="flex items-center gap-2">
                                <BarChart2 className="h-4 w-4" />
                                Bình chọn
                            </TabsTrigger>
                            <TabsTrigger value="2" className="flex items-center gap-2">
                                <Hash className="h-4 w-4" />
                                Kênh
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="1">
                            <TabPaneVote />
                        </TabsContent>
                        <TabsContent value="2">
                            <ListChannel data={channels} />
                        </TabsContent>
                    </Tabs>
                </div>
            </Scrollbars>
        </div>
    );
}

export default GroupNews;
