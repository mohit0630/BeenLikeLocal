"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion, useScroll, useTransform, AnimatePresence, useInView } from "framer-motion";

const TripRecommender = dynamic(
  () => import("@/components/TripRecommender"),
  { ssr: false }
);

function FadeInSection({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >{children}</motion.div>
  );
}

function TiltCard({ dest }) {
  const cardRef = useRef(null);
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const rotateX = ((e.clientY - rect.top - rect.height / 2) / rect.height) * -10;
    const rotateY = ((e.clientX - rect.left - rect.width / 2) / rect.width) * 10;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04,1.04,1.04)`;
  };
  const handleMouseLeave = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    }
  };
  return (
    <a ref={cardRef} href={`/destinations/${dest.slug}`}
      onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.15s ease-out", transformStyle: "preserve-3d", display: "block" }}
      className="group relative overflow-hidden rounded-2xl cursor-pointer"
    >
      <img
        src={`/photos/${dest.slug === "barot-valley" ? "barot" : dest.slug}.jpg`}
        alt={dest.label}
        className="w-full h-72 object-cover group-hover:scale-110 transition duration-700"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      <div className={`absolute top-3 right-3 text-xs px-2 py-1 rounded-full tracking-widest uppercase ${
        dest.type === "explore" ? "bg-green-600/80" : "bg-orange-500/80"
      }`}>
        {dest.type === "explore" ? "Adventure" : "Relax"}
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <p className="text-xl font-semibold">{dest.label}</p>
        <p className="text-xs opacity-0 group-hover:opacity-100 mt-1 uppercase tracking-widest transition-all duration-300">
          View Details →
        </p>
      </div>
    </a>
  );
}

const destinations = [
  { slug: "spiti",        label: "Spiti Valley",  type: "explore" },
  { slug: "ladakh",       label: "Ladakh",         type: "explore" },
  { slug: "zanskar",      label: "Zanskar",        type: "explore" },
  { slug: "kasol",        label: "Kasol",          type: "explore" },
  { slug: "chakrata",     label: "Chakrata",       type: "explore" },
  { slug: "manali",       label: "Manali",         type: "explore" },
  { slug: "jispa",        label: "Jispa",          type: "explore" },
  { slug: "jibhi",        label: "Jibhi",          type: "relax"   },
  { slug: "udaipur",      label: "Udaipur",        type: "relax"   },
  { slug: "rishikesh",    label: "Rishikesh",      type: "relax"   },
  { slug: "banswara",     label: "Banswara",       type: "relax"   },
  { slug: "barot-valley", label: "Barot Valley",   type: "relax"   },
  { slug: "jaisalmer",    label: "Jaisalmer",      type: "relax"   },
  { slug: "dharamshala",  label: "Dharamshala",    type: "relax"   },
];

export default function Home() {
  const [mode, setMode] = useState("home");
  const [search, setSearch] = useState("");
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);

  const bg =
    mode === "explore" ? "/photos/explore.jpg" :
    mode === "relax"   ? "/photos/relax.jpg"   :
    "/photos/mountains.jpg";

  const filtered = destinations.filter((d) => {
    const matchesMode = mode === "home" || d.type === mode;
    const matchesSearch = search === "" || d.label.toLowerCase().includes(search.toLowerCase());
    return matchesMode && matchesSearch;
  });

  return (
    <main className="w-full text-white bg-black overflow-x-hidden">

      {/* HERO */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <motion.div style={{ y: bgY }} className="absolute inset-0 w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div key={bg}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full"
              style={{ backgroundImage: `url(${bg})`, backgroundSize: "cover", backgroundPosition: "center 70%" }}
            />
          </AnimatePresence>
        </motion.div>

        <div className="absolute inset-0 bg-black/50" />

        <motion.div style={{ opacity: heroOpacity }} className="relative z-10 px-4">
          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 0.7, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xs tracking-[0.4em] uppercase mb-4"
          >
            Travel Beyond the Obvious
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: "easeOut" }}
            className="text-6xl md:text-8xl font-bold tracking-tight mb-6 leading-none"
          >
            BEEN LIKE LOCAL
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} transition={{ delay: 0.7 }} className="text-lg mb-2">
            Been There. Lived That.
          </motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ delay: 0.9 }} className="text-sm mb-12">
            Travel the mountains like a local
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => setMode(mode === "explore" ? "home" : "explore")}
              className={`px-8 py-3 rounded-full text-sm tracking-widest uppercase transition-all duration-300 border ${
                mode === "explore" ? "bg-green-600 border-green-600" : "border-white/50 hover:bg-white/10"
              }`}
            >
              🏔️ Explore Mode
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
              onClick={() => setMode(mode === "relax" ? "home" : "relax")}
              className={`px-8 py-3 rounded-full text-sm tracking-widest uppercase transition-all duration-300 border ${
                mode === "relax" ? "bg-orange-500 border-orange-500" : "border-white/50 hover:bg-white/10"
              }`}
            >
              🌿 Relax Mode
            </motion.button>
          </motion.div>

          <AnimatePresence>
            {mode !== "home" && (
              <motion.p
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 0.5, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="mt-6 text-xs tracking-widest uppercase"
              >
                Showing {mode === "explore" ? "adventure" : "slow travel"} destinations
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce"
        >
          <span className="text-xs tracking-widest uppercase mb-1">Scroll</span>
          <span>↓</span>
        </motion.div>
      </section>

      {/* WHY US */}
      <section id="why-us" className="bg-neutral-950 py-28 text-center px-6">
        <FadeInSection>
          <p className="text-xs tracking-[0.4em] uppercase opacity-40 mb-4">Why Choose Us</p>
          <h2 className="text-4xl md:text-5xl font-semibold mb-16">Been Like Local</h2>
        </FadeInSection>
        <div className="grid md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {[
            { icon: "🗺️", title: "Real Travel Experience", desc: "Every destination is personally explored. No third-party listings. No fake reviews." },
            { icon: "🔍", title: "Hidden Locations",        desc: "Find villages, cafés, and trails that tourists never discover." },
            { icon: "💰", title: "Budget Smart Trips",      desc: "Maximum experience without overspending. Real budgets, real numbers." },
          ].map((card, i) => (
            <FadeInSection key={card.title} delay={i * 0.15}>
              <motion.div whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300 }}
                className="p-8 border border-white/10 rounded-2xl hover:border-white/30 transition-colors"
              >
                <div className="text-3xl mb-4">{card.icon}</div>
                <h3 className="text-lg font-semibold mb-3">{card.title}</h3>
                <p className="opacity-50 text-sm leading-relaxed">{card.desc}</p>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* QUICK LINKS */}
      <section className="bg-black py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            { href: "/about", icon: "👤", title: "Our Story",      desc: "Who is behind Been Like Local" },
            { href: "/blog",  icon: "📖", title: "Trip Journal",   desc: "Real stories from real trips"  },
            { href: "/plan",  icon: "🧮", title: "Plan Your Trip", desc: "AI budget + timing calculator" },
          ].map((item, i) => (
            <FadeInSection key={item.href} delay={i * 0.1}>
              <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
                <Link href={item.href}
                  className="flex items-start gap-4 p-6 border border-white/10 rounded-2xl hover:border-white/30 transition-colors group"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="font-semibold group-hover:text-green-400 transition-colors mb-1">{item.title}</p>
                    <p className="text-xs opacity-40">{item.desc}</p>
                  </div>
                  <span className="ml-auto opacity-30 group-hover:opacity-80 transition">→</span>
                </Link>
              </motion.div>
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* DESTINATIONS */}
      <section id="destinations" className="bg-black py-28 px-6">
        <FadeInSection>
          <p className="text-xs tracking-[0.4em] uppercase opacity-40 text-center mb-4">
            {mode === "explore" ? "Adventure Destinations" :
             mode === "relax"   ? "Slow Travel Destinations" : "All Destinations"}
          </p>
          <h2 className="text-4xl md:text-5xl text-center font-semibold mb-8">Choose Your Journey</h2>
        </FadeInSection>

        {/* SEARCH BAR */}
        <div className="max-w-md mx-auto mb-12 relative">
          <input
            type="text"
            placeholder="Search destinations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            suppressHydrationWarning
              className="w-full bg-neutral-900 border border-white/20 text-white px-5 py-3 rounded-full text-sm placeholder:opacity-30 focus:border-white/50 outline-none transition pr-10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-80 transition text-lg"
            >
              ✕
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={mode}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="grid md:grid-cols-4 gap-6 max-w-7xl mx-auto"
          >
            {filtered.map((dest, i) => (
              <motion.div key={dest.slug}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <TiltCard dest={dest} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* INSTAGRAM */}
      <section className="bg-neutral-950 py-24 text-center px-6">
        <FadeInSection>
          <p className="text-xs tracking-[0.4em] uppercase opacity-40 mb-4">Follow the Journey</p>
          <h2 className="text-4xl font-semibold mb-8">@beenlikelocal</h2>
          <p className="opacity-50 mb-10 text-sm max-w-md mx-auto">
            Real moments. Real places. Follow along as we discover India's hidden corners.
          </p>
          <motion.a whileHover={{ scale: 1.05, backgroundColor: "white", color: "black" }}
            whileTap={{ scale: 0.97 }}
            href="https://www.instagram.com/beenlikelocal?igsh=azR1ZGtmc3FlYXNm&utm_source=qr"
            target="_blank"
            className="inline-block border border-white/30 text-white px-8 py-3 rounded-full text-sm tracking-widest uppercase transition-colors duration-300"
          >
            Follow on Instagram
          </motion.a>
        </FadeInSection>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-white/10 py-10 text-center">
        <p className="text-xs opacity-30 tracking-widest uppercase">
          © 2025 Been Like Local — Travel Beyond the Obvious
        </p>
      </footer>

      <TripRecommender />
    </main>
  );
}