"use client";

import { useSession } from "next-auth/react";
import Loading from "./loading";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) {
    return <Loading />;
  }

  return (
    <div>
      <h1>Welcome to the Dashboard, {session.user?.name || "User"}!</h1>
    </div>
  );
}
