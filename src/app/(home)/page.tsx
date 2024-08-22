"use client";
import { Profile } from "@/components/Profile";
import { useStore } from "@/store/useStore";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const { data: session } = useSession();
  const { setCurrentUser, currentUser } = useStore();

  useEffect(() => {
    if (session?.user) setCurrentUser(session?.user);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold">Welcome {currentUser?.firstname}</h1>
    </div>
  );
}
