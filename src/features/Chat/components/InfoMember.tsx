import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ChevronDown, Copy, Link, Lock, Unlock, Users } from 'lucide-react';
import { toast } from 'sonner';

import conversationApi from '@/api/conversationApi';
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
import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

interface InfoMemberProps {
    viewMemberClick?: (type: number) => void;
    quantity: number;
}

function InfoMember({ viewMemberClick, quantity }: InfoMemberProps) {
    const [isDrop, setIsDrop] = useState(true);
    const { currentConversation, conversations } = useSelector(
        (state: any) => state.chat,
    );
    const [status, setStatus] = useState(false);
    const { user } = useSelector((state: any) => state.global);
    const [checkLeader, setCheckLeader] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    useEffect(() => {
        const convo = conversations.find((ele: any) => ele._id === currentConversation);
        if (convo) {
            setStatus(convo.isJoinFromLink);
            setCheckLeader(convo.leaderId === user._id);
        }
    }, [currentConversation, conversations, user._id]);

    const handleOnClick = () => {
        setIsDrop(!isDrop);
    };

    const handleViewAll = () => {
        viewMemberClick?.(1);
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(
            `${import.meta.env.VITE_API_URL}/jf-link/${currentConversation}`,
        );
        toast.info('Đã sao chép link');
    };

    const handleChangeStatus = async () => {
        try {
            await conversationApi.changeStatusForGroup(
                currentConversation,
                !status,
            );
            setStatus(!status);
            toast.success('Cập nhật thành công');
        } catch (error) {
            toast.error('Cập nhật thất bại');
        }
        setShowConfirm(false);
    };

    return (
        <div className="border-b border-slate-100">
            <button
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                onClick={handleOnClick}
            >
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span className="font-medium text-sm text-slate-700">Thành viên</span>
                    <span className="text-xs text-slate-400">({quantity})</span>
                </div>
                <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${!isDrop ? '-rotate-90' : ''}`}
                />
            </button>

            <div className={`overflow-hidden transition-all duration-200 ${isDrop ? 'max-h-96' : 'max-h-0'}`}>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
                    onClick={handleViewAll}
                >
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Users className="h-4 w-4 text-primary" />
                    </div>
                    <div className="text-left">
                        <span className="text-sm font-medium text-slate-700">Xem tất cả thành viên</span>
                        <p className="text-xs text-slate-400">{quantity} người</p>
                    </div>
                </button>

                <div className="flex items-center gap-3 px-4 py-3">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                        <Link className="h-4 w-4 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-700">Link tham gia</div>
                        <div className="text-xs text-slate-400 truncate">
                            {`${import.meta.env.VITE_API_URL}/jf-link/${currentConversation}`}
                        </div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-lg"
                                    onClick={handleCopyLink}
                                >
                                    <Copy className="h-4 w-4 text-slate-500" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>Sao chép link</TooltipContent>
                        </Tooltip>

                        {checkLeader && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={`h-8 w-8 rounded-lg ${status ? 'text-green-600 hover:text-green-700' : 'text-red-500 hover:text-red-600'}`}
                                        onClick={() => setShowConfirm(true)}
                                    >
                                        {status ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    {status ? 'Tắt link tham gia' : 'Bật link tham gia'}
                                </TooltipContent>
                            </Tooltip>
                        )}
                    </div>
                </div>
            </div>

            <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Xác nhận thay đổi</AlertDialogTitle>
                        <AlertDialogDescription>
                            {status
                                ? 'Sau khi tắt, người dùng sẽ không thể tham gia nhóm bằng link nữa.'
                                : 'Sau khi bật, bất kỳ ai có link đều có thể tham gia nhóm.'}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="rounded-xl">Hủy</AlertDialogCancel>
                        <AlertDialogAction onClick={handleChangeStatus} className="rounded-xl">
                            Xác nhận
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}

export default InfoMember;
