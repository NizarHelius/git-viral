"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ 
      email,
      options: {
        emailRedirectTo: window.location.origin,
      }
    });
    if (error) alert(error.message);
    else setMessage("Check your email for the magic link!");
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-md w-full">
        <div 
          onClick={() => router.push('/')} 
          className="flex items-center justify-center gap-2 mb-10 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-110 transition-transform">G</div>
          <h1 className="text-2xl font-bold tracking-tighter">GitViral</h1>
        </div>

        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-2">Welcome back</h2>
          <p className="text-gray-400 mb-8 text-sm">Enter your email to receive a magic login link.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full p-4 bg-white/[0.03] border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-gray-700"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "Send Magic Link"
              )}
            </button>
          </form>

          {message && (
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl text-blue-400 text-sm text-center animate-fade-in">
              {message}
            </div>
          )}
        </div>

        <button 
          onClick={() => router.push('/')}
          className="w-full mt-8 text-sm text-gray-500 hover:text-white transition"
        >
          ← Back to home
        </button>
      </div>
    </main>
  );
}