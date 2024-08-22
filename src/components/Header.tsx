"use client";

import { Profile } from "./Profile";
import { Navigation } from "./navigation/HomeNav";
import Container from "./ui/container";

import { useNavigation } from "@/hooks/useNavigation";
export const Header = () => {
  const { navItemsHeader } = useNavigation();

  return (
    <Container className="mb-10 flex h-16 items-center justify-between px-8">
      <h1>Epytogo</h1>
      <nav className="flex justify-end gap-4">
        <Navigation navItems={navItemsHeader} />
      </nav>
    </Container>
  );
};
