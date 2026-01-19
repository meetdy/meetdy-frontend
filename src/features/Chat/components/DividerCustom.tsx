type Props = {
    dateString: Date;
};

function DividerCustom({ dateString }: Props) {
    const date = new Date(dateString);
    const currentDate = new Date();

    const isToday = date.toDateString() === currentDate.toDateString();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const formatTime = () => {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const formatDate = () => {
        if (isToday) {
            return 'Hôm nay';
        }
        if (isYesterday) {
            return 'Hôm qua';
        }
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <div className="flex items-center gap-4 py-4 px-2">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-100/80 rounded-full">
                <span className="text-xs font-medium text-slate-600">
                    {formatDate()}
                </span>
                <span className="w-1 h-1 rounded-full bg-slate-300" />
                <span className="text-xs text-slate-500">
                    {formatTime()}
                </span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        </div>
    );
}

export default DividerCustom;
