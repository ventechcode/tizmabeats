"use client";

import { signOut, useSession } from "next-auth/react";

export default function Dashboard() {
  const { data: session } = useSession();

  if (!session) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>Welcome to the Dashboard, {session.user?.name || "User"}!</h1>
      <button onClick={() => signOut({ callbackUrl: "/auth/signin" })}>
        Sign Out
      </button>
    </div>
  );
}
