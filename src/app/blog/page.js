"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";

function FadeIn({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
      className={className}
    >{children}</motion.div>
  );
}

const posts = [
  {
    slug: "tirthan-valley-where-it-all-began",
    title: "Tirthan Valley — Where It All Began",
    date: "August 2024",
    category: "Trip Story",
    image: "/photos/jibhi.jpg",
    readTime: "6 min read",
    tags: ["Himachal", "Offbeat", "Solo"],
    excerpt: "August 2024. I was sitting on a cold boulder in the middle of the Tirthan River, watching trout swim in water so clear it looked fake. No tourists. No Instagram spots. Just a river, a forest, and complete silence. This was the moment Been Like Local was born.",
    content: `August 2024. I was sitting on a cold boulder in the middle of the Tirthan River, watching trout swim in water so clear it looked fake. No tourists. No Instagram spots. Just a river, a forest, and complete silence.

This was my first real offbeat trip. I had driven from Bhiwadi to Tirthan Valley — a place most people in my city had never even heard of. I didn't tell my family where I was going. I just drove.

The road to Tirthan is narrow and winding. It passes through Aut, climbs into the Banjar Valley, and suddenly — the river appears. The Tirthan River runs alongside the road for the last 20 kilometres, and every kilometre gets more beautiful than the last.

I stayed in a wooden cottage run by a local family. The owner's wife cooked dal and rice on a wood fire. The walls were thin. You could hear the river from your bed. I slept better than I had in months.

Three days. No phone network for most of it. I walked 15 kilometres through the forest without seeing another tourist. I sat by the river every morning with chai. I watched the same family of ducks cross the river at the same time every evening.

When I came back, something had shifted. I had been to "popular" hill stations before — Shimla, Manali, Mussoorie. They're beautiful, but they're crowded and rushed. Tirthan was different. It was slow. It was real.

That's when I decided — someone needs to document these places. Not the tourist circuit. The real India.

That's Been Like Local.

**What to know if you go:**
Tirthan Valley is in the Great Himalayan National Park buffer zone. The best base is Banjar or Gushaini. Stay in a riverside cottage — the HPFD rest houses are excellent and cheap. The Jibhi area is 10km further and equally beautiful.

Best time: April to June, September to November. Monsoon makes the river unsafe but the forest spectacular.`
  },
  {
    slug: "manali-darcha-bike-trip-october",
    title: "Riding Through Atal Tunnel — October on a Bike",
    date: "October 2024",
    category: "Bike Trip",
    image: "/photos/manali.jpg",
    readTime: "8 min read",
    tags: ["Bike Trip", "Manali", "Lahaul"],
    excerpt: "October in Lahaul is borderline insane. Most tourists are gone. The roads are empty. The mountains are turning gold. And you're riding through the world's longest high-altitude tunnel into a completely different world. This is when you ride.",
    content: `October in Lahaul is borderline insane. The tourists are gone. The roads are empty. The dhabas are closing for winter. And the mountains — the mountains are doing something I had never seen before.

They were turning gold.

I left Manali at 6am on my bike. The Atal Tunnel entrance was 15 kilometres from my hotel. In summer, there's a queue of cars here. In October, I was completely alone. I rode into the tunnel at 3100m on one side and came out at 3000m on the other — into the Lahaul Valley.

The difference is immediate and total.

Manali side: tourists, cafes, apple orchards, Bollywood music from restaurants.
Lahaul side: silence. Brown mountains. The Chenab river. A few villages with flat-roofed houses. Three monks walking on the road.

I rode to Jispa — a tiny village on the banks of the Bhaga River. I was the only guest at the camp. The camp owner made dal and rice and we talked for three hours. He told me about the valley in winter — how it gets cut off, how the residents have 6 months of stored food, how the snow reaches the roof.

The next morning I woke up at 5am. The Bhaga River was frozen along the edges. The mountains were white above 4000m. I sat outside with chai that the camp owner had left on a small table outside my tent. It was -4°C.

It was the best morning of 2024.

**What to know if you go:**
October is the last month the Rohtang Pass and Atal Tunnel are reliably open. By November, snowfall can close roads without warning. Fuel up completely in Manali — petrol pumps are scarce in Lahaul. The Jispa camps are basic but the setting is extraordinary. Total distance Manali-Jispa: 115km. Allow 3-4 hours.`
  },
  {
    slug: "rishikesh-beyond-the-rafting-brochure",
    title: "Rishikesh Beyond the Rafting Brochure",
    date: "November 2024",
    category: "Travel Tips",
    image: "/photos/rishikesh.jpg",
    readTime: "5 min read",
    tags: ["Rishikesh", "Spiritual", "Tips"],
    excerpt: "Everyone comes to Rishikesh for rafting. The brochures, the Instagram posts, the travel blogs — all rafting. But the real Rishikesh is in the back lanes, the small ghats, and the conversations with sadhus at dusk. Here's what most people miss.",
    content: `Everyone comes to Rishikesh for rafting. The brochures, the Instagram posts, the travel blogs — all rafting. River rafting, bungee jumping, the adventure capital of India.

I came for Ganga Aarti.

The aarti at Triveni Ghat happens every evening at 7pm. It has been happening every evening for decades. Priests in saffron robes hold large fire lamps and wave them in patterns over the river while drums play and bells ring. The Ganga is lit by the fire. The smoke rises. A thousand people watch.

It costs nothing. It takes 45 minutes. It is the most powerful thing I have seen in India.

After the aarti, I walked back through the lanes behind the ghat. Small shops selling rudraksha and incense. A chai stall run by an 80-year-old man who said he had been there since 1975. A sadhu sitting in a doorway who looked at me and said nothing.

This is Rishikesh.

The rafting is good. The bungee jumping is terrifying in the best way. But if you come to Rishikesh and only do adventure activities, you've missed the city entirely.

**What I did that most people skip:**
The Beatles Ashram (officially Chaurasi Kutia) is where The Beatles stayed in 1968 and composed most of the White Album. It's now abandoned and covered in murals. You walk through overgrown buildings and art installations in the forest. Entry is ₹150 for Indians. It's one of the most atmospheric places I've visited anywhere.

Kunjapuri Temple is 25km from Rishikesh on a hill. Sunrise there — with the Himalayan ranges visible on clear days — is spectacular. Most tourists never go.

Shivpuri, 16km upstream, has better camping and less crowded rafting than the main Rishikesh stretch.

**Best time:** September to November. February to May. Avoid monsoon — rivers are dangerous and beauty is reduced.`
  },
  {
    slug: "mcleodganj-tibetan-india",
    title: "McLeodganj — Where Tibet Meets India",
    date: "June 2025",
    category: "Trip Story",
    image: "/photos/dharamshala.jpg",
    readTime: "6 min read",
    tags: ["Dharamshala", "Culture", "Food"],
    excerpt: "I expected a tourist town. What I found was a community — Tibetan refugees, Buddhist monks, Indian families, and travelers from across the world, all living in a small hill town under the Dhauladhar range. McLeodganj is unlike anywhere else in India.",
    content: `I expected a tourist town. The kind of place that exists primarily to extract money from visitors. Prayer flags sold by the metre, momos served to tourists who don't know what thukpa is, monasteries where you pay ₹200 to take photos.

What I found was completely different.

McLeodganj is a real community. The Tibetan refugees who settled here in 1960 have built a functioning society — schools, hospitals, government offices, monasteries, restaurants. The Dalai Lama lives here. It's the capital of a government in exile. These are people who left everything and created something extraordinary in a hill town in Himachal Pradesh.

I arrived in the evening and walked the main street. Tibetan restaurants, Buddhist bookshops, small guesthouses with hand-painted signs. An old Tibetan woman selling butter tea from a thermos on the pavement.

I had momos that night. Not the momos you get in Delhi malls — small, identical, made by machine. These were handmade, thick-skinned, filled with vegetables and cheese, served with a dark chilli sauce. I ate three plates.

The next morning I walked to Namgyal Monastery at 6am. The morning prayers had started. Monks in burgundy robes were chanting in a low drone that filled the hall. A few local Tibetans sat at the back. I sat at the back too. For 40 minutes, nobody acknowledged I was there. I didn't need them to.

That afternoon I started the Triund trek. 9km up to a ridge at 2828m. The Dhauladhar range is directly in front of you. The Kangra Valley is below. Snow on the peaks even in June. I camped overnight.

In the morning, I sat on the ridge at 5:30am and watched the sun come up behind the mountains.

**What to know:**
Stay in McLeodganj, not lower Dharamshala — they're different towns. Dharamkot village above McLeodganj is quieter and more local. The Tibet Kitchen restaurant is the best Tibetan food. Triund camping needs a permit from the forest office.`
  },
  {
    slug: "budget-travel-himachal-under-8000",
    title: "How to Travel Himachal in Under ₹8,000",
    date: "2024",
    category: "Travel Tips",
    image: "/photos/kasol.jpg",
    readTime: "7 min read",
    tags: ["Budget", "Tips", "Himachal"],
    excerpt: "People think Himachal Pradesh is expensive. It's not. The expensive version exists — luxury hotels, private taxis, curated packages. But there's another Himachal that costs almost nothing. Here's exactly how I travel the mountains on a real budget.",
    content: `People think Himachal Pradesh is expensive. They've seen the Airbnb prices near Kasol (₹4,000 a night for a wooden cabin), the private taxi quotes (₹6,000 from Bhuntar to Kheerganga base), the mountain restaurant bills (₹800 for pasta and a coffee).

The expensive version of Himachal exists. But it's not the only version.

Here's how I travel:

**Transport**
HRTC buses connect almost everywhere in Himachal. Delhi to Manali overnight bus: ₹700-900. Chandigarh to Kasol: ₹350. These buses are not luxury — they're state transport buses with reclining seats. But they work. They leave on time. They're driven by people who have been driving these mountain roads for 20 years.

For shorter distances, shared jeeps and taxis are the local system. Bhuntar to Kasol: ₹50 in a shared jeep. Kasol to Barshaini: ₹80.

**Stay**
HPFD rest houses (Himachal Pradesh Forest Department) are one of the best kept secrets in Indian travel. Clean rooms, attached bathrooms, sometimes a caretaker who will cook for you. Cost: ₹400-800 per night. They're in incredible locations — inside forests, by rivers, at viewpoints.

Village guesthouses charge ₹300-600 for a basic room. In Kasol and Manali, competition has pushed prices up slightly. Go one village further — Chalal near Kasol, Old Manali above town — and prices drop immediately.

**Food**
Dhabas charge ₹80-150 for a full meal. Dal, rice, roti, sabzi. In Himachal, the dal is thick and the roti is made fresh. This is the food locals eat. It's good.

The Israeli cafes in Kasol charge ₹400-600 for a meal. They're worth it occasionally for the experience. Not for every meal.

**The honest 4-day Kasol budget:**
Bus Delhi-Kasol: ₹800
3 nights guesthouse in Chalal: ₹1,500
4 days food at dhabas: ₹1,200
Shared jeeps and local transport: ₹400
Kheerganga trek (no guide needed): ₹0
Entry fees, misc: ₹300
**Total: ₹4,200**

With one slightly nicer meal and one cafe breakfast per day, add ₹1,000. Still under ₹6,000 for 4 days in the Himalayas.`
  },
  {
    slug: "manali-car-trip-november-first-snow",
    title: "Manali in November — First Snow of the Season",
    date: "November 2024",
    category: "Trip Story",
    image: "/photos/manali.jpg",
    readTime: "5 min read",
    tags: ["Manali", "Winter", "Road Trip"],
    excerpt: "We drove to Manali in November — four of us in my i20. Most people go in summer. November is different. The tourists are mostly gone. The apple trees are bare. And then, somewhere above Kullu, it started snowing.",
    content: `We drove to Manali in November — four of us in my i20. Kartikey (Amit), Vaibhav (Rahul), and one more friend. We left Bhiwadi at 4am. We didn't tell our families exactly where we were going.

This is how our trips work.

The drive through the Kullu Valley in November is different from what you see on Instagram. No apple blossoms, no green fields. The apple trees are bare. The fields are yellow and brown. The river is grey. The mountains have their first white on the peaks.

We stopped for chai at a dhaba outside Kullu. The owner asked where we were going. When we said Manali, he said — "Snow came yesterday above Rohtang. Atal Tunnel is open but Rohtang is finished for the season."

Good, I thought. Fewer people.

We reached Manali by early afternoon and drove directly to Old Manali — above the main town, where the guesthouses are cheap and the cafes are small and genuine. Checked in to a wooden room for ₹800 a night. The owner brought blankets without being asked.

The next morning, we drove to Solang Valley. Snow on the ground. No crowds. The cable car was running. We went up and stood in 4 inches of snow looking at peaks we didn't know the names of.

That afternoon it snowed in Old Manali itself. We sat in a cafe with soup and watched it fall on the street outside.

Sometimes travel is exactly that simple.

**November Manali tips:**
Atal Tunnel stays open in November — Lahaul is accessible. Rohtang is usually closed by mid-October. Accommodation prices drop 40-50% from peak season. Old Manali cafes reduce hours but the best ones stay open. Carry chains for the car if going above Solang.`
  },
];

