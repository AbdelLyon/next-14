"use client";
import { Search } from "lucide-react";
// @ts-ignoreimport { useState } from "react";
import { GetCity, GetState } from "react-country-state-city";
import { useEffect } from "react";

import Container from "@/components/ui/container";
import { Title } from "@/components/ui/title";
import { Navigation } from "@/components/navigation/HomeNav";
import { Button } from "@/components/ui/button";
import { restaurantInfo } from "@/data/data";
import "react-country-state-city/dist/react-country-state-city.css";
import { useNavigation } from "@/hooks/useNavigation";
import { SkeletonCard } from "./SkeletonCard";
import { CustomCard } from "./CustomCard";
import Link from "next/link";

export const Home = () => {
  const { navItemsHomePage } = useNavigation();
  // const {data} = useQuery({
  //   queryKey: ["restaurants"],
  //   request: fetchRestaurants,
  //   search: {
  //     enabled: false,
  //   },
  // });

  // const { data } = useQuery({
  //   queryKey: ["geo"],
  //   request: fetchGeo,
  //   search: {
  //     enabled: false,
  //   },
  // });

  // console.log(data);

  useEffect(() => {
    GetCity(65, 3235).then((result: any) => {
      console.log(result);
    });
  }, []);
  useEffect(() => {
    GetState(65).then((result: any) => {
      console.log(result);
    });
  }, []);

  return (
    <Container>
      <div className="mx-auto flex w-3/6 flex-col justify-center">
        <Title className="mb-4 text-center text-3xl font-bold" tag="h1">
          Découvrez Les Meilleurs Endroits
        </Title>
        <Navigation navItems={navItemsHomePage} />
        <form className="relative mt-4 flex w-full">
          <input
            className="h-11 w-full rounded-full border border-sky-600 px-10 outline-none"
            name="search"
            placeholder="Rechercher un restaurant..."
            type="text"
          />
          <Search
            className="absolute bottom-1.5 left-3 -translate-y-1/2"
            size={16}
          />

          <Button className="absolute right-0 h-11 rounded-l-none rounded-r-full">
            Rechercher
          </Button>
        </form>
      </div>
      <div className="mt-10 grid grid-cols-3 gap-10 px-10">
        {false
          ? Array.from({ length: 10 }).map((_, index) => (
              <SkeletonCard key={index} className="h-[300px] w-[380px]" />
            ))
          : restaurantInfo.map((restaurant, index) => (
              <Link
                key={restaurant.restaurantsId}
                href={`/restaurant/${restaurant.restaurantsId}`}
              >
                <CustomCard
                  className="min-h-[300px] w-[380px]"
                  restaurant={restaurant}
                />
              </Link>
            ))}
      </div>
    </Container>
  );
};
