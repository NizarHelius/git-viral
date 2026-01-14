import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="max-w-6xl mx-auto px-6 py-12 border-t border-white/5">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <img
            src="/ideogram.png"
            alt="GitViral Logo"
            className="w-10 h-auto object-contain"
          />
          <span className="font-bold tracking-tighter text-gray-300">
            GitViral
          </span>
        </div>

        <div className="flex gap-8 text-sm text-gray-500">
          <a href="#" className="hover:text-white transition">
            Twitter / X
          </a>
          <a
            href="https://ko-fi.com/s/de1cb65423"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            Pricing
          </a>
          <a
            href="mailto:your-email@example.com"
            className="hover:text-white transition"
          >
            Support
          </a>
        </div>

        <p className="text-xs text-gray-600">
          © {new Date().getFullYear()} GitViral. Built for the #buildinpublic
          community.
        </p>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[10px] text-gray-800 uppercase tracking-[0.2em]">
          Powered by Groq • Llama 3.3 • Supabase • Vercel
        </p>
      </div>
    </footer>
  );
};

export default Footer;
