import CarouselFeatureItem from './CarouselFeatureItem';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { useGetInfoWeb } from '@/hooks/info-web/useFetchInfoWeb';

export default function CarouselFeature() {
  const { data } = useGetInfoWeb();

  const features = data.features || [];

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
