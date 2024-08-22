import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

import { Background } from "./Background";

import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel as CarouselRoot,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { carouselData } from "@/data/data";

type Props = {
  className?: string;
  delay?: number;
  stopOnInteraction?: boolean;
};

export const Carousel = ({
  className,
  delay = 6000,
  stopOnInteraction = true,
}: Props) => {
  const plugin = useRef(Autoplay({ delay, stopOnInteraction }));

  return (
    <CarouselRoot className={className} plugins={[plugin.current]}>
      <CarouselContent>
        {carouselData.map(({ image, title, description }) => (
          <CarouselItem key={image}>
            <Card>
              <CardContent>
                <Background
                  description={description}
                  image={image}
                  title={title}
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
    </CarouselRoot>
  );
};
