import { Tabs } from 'antd';

import ConverMultiSearch from '@/components/ConverMultiSearch';
import ConverPersonalSearch from '@/components/ConverPersonalSearch';

function FilterContainer({ dataMulti = [], dataSingle = [] }) {
  const { TabPane } = Tabs;

  return (
    <div className="filter-container">
      <Tabs defaultActiveKey="1">
        <TabPane tab="Cá nhân" key="1">
          <ConverPersonalSearch data={dataSingle} />
        </TabPane>
        <TabPane tab="Nhóm" key="2">
          <ConverMultiSearch data={dataMulti} />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default FilterContainer;
