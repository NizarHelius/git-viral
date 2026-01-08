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
  const router = useRouter();

  useEffect(() => {
    const fetchUserAndCredits = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push("/login");
      } else {
        setUser(data.user);
        // Fetch credits from profiles table
        const { data: profile } = await supabase
          .from("profiles")
          .select("credits")
          .eq("id", data.user.id)
          .single();
        if (profile) setCredits(profile.credits);
      }
    };
    fetchUserAndCredits();
  }, []);

  const generate = async () => {
    if (credits <= 0) {
      alert("Out of credits! Redirecting to Ko-fi...");
      window.open("https://ko-fi.com/s/de1cb65423", "_blank"); // Change this to your link!
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

      // Deduct credit in DB
      const newCreditCount = credits - 1;
      await supabase
        .from("profiles")
        .update({ credits: newCreditCount })
        .eq("id", user.id);
      setCredits(newCreditCount); // Update UI
    } catch (err) {
      alert("Error generating posts.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied!");
  };

  const posts = output.split("### ").filter(Boolean);

  if (!user) return <div className="p-10">Loading...</div>;

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 text-black">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold mb-2">GitViral 🚀</h1>

        {/* CREDIT DISPLAY */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <span className="bg-blue-100 text-blue-800 px-4 py-1 rounded-full font-bold">
            Credits: {credits}
          </span>
          <a
            href="https://ko-fi.com/s/de1cb65423"
            target="_blank"
            className="text-blue-600 underline text-sm font-medium"
          >
            Get More Credits
          </a>
        </div>
        <button
          onClick={() =>
            supabase.auth.signOut().then(() => router.push("/login"))
          }
          className="absolute top-4 left-4 text-xs text-gray-400 hover:text-black"
        >
          Logout
        </button>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <textarea
            className="w-full h-48 p-4 border rounded-lg text-black bg-white"
            placeholder="Paste your README or code snippet..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={generate}
            disabled={loading || credits <= 0}
            className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading
              ? "Generating..."
              : credits <= 0
              ? "No Credits Left"
              : "Generate Viral Posts"}
          </button>
        </div>

        {output && (
          <div className="mt-12 space-y-8">
            {posts.map((post, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md border text-left relative group"
              >
                <button
                  onClick={() => copyToClipboard(post)}
                  className="absolute top-4 right-4 bg-gray-100 px-3 py-1 rounded-full text-xs"
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
