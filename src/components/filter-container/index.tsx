import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ConverMultiSearch from './ConverMultiSearch';
import ConverPersonalSearch from './ConverPersonalSearch';

interface FilterContainerProps {
  dataMulti?: any[];
  dataSingle?: any[];
}

function FilterContainer({ dataMulti = [], dataSingle = [] }: FilterContainerProps) {
  return (
    <div className="w-full">
      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="personal">Cá nhân</TabsTrigger>
          <TabsTrigger value="group">Nhóm</TabsTrigger>
        </TabsList>
        <TabsContent value="personal" className="mt-2">
          <ConverPersonalSearch data={dataSingle} />
        </TabsContent>
        <TabsContent value="group" className="mt-2">
          <ConverMultiSearch data={dataMulti} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default FilterContainer;
