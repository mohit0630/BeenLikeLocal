"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const destinations = {
  spiti: {
    name: "Spiti Valley", image: "/photos/spiti.jpg", slug: "spiti",
    price: 18000, days: "8-10", type: "Adventure",
    altitude: "3500-4500m", bestTime: "Jun-Sep",
    difficulty: 9, crowd: 3, internet: 1, atm: 2, roads: 9,
    tags: ["Monasteries", "High Altitude", "Remote", "Bike Trip"],
    idealFor: ["Bikers", "Photographers", "Solo Travelers"],
    avoid: "Families with kids, first-time mountain travelers",
    highlight: "Key Monastery, Chandratal Lake, Hikkim Post Office",
  },
  ladakh: {
    name: "Ladakh", image: "/photos/ladakh.jpg", slug: "ladakh",
    price: 28000, days: "8-10", type: "Adventure",
    altitude: "3500-5300m", bestTime: "Jun-Sep",
    difficulty: 8, crowd: 6, internet: 4, atm: 6, roads: 7,
    tags: ["Lakes", "High Altitude", "Monasteries", "Permits"],
    idealFor: ["All Travelers", "Photographers", "Adventure Seekers"],
    avoid: "Budget backpackers, altitude-sensitive people",
    highlight: "Pangong Lake, Nubra Valley, Khardung La",
  },
  kasol: {
    name: "Kasol", image: "/photos/kasol.jpg", slug: "kasol",
    price: 7000, days: "4", type: "Adventure",
    altitude: "1580m", bestTime: "Mar-Jun, Sep-Nov",
    difficulty: 3, crowd: 7, internet: 5, atm: 5, roads: 4,
    tags: ["Backpacker", "Trekking", "Cafes", "River"],
    idealFor: ["Budget Travelers", "First Timers", "Friend Groups"],
    avoid: "Luxury seekers, families with very young kids",
    highlight: "Kheerganga Trek, Parvati River, Israeli Cafes",
  },
  manali: {
    name: "Manali", image: "/photos/manali.jpg", slug: "manali",
    price: 8000, days: "4", type: "Adventure",
    altitude: "2050m", bestTime: "Oct-Nov, May-Jun",
    difficulty: 3, crowd: 9, internet: 7, atm: 8, roads: 5,
    tags: ["Snow", "Adventure Sports", "Accessible", "Crowds"],
    idealFor: ["Families", "Couples", "First Timers"],
    avoid: "Crowd-haters, offbeat seekers",
    highlight: "Solang Valley, Atal Tunnel, Old Manali Cafes",
  },
  jibhi: {
    name: "Jibhi", image: "/photos/jibhi.jpg", slug: "jibhi",
    price: 6000, days: "3", type: "Relax",
    altitude: "1600m", bestTime: "Mar-Jun, Sep-Nov",
    difficulty: 2, crowd: 3, internet: 2, atm: 3, roads: 5,
    tags: ["Forest", "Quiet", "Cottages", "Hidden Gem"],
    idealFor: ["Couples", "Solo Travelers", "Digital Detox"],
    avoid: "People wanting nightlife or entertainment",
    highlight: "Tirthan River, Serolsar Lake, Jalori Pass",
  },
  rishikesh: {
    name: "Rishikesh", image: "/photos/rishikesh.jpg", slug: "rishikesh",
    price: 6500, days: "3", type: "Relax",
    altitude: "372m", bestTime: "Sep-Nov, Feb-May",
    difficulty: 1, crowd: 8, internet: 8, atm: 9, roads: 2,
    tags: ["Spiritual", "Rafting", "Yoga", "Accessible"],
    idealFor: ["Everyone", "Spiritual Seekers", "Beginners"],
    avoid: "Monsoon visitors (rafting banned)",
    highlight: "Ganga Aarti, River Rafting, Beatles Ashram",
  },
  udaipur: {
    name: "Udaipur", image: "/photos/udaipur.jpg", slug: "udaipur",
    price: 5000, days: "2", type: "Relax",
    altitude: "598m", bestTime: "Oct-Mar",
    difficulty: 1, crowd: 7, internet: 8, atm: 9, roads: 2,
    tags: ["Lakes", "Palaces", "Romantic", "Heritage"],
    idealFor: ["Couples", "Families", "History Lovers"],
    avoid: "Summer visitors (May-June too hot)",
    highlight: "City Palace, Lake Pichola, Bagore ki Haveli",
  },
  jaisalmer: {
    name: "Jaisalmer", image: "/photos/jaisalmer.jpg", slug: "jaisalmer",
    price: 7500, days: "3", type: "Relax",
    altitude: "225m", bestTime: "Oct-Mar",
    difficulty: 1, crowd: 6, internet: 7, atm: 8, roads: 2,
    tags: ["Desert", "Fort", "Camping", "Camels"],
    idealFor: ["Everyone", "Photographers", "Culture Lovers"],
    avoid: "May-June (temperatures above 45°C)",
    highlight: "Jaisalmer Fort, Sam Sand Dunes, Desert Camping",
  },
  dharamshala: {
    name: "Dharamshala", image: "/photos/dharamshala.jpg", slug: "dharamshala",
    price: 6500, days: "3", type: "Relax",
    altitude: "1457m", bestTime: "Mar-Jun, Sep-Nov",
    difficulty: 3, crowd: 6, internet: 7, atm: 7, roads: 3,
    tags: ["Tibetan Culture", "Trek", "Monastery", "Hill Station"],
    idealFor: ["Culture Seekers", "Trekkers", "Solo Travelers"],
    avoid: "Heavy monsoon period",
    highlight: "McLeodganj, Triund Trek, Namgyal Monastery",
  },
  chakrata: {
    name: "Chakrata", image: "/photos/chakrata.jpg", slug: "chakrata",
    price: 6000, days: "3", type: "Adventure",
    altitude: "2118m", bestTime: "Mar-Jun, Sep-Nov",
    difficulty: 3, crowd: 2, internet: 3, atm: 4, roads: 5,
    tags: ["Hidden", "Forest", "Waterfall", "No Crowds"],
    idealFor: ["Crowd Haters", "Nature Lovers", "Budget Travelers"],
    avoid: "People wanting good connectivity",
    highlight: "Tiger Falls, Chilmiri Neck, Deoban Forest",
  },
  banswara: {
    name: "Banswara", image: "/photos/banswara.jpg", slug: "banswara",
    price: 4500, days: "2", type: "Relax",
    altitude: "209m", bestTime: "Jul-Feb",
    difficulty: 1, crowd: 1, internet: 6, atm: 7, roads: 3,
    tags: ["Offbeat", "Islands", "Tribal", "Budget"],
    idealFor: ["Offbeat Explorers", "Budget Travelers"],
    avoid: "People expecting tourist infrastructure",
    highlight: "Mahi Dam Islands, Tripura Sundari Temple",
  },
  "barot-valley": {
    name: "Barot Valley", image: "/photos/barot.jpg", slug: "barot-valley",
    price: 6000, days: "3", type: "Relax",
    altitude: "1800m", bestTime: "Apr-Oct",
    difficulty: 2, crowd: 2, internet: 2, atm: 3, roads: 5,
    tags: ["Hidden", "River", "Fishing", "Peace"],
    idealFor: ["Digital Detox", "Nature Lovers", "Budget Travelers"],
    avoid: "People wanting connectivity or nightlife",
    highlight: "Uhl River, Rajgundha Trek, Trout Fishing",
  },
  jispa: {
    name: "Jispa", image: "/photos/jispa.jpg", slug: "jispa",
    price: 7000, days: "3", type: "Adventure",
    altitude: "3200m", bestTime: "Jun-Sep",
    difficulty: 4, crowd: 2, internet: 2, atm: 3, roads: 6,
    tags: ["Remote", "Camping", "Lahaul", "Peaceful"],
    idealFor: ["Bikers", "Road Trippers", "Solitude Seekers"],
    avoid: "First-time mountain travelers",
    highlight: "Bhaga River Camping, Gemur Monastery, Baralacha La",
  },
  zanskar: {
    name: "Zanskar", image: "/photos/zanskar.jpg", slug: "zanskar",
    price: 28000, days: "8-10", type: "Adventure",
    altitude: "3700m", bestTime: "Jun-Oct",
    difficulty: 10, crowd: 1, internet: 1, atm: 1, roads: 10,
    tags: ["Extreme", "Remote", "Monasteries", "Gorges"],
    idealFor: ["Serious Adventurers", "Experienced Trekkers"],
    avoid: "Casual travelers, anyone without mountain experience",
    highlight: "Phugtal Monastery, Chadar Trek Route, Padum",
  },
  kedarnath: {
    name: "Kedarnath", image: "/photos/kedarnath.jpg", slug: "kedarnath",
    price: 9000, days: "4", type: "Adventure",
    altitude: "3553m", bestTime: "May-Jun, Sep-Oct",
    difficulty: 8, crowd: 7, internet: 2, atm: 2, roads: 5,
    tags: ["Spiritual", "Trek", "Jyotirlinga", "High Altitude"],
    idealFor: ["Pilgrims", "Trekkers", "Spiritual Seekers"],
    avoid: "People with knee/back issues, anyone afraid of long treks",
    highlight: "Kedarnath Temple, 22km Trek, Opening Day Darshan",
  },
};

