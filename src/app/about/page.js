"use client";
import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const trips = [
  { year: "2024", month: "August",           place: "Tirthan Valley",             emoji: "🌿", upcoming: false, desc: "My first real offbeat trip. Dense forests, crystal river, zero tourists. This is where Been Like Local began." },
  { year: "2024", month: "October",          place: "Manali → Darcha (Bike Trip)", emoji: "🏍️", upcoming: false, desc: "Rode through Atal Tunnel into Lahaul. Cold, raw, completely empty roads. One of the best rides of my life." },
  { year: "2024", month: "November",         place: "Manali (Car Trip)",           emoji: "🚗", upcoming: false, desc: "Same mountains, completely different vibe. First snow of the season. Came back with 400+ photos." },
  { year: "2024", month: "November",         place: "Rishikesh",                   emoji: "🌊", upcoming: false, desc: "Ganga aarti at dusk, riverside camps, and the best maggi of my life at a dhaba near Lakshman Jhula." },
  { year: "2025", month: "June",             place: "McLeodganj",                  emoji: "🏔️", upcoming: false, desc: "Tibetan culture meets Indian mountains. Triund at golden hour. Momos that ruined all other momos forever." },
  { year: "2025", month: "September",        place: "Barot Valley",                emoji: "🎯", upcoming: true,  desc: "Next mission. Himachal's best kept secret — a valley most people drive past without stopping." },
];

export default function About() {
  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section
        className="h-[75vh] flex items-end justify-start relative overflow-hidden"
        style={{
          backgroundImage: "url(/photos/mountains.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div className="relative z-10 p-10 md:p-20 max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.5, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs tracking-[0.4em] uppercase mb-4"
          >
            The Person Behind the Trips
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold leading-tight mb-4"
          >
            A Person Crazy<br />For Travel
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.6 }}
            className="text-lg"
          >
            Not a tourist. Never was.
          </motion.p>
        </div>
      </section>

      {/* STORY */}
      <section className="max-w-4xl mx-auto px-6 py-24 space-y-20">

        <FadeIn>
          <div className="space-y-6">
            <p className="text-xs tracking-[0.4em] uppercase opacity-40">The Story</p>
            <p className="text-2xl md:text-3xl font-light leading-relaxed opacity-90">
              Been Like Local started with one simple frustration —
              <span className="text-white font-medium"> every travel platform shows the same 10 places.</span>
            </p>
            <p className="opacity-60 leading-relaxed text-lg">
              I wanted to find the real India. The hidden valleys, the forgotten villages, the roads that don't appear on tourist maps. So I stopped reading travel blogs and started driving.
            </p>
            <p className="opacity-60 leading-relaxed text-lg">
              Been Like Local is not a business. It's a documentation. Every destination listed here has been visited personally. Every itinerary is real. Every budget is what I actually spent.
            </p>
          </div>
        </FadeIn>

        {/* STATS */}
        <FadeIn delay={0.1}>
          <div className="grid grid-cols-3 gap-6 text-center">
            {[
              { number: "6+",  label: "Major Trips"        },
              { number: "10+", label: "States Explored"    },
              { number: "0",   label: "Generic Tours Taken"},
            ].map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={{ y: -4 }}
                className="p-8 border border-white/10 rounded-2xl hover:border-white/30 transition-colors"
              >
                <p className="text-5xl font-bold mb-2">{stat.number}</p>
                <p className="text-xs opacity-50 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </FadeIn>

        {/* PHILOSOPHY */}
        <FadeIn delay={0.1}>
          <div className="space-y-6">
            <p className="text-xs tracking-[0.4em] uppercase opacity-40">The Philosophy</p>
            <div className="space-y-5 leading-relaxed text-lg">
              <p className="opacity-70">
                Most people travel to check places off a list. I travel to understand them. There is a massive difference between visiting a place and experiencing it.
              </p>
              <p className="opacity-70">
                When I ride into Spiti Valley or walk into a village in Tirthan, I'm not there as a tourist. I eat what locals eat, stay where they stay, and take the roads they take.
              </p>
              <p className="text-white opacity-90 font-medium text-xl border-l-2 border-green-500 pl-6">
                That's what Been Like Local is — a documentation of real travel, for people who want the same.
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* TRIP TIMELINE */}
      <section className="bg-neutral-950 py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <p className="text-xs tracking-[0.4em] uppercase opacity-40 mb-2">The Journey So Far</p>
            <h2 className="text-4xl font-semibold mb-16">Trips That Built This</h2>
          </FadeIn>

          <div className="space-y-0">
            {trips.map((trip, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ x: 8 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex gap-6 items-start border-b border-white/10 py-8 group cursor-default"
                >
                  <div className="text-3xl shrink-0 mt-1">{trip.emoji}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <p className="text-lg font-semibold group-hover:text-green-400 transition-colors">
                        {trip.place}
                      </p>
                      {trip.upcoming && (
                        <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded-full border border-orange-500/30">
                          Upcoming
                        </span>
                      )}
                    </div>
                    <p className="text-xs opacity-40 uppercase tracking-widest mb-3">
                      {trip.month} {trip.year}
                    </p>
                    <p className="opacity-60 text-sm leading-relaxed">{trip.desc}</p>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT IS THIS PLATFORM */}
      <section className="max-w-4xl mx-auto px-6 py-24">
        <FadeIn>
          <p className="text-xs tracking-[0.4em] uppercase opacity-40 mb-4">What This Platform Offers</p>
          <h2 className="text-4xl font-semibold mb-12">More Than Just Destinations</h2>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6">
          {[
            { icon: "🗺️", title: "Real Itineraries",      desc: "Day by day plans from actual trips — not copy-pasted from other websites." },
            { icon: "💰", title: "Honest Budgets",         desc: "What things actually cost. No hidden assumptions or sponsored stays." },
            { icon: "🤖", title: "AI Trip Planner",        desc: "Budget calculator and best time suggester powered by AI." },
            { icon: "📖", title: "Trip Stories",           desc: "Real accounts of what happened — good roads and bad ones both." },
          ].map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="p-6 border border-white/10 rounded-2xl hover:border-white/30 transition-colors"
              >
                <span className="text-2xl mb-4 block">{item.icon}</span>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm opacity-50 leading-relaxed">{item.desc}</p>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-neutral-950 py-24 text-center px-6">
        <FadeIn>
          <p className="text-xs tracking-[0.4em] uppercase opacity-40 mb-4">Ready to Travel?</p>
          <h2 className="text-4xl font-semibold mb-6">Let's Find Your Trip</h2>
          <p className="opacity-50 max-w-md mx-auto mb-10 text-sm leading-relaxed">
            Browse the destinations, use the AI planner, or just follow along on Instagram — real travel, always.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link href="/#destinations" className="inline-block bg-white text-black px-8 py-3 rounded-full text-sm tracking-widest uppercase font-semibold">
                Browse Destinations
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}>
              <Link href="/plan" className="inline-block border border-white/30 text-white px-8 py-3 rounded-full text-sm tracking-widest uppercase">
                Plan My Trip
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