"use client";
import { useState, useEffect, Suspense } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getHistory = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const { data } = await supabase
        .from("generations")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setHistory(data);
      setLoading(false);
    };
    getHistory();
  }, [router]);

  return (
    <main className="min-h-screen bg-[#030712] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="text-gray-500 hover:text-white mb-8 transition flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-4xl font-bold mb-10">Your Content Library</h1>

        {loading ? (
          <div className="animate-pulse text-gray-600 font-mono">
            Accessing archives...
          </div>
        ) : history.length === 0 ? (
          <div className="text-gray-500">
            You haven't generated any posts yet.
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((item, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 p-8 rounded-[32px] hover:border-blue-500/30 transition shadow-xl"
              >
                <div className="flex justify-between mb-4 text-[10px] uppercase tracking-widest text-gray-500 font-bold">
                  <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  <span className="text-blue-500">
                    ID: {item.id.slice(0, 8)}
                  </span>
                </div>
                <div className="font-mono text-xs text-gray-400 bg-black/20 p-4 rounded-xl mb-6 line-clamp-3">
                  {item.input_text}
                </div>
                {/* We simplify the view here, or link back to dashboard to see results */}
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      // Save both pieces of data to the browser's memory
                      localStorage.setItem("restore_input", item.input_text);
                      localStorage.setItem(
                        "restore_output",
                        item.output_json.content
                      );
                      router.push("/"); // Go back to dashboard
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl text-xs font-bold transition"
                  >
                    View & Copy Posts
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
