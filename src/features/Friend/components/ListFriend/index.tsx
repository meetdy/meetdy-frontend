import { useState } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import { useDispatch } from 'react-redux';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Modal } from 'antd';

import { toast } from 'sonner';

import friendApi from '@/api/friendApi';
import userApi from '@/api/userApi';
import { fetchFriends } from '../../friendSlice';

import UserCard from '@/components/UserCard';
import FriendItem from '../FriendItem';

function ListFriend({ data }) {
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [userIsFind, setUserIsFind] = useState({});

  const handleOnClickMenu = async (key, id) => {
    if (key === '2') {
      confirm(id);
    } else {
      setIsVisible(true);
      const tempUser = data.find((ele) => ele._id === id);
      const realUser = await userApi.getUser(tempUser.username);
      setUserIsFind(realUser);
    }
  };

  const handleCancelModalUserCard = () => {
    setIsVisible(false);
  };

  const handleOkModal = async (id) => {
    try {
      await friendApi.deleteFriend(id);
      dispatch(fetchFriends());
      toast.success('Xóa thành công');
      setIsVisible(false);
    } catch (error) {
      toast.error('Xóa thất bại');
    }
  };

  const handleOnDeleteFriend = (id) => {
    setIsVisible(true);
    confirm(id);
  };

  function confirm(id) {
    Modal.confirm({
      title: 'Xác nhận',
      icon: <ExclamationCircleOutlined />,
      content: (
        <span>
          Bạn có thực sự muốn xóa{' '}
          <b>{data.find((ele) => ele._id === id).name}</b> khỏi danh sách bạn bè{' '}
        </span>
      ),
      okText: 'Xóa',
      cancelText: 'Hủy',
      onOk: () => handleOkModal(id),
    });
  }

  return (
    <Scrollbars
      autoHide={true}
      autoHideTimeout={1000}
      autoHideDuration={200}
      style={{ height: '100%', width: '100%' }}
    >
      {data.length > 0 &&
        data.map((e, index) => {
          return (
            <FriendItem key={index} data={e} onClickMenu={handleOnClickMenu} />
          );
        })}

      <UserCard
        user={userIsFind}
        isVisible={isVisible}
        onCancel={handleCancelModalUserCard}
      />
    </Scrollbars>
  );
}

export default ListFriend;
