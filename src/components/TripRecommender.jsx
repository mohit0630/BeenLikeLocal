"use client";
import { useState, useRef, useEffect } from "react";

const destinationsContext = `
You are a friendly travel assistant for "Been Like Local" — an authentic Indian travel platform.

Available destinations:
- Spiti Valley: 8 days, ₹18000, Adventure, high altitude desert, monasteries, remote Himalayas
- Ladakh: 8 days, ₹22000, Adventure, high passes, Pangong lake, Nubra valley
- Zanskar: 8 days, ₹24000, Adventure, most remote region, ancient monasteries, gorges
- Kasol: 4 days, ₹7000, Backpacker, Parvati Valley, hippie culture, trekking
- Chakrata: 3 days, ₹6000, Adventure, hidden Uttarakhand, Tiger Falls, dense forests
- Manali: 4 days, ₹8000, Adventure, Solang Valley, Atal Tunnel, gateway to Himalayas
- Jispa: 3 days, ₹7000, Adventure, remote Lahaul Valley, Bhaga river, very peaceful
- Jibhi: 3 days, ₹6000, Relax, hidden forest village, wooden cottages, Tirthan Valley
- Udaipur: 2 days, ₹5000, Relax, city of lakes, palaces, romantic atmosphere
- Rishikesh: 3 days, ₹6500, Relax, Ganga aarti, river rafting, yoga, spiritual
- Banswara: 2 days, ₹4500, Relax, offbeat Rajasthan, 100 islands, tribal culture
- Barot Valley: 3 days, ₹6000, Relax, hidden Himachal, trout fishing, Rajgundha trek
- Jaisalmer: 3 days, ₹6500, Relax, golden city, desert safari, sand dunes
- Dharamshala: 3 days, ₹6500, Relax, Tibetan culture, McLeodganj, Triund trek

Rules:
- Recommend 1-2 best matching destinations based on budget, days, and vibe
- Always mention destination name, price, duration and why it matches
- Be friendly, warm and concise
- Keep response under 100 words
- End with "Want more details? Just ask! 😊"
`;

const QUICK_PROMPTS = [
  "Budget ₹8000, 4 days, adventure",
  "Couple trip, relaxing, ₹12000",
  "Solo backpacker, ₹6000",
  "Family trip, easy destination",
];

export default function TripRecommender() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hey! 👋 Tell me your budget, days available, and travel vibe — I'll find your perfect destination!",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) setUnread(0);
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [open, messages]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setLoading(true);

    try {
      const prompt = `${destinationsContext}\n\nUser: ${userText}\n\nAssistant:`;

      const response = await fetch("/api/trip-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: prompt }),
      });

      const data = await response.json();

      let reply = "";

      if (Array.isArray(data) && data[0]?.generated_text) {
        reply = data[0].generated_text.trim();
      } else if (data?.generated_text) {
        reply = data.generated_text.trim();
      } else if (data?.error) {
        reply = `Sorry, something went wrong: ${data.error}`;
      } else {
        reply = "Sorry, I couldn't get a response. Please try again!";
      }

      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
      if (!open) setUnread((u) => u + 1);

    } catch (err) {
      console.error("TripRecommender error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Network error. Please check your connection and try again!" },
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-green-600 hover:bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
      >
        {open ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          style={{ height: "480px" }}
        >
          {/* Header */}
          <div className="bg-green-700 px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-sm">🏔️</div>
            <div>
              <p className="text-white text-sm font-semibold">Trip Recommender</p>
              <p className="text-green-200 text-xs">Been Like Local AI</p>
            </div>
            <div className="ml-auto flex items-center gap-1">
              <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
              <span className="text-green-200 text-xs">Online</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-green-600 text-white rounded-br-sm"
                    : "bg-neutral-800 text-white/90 rounded-bl-sm"
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-neutral-800 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className="w-2 h-2 bg-white/40 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 150}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Quick Prompts — show only at start */}
          {messages.length === 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0">
              {QUICK_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(p)}
                  disabled={loading}
                  className="text-xs bg-neutral-800 hover:bg-neutral-700 text-white/70 px-3 py-1.5 rounded-full transition border border-white/10 disabled:opacity-40"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-white/10 flex gap-2 shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) sendMessage(); }}
              placeholder="Budget, days, vibe..."
              disabled={loading}
              className="flex-1 bg-neutral-800 text-white text-sm px-4 py-2 rounded-xl outline-none placeholder:opacity-30 border border-white/10 focus:border-green-500 transition disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="bg-green-600 hover:bg-green-500 disabled:opacity-40 text-white px-4 py-2 rounded-xl transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}