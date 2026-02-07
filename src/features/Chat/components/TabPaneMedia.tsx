import { useState } from 'react';
import fileHelpers from '@/utils/file-utils';
import PersonalAvatar from './PersonalAvatar';
import RangeCalendarCustom from '@/components/range-calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface TabPaneMediaProps {
  members?: any[];
  onQueryChange?: (query: any) => void;
}

function TabPaneMedia({ members = [], onQueryChange }: TabPaneMediaProps) {
  const [sender, setSender] = useState('');
  const [query, setQuery] = useState<any>({});

  const handleChange = (memberId: string) => {
    const index = members.findIndex((memberEle) => memberEle._id === memberId);
    let queryTemp: any = {};

    if (index > -1) {
      setSender(members[index].name);
      queryTemp = {
        ...query,
        senderId: memberId,
      };
      setQuery(queryTemp);
    } else {
      setSender('');
      queryTemp = {
        ...query,
        senderId: '',
      };
      setQuery(queryTemp);
    }

    onQueryChange?.(queryTemp);
  };

  const handleDatePickerChange = (date: any, dateString: [string, string]) => {
    const queryTemp = {
      ...query,
      ...fileHelpers.convertDateStringsToServerDateObject(dateString),
    };
    setQuery({ ...query, ...queryTemp });
    onQueryChange?.(queryTemp);
  };

  return (
    <div className="space-y-3 p-4">
      <Select value={sender} onValueChange={handleChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Người gửi" />
        </SelectTrigger>
        <SelectContent>
          {members.map((memberEle, index) => (
            <SelectItem key={index} value={memberEle._id}>
              <div className="flex items-center gap-2">
                <PersonalAvatar
                  dimension={24}
                  avatar={memberEle.avatar}
                  name={memberEle.name}
                />
                <span>{memberEle.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <RangeCalendarCustom
        style={{ width: '100%' }}
        onChange={handleDatePickerChange}
        allowClear={true}
      />
    </div>
  );
}

export default TabPaneMedia;
