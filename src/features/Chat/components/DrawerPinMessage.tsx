import { ChevronUp, ChevronDown } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import NutshellPinMessage from './NutshellPinMessage';

interface DrawerPinMessageProps {
    isOpen: boolean;
    onClose: () => void;
    message: any[];
}

function DrawerPinMessage({ isOpen, onClose, message }: DrawerPinMessageProps) {
    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent side="top" className="p-0">
                <div className="flex flex-col">
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
                        <span className="font-medium text-sm">
                            Danh sách ghim ({message.length})
                        </span>
                        <button
                            onClick={onClose}
                            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Thu gọn
                            <ChevronUp className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="max-h-64 overflow-y-auto p-2 space-y-2">
                        {message.map((ele, index) => (
                            <NutshellPinMessage key={index} message={ele} isItem={true} />
                        ))}
                    </div>

                    <button
                        onClick={onClose}
                        className="flex items-center justify-center py-2 border-t hover:bg-muted/50 transition-colors"
                    >
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </button>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default DrawerPinMessage;
