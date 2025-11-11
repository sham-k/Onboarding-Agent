"use client";
import "./globals.css";
import "@/app/globals.css";
import { useState, useEffect } from "react";

export default function Home() {
  const [form, setForm] = useState({ Name: "", Email: "", Summary: "", Tone: "", Goal: "" });
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [typingDots, setTypingDots] = useState(".");

  // Animate typing dots (...)
  useEffect(() => {
    if (!loading) return;
    const interval = setInterval(() => {
      setTypingDots((prev) => (prev === "..." ? "." : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, [loading]);

  // Typing effect for AI response (configurable speed with natural pauses)
  useEffect(() => {
    if (!response) return;

    // Typing speed presets (ms per character)
    const speeds = {
      fast: 10,
      medium: 25,
      slow: 40,
    };

    const typingSpeed = speeds.medium; // Change to fast / medium / slow as desired

    let i = 0;
    setDisplayedText("");

    const chars = [...response];
    const typeNextChar = () => {
      if (i >= chars.length) return;
      const currentChar = chars[i];
      setDisplayedText((prev) => prev + currentChar);
      i++;

      // Add realistic pauses for punctuation or line breaks
      let delay = typingSpeed;
      if (currentChar === "." || currentChar === "!" || currentChar === "?") delay += 300;
      if (currentChar === "\n") delay += 150;

      setTimeout(typeNextChar, delay);
    };

    typeNextChar();
  }, [response]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log("Loaded env:", process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL);
    e.preventDefault();
    setLoading(true);
    setResponse("");
    setDisplayedText("");

    try {
      console.log("Webhook URL:", process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL);
      const res = await fetch(process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL as string, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(form),
});

      if (!res.ok) throw new Error("Server error");

      const rawText = await res.text(); // ✅ Read once
      let data;

      try {
        data = JSON.parse(rawText); // Try to parse JSON
      } catch {
        data = { Body: rawText || "No JSON returned" }; // Fallback for text
      }

      let aiSummary = "";

      if (typeof data === "string") {
        aiSummary = data;
      } else if (data.ai_summary) {
        aiSummary = data.ai_summary;
      } else if (data.message) {
        aiSummary = data.message;
      } else if (data.json?.ai_summary) {
        aiSummary = data.json.ai_summary;
      } else {
        aiSummary = "No summary yet.";
      }

      // Clean up JSON-like responses so they show as natural text
      let cleanSummary = aiSummary.trim();
      if (cleanSummary.startsWith("{") && cleanSummary.endsWith("}")) {
        try {
          const parsed = JSON.parse(cleanSummary);
          cleanSummary =
            parsed.ai_summary ||
            parsed.message ||
            Object.values(parsed).join(" ") ||
            cleanSummary;
        } catch {
          // If parsing fails, just show the raw string
        }
      }

      setResponse(cleanSummary);
    } catch (err: any) {
      setResponse("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
   <main className="flex flex-col items-center justify-start min-h-dvh w-full px-4 sm:px-6 lg:px-8 pt-6 pb-4 bg-[var(--background)] text-[var(--foreground)] overflow-x-hidden transition-all duration-300 ease-in-out">
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left: Form Card */}
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-gray-200 animate-fade-in">
          <h1 className="outfit-font text-3xl md:text-4xl text-center mb-2">🚀 AI Onboarding Agent</h1>
          <p className="text-sm text-gray-500 mb-6 text-center">
            Enter your details to generate a personalized onboarding summary.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-900">Name</label>
                <input
                  name="Name"
                  value={form.Name}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-900 placeholder-gray-400 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
                  placeholder="Your name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-900">Email</label>
                <input
                  type="email"
                  name="Email"
                  value={form.Email}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-900 placeholder-gray-400 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
                  placeholder="Your email"
                />
              </div>

              {/* Summary */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-900">Summary</label>
                <textarea
                  name="Summary"
                  value={form.Summary}
                  onChange={handleChange}
                  required
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-900 placeholder-gray-400 h-24 resize-none transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
                  placeholder="Tell us a bit about yourself..."
                />
              </div>

              {/* Project Goal */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-900">Project Goal</label>
                <textarea
                  name="Goal"
                  value={form.Goal || ""}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-900 placeholder-gray-400 h-20 resize-none transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
                  placeholder="What would you like to achieve with AI?"
                />
              </div>

              {/* Tone Dropdown */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-900">Tone</label>
                <select
                  name="Tone"
                  value={form.Tone}
                  onChange={handleChange}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 text-gray-900 placeholder-gray-400 transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-400"
                >
                  <option value="">Select a tone</option>
                  <option value="Friendly 😊">Friendly 😊</option>
                  <option value="Professional 💼">Professional 💼</option>
                  <option value="Playful 🎨">Playful 🎨</option>
                  <option value="Motivational 🚀">Motivational 🚀</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="sm:col-span-2 relative w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2 rounded-md shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 active:scale-[0.98]"
              >
                {loading ? "Generating..." : "Generate Summary"}
              </button>
            </div>
          </form>
        </div>

        {/* Right: Results Card */}
        <div className="bg-white shadow-xl rounded-2xl p-6 md:p-8 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Results</h2>

          {/* Success Card */}
          {!loading && response && (
            <div className="mb-4 border border-green-200 bg-green-50 rounded-xl p-4 text-gray-800 shadow-sm">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-green-600 text-xl">✅</span>
                <h3 className="text-base font-semibold">Submission Successful</h3>
              </div>
              <p className="text-gray-700">Your onboarding form was received successfully.</p>
              <p className="mt-1 text-sm text-gray-500">Our AI assistant is preparing your personalized summary.</p>
            </div>
          )}

          {/* AI Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-gray-800 shadow-sm min-h-[140px]">
            {loading ? (
              <div className="flex items-center justify-center space-x-1 text-blue-600">
                <span>AI is generating your onboarding summary</span>
                <span className="font-bold text-lg">{typingDots}</span>
              </div>
            ) : (
              displayedText ? (
                <div>
                  <h3 className="text-base font-semibold text-blue-600 mb-2">🤖 Your Personalized AI Summary</h3>
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap animate-fade-in typing-cursor">
                    {displayedText}
                  </p>
                  <p className="text-sm text-gray-500 italic mt-2">
                    — Generated by your AI onboarding assistant
                  </p>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No summary yet — submit the form to generate one.</p>
              )
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl w-full mx-auto mt-6 text-center  text-xs text-gray-400">
        Built by <span className="font-medium">Shamar Knibbs</span> — Powered by n8n + OpenAI
      </div>
    </main>
  );
}