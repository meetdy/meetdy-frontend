import { Gift } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ListSticker from './ListSticker';

interface StickerProps {
  data?: any[];
  onClose?: () => void;
  onScroll?: () => void;
}

function Sticker({ data = [], onClose, onScroll }: StickerProps) {
  const handleOnClose = () => {
    onClose?.();
  };

  return (
    <div className="w-80 bg-background rounded-lg border shadow-lg">
      <Tabs defaultValue="sticker" className="w-full">
        <TabsList className="w-full rounded-none border-b bg-transparent h-auto p-0">
          <TabsTrigger
            value="sticker"
            className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent py-3"
          >
            <Gift className="h-4 w-4 mr-2" />
            STICKER
          </TabsTrigger>
        </TabsList>
        <TabsContent value="sticker" className="p-0 m-0">
          <ListSticker
            data={data}
            onClose={handleOnClose}
            onScroll={onScroll}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Sticker;
