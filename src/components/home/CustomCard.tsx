import { cn } from "@/lib/utils";
import { Card, CardContent, CardTitle } from "../ui/card";
import Image from "next/image";

export const CustomCard = ({
  restaurant,
  className,
}: {
  restaurant: any;
  className?: string;
}) => (
  <Card
    key={restaurant.restaurantsId}
    className={cn(
      "relative flex cursor-pointer justify-center border-none shadow-none transition-opacity hover:opacity-90",
      className,
    )}
  >
    <CardTitle className="absolute bottom-10 text-3xl text-white">
      {restaurant.name}
    </CardTitle>
    <Image
      alt={restaurant.name}
      className="h-[360px] w-full rounded-md"
      src={restaurant.heroImgUrl}
      width={500}
      height={360}
    />
    <CardContent className="absolute bottom-0 flex w-full flex-col justify-between bg-white py-4">
      <p className="font-semibold">
        Visite guidée de la Tour Eiffel en ascenseur avec sommet en option{" "}
      </p>
      <span className="text-muted">à partir de 42€ par adulte</span>
    </CardContent>
  </Card>
);