const categories = ["All", "Trip Story", "Travel Tips", "Bike Trip"];

export default function Blog() {
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = active === "All" ? posts : posts.filter(p => p.category === active);

  if (selected) {
    const post = posts.find(p => p.slug === selected);
    return (
      <main className="min-h-screen bg-black text-white">
        <section
          className="h-[50vh] flex items-end relative"
          style={{ backgroundImage: `url(${post.image})`, backgroundSize: "cover", backgroundPosition: "center" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="relative z-10 p-10 md:p-16 max-w-4xl">
            <span className="text-xs bg-green-600 px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
              {post.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold mb-3 leading-tight">{post.title}</h1>
            <div className="flex gap-4 text-xs opacity-40">
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        </section>

        <div className="max-w-3xl mx-auto px-6 py-16">
          <div className="prose prose-invert prose-lg max-w-none">
            {post.content.split('\n\n').map((para, i) => (
              <p key={i} className={`mb-6 leading-relaxed ${
                para.startsWith('**') ? 'text-white font-semibold text-lg' : 'opacity-75'
              }`}>
                {para.replace(/\*\*/g, '')}
              </p>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap mt-12 mb-8">
            {post.tags.map(tag => (
              <span key={tag} className="text-xs border border-white/20 px-3 py-1 rounded-full opacity-50">
                #{tag}
              </span>
            ))}
          </div>

          <button
            onClick={() => setSelected(null)}
            className="text-sm opacity-40 hover:opacity-80 transition"
          >
            ← Back to Journal
          </button>
        </div>

        <footer className="bg-black border-t border-white/10 py-10 text-center">
          <p className="text-xs opacity-30 tracking-widest uppercase">© 2025 Been Like Local</p>
        </footer>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="pt-32 pb-16 px-6 text-center">
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 0.4, y: 0 }} transition={{ delay: 0.1 }}
          className="text-xs tracking-[0.4em] uppercase mb-4">Real Stories. Real Places.</motion.p>
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.7 }}
          className="text-5xl md:text-7xl font-bold mb-6">The Journal</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.4 }}
          className="max-w-md mx-auto text-sm leading-relaxed">
          Real trip stories, honest travel guides, and everything nobody tells you about these places.
        </motion.p>
      </section>

      <section className="px-6 pb-12">
        <div className="flex gap-3 justify-center flex-wrap">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-xs tracking-widest uppercase transition-all duration-300 border ${
                active === cat ? "bg-white text-black border-white" : "border-white/20 text-white/60 hover:border-white/50"
              }`}
            >{cat}</button>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-3 gap-8">
          {filtered.map((post, i) => (
            <FadeIn key={post.slug} delay={i * 0.08}>
              <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300 }}
                onClick={() => setSelected(post.slug)}
                className="group bg-neutral-900 rounded-2xl overflow-hidden border border-white/10 hover:border-white/30 transition-colors cursor-pointer"
              >
                <div className="relative overflow-hidden h-52">
                  <img src={post.image} alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute top-4 left-4">
                    <span className="text-xs bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20 uppercase tracking-widest">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs opacity-40">{post.date}</span>
                    <span className="text-xs opacity-20">·</span>
                    <span className="text-xs opacity-40">{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3 leading-snug group-hover:text-green-400 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm opacity-50 leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
                  <div className="flex gap-2 flex-wrap">
                    {post.tags.map(tag => (
                      <span key={tag} className="text-xs opacity-40 border border-white/10 px-2 py-0.5 rounded-full">#{tag}</span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </FadeIn>
          ))}
        </div>
      </section>

      <footer className="bg-black border-t border-white/10 py-10 text-center">
        <p className="text-xs opacity-30 tracking-widest uppercase">© 2025 Been Like Local — Travel Beyond the Obvious</p>
      </footer>
    </main>
  );
}