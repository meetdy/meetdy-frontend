import React, { useEffect, useRef, useState } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Modal, Input, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import ConversationAvatar from '../ConversationAvatar';
import UploadAvatar from '@/components/UploadAvatar';
import conversationApi from '@/api/conversationApi';
import { updateNameOfConver } from '@/features/Chat/slice/chatSlice';

import type { RootState, AppDispatch } from '@/store';

type Props = {
  conversation?: {
    _id?: string;
    name?: string;
    avatar?: string | File;
    type?: string;
    totalMembers?: number;
    avatarColor?: string;
  };
};

export default function InfoNameAndThumbnail({ conversation = {} }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentConversation } = useSelector((state: RootState) => state.chat);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [value, setValue] = useState<string>('');
  const refInitValue = useRef<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isClear, setIsClear] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    if (conversation?.type) {
      setValue(conversation?.name ?? '');
      refInitValue.current = conversation?.name ?? '';
    } else {
      setValue(conversation?.name ?? '');
      refInitValue.current = conversation?.name ?? '';
    }

    if (isModalVisible) {
      setIsClear(false);
    }
    // reset file when conversation changes
    setFile(null);
  }, [conversation, isModalVisible]);

  const handleOnClick = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFile(null);
    setIsClear(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleGetfile = (f: File | null) => {
    setFile(f);
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      // change name if changed
      if (refInitValue.current !== value && value.trim().length > 0) {
        await conversationApi.changeNameConversation(
          currentConversation,
          value,
        );
        dispatch(
          updateNameOfConver({
            conversationId: currentConversation,
            conversationName: value,
          }),
        );
      }

      // change avatar if present
      if (file) {
        const frmData = new FormData();
        frmData.append('file', file);
        await conversationApi.changeAvatarGroup(currentConversation, frmData);
      }

      message.success('Cập nhật thông tin thành công');
    } catch (error) {
      // silent fail as before
    } finally {
      setConfirmLoading(false);
      setIsModalVisible(false);
    }
  };

  return (
    <div className="info_name-and-thumbnail">
      <Modal
        title="Cập nhật cuộc trò chuyện"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Thay đổi"
        cancelText="Hủy"
        closable={false}
        confirmLoading={confirmLoading}
        okButtonProps={{
          disabled:
            (refInitValue?.current === value && !file) ||
            value.trim().length === 0,
        }}
      >
        <div className="update-profile_wrapper">
          <div className="update-profile_upload">
            <UploadAvatar
              avatar={
                typeof conversation?.avatar === 'string'
                  ? conversation?.avatar
                  : ''
              }
              getFile={handleGetfile}
              isClear={isClear}
            />
          </div>

          <div className="update-profile_input">
            <Input
              placeholder="Nhập tên mới"
              onChange={handleInputChange}
              value={value}
            />
          </div>
        </div>
      </Modal>

      <div className="info-thumbnail">
        <ConversationAvatar
          isGroupCard={true}
          totalMembers={conversation?.totalMembers}
          type={conversation?.type}
          avatar={conversation?.avatar}
          name={conversation?.name}
          avatarColor={conversation?.avatarColor}
        />
      </div>

      <div className="info-name-and-button">
        <div className="info-name">
          <span>{conversation?.name}</span>
        </div>

        {conversation?.type && (
          <div className="info-button">
            <EditOutlined onClick={handleOnClick} />
          </div>
        )}
      </div>
    </div>
  );
}
