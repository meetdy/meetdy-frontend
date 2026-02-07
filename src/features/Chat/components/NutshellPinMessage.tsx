import { useState } from 'react';
import { ChevronDown, MessageSquare, MoreHorizontal } from 'lucide-react';

import { useUnpinMessage } from '@/hooks/message/pin-message';

import TypeMessagePin from './TypeMessagePin';
import ModalDetailMessagePin from './modal/ModalDetailMessagePin';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface NutshellPinMessageProps {
    isItem?: boolean;
    onOpenDrawer?: () => void;
    message: any;
    quantity?: number;
    isHover?: boolean;
}

function NutshellPinMessage({
    isItem = false,
    onOpenDrawer,
    message,
    quantity = 0,
    isHover = true,
}: NutshellPinMessageProps) {
    const { doUnpinMessage } = useUnpinMessage();

    const [visible, setVisible] = useState(false);
    const [confirmUnpin, setConfirmUnpin] = useState(false);

    return (
        <>
            <div
                className={`flex items-center justify-between p-3 rounded-lg transition-colors ${isItem ? 'bg-muted/50' : ''
                    } ${isHover ? 'hover:bg-muted/50' : ''}`}
            >
                <button
                    onClick={() => setVisible(true)}
                    className="flex items-center gap-3 flex-1 text-left"
                >
                    <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                        <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                        <div className="text-xs text-muted-foreground">Tin nhắn</div>
                        <div className="text-sm truncate">
                            <TypeMessagePin
                                name={message.user.name}
                                content={message.content}
                                type={message.type}
                            />
                        </div>
                    </div>
                </button>

                <div className={`flex-shrink-0 ${isItem ? 'hidden' : ''}`}>
                    {isItem ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="h-8 w-8">
                                    <MoreHorizontal className="h-4 w-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => setConfirmUnpin(true)}
                                    className="text-destructive focus:text-destructive"
                                >
                                    Bỏ ghim
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onOpenDrawer}
                            className="text-primary"
                        >
                            {`${quantity} ghim tin khác`}
                            <ChevronDown className="h-4 w-4 ml-1" />
                        </Button>
                    )}
                </div>
            </div>

            <ModalDetailMessagePin
                visible={visible}
                message={message}
                onClose={() => setVisible(false)}
            />

            <AlertDialog open={confirmUnpin} onOpenChange={setConfirmUnpin}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Bỏ ghim</AlertDialogTitle>
                        <AlertDialogDescription>
                            Bạn có chắc muốn bỏ ghim nội dung này không?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Không</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                doUnpinMessage({ messageId: message._id });
                                setConfirmUnpin(false);
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Bỏ ghim
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

export default NutshellPinMessage;