const destList = Object.values(destinations);

function Bar({ value, color }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${value * 10}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`} />
      </div>
      <span className="text-xs opacity-40 w-4">{value}</span>
    </div>
  );
}

export default function Compare() {
  const [dest1, setDest1] = useState("spiti");
  const [dest2, setDest2] = useState("ladakh");
  const d1 = destinations[dest1];
  const d2 = destinations[dest2];

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="pt-32 pb-12 px-6 text-center">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 0.1 }}
          className="text-xs tracking-[0.4em] uppercase mb-4">Side by Side</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="text-5xl md:text-6xl font-bold mb-4">Compare Trips</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.4 }}
          className="max-w-md mx-auto text-sm">Can't decide? Compare two destinations side by side.</motion.p>
      </section>

      {/* SELECTORS */}
      <section className="max-w-5xl mx-auto px-6 pb-8">
        <div className="grid md:grid-cols-2 gap-4">
          {[{ val: dest1, set: setDest1, excl: dest2, color: "border-green-500", label: "Destination 1" },
            { val: dest2, set: setDest2, excl: dest1, color: "border-blue-500", label: "Destination 2" }].map((s, i) => (
            <div key={i}>
              <label className="text-xs opacity-40 uppercase tracking-widest block mb-2">{s.label}</label>
              <select value={s.val} onChange={e => s.set(e.target.value)}
                className={`w-full bg-neutral-900 border-2 ${s.color} text-white px-4 py-3 rounded-xl text-sm outline-none`}>
                {destList.filter(d => d.slug !== s.excl).map(d => (
                  <option key={d.slug} value={d.slug}>{d.name}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </section>

      {/* HERO CARDS */}
      <section className="max-w-5xl mx-auto px-6 pb-6">
        <div className="grid md:grid-cols-2 gap-6">
          {[{ d: d1, color: "border-green-500/40", btn: "bg-green-600 hover:bg-green-500" },
            { d: d2, color: "border-blue-500/40", btn: "bg-blue-600 hover:bg-blue-500" }].map(({ d, color, btn }, i) => (
            <motion.div key={d.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-2xl overflow-hidden border ${color}`}
            >
              <div className="relative h-44">
                <img src={d.image} alt={d.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-0 p-4">
                  <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-widest ${
                    d.type === "Adventure" ? "bg-green-600" : "bg-orange-500"
                  }`}>{d.type}</span>
                  <h3 className="text-2xl font-bold mt-1">{d.name}</h3>
                </div>
              </div>
              <div className="p-4 bg-neutral-900 grid grid-cols-2 gap-3">
                {[
                  { label: "Price/Person", val: `₹${d.price.toLocaleString()}` },
                  { label: "Duration", val: `${d.days} Days` },
                  { label: "Altitude", val: d.altitude },
                  { label: "Best Time", val: d.bestTime },
                ].map(item => (
                  <div key={item.label} className="bg-black/40 rounded-xl p-3">
                    <p className="text-xs opacity-40 mb-1">{item.label}</p>
                    <p className="font-semibold text-sm">{item.val}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* METRICS */}
      <section className="max-w-5xl mx-auto px-6 pb-6">
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
          <p className="text-xs opacity-40 uppercase tracking-widest mb-6">Head to Head</p>
          <div className="space-y-5">
            {[
              { label: "Crowd Level", key: "crowd", note: "Higher = more crowded" },
              { label: "Internet Access", key: "internet", note: "Higher = better" },
              { label: "ATM Access", key: "atm", note: "Higher = easier" },
              { label: "Road Difficulty", key: "roads", note: "Higher = rougher roads" },
              { label: "Trip Difficulty", key: "difficulty", note: "Higher = harder" },
            ].map(m => (
              <div key={m.key}>
                <div className="flex justify-between mb-2">
                  <p className="text-sm font-semibold">{m.label}</p>
                  <p className="text-xs opacity-30">{m.note}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-green-400 mb-1">{d1.name}</p>
                    <Bar value={d1[m.key]} color="bg-green-500" />
                  </div>
                  <div>
                    <p className="text-xs text-blue-400 mb-1">{d2.name}</p>
                    <Bar value={d2[m.key]} color="bg-blue-500" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DETAILS */}
      <section className="max-w-5xl mx-auto px-6 pb-8">
        <div className="grid md:grid-cols-2 gap-6">
          {[{ d: d1, color: "text-green-400", btn: "bg-green-600 hover:bg-green-500" },
            { d: d2, color: "text-blue-400", btn: "bg-blue-600 hover:bg-blue-500" }].map(({ d, color, btn }) => (
            <div key={d.slug} className="bg-neutral-900 border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className={`font-bold text-xl ${color}`}>{d.name}</h3>
              <div>
                <p className="text-xs opacity-40 uppercase tracking-widest mb-2">Highlights</p>
                <p className="text-sm opacity-70">{d.highlight}</p>
              </div>
              <div>
                <p className="text-xs opacity-40 uppercase tracking-widest mb-2">Ideal For</p>
                <div className="flex gap-2 flex-wrap">
                  {d.idealFor.map(t => <span key={t} className="text-xs bg-white/10 px-3 py-1 rounded-full">{t}</span>)}
                </div>
              </div>
              <div>
                <p className="text-xs opacity-40 uppercase tracking-widest mb-2">Avoid If</p>
                <p className="text-sm opacity-50">{d.avoid}</p>
              </div>
              <div>
                <p className="text-xs opacity-40 uppercase tracking-widest mb-2">Tags</p>
                <div className="flex gap-2 flex-wrap">
                  {d.tags.map(t => <span key={t} className="text-xs border border-white/20 px-2 py-0.5 rounded-full opacity-50">#{t}</span>)}
                </div>
              </div>
              <Link href={`/destinations/${d.slug}`}
                className={`block text-center py-3 rounded-xl text-sm font-semibold transition ${btn}`}>
                View Full Details →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* VERDICT */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="bg-neutral-900 border border-white/10 rounded-2xl p-6">
          <p className="text-xs opacity-40 uppercase tracking-widest mb-6">Quick Verdict</p>
          <div className="grid md:grid-cols-2 gap-6">
            {[{ d: d1, other: d2, color: "text-green-400" }, { d: d2, other: d1, color: "text-blue-400" }].map(({ d, other, color }) => (
              <div key={d.slug}>
                <p className={`font-semibold mb-3 ${color}`}>{d.name} is better if:</p>
                <div className="space-y-2">
                  {d.price < other.price && <p className="text-sm opacity-60">✓ Tighter budget — ₹{(other.price - d.price).toLocaleString()} cheaper</p>}
                  {d.price > other.price && <p className="text-sm opacity-60">✓ You can spend more — better infrastructure</p>}
                  {d.crowd < other.crowd && <p className="text-sm opacity-60">✓ You hate crowds</p>}
                  {d.crowd > other.crowd && <p className="text-sm opacity-60">✓ You like being around other travelers</p>}
                  {d.internet > other.internet && <p className="text-sm opacity-60">✓ You need connectivity</p>}
                  {d.internet < other.internet && <p className="text-sm opacity-60">✓ You want a real digital detox</p>}
                  {d.difficulty > other.difficulty && <p className="text-sm opacity-60">✓ You're an experienced adventurer</p>}
                  {d.difficulty < other.difficulty && <p className="text-sm opacity-60">✓ You're a first-time mountain traveler</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-black border-t border-white/10 py-10 text-center">
        <p className="text-xs opacity-30 tracking-widest uppercase">© 2025 Been Like Local</p>
      </footer>
    </main>
  );
}