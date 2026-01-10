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

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">
        <div className="animate-pulse font-bold tracking-tighter text-2xl">
          GitViral 🚀
        </div>
      </div>
    );
  }

  // --- STUNNING LANDING PAGE (Logged Out) ---
  if (!user) {
    return (
      <main className="min-h-screen bg-[#030712] text-white selection:bg-blue-500/30 overflow-hidden relative">
        {/* Background Glow */}
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            New: Powered by Llama 3.3
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            Your README is a <br />
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

  // --- PRO DARK DASHBOARD (Logged In) ---
  return (
    <main className="min-h-screen bg-[#030712] text-white selection:bg-blue-500/30">
      {/* Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[100px] -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/5 blur-[100px] -z-10" />

      <nav className="p-6 border-b border-white/5 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
        <div className="font-bold italic text-xl tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            G
          </div>
          GitViral
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
            <span className="text-blue-400 text-sm font-bold">
              {credits} Credits Left
            </span>
          </div>
          <button
            onClick={() =>
              supabase.auth.signOut().then(() => window.location.reload())
            }
            className="text-sm text-gray-500 hover:text-white transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="mb-10">
          <h2 className="text-4xl font-extrabold mb-2 tracking-tight">
            Generator Dashboard
          </h2>
          <p className="text-gray-400 text-lg">
            Turn your technical logic into viral marketing copy.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Input Area */}
          <div className="bg-white/5 border border-white/10 p-1 rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden">
            <textarea
              className="w-full h-64 p-6 bg-transparent text-white placeholder:text-gray-700 outline-none resize-none text-lg border-none focus:ring-0"
              placeholder="Paste your README.md or a specific code function here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="p-4 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <a
                href="https://ko-fi.com/s/de1cb65423"
                target="_blank"
                className="text-sm text-blue-400 hover:text-blue-300 transition underline decoration-blue-400/30"
              >
                Need more credits? Refill here.
              </a>
              <button
                onClick={generate}
                disabled={loading || credits <= 0}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 text-white font-bold py-3 px-10 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Crunching...
                  </>
                ) : credits <= 0 ? (
                  "No Credits Left"
                ) : (
                  "Generate Viral Posts"
                )}
              </button>
            </div>
          </div>

          {/* Results Area */}
          {output && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex items-center gap-2 text-gray-500 text-sm font-bold uppercase tracking-widest px-2">
                <div className="h-px bg-white/10 flex-1"></div>
                Your Content is Ready
                <div className="h-px bg-white/10 flex-1"></div>
              </div>
              {output
                .split("### ")
                .filter(Boolean)
                .map((post, index) => (
                  <div
                    key={index}
                    className="group bg-white/[0.03] border border-white/10 p-8 rounded-3xl relative hover:bg-white/[0.05] transition-all hover:border-white/20 shadow-xl"
                  >
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText("### " + post);
                        alert("Copied to clipboard!");
                      }}
                      className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg"
                    >
                      Copy Text
                    </button>
                    <div className="prose prose-invert max-w-none">
                      <div className="font-mono text-sm leading-relaxed text-gray-300">
                        {"### " + post}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
