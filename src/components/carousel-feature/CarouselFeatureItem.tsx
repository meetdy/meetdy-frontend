import Image from '../ui/image';

interface CarouselFeatureItemProps {
    src?: string;
    title?: string;
    detail?: string;
}

export default function CarouselFeatureItem({
    src = '',
    title = '',
    detail = '',
}: CarouselFeatureItemProps) {
    return (
        <div className="flex flex-col items-center rounded-lg overflow-hidden bg-white">
            <div className="w-full h-40 md:h-48 lg:h-56 bg-gray-100 flex items-center justify-center">
                <Image src={src} alt="" className="w-full h-full object-cover" />
            </div>

            <div className="p-4 space-y-2 text-center">
                <div className="text-lg font-semibold text-gray-800">{title}</div>

                <div className="text-sm text-gray-500">{detail}</div>
            </div>
        </div>
    );
}
