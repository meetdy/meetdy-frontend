import { useSelector } from 'react-redux';
import CarouselFeatureItem from './CarouselFeatureItem';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';

export default function CarouselFeature() {
  const { features } = useSelector((state) => state.home);

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
            <CarouselFeatureItem
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
