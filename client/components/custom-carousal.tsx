'use client';
import React, { useEffect, useState } from 'react';
import EmblaCarousel from 'embla-carousel-react';
import { Card, CardBody } from '@nextui-org/card';
import { Image } from '@nextui-org/image';
import { Button } from '@nextui-org/button';

interface CustomCarouselProps {
  images: string[];
}

const CustomCarousel: React.FC<CustomCarouselProps> = ({ images }) => {
  const [emblaRef, emblaApi] = EmblaCarousel({ loop: true });
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (emblaApi) {
      const onSelect = () => setCurrentIndex(emblaApi.selectedScrollSnap());
      emblaApi.on('select', onSelect);
      return () => emblaApi.off('select', onSelect);
    }
  }, [emblaApi]);

  const handlePrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const handleNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {images.map((src, index) => (
            <Card key={index} className="min-w-full flex-shrink-0">
              <CardBody>
                <Image
                  width={400}
                  height={300}
                  className="object-cover rounded-xl"
                  alt={`Carousel Image ${index + 1}`}
                  src={src}
                />
              </CardBody>
            </Card>
          ))}
        </div>
      </div>

      <Button
        onClick={handlePrev}
        className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
      >
        &lt;
      </Button>
      <Button
        onClick={handleNext}
        className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full"
      >
        &gt;
      </Button>
    </div>
  );
};

export default CustomCarousel;
