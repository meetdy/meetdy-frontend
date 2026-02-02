import AvatarCustom from '@/components/avatar-custom';

function LastView({ lastView = [] }: any) {
    const displayCount = Math.min(lastView.length, 5);
    const extraCount = lastView.length - displayCount;

    return (
        <div className="flex items-center -space-x-1">
            {lastView.slice(0, displayCount).map((ele: any, index: number) => (
                <div
                    key={index}
                    className="relative inline-block ring-2 ring-background rounded-full"
                >
                    <AvatarCustom src={ele.avatar} name={ele.name} size={16} />
                </div>
            ))}
            {extraCount > 0 && (
                <div className="relative flex items-center justify-center w-4 h-4 text-xs font-medium text-orange-600 bg-orange-100 rounded-full ring-2 ring-background">
                    +{extraCount}
                </div>
            )}
        </div>
    );
}

export default LastView;
