"use client";

import { useState, use, useRef, useEffect } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ─── FADE IN ─────────────────────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >{children}</motion.div>
  );
}

// ─── DIFFICULTY METER ─────────────────────────────────────────────────────────
function DifficultyBar({ label, value, color = "bg-green-500" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="opacity-50">{label}</span>
        <span className="opacity-70">{value}/10</span>
      </div>
      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={isInView ? { width: `${value * 10}%` } : {}}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

// ─── WEATHER WIDGET ───────────────────────────────────────────────────────────
function WeatherWidget({ destination }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  const coords = {
    "Spiti Valley":   { lat: 32.2311, lon: 78.0338, alt: 3800 },
    "Ladakh":         { lat: 34.1642, lon: 77.5848, alt: 3500 },
    "Zanskar":        { lat: 33.5200, lon: 76.8700, alt: 3700 },
    "Kasol":          { lat: 32.0100, lon: 77.3140, alt: 1580 },
    "Chakrata":       { lat: 30.6980, lon: 77.8720, alt: 2118 },
    "Manali":         { lat: 32.2432, lon: 77.1892, alt: 2050 },
    "Jispa":          { lat: 32.6488, lon: 77.2150, alt: 3200 },
    "Jibhi":          { lat: 31.8120, lon: 77.3800, alt: 1600 },
    "Udaipur":        { lat: 24.5854, lon: 73.7125, alt: 598  },
    "Rishikesh":      { lat: 30.0869, lon: 78.2676, alt: 372  },
    "Banswara":       { lat: 23.5460, lon: 74.4410, alt: 209  },
    "Barot Valley":   { lat: 31.9890, lon: 76.8460, alt: 1800 },
    "Jaisalmer":      { lat: 26.9157, lon: 70.9083, alt: 225  },
    "Dharamshala":    { lat: 32.2190, lon: 76.3234, alt: 1457 },
  };

  useEffect(() => {
    const c = coords[destination];
    if (!c) { setLoading(false); return; }

    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}&current=temperature_2m,weathercode,windspeed_10m,relative_humidity_2m&elevation=${c.alt}&timezone=Asia/Kolkata`)
      .then(r => r.json())
      .then(data => {
        const code = data.current.weathercode;
        const conditions = {
          0: { label: "Clear Sky", emoji: "☀️" },
          1: { label: "Mainly Clear", emoji: "🌤️" },
          2: { label: "Partly Cloudy", emoji: "⛅" },
          3: { label: "Overcast", emoji: "☁️" },
          45: { label: "Foggy", emoji: "🌫️" },
          48: { label: "Icy Fog", emoji: "🌫️" },
          51: { label: "Light Drizzle", emoji: "🌦️" },
          61: { label: "Light Rain", emoji: "🌧️" },
          71: { label: "Light Snow", emoji: "🌨️" },
          80: { label: "Rain Showers", emoji: "🌧️" },
          95: { label: "Thunderstorm", emoji: "⛈️" },
        };
        const condition = conditions[code] || { label: "Variable", emoji: "🌡️" };
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          condition: condition.label,
          emoji: condition.emoji,
          wind: Math.round(data.current.windspeed_10m),
          humidity: data.current.relative_humidity_2m,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [destination]);

  if (loading) return (
    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 animate-pulse">
      <div className="h-4 bg-white/10 rounded w-24 mb-3" />
      <div className="h-8 bg-white/10 rounded w-16" />
    </div>
  );

  if (!weather) return null;

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
      <p className="text-xs opacity-40 uppercase tracking-widest mb-4">Live Weather</p>
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-4xl font-bold">{weather.temp}°C</span>
          <p className="text-sm opacity-60 mt-1">{weather.condition}</p>
        </div>
        <span className="text-5xl">{weather.emoji}</span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-black/40 rounded-xl p-3">
          <p className="opacity-40 mb-1">Wind</p>
          <p className="font-semibold">{weather.wind} km/h</p>
        </div>
        <div className="bg-black/40 rounded-xl p-3">
          <p className="opacity-40 mb-1">Humidity</p>
          <p className="font-semibold">{weather.humidity}%</p>
        </div>
      </div>
    </div>
  );
}

// ─── AI PACKING LIST ──────────────────────────────────────────────────────────
function PackingList({ tripName, tripType }) {
  const [month, setMonth] = useState("June");
  const [travelMode, setTravelMode] = useState("car");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const generate = async () => {
    setLoading(true);
    setResult(null);
    try {
      const prompt = `Create a practical packing list for a trip to ${tripName} in ${month} traveling by ${travelMode}.

Format your response EXACTLY like this with these exact sections:

CLOTHING:
• [item] - [why needed]
• [item] - [why needed]

ESSENTIALS:
• [item] - [why needed]
• [item] - [why needed]

MEDICINES:
• [item] - [why needed]

DOCUMENTS:
• [item]

PRO TIPS:
• [one line tip]
• [one line tip]

DON'T BRING:
• [item] - [reason]

Keep each section to 4-5 items max. Be specific to ${tripName} and ${month} weather.`;

      const response = await fetch("/api/trip-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: prompt }),
      });
      const data = await response.json();
      if (Array.isArray(data) && data[0]?.generated_text) {
        setResult(data[0].generated_text.trim());
      } else if (data?.generated_text) {
        setResult(data.generated_text.trim());
      } else {
        setResult("error");
      }
    } catch {
      setResult("error");
    }
    setLoading(false);
  };

  const parseSection = (text, section) => {
    const regex = new RegExp(`${section}:\\n([\\s\\S]*?)(?=\\n[A-Z ]+:|$)`);
    const match = text.match(regex);
    return match ? match[1].trim().split('\n').filter(l => l.trim().startsWith('•')) : [];
  };

  const sections = result && result !== "error" ? [
    { title: "👕 Clothing", key: "CLOTHING", color: "text-blue-400" },
    { title: "🎒 Essentials", key: "ESSENTIALS", color: "text-green-400" },
    { title: "💊 Medicines", key: "MEDICINES", color: "text-red-400" },
    { title: "📄 Documents", key: "DOCUMENTS", color: "text-yellow-400" },
    { title: "💡 Pro Tips", key: "PRO TIPS", color: "text-purple-400" },
    { title: "🚫 Don't Bring", key: "DON'T BRING", color: "text-orange-400" },
  ] : [];

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center text-xl">🎒</div>
        <div>
          <h3 className="font-semibold">AI Packing List</h3>
          <p className="text-xs opacity-40">Personalized for {tripName}</p>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div>
          <label className="text-xs opacity-50 uppercase tracking-widest block mb-2">Travel Month</label>
          <div className="grid grid-cols-4 gap-1.5">
            {months.map(m => (
              <button key={m} onClick={() => setMonth(m)}
                className={`py-1.5 rounded-lg text-xs transition-all border ${
                  month === m ? "border-green-500 bg-green-500/10 text-green-400" : "border-white/10 opacity-50 hover:opacity-80"
                }`}
              >{m.slice(0,3)}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs opacity-50 uppercase tracking-widest block mb-2">Travel Mode</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "bike", label: "🏍️ Bike" },
              { value: "car", label: "🚗 Car" },
              { value: "bus", label: "🚌 Bus" },
            ].map(opt => (
              <button key={opt.value} onClick={() => setTravelMode(opt.value)}
                className={`py-2 rounded-xl text-xs border transition-all ${
                  travelMode === opt.value ? "border-green-500 bg-green-500/10 text-green-400" : "border-white/10 opacity-60 hover:opacity-100"
                }`}
              >{opt.label}</button>
            ))}
          </div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={generate} disabled={loading}
        className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl text-sm font-semibold tracking-widest uppercase transition disabled:opacity-50 mb-4"
      >
        {loading ? "Generating..." : "Generate Packing List →"}
      </motion.button>

      {loading && (
        <div className="flex items-center gap-3 text-sm opacity-50">
          <div className="flex gap-1">
            {[0,1,2].map(i => (
              <span key={i} className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: `${i*150}ms` }} />
            ))}
          </div>
          AI is building your list...
        </div>
      )}

      {result === "error" && (
        <p className="text-sm text-red-400">Something went wrong. Please try again.</p>
      )}

      {result && result !== "error" && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          {sections.map(section => {
            const items = parseSection(result, section.key);
            if (!items.length) return null;
            return (
              <div key={section.key} className="bg-black/40 rounded-xl p-4">
                <p className={`text-xs font-semibold uppercase tracking-widest mb-3 ${section.color}`}>{section.title}</p>
                <div className="space-y-1.5">
                  {items.map((item, i) => (
                    <p key={i} className="text-xs opacity-70 leading-relaxed">{item}</p>
                  ))}
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

// ─── AI SAFETY CHECKER ────────────────────────────────────────────────────────
function SafetyChecker({ tripName }) {
  const [month, setMonth] = useState("June");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const fullMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];

  const check = async () => {
    setLoading(true);
    setResult(null);
    try {
      const prompt = `Is it safe and recommended to visit ${tripName} in ${fullMonths[months.indexOf(month)]}?

Answer in this EXACT format:

VERDICT: [GREAT TIME / GOOD TIME / AVERAGE TIME / BAD TIME]

WEATHER: [2 sentences about weather in this month]

ROADS: [1 sentence about road/accessibility conditions]

CROWDS: [Low / Medium / High] - [one sentence explanation]

BEST ALTERNATIVE: [If bad time, suggest better month. If good time, say "This is already a great time!"]

WARNING: [One important thing to watch out for, or "None" if all clear]

Keep it concise and practical.`;

      const response = await fetch("/api/trip-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: prompt }),
      });
      const data = await response.json();
      const text = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
      setResult(text?.trim() || "error");
    } catch { setResult("error"); }
    setLoading(false);
  };

  const getVerdict = (text) => {
    if (!text) return null;
    if (text.includes("GREAT TIME")) return { label: "Great Time", color: "text-green-400", bg: "bg-green-500/10 border-green-500/30", emoji: "✅" };
    if (text.includes("GOOD TIME")) return { label: "Good Time", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30", emoji: "👍" };
    if (text.includes("AVERAGE TIME")) return { label: "Average Time", color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", emoji: "⚠️" };
    if (text.includes("BAD TIME")) return { label: "Avoid This Month", color: "text-red-400", bg: "bg-red-500/10 border-red-500/30", emoji: "❌" };
    return { label: "Check Result", color: "text-white", bg: "bg-white/5 border-white/20", emoji: "🔍" };
  };

  const verdict = getVerdict(result);

  const getLine = (text, key) => {
    const regex = new RegExp(`${key}: (.+)`);
    const match = text?.match(regex);
    return match ? match[1].trim() : null;
  };

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-xl">🛡️</div>
        <div>
          <h3 className="font-semibold">Is It Safe to Visit?</h3>
          <p className="text-xs opacity-40">AI-powered season check</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs opacity-50 uppercase tracking-widest block mb-2">Pick Month</label>
        <div className="grid grid-cols-6 gap-1.5">
          {months.map(m => (
            <button key={m} onClick={() => setMonth(m)}
              className={`py-1.5 rounded-lg text-xs transition-all border ${
                month === m ? "border-blue-500 bg-blue-500/10 text-blue-400" : "border-white/10 opacity-50 hover:opacity-80"
              }`}
            >{m}</button>
          ))}
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
        onClick={check} disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl text-sm font-semibold tracking-widest uppercase transition disabled:opacity-50 mb-4"
      >
        {loading ? "Checking..." : "Check Safety →"}
      </motion.button>

      {loading && (
        <div className="flex items-center gap-2 text-sm opacity-50">
          <div className="flex gap-1">
            {[0,1,2].map(i => <span key={i} className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: `${i*150}ms` }} />)}
          </div>
          Analyzing conditions...
        </div>
      )}

      {result && result !== "error" && verdict && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
          <div className={`rounded-xl p-4 border ${verdict.bg}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{verdict.emoji}</span>
              <span className={`font-bold ${verdict.color}`}>{verdict.label}</span>
            </div>
            <p className="text-xs opacity-50">{tripName} in {fullMonths[months.indexOf(month)]}</p>
          </div>

          {[
            { key: "WEATHER", label: "🌤️ Weather" },
            { key: "ROADS", label: "🛣️ Roads" },
            { key: "CROWDS", label: "👥 Crowds" },
            { key: "BEST ALTERNATIVE", label: "💡 Suggestion" },
            { key: "WARNING", label: "⚠️ Warning" },
          ].map(item => {
            const line = getLine(result, item.key);
            if (!line || line === "None") return null;
            return (
              <div key={item.key} className="bg-black/40 rounded-xl p-3">
                <p className="text-xs opacity-40 mb-1">{item.label}</p>
                <p className="text-sm opacity-80 leading-relaxed">{line}</p>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

// ─── TRIPS DATA ───────────────────────────────────────────────────────────────
const trips = {
  spiti: {
    name: "Spiti Valley",
    image: "/photos/spiti.jpg",
    days: "8-10 Days",
    price: 18000,
    type: "explore",
    tagline: "The Land of Monasteries and High Altitude Desert",
    about: "Spiti Valley is a cold desert mountain valley located high in the Himalayas in the northeastern part of Himachal Pradesh. It is one of the least populated regions in India — raw, remote, and absolutely breathtaking.",
    difficulty: { fitness: 8, roads: 9, altitude: 9, budget: 6, overall: "Hard Trip ⚠️" },
    food: [
      { name: "Sakya Cafe, Kaza", emoji: "☕", desc: "Best cafe in Spiti — thukpa, momos, and apple tea. Run by a local family. Always warm." },
      { name: "Sol Cafe, Kaza", emoji: "🍽️", desc: "Rooftop views of the valley. Try the yak cheese pizza — sounds weird, tastes incredible." },
      { name: "Milma Restaurant, Kaza", emoji: "🥘", desc: "Local Spitian food — dal, sabzi, rice. Cheapest and most authentic. Eat like a local." },
      { name: "Sichey Bakery", emoji: "🥐", desc: "Fresh baked goods every morning. Get there early — sells out by 9am." },
    ],
    sunriseSunset: [
      { type: "🌅 Sunrise", name: "Langza Village", desc: "Watch the first light hit the Buddha statue with snow peaks behind — nothing else like it in India." },
      { type: "🌄 Sunset", name: "Chandratal Lake", desc: "The lake turns blood orange at sunset. Reflection in the still water — photographers weep here." },
      { type: "🌄 Sunset", name: "Key Monastery Rooftop", desc: "The monastery glows golden at dusk. Monks doing evening prayers as the sun sets — magical." },
    ],
    places: [
      { name: "Key Monastery", emoji: "🏯", desc: "1000-year-old monastery perched at 4166m. Morning prayers at 6am are open to visitors — hauntingly beautiful." },
      { name: "Chandratal Lake", emoji: "💙", desc: "Crescent-shaped alpine lake at 4300m. Crystal blue water surrounded by barren mountains — surreal and sacred." },
      { name: "Kibber Village", emoji: "🏘️", desc: "One of the highest inhabited villages in the world. Tiny, quiet, ancient stone houses with mountain backdrop." },
      { name: "Kaza Town", emoji: "🏙️", desc: "The main town and only ATM in Spiti. Stock up on cash, fuel, and supplies before heading deeper." },
      { name: "Pin Valley National Park", emoji: "🦁", desc: "Home to Snow Leopards and Ibex. One of the best chances in India to spot Snow Leopard in winter." },
    ],
    offbeat: [
      { name: "Langza Village", emoji: "🦕", desc: "Marine fossils at 4400m — proof this was once an ocean floor. A giant Buddha watches over the valley." },
      { name: "Hikkim Post Office", emoji: "📮", desc: "World's highest post office at 4440m. Send a postcard — it actually arrives. The postmaster is legendary." },
      { name: "Dhankar Monastery", emoji: "⛪", desc: "Precariously balanced on a cliff edge that looks structurally impossible. 1200 years old and still standing." },
      { name: "Tabo Monastery", emoji: "🎨", desc: "Called the Ajanta of the Himalayas. 1000-year-old murals inside — Dalai Lama chose this for his final meditation." },
    ],
    itinerary: [
      { day: "Day 1", place: "Manali → Kaza via Kunzum Pass", points: ["Atal Tunnel crossing (world's longest high altitude tunnel)", "Kunzum Pass at 4590m — offer a prayer at the temple", "First views of the Spiti desert landscape", "Reach Kaza by evening, rest and acclimatize"] },
      { day: "Day 2", place: "Key Monastery & Kibber Village", points: ["Key Monastery morning prayers at 6am", "Walk through the 1000-year-old monastery halls", "Drive to Kibber — highest motorable village", "Spot Blue Sheep and Himalayan Magpie in the fields"] },
      { day: "Day 3", place: "Langza, Hikkim & Komik", points: ["Langza village — collect marine fossils from the ground", "Visit Hikkim — post a letter from world's highest post office", "Komik monastery — world's highest monastery accessible by road", "Panoramic views of the entire Spiti Valley"] },
      { day: "Day 4", place: "Dhankar & Tabo", points: ["Dhankar Monastery — perched impossibly on a cliff", "Dhankar Lake trek (2km) — hidden lake above the monastery", "Tabo Monastery — 1000-year-old murals, photography not allowed inside", "Stay overnight in Tabo for quiet mornings"] },
      { day: "Day 5", place: "Pin Valley National Park", points: ["Enter Pin Valley — Snow Leopard country", "Mudh village — the last village in Pin Valley", "Look for Ibex and Snow Leopard tracks", "Sangam point — where Pin river meets Spiti river"] },
      { day: "Day 6", place: "Chandratal Lake", points: ["Early morning drive to Chandratal", "3km walk around the lake — no vehicles allowed", "Watch the lake change colors through the day", "Camp overnight by the lake if permits available"] },
      { day: "Day 7", place: "Kaza Local Exploration", points: ["Explore Kaza market and local shops", "Try yak cheese and Spitian apples", "Visit the local school — community interaction", "Evening at Sol Cafe watching the valley turn golden"] },
      { day: "Day 8", place: "Return to Manali", points: ["Early departure via Kunzum Pass", "Stop at Chandra Tal on the way back", "Atal Tunnel crossing back into Kullu valley", "Reach Manali by evening"] },
    ],
    tips: [
      "Best time to visit: June to September",
      "Carry warm clothes even in summer — temperatures drop to 0°C at night",
      "Altitude sickness is common — acclimatize in Kaza for 1 day before going higher",
      "Carry minimum ₹15,000 cash — only one ATM in Kaza, often not working",
      "Download offline maps before leaving Manali — no internet in most of Spiti",
    ],
  },

  ladakh: {
    name: "Ladakh",
    image: "/photos/ladakh.jpg",
    days: "8-10 Days",
    price: 28000,
    type: "explore",
    tagline: "The Land of High Passes",
    about: "Ladakh is India's northernmost region — a high-altitude desert that sits between the Himalayan and Karakoram ranges. Home to ancient monasteries, crystal clear lakes, and the most dramatic landscapes on earth.",
    difficulty: { fitness: 7, roads: 7, altitude: 9, budget: 5, overall: "Challenging Trip ⚠️" },
    food: [
      { name: "Lamayuru Restaurant, Leh", emoji: "🍜", desc: "Best thukpa and momos in Leh. Rooftop seating with views of the mountains. Always packed with locals." },
      { name: "Chopsticks Noodle Bar, Leh", emoji: "🥢", desc: "Tibetan and Ladakhi cuisine. Try the Skyu (traditional pasta) — hearty and warming at altitude." },
      { name: "Bon Appetit, Leh", emoji: "☕", desc: "Best coffee in Ladakh. Western food done right. Good for breakfast before long drives." },
      { name: "Gesmo Restaurant, Leh", emoji: "🍽️", desc: "Old Leh classic. Budget friendly, huge portions. Travellers have been coming here for 30 years." },
    ],
    sunriseSunset: [
      { type: "🌅 Sunrise", name: "Shanti Stupa", desc: "The white stupa turns gold at first light. Leh city below wakes up slowly — peaceful and profound." },
      { type: "🌅 Sunrise", name: "Pangong Lake", desc: "Watch the lake turn from black to blue to turquoise as the sun rises behind the mountains." },
      { type: "🌄 Sunset", name: "Magnetic Hill Road", desc: "Drive to Magnetic Hill at sunset — the entire valley turns orange and purple. No tourists at this hour." },
    ],
    places: [
      { name: "Pangong Lake", emoji: "💙", desc: "The iconic blue lake at 4350m. Colors shift from turquoise to blue to green through the day. Breathtaking at any hour." },
      { name: "Nubra Valley", emoji: "🐪", desc: "A green oasis in the Himalayan desert with double-humped Bactrian camels. Reached via Khardung La pass." },
      { name: "Leh Palace", emoji: "🏯", desc: "9-storey palace built in the 17th century. Overlooks all of Leh. Sunrise from the top is unforgettable." },
      { name: "Khardung La", emoji: "🛣️", desc: "One of the world's highest motorable roads at 5359m. The air is thin, the views are infinite." },
      { name: "Shanti Stupa", emoji: "☮️", desc: "White-domed Buddhist stupa on a hilltop. 500 steps up — worth every step for the sunset views." },
    ],
    offbeat: [
      { name: "Tso Moriri Lake", emoji: "🦢", desc: "Less visited than Pangong but equally stunning. Flamingos nest here. Camping by the shore is allowed." },
      { name: "Alchi Monastery", emoji: "🎨", desc: "11th century monastery with the finest ancient Buddhist art in all of Ladakh. Barely any tourists." },
      { name: "Hemis Monastery Festival", emoji: "🎭", desc: "In July — monks perform in elaborate costumes. One of the most colorful festivals in the Himalayas." },
      { name: "Nimmu Village", emoji: "🏘️", desc: "Where the Zanskar and Indus rivers merge — one of the most dramatic river confluences in India." },
    ],
    itinerary: [
      { day: "Day 1", place: "Leh Arrival — Acclimatization", points: ["Rest completely — do not exert yourself", "Short walk to Leh market in the evening only", "Drink lots of water, avoid alcohol", "Sleep early — body needs to adjust to 3500m altitude"] },
      { day: "Day 2", place: "Leh Local Sightseeing", points: ["Shanti Stupa at sunrise — 500 steps, stunning views", "Leh Palace — 9 storeys of royal history", "Hall of Fame museum — Kargil War memorial", "Leh market for local shopping in the evening"] },
      { day: "Day 3", place: "Nubra Valley via Khardung La", points: ["Cross Khardung La at 5359m — world's highest motorable road", "Diskit Monastery — giant Maitreya Buddha overlooking the valley", "Hunder village — Bactrian camel ride in the sand dunes", "Stay overnight in Nubra Valley"] },
      { day: "Day 4", place: "Pangong Lake", points: ["Drive via Shyok Valley — stunning river road", "First view of Pangong — you will stop the car and just stare", "Walk along the shore — water is ice cold even in summer", "Watch the lake change colors at sunset — camp overnight if possible"] },
      { day: "Day 5", place: "Tso Moriri Lake", points: ["Drive from Pangong via Chushul — remote and dramatic", "Korzok village — highest permanent settlement by a lake in India", "Spot migratory birds including Bar-headed Geese", "Overnight stay in Korzok for the silence"] },
      { day: "Day 6", place: "Monasteries Day", points: ["Thiksey Monastery — sunrise ceremony at 6am with monks", "Hemis Monastery — largest in Ladakh, rich museum", "Alchi Monastery — 11th century murals, barely any tourists", "Likir Monastery — giant Buddha statue overlooking green valley"] },
      { day: "Day 7", place: "Magnetic Hill & Confluence", points: ["Magnetic Hill — the famous optical illusion road", "Pathar Sahib Gurudwara — peaceful and beautiful", "Nimmu confluence — where Zanskar meets Indus, dramatic colors", "Final Leh market shopping and packing"] },
      { day: "Day 8", place: "Departure", points: ["Early morning flight from Leh", "Or drive towards Manali via Jispa (2 day drive)", "Last views of the Stok Kangri peak from the airport"] },
    ],
    tips: [
      "Fly to Leh — first day rest completely, do not trek or climb",
      "Inner Line Permit required for Nubra, Pangong and Tso Moriri — get online",
      "Best time: June to September. July-August is peak season",
      "Night temperatures drop below 0°C even in summer — pack accordingly",
      "Carry altitude sickness medicine (Diamox) — consult a doctor before",
    ],
  },

  kasol: {
    name: "Kasol",
    image: "/photos/kasol.jpg",
    days: "4 Days",
    price: 7000,
    type: "explore",
    tagline: "Mini Israel of India",
    about: "Kasol is a small hamlet in the Parvati Valley of Himachal Pradesh. Known for its hippie culture, pine forests, and the Parvati River — a gateway to some of the most stunning treks in the region.",
    difficulty: { fitness: 5, roads: 5, altitude: 4, budget: 8, overall: "Easy Trip ✅" },
    food: [
      { name: "Jim Morrison Cafe", emoji: "🎸", desc: "The most famous cafe in Kasol. Israeli food, good music, Parvati river views. Get the shakshuka." },
      { name: "Evergreen Cafe", emoji: "🌿", desc: "Old school Kasol. Best falafel and hummus outside Israel. Cheap and filling." },
      { name: "Moon Dance Cafe, Chalal", emoji: "🌙", desc: "Hidden in Chalal village across the bridge. Rooftop with river views. Local owner, genuine vibe." },
      { name: "Doon Bakery", emoji: "🥐", desc: "Fresh bread, croissants, cookies. Perfect for morning before a trek. Very popular with trekkers." },
    ],
    sunriseSunset: [
      { type: "🌅 Sunrise", name: "Kheerganga Hot Spring", desc: "After the 12km overnight trek, watch sunrise from the natural hot spring at 3050m. Worth every step." },
      { type: "🌄 Sunset", name: "Kasol Riverside", desc: "Sit on the rocks by the Parvati River as the sun sets behind the pine forest. Free, perfect, local." },
    ],
    places: [
      { name: "Parvati River Walk", emoji: "🌊", desc: "The turquoise glacier-fed river running through Kasol. Walk the riverside path at dawn — completely peaceful." },
      { name: "Chalal Village", emoji: "🏘️", desc: "Cross the wooden bridge from Kasol — 20 minutes walk. Quieter, greener, much more local vibe." },
      { name: "Kheerganga Trek", emoji: "🏔️", desc: "12km trek to a natural hot spring at 2950m. Start at 6am, reach by 1pm, soak in the spring." },
      { name: "Manikaran Gurudwara", emoji: "🛕", desc: "Sacred Sikh shrine with natural hot springs. Free langar (food) served 24 hours. Deeply spiritual." },
    ],
    offbeat: [
      { name: "Tosh Village", emoji: "🌿", desc: "4km by jeep beyond Kasol. Apple orchards, mountain panoramas, only a handful of guesthouses." },
      { name: "Kutla Village", emoji: "🏕️", desc: "Above Tosh — tiny camp spot with 360° Himalayan views. Almost no one goes here. Pure isolation." },
      { name: "Grahan Village", emoji: "🌲", desc: "5km forest trek from Kasol. A completely traditional Himachali village hidden in the forest." },
    ],
    itinerary: [
      { day: "Day 1", place: "Kasol Arrival & Exploration", points: ["Arrive in Kasol from Delhi (12 hours) or Chandigarh (6 hours)", "Drop bags and walk to the Parvati River immediately", "Cross the bridge to Chalal village — 20 minute walk", "Evening at Jim Morrison Cafe watching the river"] },
      { day: "Day 2", place: "Manikaran & Tosh", points: ["Morning: Manikaran Sahib Gurudwara — hot spring bath, free langar", "Afternoon: Jeep to Tosh village (30 mins, shared jeep available)", "Walk through Tosh apple orchards", "Evening: Return to Kasol, riverside dinner"] },
      { day: "Day 3", place: "Kheerganga Trek", points: ["Start trek at 6am from Barshaini (30 mins from Kasol)", "Trek through dense forest alongside waterfall — 12km", "Reach Kheerganga by 1pm", "Soak in the natural hot spring — snow peaks all around", "Overnight camping at Kheerganga (highly recommended)"] },
      { day: "Day 4", place: "Return & Departure", points: ["Descend from Kheerganga in the morning", "Return to Kasol for lunch", "Last walk by the Parvati River", "Depart for Delhi or next destination"] },
    ],
    tips: [
      "Best time: March to June, September to November",
      "Avoid monsoon — rivers swell, trekking becomes dangerous",
      "Kheerganga trek is easy to moderate — any reasonable fitness level can do it",
      "ATMs available in Kasol but often empty — carry cash from Bhuntar",
      "Stay in Chalal for a quieter experience than main Kasol",
    ],
  },

  manali: {
    name: "Manali",
    image: "/photos/manali.jpg",
    days: "4 Days",
    price: 8000,
    type: "explore",
    tagline: "Gateway to the Himalayas",
    about: "Manali is where the mountains begin. Sitting at 2050 meters, it is the starting point for Leh, Spiti, and Zanskar journeys. But Manali itself is equally stunning.",
    difficulty: { fitness: 4, roads: 5, altitude: 5, budget: 7, overall: "Easy Trip ✅" },
    food: [
      { name: "Johnson's Cafe", emoji: "🍽️", desc: "Manali's most famous restaurant since 1980s. Trout fish and apple pie are legendary. Must visit." },
      { name: "Drifter's Inn & Cafe, Old Manali", emoji: "☕", desc: "Best breakfast spot in Old Manali. Pancakes, eggs, coffee. Travellers congregation point." },
      { name: "Cafe 1947, Old Manali", emoji: "🎵", desc: "Rooftop cafe with live music in the evening. Pasta, pizza, great vibe. Very popular with backpackers." },
      { name: "Chopsticks Restaurant", emoji: "🥢", desc: "Best Tibetan and Chinese food in Manali. Massive portions, budget prices. Locals eat here too." },
    ],
    sunriseSunset: [
      { type: "🌅 Sunrise", name: "Naggar Castle", desc: "21km from Manali — the castle at dawn with Kullu valley below and snow peaks behind. Stunning." },
      { type: "🌄 Sunset", name: "Solang Valley", desc: "Watch the sun set behind the Beas Kund glacier from Solang. The valley turns completely golden." },
    ],
    places: [
      { name: "Solang Valley", emoji: "⛷️", desc: "14km from Manali. Snow activities in winter, paragliding in summer. Cable car rides available." },
      { name: "Rohtang Pass", emoji: "🏔️", desc: "The famous pass at 3978m. Snow almost year-round. Requires permit — book online 2 days before." },
      { name: "Hadimba Temple", emoji: "🛕", desc: "Ancient wooden pagoda temple in a cedar forest. 16th century. Very atmospheric, especially at dawn." },
      { name: "Old Manali Village", emoji: "☕", desc: "The original village above main town. Backpacker cafes, guesthouses, completely different energy." },
    ],
    offbeat: [
      { name: "Sissu Village, Lahaul", emoji: "🌊", desc: "Cross Atal Tunnel — a waterfall drops straight into the valley. 15km from tunnel, almost no tourists." },
      { name: "Naggar Castle", emoji: "🏯", desc: "500-year-old castle converted to heritage hotel. 21km from Manali, spectacular valley views." },
      { name: "Sethan Village", emoji: "🏕️", desc: "8km from Manali — a tiny village with 6 months of snow. Completely isolated. No other tourists." },
    ],
    itinerary: [
      { day: "Day 1", place: "Manali Arrival & Old Manali", points: ["Arrive in Manali — check into Old Manali for best experience", "Walk to Hadimba Temple through the cedar forest", "Mall Road evening walk — local market, shops", "Dinner at Johnson's Cafe — mandatory first night tradition"] },
      { day: "Day 2", place: "Solang Valley & Atal Tunnel", points: ["Early morning drive to Solang Valley", "Paragliding or snow activities depending on season", "Drive through Atal Tunnel (9km long) into Lahaul", "Sissu waterfall and Lahaul Valley exploration", "Return to Manali by evening"] },
      { day: "Day 3", place: "Rohtang Pass", points: ["Book Rohtang permit online — maximum 1200 vehicles per day", "Early departure — roads get congested by 10am", "First snow at 3978m — snowball fights mandatory", "Chandratal Lake views on clear days", "Return and warm up with soup at Old Manali cafe"] },
      { day: "Day 4", place: "Vashisht & Naggar", points: ["Morning: Vashisht village hot spring bath", "Drive to Naggar Castle — 21km heritage drive", "Roerich Art Gallery at Naggar", "Final Old Manali exploration before departure"] },
    ],
    tips: [
      "October-November for snow, May-June for pleasant weather and green valleys",
      "Rohtang Pass requires online permit — book at admis.hp.nic.in, 2 days in advance",
      "Old Manali has better cafes and vibe than Mall Road — stay there if possible",
      "Base camp for Spiti and Leh — add 2 extra days if continuing onward",
      "Atal Tunnel is open year-round — Lahaul is accessible even in winter now",
    ],
  },

  rishikesh: {
    name: "Rishikesh",
    image: "/photos/rishikesh.jpg",
    days: "3 Days",
    price: 6500,
    type: "relax",
    tagline: "Yoga Capital of the World",
    about: "Rishikesh sits where the Ganga descends from the Himalayas. Ancient temples and modern cafes, yoga ashrams and white-water rafting — a city of beautiful contradictions.",
    difficulty: { fitness: 3, roads: 2, altitude: 1, budget: 8, overall: "Easy Trip ✅" },
    food: [
      { name: "Chotiwala Restaurant", emoji: "🍽️", desc: "The most famous restaurant in Rishikesh since 1958. Pure vegetarian. Try the thali — enormous." },
      { name: "Little Buddha Cafe", emoji: "🌅", desc: "Rooftop cafe over the Ganga. Best sunset spot in Rishikesh. Israeli and Indian food, great smoothies." },
      { name: "Cafe Rana", emoji: "☕", desc: "Hidden gem near Laxman Jhula. Local prices, incredible views, amazing curd rice and chai." },
      { name: "Pyramid Cafe", emoji: "🔺", desc: "Quirky cafe with Ganga views. Good for breakfast before rafting. Muesli and fruit bowl are excellent." },
    ],
    sunriseSunset: [
      { type: "🌅 Sunrise", name: "Triveni Ghat", desc: "Watch the Ganga glow orange at dawn. Fishermen casting nets, pilgrims bathing — the real Rishikesh." },
      { type: "🌄 Sunset", name: "Ganga Aarti, Triveni Ghat", desc: "7pm every evening — priests perform the fire ceremony as the Ganga turns golden. Unforgettable." },
    ],
    places: [
      { name: "Laxman Jhula", emoji: "🌉", desc: "The iconic 1929 suspension bridge. Monkeys, temples, chai shops on both sides. Cross it at dusk." },
      { name: "Triveni Ghat", emoji: "🙏", desc: "The most sacred ghat. Morning dip in the Ganga with locals, evening Aarti at 7pm — powerful." },
      { name: "River Rafting", emoji: "🚣", desc: "Grade 1-4 rapids from Shivpuri (16km). 2-3 hours. Best between September and June." },
      { name: "Neer Garh Waterfall", emoji: "💦", desc: "2km forest walk from town. Tiered waterfall with natural pools. Less crowded than Rajaji." },
    ],
    offbeat: [
      { name: "Beatles Ashram (Chaurasi Kutia)", emoji: "🎸", desc: "Where The Beatles stayed in 1968. Now abandoned, covered in murals. Free entry, surreal atmosphere." },
      { name: "Kunjapuri Temple at Sunrise", emoji: "🌅", desc: "25km from Rishikesh — hilltop temple with the best Himalayan sunrise view in the entire region." },
      { name: "Shivpuri Beach Camping", emoji: "🏕️", desc: "16km upstream — quieter than Rishikesh, better camping, same great river. Far fewer tourists." },
    ],
    itinerary: [
      { day: "Day 1", place: "Arrival & Ganga Aarti", points: ["Arrive in Rishikesh — check into riverside camp or hotel near Laxman Jhula", "Afternoon: Walk across Laxman Jhula, explore Ram Jhula", "Visit Triveni Ghat at 7pm — Ganga Aarti ceremony (don't miss this)", "Dinner at Little Buddha Cafe on the rooftop"] },
      { day: "Day 2", place: "River Rafting & Adventure", points: ["7am: Depart for Shivpuri rafting starting point (16km)", "3-hour white water rafting through Grade 2-4 rapids", "Cliff jumping at Marine Drive — optional but legendary", "Afternoon: Bungee jumping (highest in India at 83m) or Giant Swing", "Evening: Beatles Ashram — 1 hour peaceful exploration"] },
      { day: "Day 3", place: "Yoga, Temples & Departure", points: ["Sunrise yoga class — Parmarth Niketan Ashram offers free classes", "Morning dip at Triveni Ghat with local pilgrims", "Kunjapuri Temple drive for Himalayan views (if time allows)", "Laxman Jhula final walk, shopping for rudraksha and local items"] },
    ],
    tips: [
      "Best time: September to November, February to May. Avoid monsoon for rafting",
      "Rafting is not allowed in monsoon (July-August) — rivers are too dangerous",
      "Triveni Ghat Aarti is at 7pm sharp every day — arrive 30 mins early for good spot",
      "Stay on the Tapovan side (near Laxman Jhula) for best cafe and river experience",
      "Beatles Ashram is open 8am-5pm, ₹150 entry — completely worth it",
    ],
  },

  jibhi: {
    name: "Jibhi",
    image: "/photos/jibhi.jpg",
    days: "3 Days",
    price: 6000,
    type: "relax",
    tagline: "Hidden Forest Village",
    about: "Jibhi is a tiny village in the Tirthan Valley of Himachal Pradesh. Hidden among dense deodar forests and apple orchards — wooden cottages, cold streams, and complete silence.",
    difficulty: { fitness: 3, roads: 4, altitude: 3, budget: 8, overall: "Easy Trip ✅" },
    food: [
      { name: "Tirthan Valley Kitchen", emoji: "🍽️", desc: "Home-cooked Himachali food by local families. Dal, roti, seasonal vegetables. Eat in someone's home." },
      { name: "Riverside Dhaba, Tirthan", emoji: "🏞️", desc: "A small dhaba right by the river. Fresh trout fish cooked to order. Cheapest and most real." },
      { name: "Shringi Cafe, Jibhi", emoji: "☕", desc: "Simple cafe run by a local family. Best chai in the valley, maggi, and eggs. Opens at 7am." },
    ],
    sunriseSunset: [
      { type: "🌅 Sunrise", name: "Jalori Pass", desc: "Drive to Jalori Pass at 3120m — the entire Tirthan Valley glows gold at sunrise. Absolutely silent." },
      { type: "🌄 Sunset", name: "Jibhi Waterfall View", desc: "Sit at the base of Jibhi waterfall as the sun sets through the deodar forest. Golden light through trees." },
    ],
    places: [
      { name: "Jibhi Waterfall", emoji: "💧", desc: "A short 10-minute walk from the village. Small but beautiful, perfect morning spot." },
      { name: "Tirthan River", emoji: "🌊", desc: "Crystal clear trout river. Sit on the boulders, watch fish swim. Swimming spots along the banks." },
      { name: "Serolsar Lake", emoji: "🏞️", desc: "5km trek from Jalori Pass through dense forest. Sacred lake — fishing and swimming not allowed." },
      { name: "Jalori Pass", emoji: "🛣️", desc: "3120m mountain pass with 360° views. Snow from November to March. Short drive from Jibhi." },
    ],
    offbeat: [
      { name: "Chhoie Waterfall", emoji: "💦", desc: "2km trek into the forest from Jibhi. Completely hidden, no signs. Ask a local to guide you." },
      { name: "Ghiyagi Village", emoji: "🌿", desc: "Above Jibhi — apple orchards, zero tourists, traditional slate-roofed houses." },
      { name: "Shringa Rishi Temple", emoji: "🛕", desc: "Ancient temple deep in the forest near Serolsar Lake. Very sacred, rarely visited." },
    ],
    itinerary: [
      { day: "Day 1", place: "Arrival & Village Exploration", points: ["Arrive in Jibhi (6 hours from Delhi, 3 hours from Chandigarh)", "Drop bags — check into wooden cottage for authentic feel", "Walk to Jibhi waterfall — 10 minutes from main road", "Evening walk along the Tirthan River, watch trout in the water", "Sit by the river as it gets dark — no sounds except water"] },
      { day: "Day 2", place: "Jalori Pass & Serolsar Lake", points: ["Drive to Jalori Pass at 3120m — 30 minutes from Jibhi", "Short tea at the pass with panoramic Himalayan views", "5km trek to Serolsar Lake through dense ancient forest", "Sacred lake — sit in silence, birds everywhere", "Return via a different forest trail"] },
      { day: "Day 3", place: "Tirthan River Walk & Departure", points: ["Morning: Walk deep into the Tirthan Valley — 3km trail", "Try to spot trout in the crystal water", "Visit Chhoie Waterfall — hidden gem, ask locally", "Lunch at riverside dhaba with fresh trout", "Depart by afternoon"] },
    ],
    tips: [
      "Best time: March to June, September to November",
      "Stay in wooden cottages — Tirthan Valley GHRS (govt rest houses) are beautiful and cheap",
      "No phone network in most of Jibhi — tell family you're unreachable",
      "Bring a book, a journal, and offline music — this is a digital detox destination",
      "Serolsar Lake trek is easy but muddy in rain — carry waterproof shoes",
    ],
  },

  udaipur: {
    name: "Udaipur",
    image: "/photos/udaipur.jpg",
    days: "2 Days",
    price: 5000,
    type: "relax",
    tagline: "City of Lakes",
    about: "Udaipur is one of the most romantic cities in India — built around shimmering lakes, with white marble palaces rising from the water.",
    difficulty: { fitness: 2, roads: 1, altitude: 1, budget: 7, overall: "Very Easy ✅" },
    food: [
      { name: "Millets of Mewar", emoji: "🌾", desc: "Only restaurant in Rajasthan serving traditional millet-based Rajasthani food. Healthy and delicious." },
      { name: "Ambrai Restaurant", emoji: "🌅", desc: "Lakeside dining with direct view of Lake Palace hotel. Best dinner spot in Udaipur. Book in advance." },
      { name: "Cafe Edelweiss", emoji: "☕", desc: "German bakery run by a Swiss couple. Fresh bread, cakes, amazing coffee. Popular with European tourists." },
      { name: "Natraj Dining Hall", emoji: "🍽️", desc: "Famous thali restaurant since 1949. Unlimited Rajasthani thali for ₹200. Always packed with locals." },
    ],
    sunriseSunset: [
      { type: "🌅 Sunrise", name: "Karni Mata Temple (Ropeway)", desc: "Take the ropeway at dawn — Fateh Sagar Lake and entire city glowing below. No tourists this early." },
      { type: "🌄 Sunset", name: "Lake Pichola Boat Ride", desc: "Book the 7pm sunset boat ride — Lake Palace lit up, City Palace reflecting in the water. Magical." },
    ],
    places: [
      { name: "City Palace", emoji: "🏯", desc: "Rajasthan's largest palace complex. 4 centuries of royal history. Museum inside is world-class." },
      { name: "Lake Pichola", emoji: "🏞️", desc: "The iconic lake with the floating Lake Palace hotel. Boat rides at sunset are unmissable." },
      { name: "Jagdish Temple", emoji: "🛕", desc: "17th century Indo-Aryan temple. Always alive — priests, music, flowers, incense. Very atmospheric." },
      { name: "Fateh Sagar Lake", emoji: "🌅", desc: "Local hangout lake north of the city. Boat to the small island inside — quieter than Pichola." },
    ],
    offbeat: [
      { name: "Bagore Ki Haveli", emoji: "🏛️", desc: "18th century haveli with evening cultural show at 7pm. Puppet shows, folk dances, royal costumes." },
      { name: "Shilpgram Craft Village", emoji: "🎨", desc: "3km from city — artisans from 5 states working live. Pottery, weaving, painting. Very authentic." },
      { name: "Eklingji Temple, Nagda", emoji: "🛕", desc: "22km from Udaipur — ancient 8th century Shiva temple. Rarely visited by tourists. Architecturally stunning." },
    ],
    itinerary: [
      { day: "Day 1", place: "Lakes & Palaces", points: ["Morning: City Palace — arrive at 9am before crowds, 3-4 hours", "Jagdish Temple — 5 minutes walk from City Palace", "Lunch at Ambrai with Lake Palace view", "Afternoon: Fateh Sagar Lake boat ride", "Evening: Sunset boat ride on Lake Pichola (book in advance)", "Bagore Ki Haveli cultural show at 7pm"] },
      { day: "Day 2", place: "Hidden Udaipur", points: ["Sunrise: Karni Mata ropeway — city at dawn", "Saheliyon Ki Bari — garden of the royal ladies, peacocks everywhere", "Shilpgram craft village — 2 hours, buy directly from artisans", "Vintage Car Museum — Maharaja's collection, fascinating", "Final sunset at Sajjangarh (Monsoon Palace) — 5km, panoramic"] },
    ],
    tips: [
      "Best time: October to March. Summers (April-June) are extremely hot",
      "Book Lake Pichola sunset boat ride in advance — fills up fast",
      "Use autorickshaws — app-based cabs are expensive here",
      "City Palace gets very crowded after 11am — go early",
      "Rajasthani thali at Natraj is the best value meal in Udaipur — ₹200 unlimited",
    ],
  },

  jaisalmer: {
    name: "Jaisalmer",
    image: "/photos/jaisalmer.jpg",
    days: "3 Days",
    price: 7500,
    type: "relax",
    tagline: "The Golden City of Rajasthan",
    about: "Jaisalmer rises out of the Thar Desert like a mirage — a golden sandstone city with ancient havelis, a magnificent fort, and the endless dunes of Sam Desert outside.",
    difficulty: { fitness: 2, roads: 3, altitude: 1, budget: 6, overall: "Very Easy ✅" },
    food: [
      { name: "Trio Restaurant, Fort Area", emoji: "🏯", desc: "Inside the fort walls. Rooftop with panoramic desert views. Best dal baati churma in Jaisalmer." },
      { name: "8 July Restaurant", emoji: "🌙", desc: "Popular with locals. Thali with laal maas (red mutton curry) — the signature Rajasthani meat dish." },
      { name: "Desert Boy's Dhani", emoji: "🎭", desc: "Cultural dining with folk music and puppetry. Touristy but worth it for one evening experience." },
      { name: "Chandan Shree Restaurant", emoji: "🍽️", desc: "Pure vegetarian, local prices. Packed with Jaisalmer families. Best ker sangri (local desert vegetable)." },
    ],
    sunriseSunset: [
      { type: "🌅 Sunrise", name: "Sam Sand Dunes", desc: "Climb the highest dune before 6am — watch the desert turn from purple to gold. Silence is total." },
      { type: "🌄 Sunset", name: "Jaisalmer Fort Ramparts", desc: "Stand on the fort walls as the entire city turns gold at sunset. The desert glows behind. Perfect." },
    ],
    places: [
      { name: "Jaisalmer Fort", emoji: "🏯", desc: "Living fort — 3000 people still live inside. 12th century golden sandstone walls glow at every hour." },
      { name: "Sam Sand Dunes", emoji: "🏜️", desc: "Classic Thar Desert. Camel rides, jeep safari, overnight camping under stars — incredible experience." },
      { name: "Patwon Ki Haveli", emoji: "🏛️", desc: "5-storey haveli with the most intricate sandstone carving in all of Rajasthan. 200-year-old masterpiece." },
      { name: "Gadisar Lake", emoji: "🏞️", desc: "Peaceful artificial lake. Boat rides, migratory birds in winter, old temples on the banks." },
    ],
    offbeat: [
      { name: "Kuldhara Abandoned Village", emoji: "👻", desc: "An entire village abandoned overnight 300 years ago — reason still unknown. Eerie and atmospheric." },
      { name: "Khaba Fort Ruins", emoji: "🏚️", desc: "Ruined fort in the desert with wild blue bulls roaming. No tourists, no guides. Raw desert exploration." },
      { name: "Bada Bagh Cenotaphs", emoji: "🕌", desc: "Royal cenotaphs in the desert. At sunset, the carved sandstone glows orange. Barely any visitors." },
    ],
    itinerary: [
      { day: "Day 1", place: "Jaisalmer Fort & Havelis", points: ["Morning: Jaisalmer Fort — enter through the main gate, explore the inner city", "Patwon Ki Haveli — 2 hours for the carvings and museum", "Lunch inside the fort at Trio Restaurant with desert views", "Gadisar Lake — boat ride, sunset photography", "Evening walk on the fort ramparts — golden hour is incredible"] },
      { day: "Day 2", place: "Desert Safari & Camping", points: ["Drive to Sam Sand Dunes (42km, 1 hour)", "Camel ride at sunset — 1 hour through the dunes", "Sunset from the highest dune — watch the desert change colors", "Overnight desert camping under stars (highly recommended)", "Bonfire, folk music, traditional Rajasthani dinner"] },
      { day: "Day 3", place: "Hidden Jaisalmer", points: ["Early morning: Sunrise at Sam Dunes before tourists arrive", "Kuldhara Village — the abandoned mystery village (8km from city)", "Khaba Fort ruins — wild desert exploration", "Bada Bagh cenotaphs at golden hour", "Jaisalmer market — buy embroidered textiles and silver jewelry"] },
    ],
    tips: [
      "Best time: October to March. Avoid May-June (temperatures above 45°C)",
      "Desert camping is the highlight — book in advance, prices vary widely",
      "Stay inside the fort for one night — a unique experience, book early",
      "Camel ride is touristy but still worth doing once — negotiate price",
      "Night sky in the desert is extraordinary — carry a stargazing app",
    ],
  },

  dharamshala: {
    name: "Dharamshala",
    image: "/photos/dharamshala.jpg",
    days: "3 Days",
    price: 6500,
    type: "relax",
    tagline: "Home of the Dalai Lama",
    about: "Dharamshala has been home to the Tibetan government in exile since 1960. McLeodganj — the upper town — is a fascinating blend of Indian and Tibetan culture.",
    difficulty: { fitness: 4, roads: 3, altitude: 3, budget: 7, overall: "Easy Trip ✅" },
    food: [
      { name: "Nick's Italian Kitchen, McLeodganj", emoji: "🍕", desc: "Run by a local family. Best pizza in Himachal Pradesh. Packed every evening. Book a table." },
      { name: "Lung Ta Japanese Restaurant", emoji: "🍱", desc: "Japanese food in the Himalayas — sounds wrong, tastes right. The owner trained in Kyoto." },
      { name: "Tibet Kitchen", emoji: "🥟", desc: "Authentic Tibetan food — thukpa, thenthuk, butter tea. Cooked by Tibetan refugees. Very genuine." },
      { name: "Common Ground Cafe", emoji: "☕", desc: "Best coffee in Dharamshala. Supports local Tibetan women. Good for work and conversations." },
    ],
    sunriseSunset: [
      { type: "🌅 Sunrise", name: "Triund Ridge", desc: "If you've camped at Triund — sunrise over the Kangra Valley with Dhauladhar behind you is spiritual." },
      { type: "🌄 Sunset", name: "Dal Lake, McLeodganj", desc: "Small lake above McLeodganj. Watch the Dhauladhar range turn pink at sunset. Quiet and beautiful." },
    ],
    places: [
      { name: "McLeodganj Market", emoji: "🏘️", desc: "Tibetan restaurants, Buddhist bookshops, handicrafts. A complete world within India. Wander for hours." },
      { name: "Namgyal Monastery", emoji: "🏯", desc: "The Dalai Lama's personal monastery. Early morning prayers open to visitors — chanting fills the hall." },
      { name: "Triund Trek", emoji: "🏔️", desc: "9km trek to a ridge at 2828m. Dhauladhar on one side, Kangra Valley on the other. 4-5 hours up." },
      { name: "Kangra Fort", emoji: "🏰", desc: "One of the oldest and largest forts in India — 4000 years of history, 40km from Dharamshala." },
    ],
    offbeat: [
      { name: "Dharamkot Village", emoji: "🌿", desc: "10 minute walk above McLeodganj. Tiny village of long-term travelers, yoga retreats, deep forest." },
      { name: "Kareri Lake Trek", emoji: "🏞️", desc: "13km from Dharamshala — glacial lake at 2934m. Far fewer visitors than Triund. Cleaner camping." },
      { name: "Masrur Rock Temple", emoji: "🛕", desc: "8th century rock-cut temples 40km away. Similar to Ellora but almost no tourists. Extraordinary." },
    ],
    itinerary: [
      { day: "Day 1", place: "McLeodganj Exploration", points: ["Arrive in McLeodganj — the upper town above Dharamshala", "Namgyal Monastery — morning prayers if arriving early", "Tibetan market walk — buy prayer flags and Tibetan handicrafts", "Tibet Kitchen for lunch — authentic refugee cooking", "Dal Lake evening walk — sunset over Kangra Valley"] },
      { day: "Day 2", place: "Triund Trek", points: ["Start trek at 7am from McLeodganj (9km)", "Magic View Cafe at halfway — mandatory chai stop", "Reach Triund ridge (2828m) by noon", "Dhauladhar range panorama — snow peaks at eye level", "Overnight camping at Triund (highly recommended — ₹300 tent rental)"] },
      { day: "Day 3", place: "Temples & Hidden Spots", points: ["Descend from Triund in the morning", "Bhagsunag Waterfall — 2km from McLeodganj, popular but beautiful", "Dharamkot village walk — different energy from McLeodganj", "Masrur Rock Temples if time allows (40km drive)", "Final momos at Tibet Kitchen before departure"] },
    ],
    tips: [
      "Best time: March to June, September to November. Avoid heavy monsoon",
      "Triund camping needs permit — available at forest office in McLeodganj",
      "Dalai Lama gives public teachings occasionally — check dharamsala.net for schedule",
      "Tibetan food is a must — momos here are different from everywhere else in India",
      "Carry warm clothes even in summer — nights above 2000m get cold",
    ],
  },

  banswara: {
    name: "Banswara",
    image: "/photos/banswara.jpg",
    days: "2 Days",
    price: 4500,
    type: "relax",
    tagline: "City of Hundred Islands",
    about: "Banswara is an underrated gem in southern Rajasthan. The Mahi River dotted with islands creates a unique landscape far from tourist crowds.",
    difficulty: { fitness: 2, roads: 3, altitude: 1, budget: 9, overall: "Very Easy ✅" },
    food: [
      { name: "Bhil Tribal Food Stalls", emoji: "🌽", desc: "Local tribal food near Mahi Dam. Corn, bajra rotla, fresh vegetables. Cheapest and most authentic." },
      { name: "Hotel Tirupati", emoji: "🍽️", desc: "Best Rajasthani thali in Banswara. Local families eat here. Unlimited refills, very affordable." },
      { name: "Mahi Riverside Dhaba", emoji: "🌊", desc: "A small dhaba by the dam. Fresh fish from the Mahi River. Eat while watching the islands." },
    ],
    sunriseSunset: [
      { type: "🌅 Sunrise", name: "Mahi Dam Viewpoint", desc: "The dam and islands emerge slowly from the morning mist. Completely alone at this hour — extraordinary." },
      { type: "🌄 Sunset", name: "Anand Sagar Lake", desc: "The lake turns completely gold at sunset. Boat to the island temple and return as the sun sets." },
    ],
    places: [
      { name: "Mahi Dam & Islands", emoji: "🏝️", desc: "The main attraction. Boat rides between islands, stunning backwaters, complete peace." },
      { name: "Tripura Sundari Temple", emoji: "🛕", desc: "One of the 108 Shakti Peethas. Hilltop location with panoramic views of the surrounding jungle." },
      { name: "Anand Sagar Lake", emoji: "🏞️", desc: "City lake with an island temple accessible by boat. Peaceful morning walk around the lake." },
    ],
    offbeat: [
      { name: "Arthuna Temples", emoji: "🏛️", desc: "11th century temple complex 45km away. Zero tourists, extraordinary stone carvings, forest setting." },
      { name: "Tribal Villages", emoji: "🏘️", desc: "Bhil and Garasia tribal villages around Banswara. Culture completely different from mainstream Rajasthan." },
      { name: "Kagdi Pickup Weir", emoji: "🏊", desc: "Local natural swimming spot in the Mahi. Only locals know this. No tourists, completely real." },
    ],
    itinerary: [
      { day: "Day 1", place: "Mahi Dam & Islands", points: ["Drive to Mahi Dam (8km from Banswara)", "Hire a local boat — explore the hundred islands", "Tripura Sundari Temple — hilltop views of the Mahi backwaters", "Sunset at Anand Sagar Lake — boat to island temple"] },
      { day: "Day 2", place: "Hidden Banswara", points: ["Arthuna Temples — 45km drive, ancient stone carvings (3-4 hours)", "Tribal village visit — interact with Bhil community", "Kagdi Weir — local swimming spot (afternoon)", "Banswara market — tribal jewelry and textiles to take home"] },
    ],
    tips: [
      "Best time: July to February. Monsoon fills the islands beautifully",
      "Very few tourists — don't expect tourist infrastructure",
      "Hire a local guide for tribal village visits — ₹300-500, worth it",
      "Cheapest destination on this list — great for budget travelers",
      "Arthuna Temples are genuinely extraordinary — don't skip them",
    ],
  },

  chakrata: {
    name: "Chakrata",
    image: "/photos/chakrata.jpg",
    days: "3 Days",
    price: 6000,
    type: "explore",
    tagline: "Uttarakhand's Hidden Escape",
    about: "Chakrata is a quiet cantonment town in Uttarakhand that most people have never heard of. Surrounded by thick forests of oak and rhododendron — solitude, wildlife, and Tiger Falls.",
    difficulty: { fitness: 4, roads: 5, altitude: 5, budget: 8, overall: "Easy Trip ✅" },
    food: [
      { name: "Hotel Deodar Restaurant", emoji: "🍽️", desc: "Only proper restaurant in Chakrata. Pahadi food — rajma chawal, simple dal. Honest and filling." },
      { name: "Forest Dhabas, Tiger Falls Road", emoji: "🌲", desc: "Small roadside dhabas selling maggi, chai, and paranthas. Best food is always at these simple stops." },
      { name: "Local Apple Farms", emoji: "🍎", desc: "Buy fresh apples directly from farms around Chakrata. Sweetest apples outside Himachal Pradesh." },
    ],
    sunriseSunset: [
      { type: "🌅 Sunrise", name: "Chilmiri Neck", desc: "Highest point of Chakrata — Himalayan panorama at sunrise with Bandarpunch and Swargarohini peaks visible." },
      { type: "🌄 Sunset", name: "Deoban Forest", desc: "Stand in the deodar forest as the last light filters through. Snow peaks visible on clear days. Silence." },
    ],
    places: [
      { name: "Tiger Falls", emoji: "💧", desc: "312 feet of straight waterfall hidden deep in the forest — India's highest straight waterfall. 5km walk." },
      { name: "Chilmiri Neck", emoji: "🌅", desc: "Highest point of Chakrata. 360° views of the Garhwal Himalayas. Snow peaks on clear days." },
      { name: "Deoban Forest", emoji: "🌲", desc: "Dense ancient deodar forest at 2800m. Silent, mystical, no tourists. Wildlife sightings common." },
      { name: "Kanasar Forest", emoji: "🦅", desc: "Some of Asia's oldest deodar trees. Forest department bungalows available for overnight stays." },
    ],
    offbeat: [
      { name: "Mundali Meadows", emoji: "🌿", desc: "High altitude meadows above Chakrata — skiing in winter, wildflowers in spring, camping in summer." },
      { name: "Budher Caves", emoji: "🕳️", desc: "Limestone cave system 25km from Chakrata. One of the largest in the region. Rarely visited." },
      { name: "Ram Tal Garden", emoji: "🌸", desc: "Hidden horticultural garden in the forest. Hundreds of plant species. Almost nobody finds this." },
    ],
    itinerary: [
      { day: "Day 1", place: "Arrival & Chilmiri Neck", points: ["Drive to Chakrata (90km from Dehradun)", "Inner Line Permit at the checkpoint — free, takes 10 minutes", "Settle in, walk to Chilmiri Neck for first panoramic view", "Evening: Watch sunset from the forest edge, listen to silence"] },
      { day: "Day 2", place: "Tiger Falls & Deoban", points: ["Morning: 5km forest walk to Tiger Falls — carry water", "Swim in the pool at the base of the falls", "Afternoon: Drive to Deoban forest", "Walk through ancient deodar trees — look for Himalayan birds", "Visit Kanasar for the oldest deodar trees"] },
      { day: "Day 3", place: "Mundali & Hidden Spots", points: ["Drive to Mundali meadows — wildflowers or snow depending on season", "Budher Caves exploration (25km from Chakrata)", "Ram Tal Garden — peaceful forest garden", "Return to Chakrata, depart for Dehradun by evening"] },
    ],
    tips: [
      "Inner Line Permit required — available at Chakrata entry checkpoint, free and instant",
      "Best time: March-June for flowers, October-November for clear skies",
      "No crowds — genuinely one of the least visited places in Uttarakhand",
      "Tiger Falls walk is 5km through forest — carry water and wear good shoes",
      "Accommodation is basic — book ahead as options are very limited",
    ],
  },

  "barot-valley": {
    name: "Barot Valley",
    image: "/photos/barot.jpg",
    days: "3 Days",
    price: 6000,
    type: "relax",
    tagline: "Himachal's Best Kept Secret",
    about: "Barot Valley sits along the Uhl river in the Mandi district. Lush green forests, trout fishing, and absolute silence — the kind of place you stumble upon and never want to leave.",
    difficulty: { fitness: 3, roads: 5, altitude: 3, budget: 9, overall: "Very Easy ✅" },
    food: [
      { name: "Uhl Riverside Dhaba", emoji: "🌊", desc: "Literally on the riverbank. Fresh trout fish caught that morning. Dal, rice, and the cleanest air." },
      { name: "Barot Village Tea Stalls", emoji: "☕", desc: "Old men running tea stalls since decades. Pahadi chai and simple biscuits. Pure Himachal experience." },
      { name: "HPFD Rest House Kitchen", emoji: "🍽️", desc: "Government rest house with a cook. Book ahead — they make traditional Himachali meals on request." },
    ],
    sunriseSunset: [
      { type: "🌅 Sunrise", name: "Rajgundha Valley Meadows", desc: "If you've trekked to Rajgundha — wake up to sunrise over the meadows with nobody else around." },
      { type: "🌄 Sunset", name: "Uhl River Boulders", desc: "Sit on the rocks by the Uhl river as the forest turns golden. Trout visible in the clear water below." },
    ],
    places: [
      { name: "Uhl River Walk", emoji: "🌊", desc: "Walk 3km along the crystal river. Trout visible in the water. Completely undisturbed nature." },
      { name: "Barot Village", emoji: "🏘️", desc: "The main village — simple, authentic Himachali life. Talk to locals, understand real mountain living." },
      { name: "Nargu Wildlife Sanctuary", emoji: "🦅", desc: "Dense forest sanctuary. Himalayan Black Bear, Leopard, rare Himalayan birds. Entry with guide." },
      { name: "Shanan Powerhouse", emoji: "⚡", desc: "1932 British-era powerhouse still running. Beautiful colonial forest architecture — very photogenic." },
    ],
    offbeat: [
      { name: "Rajgundha Valley", emoji: "🌿", desc: "12km trek from Barot. High altitude shepherd meadows. Completely alone, only sheep and mountains." },
      { name: "Billing Paragliding", emoji: "🪂", desc: "World's 2nd best paragliding site is 2 hours from Barot. Most people don't connect these two." },
      { name: "Chadiar Village", emoji: "🏕️", desc: "Further up the valley from Barot — truly the end of the road. 5 families, no facilities, pure peace." },
    ],
    itinerary: [
      { day: "Day 1", place: "Arrival & River Exploration", points: ["Drive from Mandi (60km, 2.5 hours on mountain roads)", "Check into riverside guesthouse or HPFD rest house", "Afternoon: Walk along the Uhl River — 3km nature trail", "Visit Shanan Powerhouse — 1932 British engineering in the forest", "Evening: Sit by the river, watch trout, absolute silence"] },
      { day: "Day 2", place: "Rajgundha Trek", points: ["Start trek at 7am — 12km to Rajgundha Valley", "Forest trail through deodar and oak trees", "Reach meadows by noon — shepherd settlements only", "Panoramic views of Dhauladhar range", "Return by evening or camp overnight (highly recommended)"] },
      { day: "Day 3", place: "Village Life & Departure", points: ["Morning: Village walk — interact with Barot families", "Nargu Wildlife Sanctuary — birdwatching with local guide", "Try trout fishing with a local fisherman (₹200 with equipment)", "Lunch at riverside dhaba with fresh trout", "Depart for Mandi or continue to Billing for paragliding"] },
    ],
    tips: [
      "Best time: April to October. Roads can be tricky after rain",
      "One of the cheapest and most authentic destinations in Himachal",
      "Trout fishing license available at the fisheries department in Barot — ₹100",
      "Roads to Barot are narrow and winding — not suitable for large vehicles",
      "Combine with Billing paragliding for an incredible 4-day Himachal adventure",
    ],
  },

  zanskar: {
    name: "Zanskar",
    image: "/photos/zanskar.jpg",
    days: "8-10 Days",
    price: 28000,
    type: "explore",
    tagline: "The Forgotten Kingdom",
    about: "Zanskar is one of the most remote and least visited regions of Ladakh. Cut off for most of the year, it offers raw Himalayan beauty — ancient monasteries, gorges, and rivers that feel like stepping back in time.",
    difficulty: { fitness: 9, roads: 10, altitude: 9, budget: 5, overall: "Extreme Trip 🔴" },
    food: [
      { name: "Local Homestays, Padum", emoji: "🏠", desc: "Home-cooked Zanskar food by local families. Tsampa (barley flour), butter tea, thick thukpa. Real." },
      { name: "Padum Market Dhabas", emoji: "🍽️", desc: "Basic dhabas in Padum with dal, rice, chapati. Simple, honest food at the edge of civilization." },
    ],
    sunriseSunset: [
      { type: "🌅 Sunrise", name: "Rangdum Monastery", desc: "Watch the sunrise light up the glacier behind Rangdum — monastery glowing in first light. Otherworldly." },
      { type: "🌄 Sunset", name: "Padum Valley", desc: "The entire Zanskar Valley turns purple-orange at sunset. Silence so complete you hear your heartbeat." },
    ],
    places: [
      { name: "Padum Town", emoji: "🏙️", desc: "The capital of Zanskar — ancient, unhurried, gateway to the entire region. Only proper facilities here." },
      { name: "Karsha Monastery", emoji: "🏯", desc: "Largest monastery in Zanskar. Perched on a cliff across the river from Padum. 1000 years old." },
      { name: "Zanskar River Gorge", emoji: "🏞️", desc: "One of India's deepest gorges. The famous Chadar trek happens here on the frozen river in winter." },
      { name: "Rangdum Monastery", emoji: "⛪", desc: "Isolated monastery surrounded by glaciers. Feels like the last place on earth." },
    ],
    offbeat: [
      { name: "Phugtal Monastery", emoji: "🕌", desc: "Built into a cave on a sheer cliff — accessible only by 2-day trek. Zero tourists. Life-changing sight." },
      { name: "Chadar Trek", emoji: "🧊", desc: "Walk on the frozen Zanskar river in January-February. One of the most extreme treks in the world." },
      { name: "Stongde Village", emoji: "🏘️", desc: "1000-year-old monastery, unchanged village life, complete isolation. 15km from Padum." },
    ],
    itinerary: [
      { day: "Day 1", place: "Kargil Arrival", points: ["Fly to Leh, drive to Kargil (160km, 4 hours)", "Kargil War Memorial — powerful and sobering", "Rest in Kargil before the difficult road ahead"] },
      { day: "Day 2", place: "Kargil → Rangdum", points: ["Drive to Rangdum via Suru Valley (120km, 5 hours)", "Nun-Kun peaks alongside — second highest in India", "Rangdum Monastery at sunset — glaciers all around"] },
      { day: "Day 3", place: "Rangdum → Padum", points: ["Cross Pensi La pass at 4400m", "First views of Zanskar Valley — completely different from Ladakh", "Arrive in Padum — the capital of Zanskar", "Karsha Monastery visit"] },
      { day: "Day 4-5", place: "Zanskar Valley Exploration", points: ["Stongde and Sani monasteries", "Zanskar River confluence viewpoint", "Local village homestay experience", "Phugtal Monastery (2-day trek — only for serious trekkers)"] },
      { day: "Day 6-7", place: "Return Journey", points: ["Return via same road or continue to Leh (road not always open)", "Stop at all viewpoints on the way back", "Rangdum one more night — glacier walks"] },
    ],
    tips: [
      "Most remote destination on this list — not for casual travelers",
      "Road opens only June to October — rest of year, only helicopter access",
      "Carry all essential medicines, food backup, and offline maps",
      "Homestays are the only accommodation option in most villages",
      "Phugtal Monastery is worth the 2-day trek — plan it separately",
    ],
  },

  jispa: {
    name: "Jispa",
    image: "/photos/jispa.jpg",
    days: "3 Days",
    price: 7000,
    type: "explore",
    tagline: "Lahaul's Quiet Secret",
    about: "Jispa is a tiny village in the Lahaul Valley, sitting on the banks of the Bhaga River at 3200 meters. Most travelers pass through — very few stop.",
    difficulty: { fitness: 4, roads: 6, altitude: 6, budget: 7, overall: "Moderate Trip 🟡" },
    food: [
      { name: "Jispa Camp Kitchens", emoji: "🏕️", desc: "Camping resorts with attached kitchens. Dal, rice, rajma — simple mountain food, hot and filling." },
      { name: "Darcha Dhaba", emoji: "🍽️", desc: "Last dhaba before high passes. Maggi, chai, paranthas. The best meal tastes after a long drive." },
      { name: "Keylong Market Dhabas", emoji: "☕", desc: "District capital 15km away. More variety here — local Lahaul cuisine including dried meat and butter." },
    ],
    sunriseSunset: [
      { type: "🌅 Sunrise", name: "Bhaga River Banks", desc: "Wake up at the camp and watch the Bhaga River catch the first light. Snow peaks all around. Silent." },
      { type: "🌄 Sunset", name: "Darcha Village", desc: "The mountains above Darcha turn completely red at sunset. The Bhaga River glows below." },
    ],
    places: [
      { name: "Bhaga River", emoji: "🌊", desc: "Pristine glacial river. Camp beside it, fall asleep to the sound — one of the most peaceful nights possible." },
      { name: "Gemur Monastery", emoji: "🏯", desc: "Small ancient monastery above Jispa. Very few visitors. Walk up in 30 minutes for valley views." },
      { name: "Darcha Village", emoji: "🏘️", desc: "Last permanent village before Baralacha La. Starting point for Zanskar trekking routes." },
    ],
    offbeat: [
      { name: "Baralacha La Pass", emoji: "🏔️", desc: "4890m pass an hour from Jispa. Dramatic and desolate — on the Manali-Leh highway. Often snow." },
      { name: "Trilokinath Temple", emoji: "🛕", desc: "Rare temple 50km away — worshipped by both Hindus and Buddhists. Remote and spiritually powerful." },
      { name: "Kardang Monastery", emoji: "⛪", desc: "Above Keylong — 10th century monastery with views of the entire Lahaul Valley. Almost no visitors." },
    ],
    itinerary: [
      { day: "Day 1", place: "Manali → Jispa", points: ["Drive from Manali through Atal Tunnel (world's longest high altitude tunnel)", "Sissu waterfall stop — waterfall drops into the Lahaul Valley", "Arrive in Jispa (115km, 3-4 hours from Manali)", "Evening walk along the Bhaga River — watch it turn silver in the dusk"] },
      { day: "Day 2", place: "Jispa Exploration", points: ["Morning: Gemur Monastery — 30 minute walk above the village", "Drive to Darcha — last settlement, stark and remote", "Baralacha La drive (1 hour) — high pass experience without going to Leh", "Return and camp by the Bhaga River — bonfire if possible"] },
      { day: "Day 3", place: "Keylong & Return", points: ["Drive to Keylong — Lahaul district headquarters (15km)", "Kardang Monastery above Keylong — 10th century architecture", "Trilokinath Temple visit (50km, if time allows)", "Return to Manali or continue to Leh"] },
    ],
    tips: [
      "Perfect stopover between Manali and Leh — break the 2-day drive here",
      "Very few tourists — this is real Lahaul, not tourist Manali",
      "Best time: June to September. Road from Manali open after snow melts",
      "Carry warm clothes — 3200m altitude, cold even in summer",
      "Camping by the Bhaga river is the highlight — book a riverside camp",
    ],
  },
  kedarnath: {
    name: "Kedarnath",
    image: "/photos/kedarnath.jpg",
    days: "4 Days",
    price: 9000,
    type: "explore",
    tagline: "Where Everything Disappears Except You and Mahadev",
    about: "Kedarnath is one of the twelve Jyotirlingas and one of the holiest shrines in India, sitting at 3553m in the Garhwal Himalayas. The trek is 22km one way — not 14km, not 18km as most people say. The moment you first see the temple from a distance, something shifts inside you. When you finally stand in front of it — the crowd disappears, the noise disappears, and it's just you, Mahadev, the valleys, and cold mountain wind on your face.",
    difficulty: { fitness: 8, roads: 5, altitude: 7, budget: 4, overall: "Hard Trek ⚠️" },
    food: [
      { name: "Rambhara Dhabas", emoji: "🍵", desc: "Last affordable food on the trek. Chai and maggi. Eat here before the real incline begins — this is your last proper stop." },
      { name: "Govt Canteen, Kedarnath", emoji: "🍽️", desc: "The most affordable food at the top. If you're watching your budget, this is the place. Private stalls charge 3x." },
      { name: "Trek Stalls (carry your own)", emoji: "🍫", desc: "Stalls exist all along the route but are very expensive. Carry fruits, nuts, and chocolate from base — it's lighter and cheaper." },
      { name: "Gaurikund Dhabas", emoji: "☕", desc: "Base camp town. Have a proper heavy meal here the night before — your last comfortable food before the climb." },
    ],
    sunriseSunset: [
      { type: "🌅 Sunrise", name: "Kedarnath Temple", desc: "First light hitting the ancient stone temple with snow peaks behind and mist rising from the valley — nothing in India compares." },
      { type: "🌄 Sunset", name: "Rambhara Ridge", desc: "Looking back down the Mandakini Valley at golden hour — you realize how far you've come and how small everything is." },
    ],
    places: [
      { name: "Kedarnath Temple", emoji: "🛕", desc: "One of the twelve Jyotirlingas. An 8th century stone temple that has survived Himalayan winters for over 1200 years. Standing in front of it is unlike anything else." },
      { name: "Rambhara", emoji: "🏔️", desc: "The 8km mark from Gaurikund. After here, the real incline begins. A critical mental checkpoint on the trek." },
      { name: "Gaurikund", emoji: "🌊", desc: "Trek base at 1982m. Natural hot spring used by pilgrims. Start your trek from here — shared jeeps from Sonprayag." },
      { name: "Bhairav Temple", emoji: "⛪", desc: "A short climb above Kedarnath. Panoramic views of the valley and the glacier. Almost no one goes — completely peaceful." },
    ],
    offbeat: [
      { name: "Gandhi Sarovar (Chorabari Lake)", emoji: "🏞️", desc: "3km above Kedarnath at 3900m — glacial lake where Gandhi's ashes were immersed. Barely anyone makes it up here." },
      { name: "Opening Day Darshan", emoji: "🎯", desc: "Temple opens in late April or early May. The opening day is extraordinary — fewer crowds, raw energy, the priests light the temple for the first time that season." },
      { name: "Vasuki Tal Trek", emoji: "🏔️", desc: "6km above Kedarnath at 4135m. Panoramic Himalayan views. Only for serious trekkers with a rest day to spare." },
    ],
    itinerary: [
      { day: "Day 1", place: "Delhi → Gaurikund", points: ["Leave Delhi by night or very early morning", "Drive via Haridwar, Rishikesh, Devprayag, Rudraprayag — beautiful river valley route", "Reach Sonprayag by evening, shared jeep to Gaurikund (30 mins)", "Eat a full heavy dinner — your last comfortable meal before the trek", "Sleep early — 4am wake up next morning"] },
      { day: "Day 2", place: "The 22km Trek — Gaurikund → Kedarnath", points: ["Start by 5am — early start is essential, avoid afternoon heat and crowds", "First 3km to Rambhara is gradual — deceptively manageable", "After Rambhara — real incline starts. Budget 4-5 hours for this section", "Fill water from natural springs and waterfalls on the route — they are clean and free", "Trek stalls exist but charge very high — carry fruits, nuts, chocolate from base", "First view of the temple from a distance: an inexplicable peace settles in", "Reach Kedarnath by early afternoon (total: 8-10 hours of trekking)"] },
      { day: "Day 3", place: "Kedarnath Darshan", points: ["Wake up by 4:30am for early morning darshan — queues build fast", "Standing in front of the temple: the crowd seems to disappear, just you and Mahadev", "Bhairav Temple hike after darshan — panoramic glacier view", "Gandhi Sarovar if you have energy (3km up, very few people)", "Rest and acclimatize at 3553m — do not overexert", "Book via govt Char Dham portal — private camps cost ₹7000+/night"] },
      { day: "Day 4", place: "Trek Down → Drive Back to Delhi", points: ["Start descent by 6am — easier on legs but knees feel it more going down", "Stop at Rambhara for chai on the way down — you've earned it", "Reach Gaurikund by noon", "Shared jeep to Sonprayag, then drive towards Delhi", "Haridwar or Rishikesh overnight if too tired to drive straight through"] },
    ],
    tips: [
      "Trek is 22km one side — not 14km or 18km as people say. Plan your energy accordingly",
      "The real incline only starts after Rambhara — the first 8km will feel easy, don't burn out",
      "Book accommodation via the official Char Government portal — private rooms are ₹7000+/night at top",
      "Avoid horses — they are overworked and poorly cared for. Hips, lower back, and hands will ache from riding. Walk if you can",
      "Fill water from natural springs on the route — completely clean, completely free",
      "Carry fruits, nuts, and chocolate from base — stalls on trek charge very high prices",
      "Helicopter available from Phata/Sitapur — book weeks in advance, it fills up fast",
      "Opening day darshan (late April) is special — requires early planning but worth every bit of it",
    ],  
  },
};

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function Destination(props) {
  const params = use(props.params);
  const trip = trips[params.slug];

  if (!trip) return notFound();

  const [people, setPeople] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", email: "", date: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const total = trip.price * Number(people);

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.email) { alert("Please fill all fields"); return; }
    setLoading(true);
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "YOUR_WEB3FORMS_KEY_HERE",
          subject: `New Booking: ${trip.name}`,
          name: form.name, email: form.email, phone: form.phone,
          date: form.date, people, destination: trip.name,
          estimated_cost: `₹${total}`,
        }),
      });
      if (response.ok) setSubmitted(true);
      else alert("Something went wrong. Please try WhatsApp instead.");
    } catch { alert("Something went wrong."); }
    setLoading(false);
  };

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "places", label: "Places" },
    { key: "itinerary", label: "Itinerary" },
    { key: "food", label: "Food & Stays" },
    { key: "ai", label: "AI Tools" },
  ];

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section
        className="h-[75vh] flex items-end justify-start relative overflow-hidden"
        style={{ backgroundImage: `url(${trip.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 p-10 md:p-16 max-w-4xl"
        >
          <div className={`inline-block text-xs px-3 py-1 rounded-full mb-4 tracking-widest uppercase ${
            trip.type === "explore" ? "bg-green-600" : "bg-orange-500"
          }`}>
            {trip.type === "explore" ? "Adventure" : "Slow Travel"}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-3 leading-tight">{trip.name}</h1>
          <p className="text-xl opacity-60 mb-2">{trip.tagline}</p>
          <div className="flex gap-6 mt-4">
            <div><p className="text-xs opacity-40 uppercase tracking-widest">Duration</p><p className="font-semibold">{trip.days}</p></div>
            <div><p className="text-xs opacity-40 uppercase tracking-widest">From</p><p className="font-semibold">₹{trip.price.toLocaleString()}/person</p></div>
            <div><p className="text-xs opacity-40 uppercase tracking-widest">Difficulty</p><p className="font-semibold">{trip.difficulty.overall}</p></div>
          </div>
        </motion.div>
      </section>

      {/* STICKY TABS */}
      <div className="sticky top-16 z-40 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex gap-0 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-4 text-sm uppercase tracking-widest whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.key
                    ? "border-green-500 text-white"
                    : "border-transparent text-white/40 hover:text-white/70"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-12">

        {/* LEFT CONTENT */}
        <div className="md:col-span-2 space-y-16 min-h-0">

          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <>
              <FadeIn>
                <h2 className="text-2xl font-semibold mb-4">About {trip.name}</h2>
                <p className="opacity-60 leading-relaxed text-lg">{trip.about}</p>
              </FadeIn>

              {/* DIFFICULTY METER */}
              <FadeIn delay={0.1}>
                <h2 className="text-2xl font-semibold mb-2">Trip Difficulty</h2>
                <p className="text-xs opacity-40 uppercase tracking-widest mb-6">Know before you go</p>
                <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 space-y-4">
                  <DifficultyBar label="Physical Fitness Required" value={trip.difficulty.fitness}
                    color={trip.difficulty.fitness >= 8 ? "bg-red-500" : trip.difficulty.fitness >= 5 ? "bg-yellow-500" : "bg-green-500"} />
                  <DifficultyBar label="Road Conditions" value={trip.difficulty.roads}
                    color={trip.difficulty.roads >= 8 ? "bg-red-500" : trip.difficulty.roads >= 5 ? "bg-yellow-500" : "bg-green-500"} />
                  <DifficultyBar label="Altitude Risk" value={trip.difficulty.altitude}
                    color={trip.difficulty.altitude >= 8 ? "bg-red-500" : trip.difficulty.altitude >= 5 ? "bg-yellow-500" : "bg-green-500"} />
                  <DifficultyBar label="Budget Friendly" value={trip.difficulty.budget} color="bg-blue-500" />
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-sm font-semibold">{trip.difficulty.overall}</p>
                  </div>
                </div>
              </FadeIn>

              {/* SUNRISE SUNSET */}
              <FadeIn delay={0.1}>
                <h2 className="text-2xl font-semibold mb-2">Sunrise & Sunset Spots</h2>
                <p className="text-xs opacity-40 uppercase tracking-widest mb-6">Best views in {trip.name}</p>
                <div className="space-y-4">
                  {trip.sunriseSunset.map((spot, i) => (
                    <motion.div key={i} whileHover={{ x: 6 }}
                      className="flex gap-4 items-start p-5 border border-white/10 rounded-2xl hover:border-yellow-500/30 transition-colors group"
                    >
                      <span className="text-2xl shrink-0">{spot.type.split(" ")[0]}</span>
                      <div>
                        <p className="text-xs opacity-40 mb-1">{spot.type}</p>
                        <p className="font-semibold mb-1 group-hover:text-yellow-400 transition-colors">{spot.name}</p>
                        <p className="text-sm opacity-60 leading-relaxed">{spot.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </FadeIn>

              {/* LOCAL TIPS */}
              <FadeIn delay={0.1}>
                <h2 className="text-2xl font-semibold mb-6">Local Tips</h2>
                <div className="space-y-3">
                  {trip.tips.map((tip, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="text-green-500 mt-1 shrink-0">✓</span>
                      <p className="opacity-70 text-sm leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </>
          )}

          {/* PLACES TAB */}
          {activeTab === "places" && (
            <>
              <FadeIn>
                <h2 className="text-2xl font-semibold mb-2">Must Visit Places</h2>
                <p className="text-xs opacity-40 uppercase tracking-widest mb-8">The essential {trip.name} experience</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {trip.places.map((place, i) => (
                    <motion.div key={i} whileHover={{ y: -4, borderColor: "rgba(255,255,255,0.3)" }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="p-5 border border-white/10 rounded-2xl transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl shrink-0">{place.emoji}</span>
                        <div>
                          <p className="font-semibold mb-1">{place.name}</p>
                          <p className="text-sm opacity-50 leading-relaxed">{place.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-semibold">Offbeat Hidden Gems</h2>
                  <span className="text-xs bg-green-600/20 text-green-400 border border-green-600/30 px-3 py-1 rounded-full">Exclusive</span>
                </div>
                <p className="text-xs opacity-40 uppercase tracking-widest mb-8">Places most tourists never find</p>
                <div className="space-y-4">
                  {trip.offbeat.map((place, i) => (
                    <motion.div key={i} whileHover={{ x: 6 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="flex gap-4 items-start p-5 border border-white/10 rounded-2xl hover:border-green-500/30 transition-colors group"
                    >
                      <span className="text-2xl shrink-0">{place.emoji}</span>
                      <div className="flex-1">
                        <p className="font-semibold mb-1 group-hover:text-green-400 transition-colors">{place.name}</p>
                        <p className="text-sm opacity-60 leading-relaxed">{place.desc}</p>
                      </div>
                      <span className="text-xs opacity-20 group-hover:opacity-60 transition shrink-0 mt-1">Hidden →</span>
                    </motion.div>
                  ))}
                </div>
              </FadeIn>
            </>
          )}

          {/* ITINERARY TAB */}
          {activeTab === "itinerary" && (
            <FadeIn>
              <h2 className="text-2xl font-semibold mb-2">Complete Itinerary</h2>
              <p className="text-xs opacity-40 uppercase tracking-widest mb-8">Day by day — what to see and do</p>
              <div className="space-y-6">
                {trip.itinerary.map((day, i) => (
                  <motion.div key={i}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center gap-4 p-5 bg-neutral-900">
                      <div className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center text-green-400 font-bold text-sm shrink-0">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-xs opacity-40 uppercase tracking-widest">{day.day}</p>
                        <p className="font-semibold">{day.place}</p>
                      </div>
                    </div>
                    <div className="p-5 space-y-2">
                      {day.points.map((point, j) => (
                        <div key={j} className="flex gap-3 items-start">
                          <span className="text-green-500/60 mt-1 shrink-0 text-xs">▸</span>
                          <p className="text-sm opacity-70 leading-relaxed">{point}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </FadeIn>
          )}

          {/* FOOD TAB */}
          {activeTab === "food" && (
            <>
              <FadeIn>
                <h2 className="text-2xl font-semibold mb-2">Where to Eat</h2>
                <p className="text-xs opacity-40 uppercase tracking-widest mb-8">Best food in {trip.name}</p>
                <div className="grid md:grid-cols-2 gap-4">
                  {trip.food.map((place, i) => (
                    <motion.div key={i}
                      whileHover={{ y: -4 }}
                      transition={{ type: "spring", stiffness: 300 }}
                      className="p-5 border border-white/10 rounded-2xl hover:border-orange-500/30 transition-colors group"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl shrink-0">{place.emoji}</span>
                        <div>
                          <p className="font-semibold mb-1 group-hover:text-orange-400 transition-colors">{place.name}</p>
                          <p className="text-sm opacity-50 leading-relaxed">{place.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h2 className="text-2xl font-semibold mb-2">Sunrise & Sunset Spots</h2>
                <p className="text-xs opacity-40 uppercase tracking-widest mb-6">Best views in {trip.name}</p>
                <div className="space-y-4">
                  {trip.sunriseSunset.map((spot, i) => (
                    <motion.div key={i} whileHover={{ x: 6 }}
                      className="flex gap-4 items-start p-5 border border-white/10 rounded-2xl hover:border-yellow-500/30 transition-colors group"
                    >
                      <span className="text-2xl shrink-0">{spot.type.split(" ")[0]}</span>
                      <div>
                        <p className="text-xs opacity-40 mb-1">{spot.type}</p>
                        <p className="font-semibold mb-1 group-hover:text-yellow-400 transition-colors">{spot.name}</p>
                        <p className="text-sm opacity-60 leading-relaxed">{spot.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </FadeIn>
            </>
          )}

          {/* AI TOOLS TAB */}
          {activeTab === "ai" && (
            <div className="space-y-8">
              <FadeIn>
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-2xl">🤖</span>
                  <div>
                    <h2 className="text-2xl font-semibold">AI Trip Tools</h2>
                    <p className="text-xs opacity-40">Personalized for {trip.name}</p>
                  </div>
                </div>
                <PackingList tripName={trip.name} tripType={trip.type} />
              </FadeIn>
              <FadeIn delay={0.1}>
                <SafetyChecker tripName={trip.name} />
              </FadeIn>
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">

          {/* WEATHER */}
          <div>
            <WeatherWidget destination={trip.name} />
          </div>

          {/* COST CALCULATOR */}
          <div className="space-y-0">
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-1">Cost Calculator</h3>
              <p className="text-xs opacity-40 mb-6">₹{trip.price.toLocaleString()} per person</p>
              <label className="block text-xs opacity-50 mb-2 uppercase tracking-widest">Number of People</label>
              <input type="number" value={people} min="1" max="20"
                onChange={(e) => setPeople(Math.max(1, Number(e.target.value)))}
                className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded-xl mb-4 text-center text-xl font-bold"
              />
              <div className="bg-black rounded-xl p-4 text-center">
                <p className="text-xs opacity-40 mb-1">Estimated Total</p>
                <p className="text-3xl font-bold">₹{total.toLocaleString()}</p>
                <p className="text-xs opacity-30 mt-1">for {people} {people === 1 ? "person" : "people"}</p>
              </div>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6 space-y-3">
              <p className="text-xs opacity-40 uppercase tracking-widest mb-4">Plan Your Trip</p>
              <Link href="/plan" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition group">
                <span className="text-lg">🧮</span>
                <div>
                  <p className="text-sm font-semibold group-hover:text-green-400 transition-colors">Budget Calculator</p>
                  <p className="text-xs opacity-40">Full trip cost breakdown</p>
                </div>
                <span className="ml-auto opacity-30 group-hover:opacity-70 transition">→</span>
              </Link>
              <Link href="/plan" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition group">
                <span className="text-lg">🗺️</span>
                <div>
                  <p className="text-sm font-semibold group-hover:text-green-400 transition-colors">Route Planner</p>
                  <p className="text-xs opacity-40">Distance, time & fuel cost</p>
                </div>
                <span className="ml-auto opacity-30 group-hover:opacity-70 transition">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* BACK */}
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <Link href="/" className="text-sm opacity-40 hover:opacity-80 transition">← Back to all destinations</Link>
      </div>

      <footer className="bg-black border-t border-white/10 py-10 text-center">
        <p className="text-xs opacity-30 tracking-widest uppercase">© 2025 Been Like Local — Travel Beyond the Obvious</p>
      </footer>
    </main>
  );
}