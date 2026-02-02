import React, { useMemo, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModalDetailVote from '../../modal/ModalDetailVote';
import ModalViewOption from '@/components/modal-view-options';

type Option = {
  name: string;
  userIds: string[];
};

type VoteData = {
  content: string;
  options: Option[];
};

type Props = {
  data?: VoteData;
};

export default function VoteMessage({
  data = { content: '', options: [] },
}: Props) {
  const [isVisibleDetail, setIsVisibleDetail] = useState(false);
  const [isVisibleOption, setIsVisibleOption] = useState(false);

  const getNumberJoinVote = useMemo(() => {
    const tempUserIds: string[] = [];
    data.options.forEach((option) => {
      option.userIds.forEach((userId) => tempUserIds.push(userId));
    });
    return Array.from(new Set(tempUserIds));
  }, [data]);

  const checkNumberUserSelected = () => {
    return data.options.reduce((acc, o) => acc + o.userIds.length, 0);
  };

  const countingPercent = (amountVote: number) => {
    const total = getNumberJoinVote.length;
    if (!total) return 0;
    return (amountVote / total) * 100;
  };

  return (
    <div className="p-3 rounded-md bg-slate-50">
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-slate-900">{data.content}</h3>

        {getNumberJoinVote.length > 0 && (
          <button
            type="button"
            onClick={() => setIsVisibleDetail(true)}
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
          >
            <span>Đã có {checkNumberUserSelected()} lượt bình chọn</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        <div className="space-y-2">
          {data.options.slice(0, 3).map((ele, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-sm text-slate-700 truncate">
                  {ele.name}
                </div>
                <div className="h-2 mt-1 rounded bg-slate-200 overflow-hidden">
                  <div
                    className="h-full bg-sky-500"
                    style={{ width: `${countingPercent(ele.userIds.length)}%` }}
                  />
                </div>
              </div>
              <div className="text-sm font-semibold text-slate-700">
                {ele.userIds.length}
              </div>
            </div>
          ))}
        </div>

        {data.options.length > 3 && (
          <div className="text-xs text-slate-500">
            * Còn {data.options.length - 3} lựa chọn khác
          </div>
        )}

        <div>
          <Button onClick={() => setIsVisibleOption(true)} className="w-full">
            Xem lựa chọn
          </Button>
        </div>
      </div>

      <ModalDetailVote
        visible={isVisibleDetail}
        onCancel={() => setIsVisibleDetail(false)}
        data={data.options}
      />

      <ModalViewOption
        isModalVisible={isVisibleOption}
        onCancel={() => setIsVisibleOption(false)}
        data={data}
        onShowDetail={() => setIsVisibleDetail(true)}
      />
    </div>
  );
}
