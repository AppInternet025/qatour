"use client";

import Link from "next/link";
import { signIn, useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-slate-900 flex items-center py-3 justify-between px-24 text-white">
      <Link href="/">
        <h1>Acces Google</h1>
      </Link>

      {session?.user ? (
        <div className="flex gap-x-2 items-center">
          <Link href="/dashboard">Dashboard</Link>
          <p>
            {session.user.name} {session.user.email}
          </p>
          <img
            src={session.user.image ?? "/default-avatar.png"}
            alt="User Profile"
            className="w-10 h-10 rounded-full cursor-pointer"
          />
          <button
            onClick={async () => {
              await signOut({
                callbackUrl: "/",
              });
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <button
          onClick={() => signIn()}
          className="bg-sky-400 px-3 py-2 rounded"
        >
          Sign In
        </button>
      )}
    </nav>
  );
}