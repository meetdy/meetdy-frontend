import { useSelector } from 'react-redux';
import SliderItem from '../SliderItem';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export default function Slider() {
  const { features } = useSelector((state: any) => state.home);

  return (
    <Carousel
      opts={{
        loop: true,
        align: 'start',
      }}
      className="w-full"
    >
      <CarouselContent>
        {features.map((ele: any, index: number) => (
          <CarouselItem key={index} className="basis-full">
            <SliderItem
              src={ele.image}
              title={ele.title}
              detail={ele.descrpition}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
