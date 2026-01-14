"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Loader from "./components/Loader";
import Footer from "./components/footer";

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

  if (checkingAuth)
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <Loader size={56} color="#ffffff" />
      </div>
    );

  // --- LANDING PAGE (Logged Out) ---
  if (!user) {
    return (
      <main className="min-h-screen bg-[#030712] text-white selection:bg-blue-500/30 overflow-hidden relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />

        {/* --- FIXED NAVBAR --- */}
        <nav className="p-4 flex justify-between items-center max-w-6xl mx-auto backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
              src="/ideogram.png"
              alt="GitViral Logo"
              className="w-15 h-auto object-contain"
            />
            <span className="text-xl font-bold tracking-tighter">GitViral</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => router.push("/login")}
              className="text-gray-400 text-sm font-medium hover:text-white transition"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/login?mode=register")}
              className="bg-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-blue-600/20"
            >
              Join
            </button>
          </div>
        </nav>

        {/* --- HERO SECTION --- */}
        <header className="pt-48 pb-20 px-6 text-center max-w-4xl mx-auto relative">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent leading-tight">
            Your README is a <br />{" "}
            <span className="text-blue-500">marketing goldmine.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Stop wasting hours writing LinkedIn threads. Paste your code, get 3
            viral posts, and get back to the terminal.
          </p>

          {/* --- HERO CTA BUTTONS --- */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push("/login?mode=register")}
              className="bg-blue-600 text-white px-15 py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:scale-105 transition"
            >
              Join for Free →
            </button>
          </div>
        </header>

        {/* --- VALUE PROPOSITION SECTION --- */}
        <section className="max-w-6xl mx-auto px-6 py-24 border-t border-white/5 relative">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for the terminal. Made for the feed.
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Stop staring at a blank cursor. Let GitViral handle the "marketing
              speak" so you can get back to your IDE.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Box 1: Real Example */}
            <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-md flex flex-col justify-between overflow-hidden group">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="text-blue-500 font-bold text-sm uppercase tracking-widest mb-2">
                    The Transformation
                  </div>
                  <h3 className="text-2xl font-bold">
                    From raw code to viral hook.
                  </h3>
                </div>
                <div className="bg-blue-600/20 text-blue-400 text-xs px-3 py-1 rounded-full border border-blue-500/20">
                  Live Preview
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Before */}
                <div className="bg-black/40 p-4 rounded-2xl border border-white/5 font-mono text-[10px] text-gray-500">
                  <span className="text-blue-400">export async function</span>{" "}
                  <span className="text-yellow-400">generate</span>() &#123;
                  <br />
                  &nbsp;&nbsp;const res ={" "}
                  <span className="text-blue-400">await</span>{" "}
                  <span className="text-yellow-400">fetch</span>(api);
                  <br />
                  &nbsp;&nbsp;
                  <span className="text-gray-400">
                    // Optimize for sub-second speed
                  </span>
                  <br />
                  &nbsp;&nbsp;<span className="text-blue-400">return</span> res.
                  <span className="text-yellow-400">json</span>();
                  <br />
                  &#125;
                </div>
                {/* After */}
                <div className="bg-blue-600/10 p-4 rounded-2xl border border-blue-500/20 text-xs leading-relaxed italic text-gray-300">
                  "I just cut my AI latency by 80% using Groq LPUs. 🚀 Here is
                  the exact architecture I used to hit sub-second
                  generations..."
                </div>
              </div>
            </div>

            {/* Box 2: Speed */}
            <div className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 rounded-[32px] p-8 flex flex-col justify-between">
              <div className="text-4xl mb-4 text-blue-500">⚡</div>
              <div>
                <h3 className="font-bold text-xl mb-2 text-white">
                  Sub-second Speed
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Powered by Llama 3.3 and Groq LPUs. It generates your content
                  faster than you can switch tabs.
                </p>
              </div>
            </div>

            {/* Box 3: 3-Step */}
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
              <div className="space-y-6">
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <p className="text-sm font-medium">
                    Paste your README or code
                  </p>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <p className="text-sm font-medium">
                    AI extracts the value-add
                  </p>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <p className="text-sm font-medium">Copy & Go Viral</p>
                </div>
              </div>
            </div>

            {/* Box 4: No Emojis / Professional */}
            <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-[32px] p-8 flex items-center gap-8">
              <div className="hidden sm:block text-5xl">🚫</div>
              <div>
                <h3 className="font-bold text-xl mb-1">
                  No "AI Cringe" Guarantee
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Our prompts are tuned by senior developer advocates. No
                  excessive emojis, no fake excitement—just high-signal
                  technical content.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* --- FINAL CTA SECTION --- */}
        <section className="py-32 px-6 text-center relative overflow-hidden">
          {/* Another subtle glow for the bottom */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full -z-10" />

          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 tracking-tight">
            Ready to hype your next build?
          </h2>
          <p className="text-gray-400 mb-10 text-lg">
            Join 100+ developers turning code into content.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push("/login?mode=register")}
              className="bg-blue-600 text-white px-12 py-4 rounded-2xl font-bold shadow-xl shadow-blue-600/20 hover:scale-105 transition active:scale-95"
            >
              Get My 3 Free Credits →
            </button>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <Footer />
      </main>
    );
  }

  // --- PRO DASHBOARD (Logged In) ---
  return (
    <main className="min-h-screen bg-[#030712] text-white selection:bg-blue-500/30">
      <nav className="p-6 border-b border-white/5 flex justify-between items-center backdrop-blur-md sticky top-0 z-50 bg-[#030712]/80">
        <div className="flex items-center gap-2">
          <img
            src="/ideogram.png"
            alt="GitViral Logo"
            className="w-15 h-auto object-contain"
          />
          <span className="text-xl font-bold tracking-tighter">GitViral</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-blue-400 text-sm font-bold">
            {credits} Credits Left
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
        <div className="mb-10 text-center sm:text-left">
          <h2 className="text-4xl font-extrabold mb-2 tracking-tight">
            Dashboard
          </h2>
          <p className="text-gray-400">
            Transform your technical logic into viral marketing copy.
          </p>
        </div>

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
              Refill credits
            </a>
            <button
              onClick={generate}
              disabled={loading || credits <= 0}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 text-white font-bold py-3 px-10 rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader size={16} color="#fff" />
                  <span>Crunching...</span>
                </>
              ) : (
                "Generate Viral Posts"
              )}
            </button>
          </div>
        </div>

        {output && (
          <div className="mt-12 space-y-6">
            {output
              .split("### ")
              .filter(Boolean)
              .map((post, index) => (
                <div
                  key={index}
                  className="group bg-white/[0.03] border border-white/10 p-8 rounded-3xl relative hover:bg-white/[0.05] transition-all shadow-xl"
                >
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText("### " + post);
                      alert("Copied!");
                    }}
                    className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold"
                  >
                    Copy Text
                  </button>
                  <div className="font-mono text-sm leading-relaxed text-gray-300">
                    {"### " + post}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
