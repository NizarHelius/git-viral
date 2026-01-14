"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "../components/Loader";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegister = searchParams.get("mode") === "register";

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) router.push("/");
    };
    checkUser();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (isRegister) {
      // --- JOIN LOGIC (NEEDS CONFIRMATION) ---
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else
        setMessage(
          "Account created! Please check your email to confirm and log in."
        );
    } else {
      // --- LOGIN LOGIC (IMMEDIATE) ---
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        if (error.message === "Email not confirmed") {
          alert("You joined but never confirmed your email! Check your inbox.");
        } else {
          alert("Invalid email or password.");
        }
      } else {
        router.push("/"); // IMMEDIATE ENTRY
      }
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-6 relative">
      <nav className="fixed top-0 left-0 right-0 p-6 flex items-center backdrop-blur-md z-50 bg-[#030712]/80 border-b border-white/5">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition"
        >
          <span className="text-2xl">←</span>
        </button>
      </nav>
      <div className="pt-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />
      <div className="max-w-md w-full bg-white/5 border border-white/10 p-10 rounded-[40px] backdrop-blur-xl shadow-2xl text-center">
        <h2 className="text-3xl font-bold mb-2 tracking-tight">
          {isRegister ? "Join GitViral 🚀" : "Welcome Back"}
        </h2>
        <p className="text-gray-400 mb-8 text-sm">
          {isRegister
            ? "Confirm your email to get 3 credits."
            : "Enter your details for immediate access."}
        </p>

        <form onSubmit={handleAuth} className="space-y-4 text-left">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">
              Email
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full p-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full p-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader size={16} color="#fff" />
                <span>Processing...</span>
              </>
            ) : isRegister ? (
              "Create Account & Verify"
            ) : (
              "Login Immediately"
            )}
          </button>
        </form>

        {message && (
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 text-sm">
            {message}
          </div>
        )}

        <button
          onClick={() =>
            router.push(isRegister ? "/login" : "/login?mode=register")
          }
          className="mt-6 text-xs text-gray-500 hover:text-white transition"
        >
          {isRegister
            ? "Already have an account? Login"
            : "New here? Join for free"}
        </button>
      </div>
    </main>
  );
}
