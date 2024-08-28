import { CustomCard } from "@/components/home/CustomCard";
import { restaurantInfo } from "@/data/data";

export default function Page({
  params,
}: {
  params: { restaurantsId: string };
}) {
  const restaurant = restaurantInfo.find(
    (restaurant) => restaurant.restaurantsId === params.restaurantsId,
  );
  return (
    <div className="flex justify-center">
      <CustomCard className="w-max" restaurant={restaurant} />
    </div>
  );
}
