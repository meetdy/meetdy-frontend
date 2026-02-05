import { JSX, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { ChevronRight, MinusCircle, Plus } from 'lucide-react';

import voteApi from '@/api/voteApi';
import PersonalAvatar from '@/features/Chat/components/PersonalAvatar';

import { isEqual } from 'lodash';

type OptionItem = {
  name: string;
  userIds: string[];
};

type DataType = {
  _id?: string;
  content?: string;
  user?: { name?: string };
  options: OptionItem[];
};

type Props = {
  isModalVisible: boolean;
  onCancel?: () => void;
  data: DataType;
  onShowDetail?: () => void;
};

export default function ModalViewOption({
  isModalVisible,
  onCancel,
  data,
  onShowDetail,
}: Props): JSX.Element {
  const preValue = useRef<string[] | undefined>(undefined);
  const { memberInConversation } = useSelector(
    (state: any) => state.chat || {},
  );
  const { user } = useSelector((state: any) => state.global || {});

  const [infoVote, setInfoVote] = useState<DataType>(data);
  const [checkList, setCheckList] = useState<string[]>([]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [newOptions, setNewOptions] = useState<
    { name: string; checkbox: boolean }[]
  >([]);

  useEffect(() => {
    setInfoVote(data);
  }, [data]);

  useEffect(() => {
    if (isModalVisible) {
      preValue.current = getDefaultValues();
      setCheckList(getDefaultValues());
      setNewOptions([]);
    } else {
      setNewOptions([]);
    }
  }, [isModalVisible]);

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const handleShowDetail = () => {
    if (onShowDetail) onShowDetail();
  };

  const getDefaultValues = (): string[] => {
    const temp: string[] = [];
    (infoVote?.options || []).forEach((option) => {
      option.userIds.forEach((userId) => {
        if (userId === user?._id) temp.push(option.name);
      });
    });
    return temp;
  };

  const handleCheckboxChange = (optionName: string, checked: boolean) => {
    const next = checked
      ? [...checkList, optionName]
      : checkList.filter((v) => v !== optionName);
    setCheckList(next);

    const tempOptions = (infoVote.options || []).map((ele) => {
      const filtered = ele.userIds.filter((uid) => uid !== user?._id);
      return { ...ele, userIds: filtered };
    });

    const options = tempOptions.map((optionEle) => {
      if (next.includes(optionEle.name)) {
        const userIds = [...optionEle.userIds];
        if (!userIds.includes(user?._id)) userIds.push(user?._id);
        return { ...optionEle, userIds };
      }
      return optionEle;
    });

    setInfoVote({ ...infoVote, options });
  };

  const countingPercent = (amountVote: number) => {
    const total = getNumberJoinVote().length;
    const result = (amountVote / total) * 100;
    if (isNaN(result)) return 0;
    return result;
  };

  const getNumberJoinVote = () => {
    const tempUserIds: string[] = [];
    (infoVote.options || []).forEach((option) => {
      option.userIds.forEach((userId) => tempUserIds.push(userId));
    });
    const uniqueUser = tempUserIds.filter(
      (c, index) => tempUserIds.indexOf(c) === index,
    );
    return uniqueUser;
  };

  const getNumberVotes = () => {
    const amount = (infoVote.options || []).reduce((pre, cur) => {
      const amoutnPre = pre.userIds?.length || 0;
      const amountCur = cur.userIds.length || 0;
      return amoutnPre + amountCur;
    });
    return amount || 0;
  };

  const addNewOption = () => {
    setNewOptions((s) => [...s, { name: '', checkbox: false }]);
  };

  const removeNewOption = (index: number) => {
    setNewOptions((s) => s.filter((_, i) => i !== index));
  };

  const updateNewOption = (
    index: number,
    patch: Partial<{ name: string; checkbox: boolean }>,
  ) => {
    setNewOptions((s) =>
      s.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    );
  };

  const validateNewOptions = (): { valid: boolean; message?: string } => {
    const existingNames = (infoVote.options || []).map((o) =>
      o.name.toLowerCase(),
    );
    const seen = new Set<string>();
    for (const opt of newOptions) {
      const name = (opt.name || '').trim();
      if (!name) return { valid: false, message: 'Nhập thông tin lựa chọn' };
      const lower = name.toLowerCase();
      if (existingNames.includes(lower))
        return { valid: false, message: 'Các lựa chọn không được trùng nhau' };
      if (seen.has(lower))
        return { valid: false, message: 'Các lựa chọn không được trùng nhau' };
      seen.add(lower);
    }
    return { valid: true };
  };

  const handleOk = async () => {
    if (!infoVote?._id) return;
    const validation = validateNewOptions();
    if (!validation.valid) {
      window.alert(validation.message || 'Validation failed');
      return;
    }

    setConfirmLoading(true);
    try {
      if (preValue.current && !isEqual(preValue.current, checkList)) {
        await voteApi.deleteSelect(infoVote._id, preValue.current || []);
        await voteApi.selectVote(infoVote._id, checkList);
        window.alert('Cập nhật lựa chọn thành công');
      }

      if (newOptions.length > 0) {
        const newField = newOptions.map((ele) => ele.name.trim());
        const tempSelect = newOptions.filter((ele) => ele.checkbox === true);
        const realSelect = tempSelect.map((ele) => ele.name.trim());

        await voteApi.addVote(infoVote._id, newField);
        if (realSelect.length > 0)
          await voteApi.selectVote(infoVote._id, realSelect);
        window.alert('Thêm lựa chọn thành công');
      }

      handleCancel();
    } catch (error) {
      window.alert('Đã có lỗi xảy ra');
    } finally {
      setConfirmLoading(false);
    }
  };

  const footer = (
    <div className="flex justify-end space-x-2">
      <button
        type="button"
        onClick={handleCancel}
        className="py-1 px-3 rounded-md bg-white border border-neutral-200 text-sm"
      >
        Hủy
      </button>
      <button
        type="button"
        onClick={handleOk}
        className="py-1 px-4 rounded-md bg-primary-600 text-white text-sm disabled:opacity-60 flex items-center gap-2"
        disabled={confirmLoading}
      >
        {confirmLoading && (
          <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        )}
        <span>Xác nhận</span>
      </button>
    </div>
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${isModalVisible ? '' : 'pointer-events-none'
        }`}
      aria-hidden={!isModalVisible}
    >
      <div
        className={`fixed inset-0 bg-black/40 transition-opacity ${isModalVisible ? 'opacity-100' : 'opacity-0'
          }`}
        onClick={handleCancel}
      />
      <div
        className={`relative w-full max-w-2xl mx-auto bg-white rounded-lg overflow-hidden transform transition-all ${isModalVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        style={{ padding: '2rem 1rem', background: '#f4f5f7' }}
      >
        <div className="modal-view-option">
          <div className="modal-view-option_title mb-4">
            <h3 className="text-lg font-semibold">{infoVote?.content}</h3>
            <small className="text-sm text-muted-foreground">
              Tạo bởi <strong>{infoVote?.user?.name}</strong> - Hôm qua
            </small>
          </div>

          {+getNumberVotes() > 0 && (
            <p
              className="overview-text text-sm text-primary-600 cursor-pointer flex items-center gap-2"
              onClick={handleShowDetail}
            >
              <span>{`${getNumberJoinVote().length
                } người tham gia ${getNumberVotes()} lượt bình chọn`}</span>
              <ChevronRight className="w-4 h-4" />
            </p>
          )}

          <div className="mt-4">
            {(infoVote.options || []).map((ele, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 p-3 rounded-md hover:bg-gray-50"
              >
                <div className="flex items-start gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-100">
                    <PersonalAvatar
                      name={
                        memberInConversation &&
                          ele.userIds &&
                          ele.userIds.length > 0
                          ? (memberInConversation.find(
                            (m: any) => m._id === ele.userIds[0],
                          )?.name as string)
                          : undefined
                      }
                      avatar={
                        memberInConversation &&
                          ele.userIds &&
                          ele.userIds.length > 0
                          ? (memberInConversation.find(
                            (m: any) => m._id === ele.userIds[0],
                          )?.avatar as string)
                          : undefined
                      }
                      dimension={32}
                      color={
                        memberInConversation &&
                          ele.userIds &&
                          ele.userIds.length > 0
                          ? (memberInConversation.find(
                            (m: any) => m._id === ele.userIds[0],
                          )?.avatarColor as string)
                          : undefined
                      }
                    />
                  </div>

                  <div>
                    <div className="text-sm">
                      {ele.name}
                    </div>
                    <strong className="text-sm ml-1">
                      {ele.userIds.length}
                    </strong>
                    <div
                      className="h-2 bg-primary-200 rounded mt-2"
                      style={{
                        width: `${countingPercent(ele.userIds.length)}%`,
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {ele.userIds.length > 0 && memberInConversation.length > 0
                      ? ele.userIds.map((uid, i) => {
                        const u = memberInConversation.find(
                          (m: any) => m._id === uid,
                        );
                        if (u) {
                          return (
                            <div
                              key={i}
                              className="z-10"
                              style={{ marginLeft: i === 0 ? 0 : -8 }}
                            >
                              <PersonalAvatar
                                name={u.name}
                                avatar={u.avatar}
                                dimension={32}
                                color={u.avatarColor}
                              />
                            </div>
                          );
                        }
                        return (
                          <div
                            key={i}
                            className="z-10"
                            style={{ marginLeft: i === 0 ? 0 : -8 }}
                          >
                            <PersonalAvatar noneUser={true} dimension={32} />
                          </div>
                        );
                      })
                      : null}
                    {ele.userIds.length > 1 && (
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-neutral-100 text-xs text-neutral-700">
                        +{Math.max(0, ele.userIds.length - 3)}
                      </div>
                    )}
                  </div>

                  <label className="ml-3 inline-flex items-center">
                    <input
                      type="checkbox"
                      value={ele.name}
                      checked={checkList.includes(ele.name)}
                      onChange={(e) =>
                        handleCheckboxChange(ele.name, e.target.checked)
                      }
                      className="h-4 w-4 text-primary-600 accent-primary-600"
                    />
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="modal-view-option_add mt-6">
            <div className="space-y-3">
              {newOptions.map((field, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={field.checkbox}
                      onChange={(e) =>
                        updateNewOption(idx, { checkbox: e.target.checked })
                      }
                      className="h-4 w-4 text-primary-600 accent-primary-600 mr-2"
                    />
                  </label>
                  <input
                    value={field.name}
                    onChange={(e) =>
                      updateNewOption(idx, { name: e.target.value })
                    }
                    placeholder={`Lựa chọn ${((infoVote && infoVote.options?.length) || 0) + idx + 1
                      }`}
                    className="flex-1 px-3 py-2 border border-neutral-200 rounded-md bg-white"
                    spellCheck={false}
                  />
                  <button
                    type="button"
                    onClick={() => removeNewOption(idx)}
                    className="p-2 text-neutral-500"
                  >
                    <MinusCircle className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <div>
                <button
                  type="button"
                  onClick={addNewOption}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-md border border-neutral-200 bg-white text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Thêm lựa chọn</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">{footer}</div>
        </div>
      </div>
    </div>
  );
}
