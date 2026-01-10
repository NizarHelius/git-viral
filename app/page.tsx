"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number>(0);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndCredits = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", data.user.id)
          .single();
        if (profile) setCredits(profile.credits);
      }
      setCheckingAuth(false);
    };
    fetchUserAndCredits();
  }, []);

  const generate = async () => {
    if (credits <= 0) {
      alert("Out of credits!");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });
      const { data } = await res.json();
      setOutput(data);
      const newCreditCount = credits - 1;
      await supabase
        .from("profiles")
        .update({ credits: newCreditCount })
        .eq("id", user.id);
      setCredits(newCreditCount);
    } catch (err) {
      alert("Error!");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth) return <div className="p-10 text-center">Loading...</div>;

  // --- LANDING PAGE (If not logged in) ---
  // --- STUNNING LANDING PAGE (Logged Out) ---
  if (!user) {
    return (
      <main className="min-h-screen bg-[#030712] text-white selection:bg-blue-500/30 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />

        <nav className="p-8 flex justify-between items-center max-w-6xl mx-auto backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
          <div className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
              G
            </div>
            GitViral
          </div>
          <button
            onClick={() => router.push("/login")}
            className="text-sm font-medium text-gray-400 hover:text-white transition"
          >
            Login
          </button>
        </nav>

        <header className="pt-40 pb-20 px-6 text-center max-w-4xl mx-auto relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New: Powered by Llama 3.3
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            Your README is a <br />{" "}
            <span className="text-blue-500">marketing goldmine.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Stop wasting hours writing LinkedIn threads. Paste your code, get 3
            viral posts, and get back to the terminal.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push("/login")}
              className="group relative bg-blue-600 text-white px-8 py-4 rounded-xl font-bold transition hover:bg-blue-500 flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)]"
            >
              Get Started for Free
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </button>
            <div className="text-sm text-gray-500 italic">
              No credit card required.
            </div>
          </div>
        </header>

        {/* Bento Grid Preview */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md">
              <div className="flex gap-2 mb-4 italic text-blue-500 text-sm">
                Output Preview
              </div>
              <div className="space-y-3 opacity-50">
                <div className="h-4 bg-white/20 rounded w-3/4"></div>
                <div className="h-4 bg-white/20 rounded w-1/2"></div>
                <div className="h-4 bg-white/20 rounded w-5/6"></div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-3xl p-8">
              <h3 className="font-bold text-xl mb-2">3 Free Credits</h3>
              <p className="text-gray-400 text-sm">
                Sign up in 10 seconds. No password needed. Start sharing your
                work today.
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }
  // --- DASHBOARD (If logged in) ---
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 relative text-black">
      <button
        onClick={() =>
          supabase.auth.signOut().then(() => window.location.reload())
        }
        className="absolute top-6 left-6 text-sm text-gray-400 hover:text-black"
      >
        Logout
      </button>

      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold">Generator Dashboard</h2>
          <div className="mt-4 flex items-center justify-center gap-4">
            <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-bold">
              Credits: {credits}
            </span>
            <a
              href="https://ko-fi.com/s/de1cb65423"
              target="_blank"
              className="text-blue-600 text-sm underline"
            >
              Refill Credits
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <textarea
            className="w-full h-48 p-4 border rounded-xl text-black bg-white focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Paste your README or code snippet..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={generate}
            disabled={loading || credits <= 0}
            className="w-full mt-4 bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 disabled:bg-gray-300 transition"
          >
            {loading
              ? "Crunching..."
              : credits <= 0
              ? "No Credits"
              : "Generate Viral Posts"}
          </button>
        </div>

        {output && (
          <div className="mt-12 space-y-6">
            {output
              .split("### ")
              .filter(Boolean)
              .map((post, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-md border text-left relative group"
                >
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(post);
                      alert("Copied!");
                    }}
                    className="absolute top-4 right-4 bg-gray-50 px-3 py-1 rounded-lg text-xs hover:bg-gray-100 transition"
                  >
                    Copy
                  </button>
                  <div className="prose prose-blue whitespace-pre-wrap pt-4 font-mono text-sm leading-relaxed">
                    {"### " + post}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </main>
  );
}
