"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";
import RoutePlanner from "@/components/RoutePlanner";

function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md py-4">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-xl tracking-widest uppercase">
          Been Like Local
        </Link>
        <div className="hidden md:flex gap-8 text-white text-sm tracking-wider">
          <Link href="/" className="hover:opacity-60 transition uppercase">Home</Link>
          <Link href="/#destinations" className="hover:opacity-60 transition uppercase">Destinations</Link>
          <Link href="/about" className="hover:opacity-60 transition uppercase">About</Link>
          <Link href="/blog" className="hover:opacity-60 transition uppercase">Blog</Link>
          <Link href="/plan" className="opacity-100 border-b border-white uppercase">Plan Trip</Link>
        </div>
      </div>
    </nav>
  );
}

function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const destinations = [
  "Spiti Valley", "Ladakh", "Zanskar", "Kasol", "Chakrata",
  "Manali", "Jispa", "Jibhi", "Udaipur", "Rishikesh",
  "Banswara", "Barot Valley", "Jaisalmer", "Dharamshala","Kedarnath",
];

// ─── BUDGET CALCULATOR ────────────────────────────────────────────────────────
function BudgetCalculator() {
  const [form, setForm] = useState({
    destination: "Manali",
    people: 2,
    days: 4,
    stay: "budget",
    transport: "own",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const calculate = async () => {
    setLoading(true);
    setResult(null);

    const prompt = `<s>[INST] You are a travel budget expert for India.

Calculate a detailed trip budget for:
- Destination: ${form.destination}
- People: ${form.people}
- Days: ${form.days}
- Stay type: ${form.stay} (budget = hostels/cheap hotels ₹500-800/night, mid = ₹1000-2000/night, luxury = ₹3000+/night)
- Transport: ${form.transport} (own vehicle = fuel only, public = buses/shared taxis, cab = private cabs)

Give a breakdown in this EXACT format:
ACCOMMODATION: ₹[amount]
FOOD: ₹[amount]
TRANSPORT: ₹[amount]
ACTIVITIES: ₹[amount]
MISCELLANEOUS: ₹[amount]
TOTAL PER PERSON: ₹[amount]
TOTAL FOR GROUP: ₹[amount]
TIP: [one practical money saving tip]

Keep numbers realistic for India travel. [/INST]`;

    try {
      const response = await fetch("/api/trip-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: prompt }),
      });

      const data = await response.json();
      let text = "";

      if (Array.isArray(data) && data[0]?.generated_text) {
        text = data[0].generated_text.trim();
      } else if (data?.generated_text) {
        text = data.generated_text.trim();
      } else if (data?.error) {
        text = "MODEL_LOADING";
      }

      setResult(text);
    } catch {
      setResult("ERROR");
    }

    setLoading(false);
  };

  const parseResult = (text) => {
    if (!text || text === "MODEL_LOADING" || text === "ERROR") return null;
    const lines = text.split("\n").filter(l => l.trim());
    return lines;
  };

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center text-xl">💰</div>
        <div>
          <h3 className="text-xl font-semibold">AI Budget Calculator</h3>
          <p className="text-xs opacity-40">Get a realistic trip budget estimate</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs opacity-50 uppercase tracking-widest mb-2">Destination</label>
          <select
            value={form.destination}
            onChange={(e) => setForm({ ...form, destination: e.target.value })}
            className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded-xl text-sm focus:border-green-500 outline-none transition"
          >
            {destinations.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs opacity-50 uppercase tracking-widest mb-2">Number of People</label>
          <select
            value={form.people}
            onChange={(e) => setForm({ ...form, people: e.target.value })}
            className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded-xl text-sm focus:border-green-500 outline-none transition"
          >
            {[1,2,3,4,5,6,8,10].map((n) => (
              <option key={n} value={n}>{n} {n === 1 ? "Person" : "People"}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs opacity-50 uppercase tracking-widest mb-2">Duration</label>
          <select
            value={form.days}
            onChange={(e) => setForm({ ...form, days: e.target.value })}
            className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded-xl text-sm focus:border-green-500 outline-none transition"
          >
            {[2,3,4,5,6,7,8,10,14].map((n) => (
              <option key={n} value={n}>{n} Days</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs opacity-50 uppercase tracking-widest mb-2">Stay Type</label>
          <select
            value={form.stay}
            onChange={(e) => setForm({ ...form, stay: e.target.value })}
            className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded-xl text-sm focus:border-green-500 outline-none transition"
          >
            <option value="budget">Budget (Hostel / Cheap Hotel)</option>
            <option value="mid">Mid Range (3-star hotel)</option>
            <option value="luxury">Luxury (4-5 star)</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs opacity-50 uppercase tracking-widest mb-2">Transport Mode</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "own", label: "🏍️ Own Vehicle", desc: "Bike / Car" },
              { value: "public", label: "🚌 Public Transport", desc: "Bus / Taxi" },
              { value: "cab", label: "🚗 Private Cab", desc: "Hired cab" },
            ].map((opt) => (
              <button
                key={opt.value}
                onClick={() => setForm({ ...form, transport: opt.value })}
                className={`p-3 rounded-xl border text-left transition-all ${
                  form.transport === opt.value
                    ? "border-green-500 bg-green-500/10"
                    : "border-white/10 hover:border-white/30"
                }`}
              >
                <p className="text-sm">{opt.label}</p>
                <p className="text-xs opacity-40 mt-0.5">{opt.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={calculate}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-semibold tracking-widest uppercase text-sm transition disabled:opacity-50"
      >
        {loading ? "Calculating..." : "Calculate Budget →"}
      </motion.button>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mt-6 flex items-center gap-3 text-sm opacity-60"
          >
            <div className="flex gap-1">
              {[0,1,2].map((i) => (
                <span key={i} className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
            AI is calculating your budget...
          </motion.div>
        )}

        {result && result !== "MODEL_LOADING" && result !== "ERROR" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 bg-black rounded-xl p-6 border border-green-500/20"
          >
            <p className="text-xs opacity-40 uppercase tracking-widest mb-4">Budget Breakdown</p>
            <div className="space-y-2">
              {parseResult(result)?.map((line, i) => (
                <div key={i} className={`text-sm ${line.includes("TOTAL") ? "text-green-400 font-semibold text-base mt-3" : "opacity-70"}`}>
                  {line}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {result === "MODEL_LOADING" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-sm opacity-50 text-center">
            ☕ Model is warming up. Try again in 20 seconds!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── BEST TIME SUGGESTER ──────────────────────────────────────────────────────
function BestTimeSuggester() {
  const [destination, setDestination] = useState("Spiti Valley");
  const [month, setMonth] = useState("June");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const check = async () => {
    setLoading(true);
    setResult(null);

    const prompt = `<s>[INST] You are an expert on Indian travel and weather conditions.

Answer this question about visiting ${destination} in ${month}:

1. Is it a GOOD, AVERAGE, or BAD time to visit? (state clearly)
2. Weather conditions in ${month}
3. What to expect (crowds, road conditions, activities available)
4. What to pack for this time
5. Any warnings or special considerations

Keep answer concise, practical, and under 120 words. Start with GOOD TIME, AVERAGE TIME, or BAD TIME in caps. [/INST]`;

    try {
      const response = await fetch("/api/trip-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: prompt }),
      });

      const data = await response.json();
      let text = "";

      if (Array.isArray(data) && data[0]?.generated_text) {
        text = data[0].generated_text.trim();
      } else if (data?.generated_text) {
        text = data.generated_text.trim();
      } else if (data?.error) {
        text = "MODEL_LOADING";
      }

      setResult(text);
    } catch {
      setResult("ERROR");
    }

    setLoading(false);
  };

  const getRating = (text) => {
    if (!text) return null;
    if (text.toUpperCase().includes("GOOD TIME")) return "good";
    if (text.toUpperCase().includes("BAD TIME")) return "bad";
    return "average";
  };

  const rating = getRating(result);

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-xl">🗓️</div>
        <div>
          <h3 className="text-xl font-semibold">Best Time to Visit</h3>
          <p className="text-xs opacity-40">AI-powered travel timing advice</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs opacity-50 uppercase tracking-widest mb-2">Destination</label>
          <select
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded-xl text-sm focus:border-orange-500 outline-none transition"
          >
            {destinations.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs opacity-50 uppercase tracking-widest mb-2">When are you planning to go?</label>
          <div className="grid grid-cols-4 gap-2">
            {months.map((m) => (
              <button
                key={m}
                onClick={() => setMonth(m)}
                className={`py-2 px-2 rounded-lg text-xs transition-all border ${
                  month === m
                    ? "border-orange-500 bg-orange-500/10 text-orange-400"
                    : "border-white/10 opacity-60 hover:opacity-100 hover:border-white/30"
                }`}
              >
                {m.slice(0, 3)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={check}
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-400 text-white py-4 rounded-xl font-semibold tracking-widest uppercase text-sm transition disabled:opacity-50"
      >
        {loading ? "Checking..." : "Check Best Time →"}
      </motion.button>

      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mt-6 flex items-center gap-3 text-sm opacity-60"
          >
            <div className="flex gap-1">
              {[0,1,2].map((i) => (
                <span key={i} className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
            Checking travel conditions...
          </motion.div>
        )}

        {result && result !== "MODEL_LOADING" && result !== "ERROR" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 rounded-xl p-6 border ${
              rating === "good" ? "bg-green-500/10 border-green-500/30" :
              rating === "bad" ? "bg-red-500/10 border-red-500/30" :
              "bg-orange-500/10 border-orange-500/30"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">
                {rating === "good" ? "✅" : rating === "bad" ? "❌" : "⚠️"}
              </span>
              <span className={`text-sm font-semibold uppercase tracking-widest ${
                rating === "good" ? "text-green-400" :
                rating === "bad" ? "text-red-400" :
                "text-orange-400"
              }`}>
                {destination} in {month}
              </span>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">{result}</p>
          </motion.div>
        )}

        {result === "MODEL_LOADING" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-sm opacity-50 text-center">
            ☕ Model is warming up. Try again in 20 seconds!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function PlanTrip() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="pt-32 pb-16 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.4, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xs tracking-[0.4em] uppercase mb-4"
        >
          Powered by AI
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="text-5xl md:text-6xl font-bold mb-6"
        >
          Plan Your Trip
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: 0.4 }}
          className="max-w-lg mx-auto text-sm leading-relaxed"
        >
          Budget estimates, timing advice, and route planning — everything you need before you book.
        </motion.p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 space-y-8">

        {/* Row 1 — Budget + Best Time */}
        <div className="grid md:grid-cols-2 gap-8">
          <FadeIn delay={0}>
            <BudgetCalculator />
          </FadeIn>
          <FadeIn delay={0.15}>
            <BestTimeSuggester />
          </FadeIn>
        </div>

        {/* Row 2 — Route Planner (full width) */}
        <FadeIn delay={0.1} id="route-planner">
          <RoutePlanner />
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={0.2} className="mt-8 text-center">
          <p className="opacity-40 text-sm mb-6">Ready to go?</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/#destinations"
                className="inline-block bg-white text-black px-8 py-3 rounded-full text-sm font-bold tracking-widest uppercase"
              >
                Browse Destinations
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/about"
                className="inline-block border border-white/30 text-white px-8 py-3 rounded-full text-sm tracking-widest uppercase"
              >
                About Been Like Local
              </Link>
            </motion.div>
          </div>
        </FadeIn>
      </section>

      <footer className="bg-black border-t border-white/10 py-10 text-center">
        <p className="text-xs opacity-30 tracking-widest uppercase">
          © 2025 Been Like Local — Travel Beyond the Obvious
        </p>
      </footer>
    </main>
  );
}