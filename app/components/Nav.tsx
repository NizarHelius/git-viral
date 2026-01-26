"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Props = {
  loggedIn?: boolean;
  credits?: number;
};

export default function Nav({ loggedIn = false, credits }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-gray-900/50 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full max-w-6xl px-4 mx-auto">
        <div
          onClick={() => router.push("/")}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <img
            src="/ideogram.png"
            alt="GitViral Logo"
            className="object-contain h-10 w-10" // Simplified sizing
          />
          <span className="text-xl font-bold tracking-tighter">GitViral</span>
        </div>

        <div className="flex items-center gap-4">
          {loggedIn ? (
            <>
              <div className="hidden sm:flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
                <span className="text-blue-400 text-sm font-bold">
                  {credits ?? 0} Credits Left
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-400 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push("/login")}
              className="text-sm text-gray-400 hover:text-white"
            >
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
