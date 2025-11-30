import { useState } from 'react';
import { Col, Row } from 'antd';

import SuggestCard from '../SuggestCard';
import UserCard from '@/components/UserCard';

function SuggestList({ data = [] }) {
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState({});

  const handleOnClick = (value) => {
    setUser(value);
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  return (
    <div id="suggest_list">
      <UserCard user={user} isVisible={visible} onCancel={handleCancel} />

      <Row gutter={[16, 16]}>
        {data.map((ele, index) => {
          if (ele.status === 'NOT_FRIEND') {
            return (
              <Col
                span={6}
                xl={{ span: 6 }}
                lg={{ span: 8 }}
                md={{ span: 12 }}
                sm={{ span: 12 }}
                xs={{ span: 24 }}
              >
                <SuggestCard data={ele} key={index} onClick={handleOnClick} />
              </Col>
            );
          }
        })}
      </Row>
    </div>
  );
}

export default SuggestList;
