'use client';
import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: input }),
      });
      const { data } = await res.json();
      setOutput(data);
    } catch (err) {
      alert("Error generating posts.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  // This splits the AI output by the "### Post" headings
  const posts = output.split('### ').filter(Boolean);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">GitViral 🚀</h1>
          <p className="text-gray-600">Turn your technical READMEs into viral social content.</p>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <textarea 
            className="w-full h-48 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            placeholder="Paste your README or code snippet here..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button 
            onClick={generate}
            disabled={loading}
            className="w-full mt-4 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {loading ? 'Crunching your code...' : 'Generate Viral Posts'}
          </button>
        </div>

        {output && (
          <div className="mt-12 space-y-8">
            {posts.map((post, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md border border-gray-100 relative group">
                <button 
                  onClick={() => copyToClipboard(post)}
                  className="absolute top-4 right-4 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-full transition"
                >
                  Copy Text
                </button>
                <div className="prose prose-blue text-gray-800 whitespace-pre-wrap pt-4">
                  {/* We add "### " back because we split it earlier */}
                  <div className="font-mono text-sm leading-relaxed">
                    {"### " + post}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}