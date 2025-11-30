import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Tag } from 'lucide-react';

import ClassifyApi from '@/api/classifyApi';
import { fetchListClassify } from '@/features/Chat/slice/chatSlice';
import ModalClassify from '@/features/Chat/components/ModalClassify';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

interface SubMenuClassifyProps {
  data: any[];
  idConver: string;
}

export default function SubMenuClassify({
  data,
  idConver,
}: SubMenuClassifyProps) {
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const handleClickClassify = async (id: string) => {
    await ClassifyApi.addClassifyForConversation(id, idConver);
    dispatch(fetchListClassify());
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer font-medium">
          Phân loại
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel className="text-sm font-semibold px-3 py-1">
            Danh sách thẻ
          </DropdownMenuLabel>

          {data.length > 0 &&
            data.map((ele) => (
              <DropdownMenuItem
                key={ele._id}
                onClick={() => handleClickClassify(ele._id)}
                className="cursor-pointer flex items-center gap-2"
              >
                <Tag className="w-4 h-4" style={{ color: ele.color.code }} />
                {ele.name}
              </DropdownMenuItem>
            ))}

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setVisible(true)}
            className="cursor-pointer flex items-center gap-2 font-medium"
          >
            <Tag className="w-4 h-4" /> Quản lý thẻ phân loại
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ModalClassify
        isVisible={visible}
        onCancel={() => setVisible(false)}
        onOpen={() => setVisible(true)}
      />
    </>
  );
}
