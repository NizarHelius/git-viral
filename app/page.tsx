"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Loader from "./components/Loader";
import Footer from "./components/footer";

export default function Home() {
  const [announcement, setAnnouncement] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState<number>(0);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const router = useRouter();

  // 1. Auth & Data Fetching
  useEffect(() => {
    const fetchUserAndData = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        setUser(data.user);
        const { data: profile } = await supabase
          .from("profiles")
          .select("credits, message")
          .eq("id", data.user.id)
          .single();
        if (profile) {
          setCredits(profile.credits);
          if (profile.message) setAnnouncement(profile.message);
        }

        const { data: historyData } = await supabase
          .from("generations")
          .select("*")
          .eq("user_id", data.user.id)
          .order("created_at", { ascending: false })
          .limit(3);
        if (historyData) setHistory(historyData);
      }
      setCheckingAuth(false);
    };
    fetchUserAndData();
  }, []);

  // 1.5 Referrer Tracker
  useEffect(() => {
    // Check if we already have a source saved
    const existingSource = localStorage.getItem("entry_source");

    if (!existingSource) {
      // Capture where they came from
      const source = document.referrer || "direct";
      localStorage.setItem("entry_source", source);
      console.log("User entered from:", source);
    }
  }, []);

  // 1.6 Dismiss Message
  const dismissMessage = async () => {
    setAnnouncement(null);
    await supabase.from("profiles").update({ message: null }).eq("id", user.id);
  };

  // 2. Logic to Fill Sample
  const fillSample = (type: string) => {
    const samples: any = {
      react:
        "# Modern UI Library\nHigh-performance React components built with Tailwind CSS.",
      python:
        "# FastAPI Scraper\nAsync web scraper designed to extract real-time market data.",
      api: "# Stripe Wrapper\nA lightweight wrapper for the Stripe API to handle subscriptions.",
    };
    setInput(samples[type]);
  };

  // 3. Generation Logic (Works for both Demo and Logged In)
  const generate = async () => {
    if (!user && output) {
      router.push("/login?mode=register");
      return;
    }

    if (user && credits <= 0) {
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

      if (user) {
        const newCreditCount = credits - 1;
        await supabase
          .from("profiles")
          .update({ credits: newCreditCount })
          .eq("id", user.id);
        setCredits(newCreditCount);
        await supabase.from("generations").insert({
          user_id: user.id,
          input_text: input,
          output_json: { content: data },
        });
      }
    } catch (err) {
      alert("Error generating content!");
    } finally {
      setLoading(false);
    }
  };

  if (checkingAuth)
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white text-2xl animate-pulse font-bold">
        GitViral 🚀
      </div>
    );

  // --- STUNNING LANDING PAGE (Logged Out) ---
  if (!user) {
    return (
      <main className="min-h-screen bg-[#030712] text-white selection:bg-blue-500/30 overflow-hidden relative">
        {/* --- PRODUCT HUNT BANNER --- */}
        <div className="relative z-[70] bg-blue-600 text-white py-3 px-4 shadow-2xl">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-3 text-sm font-bold">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>We are live on Product Hunt! 🚀</span>
            <a
              href="https://www.producthunt.com/posts/gitviral"
              target="_blank"
              className="bg-white text-blue-600 px-3 py-1 rounded-full text-[10px] uppercase tracking-tighter hover:bg-gray-100 transition"
            >
              Support us here →
            </a>
          </div>
        </div>

        {/* Background Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full -z-10" />

        {/* --- STICKY NAVBAR --- */}
        <nav className="p-8 flex justify-between items-center max-w-6xl mx-auto backdrop-blur-md sticky top-0 left-0 right-0 z-50 bg-[#030712]/50">
          <div
            onClick={() => router.push("/")}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
              src="/ideogram.png"
              alt="GitViral"
              width={70}
              height={70}
              className="w-14 sm:w-16 md:w-20 h-auto object-contain"
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
        <header className="pt-12 pb-20 px-6 text-center max-w-4xl mx-auto relative">
          {/* The "Trend" Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Now Optimized with DeepSeek-V3
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent leading-tight">
            Your README is a <br />{" "}
            <span className="text-blue-500 font-black italic">
              marketing goldmine.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Stop wasting hours on social copy. Get technical viral posts in
            seconds using{" "}
            <span className="text-white border-b border-blue-500/50">
              Llama 3.3
            </span>{" "}
            and{" "}
            <span className="text-white border-b border-blue-500/50">
              DeepSeek
            </span>
            .
          </p>

          {/* Hero CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => router.push("/login?mode=register")}
              className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:scale-105 transition active:scale-95"
            >
              Join for Free →
            </button>
            <button
              onClick={() => router.push("/login")}
              className="bg-white/5 border border-white/10 text-white px-10 py-4 rounded-2xl font-bold hover:bg-white/10 transition"
            >
              Login
            </button>
          </div>
        </header>

        {/* --- PLAYGROUND --- */}
        <section className="max-w-4xl mx-auto px-6 mb-40 relative">
          <div className="bg-white/5 border border-white/10 rounded-[40px] p-1.5 backdrop-blur-3xl shadow-2xl overflow-hidden focus-within:border-blue-500/40 transition-all duration-500">
            <div className="bg-[#030712]/80 rounded-[36px] overflow-hidden">
              <textarea
                className="w-full h-48 p-8 bg-transparent text-white placeholder:text-gray-700 outline-none resize-none text-lg border-none focus:ring-0"
                placeholder="Paste your README.md here to see the magic..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />

              <div className="px-8 pb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => fillSample("react")}
                    className="text-[10px] bg-white/5 border border-white/10 px-4 py-2 rounded-full text-gray-400 transition hover:bg-white/10 hover:text-white"
                  >
                    ⚡ React Example
                  </button>
                  <button
                    onClick={() => fillSample("python")}
                    className="text-[10px] bg-white/5 border border-white/10 px-4 py-2 rounded-full text-gray-400 transition hover:bg-white/10 hover:text-white"
                  >
                    📦 Python Example
                  </button>
                </div>

                <button
                  onClick={generate}
                  disabled={loading}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-10 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <Loader size={16} color="#fff" />
                  ) : output ? (
                    "Unlock Full Results →"
                  ) : (
                    "Generate Free Preview"
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* RESULTS WITH SHARP BUTTONS */}
          {output && (
            <div className="mt-12 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              {JSON.parse(output).posts.map((post: any, index: number) => {
                const isLocked = index > 0; // Lock the 2nd and 3rd posts

                return (
                  <div
                    key={index}
                    className="group bg-white/[0.03] border border-white/10 rounded-[32px] relative overflow-hidden transition-all hover:border-white/20"
                  >
                    {/* HEADER */}
                    <div className="bg-white/5 px-8 py-4 border-b border-white/5">
                      <div className="text-[10px] font-bold uppercase tracking-widest text-blue-500">
                        {post.title}
                      </div>
                    </div>

                    {/* CONTENT AREA */}
                    <div className="p-8 relative">
                      {/* THE TEXT (This gets blurred if locked) */}
                      <div
                        className={`font-mono text-sm leading-relaxed text-gray-400 whitespace-pre-wrap transition-all ${isLocked ? "blur-[8px] select-none opacity-40" : ""}`}
                      >
                        {post.content}
                      </div>

                      {/* THE OVERLAY (Only shows for locked posts) */}
                      {isLocked && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#030712]/10 z-30 backdrop-blur-[2px]">
                          <div className="bg-blue-600/10 border border-blue-500/20 p-6 rounded-3xl flex flex-col items-center shadow-2xl">
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-tighter mb-3">
                              Full Access Required
                            </span>
                            <button
                              onClick={() =>
                                router.push("/login?mode=register")
                              }
                              className="bg-white text-black px-8 py-3 rounded-2xl text-xs font-black shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition"
                            >
                              UNLOCK WITH 3 FREE CREDITS →
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
        {/* --- TRUST BAR --- */}
        <div className="mt-16 flex flex-col items-center gap-6 animate-in fade-in duration-1000 delay-500 pb-20 pt-12 border-t border-white/5">
          <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">
            Trusted by developers from
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 grayscale brightness-200 contrast-125">
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tighter">
                GitHub
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tighter italic text-blue-400">
                DuckDuckGo
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-black text-xl tracking-tighter">
                Vercel
              </span>
            </div>
          </div>
        </div>
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
        {/* Existing Sections Below... */}
        <Footer />
      </main>
    );
  }

  // --- PRO DASHBOARD (LOGGED IN) ---
  return (
    <main className="min-h-screen bg-[#030712] text-white selection:bg-blue-500/30">
      <nav className="p-6 border-b border-white/5 flex justify-between items-center backdrop-blur-md sticky top-0 z-50 bg-[#030712]/80">
        <div className="flex items-center gap-2">
          <img src="/ideogram.png" alt="Logo" className="w-10 h-auto" />
          <span className="text-xl font-bold tracking-tighter">GitViral</span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.push("/history")}
            className="text-sm text-gray-500 hover:text-white transition"
          >
            Library
          </button>
          <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-blue-400 text-sm font-bold">
            {credits} Credits
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
        {announcement && (
          <div className="mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="bg-blue-600/10 border border-blue-500/30 p-4 rounded-2xl flex items-center justify-between gap-4 backdrop-blur-xl shadow-[0_0_20px_rgba(37,99,235,0.1)]">
              <div className="flex items-center gap-3">
                <span className="text-xl">🔔</span>
                <p className="text-sm font-medium text-blue-100">
                  {announcement}
                </p>
              </div>
              <button
                onClick={dismissMessage}
                className="text-blue-400 hover:text-white transition text-xs font-bold whitespace-nowrap"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h2 className="text-4xl font-extrabold mb-2 tracking-tight">
              Dashboard
            </h2>
            <p className="text-gray-400">
              Transform your technical logic into viral marketing copy.
            </p>
          </div>
          <button
            onClick={() => fillSample("react")}
            className="text-xs bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-xl transition"
          >
            ✨ Try Sample
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 p-1 rounded-3xl backdrop-blur-xl shadow-2xl overflow-hidden mb-12">
          <textarea
            className="w-full h-64 p-6 bg-transparent text-white placeholder:text-gray-700 outline-none resize-none text-lg border-none focus:ring-0"
            placeholder="Paste your README or code..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="p-4 bg-white/[0.02] border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
            <div className="flex flex-col">
              <a
                href="https://ko-fi.com/s/de1cb65423"
                target="_blank"
                className="text-sm text-amber-400 font-bold hover:text-amber-300 transition underline decoration-amber-400/30"
              >
                Get 20 more credits ($10) →
              </a>
              <span className="text-[9px] text-gray-500 mt-1 uppercase tracking-widest font-bold">
                INSTANT AUTOMATED DELIVERY ⚡
              </span>
            </div>
            <button
              onClick={generate}
              disabled={loading || credits <= 0}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 text-white font-bold py-3 px-10 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              {loading ? (
                <Loader size={16} color="#fff" />
              ) : (
                "Generate Viral Posts"
              )}
            </button>
          </div>
        </div>

        {output && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {JSON.parse(output).posts.map((post: any, index: number) => {
              const isLinkedIn = post.platform === "LinkedIn";
              const shareText = encodeURIComponent(post.content);
              const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
              return (
                <div
                  key={index}
                  className="group bg-white/[0.03] border border-white/10 rounded-[32px] overflow-hidden hover:bg-white/[0.05] transition shadow-2xl"
                >
                  <div className="bg-white/5 px-8 py-4 border-b border-white/5 flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">
                      {post.title}
                    </span>
                    <div className="flex gap-2">
                      {!isLinkedIn && (
                        <a
                          href={twitterUrl}
                          target="_blank"
                          className="bg-white text-black px-4 py-1.5 rounded-xl text-[10px] font-bold"
                        >
                          Post to X
                        </a>
                      )}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(post.content);
                          alert("Copied!");
                        }}
                        className={`px-4 py-1.5 rounded-xl text-[10px] font-bold text-white ${isLinkedIn ? "bg-[#0077b5]" : "bg-blue-600"}`}
                      >
                        {isLinkedIn ? "Copy for LinkedIn" : "Copy Text"}
                      </button>
                    </div>
                  </div>
                  <div className="p-8 font-mono text-sm text-gray-300 whitespace-pre-wrap">
                    {post.content}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
