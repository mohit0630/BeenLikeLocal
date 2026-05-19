// src/app/destinations/[slug]/layout.js
// This is a SERVER component — no "use client" here
// It gives each destination its own OG image and title when shared on WhatsApp/social

const tripMeta = {
  spiti:          { name: "Spiti Valley",   desc: "High altitude desert, ancient monasteries, remote Himalayas. 8-10 days, ₹18,000.", image: "spiti" },
  ladakh:         { name: "Ladakh",         desc: "Land of high passes — Pangong Lake, Nubra Valley, Khardung La. 8-10 days, ₹28,000.", image: "ladakh" },
  zanskar:        { name: "Zanskar",        desc: "The forgotten kingdom — most remote region in Ladakh. Ancient monasteries, gorges. 8-10 days.", image: "zanskar" },
  kasol:          { name: "Kasol",          desc: "Mini Israel of India — Parvati Valley, Kheerganga trek, hippie cafes. 4 days, ₹7,000.", image: "kasol" },
  chakrata:       { name: "Chakrata",       desc: "Uttarakhand's hidden escape — Tiger Falls, dense forests, zero crowds. 3 days, ₹6,000.", image: "chakrata" },
  manali:         { name: "Manali",         desc: "Gateway to the Himalayas — Solang Valley, Atal Tunnel, Old Manali. 4 days, ₹8,000.", image: "manali" },
  jispa:          { name: "Jispa",          desc: "Lahaul's quiet secret — Bhaga River camping, remote valley, peace. 3 days, ₹7,000.", image: "jispa" },
  jibhi:          { name: "Jibhi",          desc: "Hidden forest village in Tirthan Valley — wooden cottages, cold streams, silence. 3 days, ₹6,000.", image: "jibhi" },
  udaipur:        { name: "Udaipur",        desc: "City of Lakes — Lake Palace, City Palace, romantic Rajasthan. 2 days, ₹5,000.", image: "udaipur" },
  rishikesh:      { name: "Rishikesh",      desc: "Yoga capital of the world — Ganga Aarti, river rafting, Beatles Ashram. 3 days, ₹6,500.", image: "rishikesh" },
  banswara:       { name: "Banswara",       desc: "City of hundred islands — offbeat Rajasthan, tribal culture, Mahi River. 2 days, ₹4,500.", image: "banswara" },
  "barot-valley": { name: "Barot Valley",   desc: "Himachal's best kept secret — Uhl River, trout fishing, Rajgundha trek. 3 days, ₹6,000.", image: "barot" },
  jaisalmer:      { name: "Jaisalmer",      desc: "The Golden City — Jaisalmer Fort, Sam Sand Dunes, desert camping. 3 days, ₹7,500.", image: "jaisalmer" },
  dharamshala:    { name: "Dharamshala",    desc: "Home of the Dalai Lama — McLeodganj, Triund trek, Tibetan culture. 3 days, ₹6,500.", image: "dharamshala" },
  kedarnath:      { name: "Kedarnath",      desc: "The 22km trek nobody tells you the truth about. Opening day darshan. One of the twelve Jyotirlingas. 4 days, ₹9,000.", image: "kedarnath" },
};

export async function generateMetadata({ params }) {
  const trip = tripMeta[params.slug];

  if (!trip) {
    return {
      title: "Destination — Been Like Local",
    };
  }

  return {
    title: `${trip.name} Travel Guide — Been Like Local`,
    description: trip.desc,
    openGraph: {
      title: `${trip.name} — Been Like Local`,
      description: trip.desc,
      url: `https://beenlikelocal.in/destinations/${params.slug}`,
      siteName: "Been Like Local",
      images: [
        {
          url: `/photos/${trip.image}.jpg`,
          width: 1200,
          height: 630,
          alt: `${trip.name} — Been Like Local`,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${trip.name} — Been Like Local`,
      description: trip.desc,
      images: [`/photos/${trip.image}.jpg`],
    },
  };
}

export default function DestinationLayout({ children }) {
  return children;
}