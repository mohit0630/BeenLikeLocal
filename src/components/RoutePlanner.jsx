"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const routes = {
  "Spiti Valley": {
    distance: 740,
    driveTime: "14–16 hrs",
    days: "2 days recommended",
    stops: [
      { name: "Chandigarh", km: 260, note: "Good lunch stop — last major city" },
      { name: "Mandi", km: 420, note: "Fuel up here before mountains" },
      { name: "Manali", km: 570, note: "Overnight stop — mandatory" },
      { name: "Kaza (Spiti)", km: 740, note: "Via Atal Tunnel + Kunzum Pass" },
    ],
    highway: "NH44 → NH205 → NH3 → NH505",
    tips: [
      "Manali overnight is mandatory — don't attempt Delhi to Spiti in one day",
      "Kunzum Pass (4590m) opens only in June — check before planning",
      "Last fuel pump at Manali — carry extra 10L",
      "Download offline maps before leaving Manali — no internet in Spiti",
    ],
  },
  "Ladakh": {
    distance: 1000,
    driveTime: "18–22 hrs",
    days: "2–3 days recommended",
    stops: [
      { name: "Chandigarh", km: 260, note: "First major stop, good food" },
      { name: "Manali", km: 570, note: "Day 1 overnight" },
      { name: "Jispa", km: 685, note: "Day 2 overnight — beautiful riverside camp" },
      { name: "Leh", km: 1000, note: "Via Baralacha La & Tanglang La passes" },
    ],
    highway: "NH44 → NH3 → NH3D",
    tips: [
      "Manali–Leh highway open June to October only",
      "Acclimatize in Jispa before driving to Leh",
      "Carry an oxygen can — passes go above 5000m",
      "Inner Line Permit needed for Nubra/Pangong — get it online",
    ],
  },
  "Zanskar": {
    distance: 1050,
    driveTime: "20–24 hrs",
    days: "3 days recommended",
    stops: [
      { name: "Chandigarh", km: 260, note: "Fuel and food" },
      { name: "Manali", km: 570, note: "Day 1 overnight" },
      { name: "Kargil", km: 870, note: "Day 2 overnight" },
      { name: "Padum (Zanskar)", km: 1050, note: "Via Pensi La pass at 4400m" },
    ],
    highway: "NH44 → NH3 → NH301 → Zanskar Road",
    tips: [
      "Road to Zanskar open only June–October",
      "Most remote drive on this list — plan extra days buffer",
      "Carry 2 days extra food and water",
      "No ATM in Zanskar — withdraw enough cash in Kargil",
    ],
  },
  "Kasol": {
    distance: 530,
    driveTime: "10–12 hrs",
    days: "1 day (or overnight bus)",
    stops: [
      { name: "Chandigarh", km: 260, note: "Midway stop, good food options" },
      { name: "Bhuntar", km: 495, note: "Last ATM before Kasol — withdraw here" },
      { name: "Kasol", km: 530, note: "Via Parvati Valley road" },
    ],
    highway: "NH44 → NH205 → NH3 → Parvati Valley Road",
    tips: [
      "Overnight Volvo bus from Delhi is the easiest option (₹700–900)",
      "Bhuntar has the last reliable ATM before Kasol",
      "Road after Bhuntar is narrow — drive carefully at night",
      "HRTC shared bus from Bhuntar to Kasol: ₹50",
    ],
  },
  "Chakrata": {
    distance: 330,
    driveTime: "6–7 hrs",
    days: "Day trip possible",
    stops: [
      { name: "Dehradun", km: 280, note: "Last major city — fuel up" },
      { name: "Vikasnagar", km: 305, note: "Last town before the mountains" },
      { name: "Chakrata", km: 330, note: "Inner Line Permit checkpoint here" },
    ],
    highway: "NH44 → NH72A → Chakrata Road",
    tips: [
      "Closest offbeat mountain destination from Delhi",
      "Inner Line Permit at checkpoint — free, takes only 10 minutes",
      "Road from Vikasnagar gets narrow and winding",
      "Best for a quick 3-day getaway from Delhi",
    ],
  },
  "Manali": {
    distance: 570,
    driveTime: "11–13 hrs",
    days: "1 day (leave by 5am)",
    stops: [
      { name: "Chandigarh", km: 260, note: "Lunch break recommended" },
      { name: "Mandi", km: 420, note: "Fuel stop — last big town" },
      { name: "Kullu", km: 500, note: "Beas river begins here — scenic" },
      { name: "Manali", km: 570, note: "Stay in Old Manali for best experience" },
    ],
    highway: "NH44 → NH205 → NH3",
    tips: [
      "Leave Delhi by 5am to reach Manali before dark",
      "Chandigarh bypass saves 45 minutes",
      "Road from Mandi is scenic but slower — don't rush",
      "Old Manali is 5km above main town — worth staying there",
    ],
  },
  "Jispa": {
    distance: 685,
    driveTime: "13–15 hrs",
    days: "2 days recommended",
    stops: [
      { name: "Chandigarh", km: 260, note: "Midway stop" },
      { name: "Manali", km: 570, note: "Day 1 overnight — mandatory" },
      { name: "Jispa", km: 685, note: "2 hours from Manali via Atal Tunnel" },
    ],
    highway: "NH44 → NH3 → Leh Highway",
    tips: [
      "Manali overnight is essential — don't try to rush",
      "Atal Tunnel is 9km long — world's longest high altitude tunnel",
      "Jispa sits at 3200m — altitude starts here",
      "Last fuel at Manali — very few pumps after",
    ],
  },
  "Jibhi": {
    distance: 520,
    driveTime: "10–11 hrs",
    days: "1 day",
    stops: [
      { name: "Chandigarh", km: 260, note: "Lunch stop" },
      { name: "Aut", km: 490, note: "Turn off NH3 towards Banjar Valley" },
      { name: "Banjar", km: 510, note: "Last town before Jibhi" },
      { name: "Jibhi", km: 520, note: "Last 10km is beautiful forest road" },
    ],
    highway: "NH44 → NH205 → NH3 → Banjar Valley Road",
    tips: [
      "Road after Aut turning is stunning — drive slowly to enjoy",
      "Last 10km to Jibhi is narrow mountain road",
      "Best to arrive before dark",
      "Tirthan Valley starts here — easily extend the trip",
    ],
  },
  "Udaipur": {
    distance: 670,
    driveTime: "9–10 hrs",
    days: "1 day",
    stops: [
      { name: "Jaipur", km: 390, note: "Lunch break — smooth 6-lane highway" },
      { name: "Chittorgarh", km: 580, note: "Historic fort — worth a 30 min stop" },
      { name: "Udaipur", km: 670, note: "Fateh Sagar area for best stay" },
    ],
    highway: "NH48 → NH48 → NH58",
    tips: [
      "NH48 Delhi–Jaipur is India's best highway — comfortable driving",
      "Jaipur bypass saves time, skip the city",
      "Arrive before sunset — City Palace at dusk is extraordinary",
      "Park near Jagdish Temple for easy lake access",
    ],
  },
  "Rishikesh": {
    distance: 250,
    driveTime: "5–6 hrs",
    days: "Half day drive",
    stops: [
      { name: "Meerut", km: 90, note: "Quick chai stop on the highway" },
      { name: "Haridwar", km: 215, note: "30 mins before Rishikesh — worth a stop" },
      { name: "Rishikesh", km: 250, note: "Stay near Laxman Jhula" },
    ],
    highway: "NH58 → NH334",
    tips: [
      "Closest destination from Delhi on this list — great weekend trip",
      "Leave early to avoid Delhi traffic buildup",
      "Haridwar is 30 mins before — quick Ganga ghat visit possible",
      "Park in town and walk everywhere — Rishikesh is very compact",
    ],
  },
  "Banswara": {
    distance: 730,
    driveTime: "10–11 hrs",
    days: "1 day",
    stops: [
      { name: "Jaipur", km: 390, note: "Lunch stop on NH48" },
      { name: "Dungarpur", km: 680, note: "Last decent town before Banswara" },
      { name: "Banswara", km: 730, note: "South Rajasthan tribal belt" },
    ],
    highway: "NH48 → NH27 → NH927",
    tips: [
      "NH48 to Jaipur is fast and comfortable — 4 hours easy",
      "Road after Dungarpur gets narrower",
      "Least visited destination — very few tourists on the road",
      "Best paired with Udaipur (only 2 hours apart)",
    ],
  },
  "Barot Valley": {
    distance: 530,
    driveTime: "10–11 hrs",
    days: "1 day",
    stops: [
      { name: "Chandigarh", km: 260, note: "Midway stop" },
      { name: "Mandi", km: 420, note: "Turn towards Jogindernagar" },
      { name: "Jogindernagar", km: 490, note: "Last town — fuel here" },
      { name: "Barot", km: 530, note: "Last 40km is narrow mountain road" },
    ],
    highway: "NH44 → NH205 → NH154 → Barot Road",
    tips: [
      "Last 40km from Jogindernagar is narrow winding road — take it slow",
      "Reach Mandi before 2pm for comfortable timing",
      "No fuel pump in Barot — fill up at Jogindernagar",
      "Combine with Billing paragliding (2 hours away) for a great combo",
    ],
  },
  "Jaisalmer": {
    distance: 790,
    driveTime: "10–12 hrs",
    days: "1 day (highway is comfortable)",
    stops: [
      { name: "Jaipur", km: 390, note: "Lunch break — Pink City" },
      { name: "Jodhpur", km: 590, note: "Fuel and snacks — Blue City" },
      { name: "Jaisalmer", km: 790, note: "Enter at sunset — fort glows gold" },
    ],
    highway: "NH48 → NH62 → NH125",
    tips: [
      "NH48 Delhi–Jaipur is India's best highway",
      "Desert landscape begins after Jodhpur — stunning",
      "Plan to arrive in Jaisalmer at sunset — magical entry into the golden city",
      "Book desert camping well in advance — fills up fast",
    ],
  },
  "Dharamshala": {
    distance: 480,
    driveTime: "9–10 hrs",
    days: "1 day",
    stops: [
      { name: "Chandigarh", km: 260, note: "Lunch — last big city" },
      { name: "Una", km: 370, note: "Enter Himachal Pradesh here" },
      { name: "Kangra", km: 455, note: "30 mins from Dharamshala" },
      { name: "McLeodganj", km: 480, note: "Upper Dharamshala — stay here, not lower town" },
    ],
    highway: "NH44 → NH205 → NH154",
    tips: [
      "Leave Delhi by 5am for a comfortable drive",
      "Chandigarh bypass saves 30 minutes",
      "Road from Una is smooth and scenic through Kangra Valley",
      "Stay in McLeodganj — it's 10km above main Dharamshala and completely different",
    ],
  },
  "Kedarnath": {
    distance: 470,
    driveTime: "10–12 hrs + 22km trek",
    days: "2 days recommended",
    stops: [
      { name: "Haridwar", km: 220, note: "Good breakfast + fuel stop" },
      { name: "Rishikesh", km: 250, note: "Last major city before mountains" },
      { name: "Rudraprayag", km: 390, note: "Major junction — tea/lunch stop" },
      { name: "Sonprayag", km: 455, note: "Private vehicles stop here in season" },
      { name: "Gaurikund", km: 460, note: "Start point of Kedarnath trek" },
        { name: "Kedarnath", km: 476, note: "16km trek from Gaurikund" },
    ],
    highway: "NH334 → NH7 → Kedarnath Road",
    tips: [
        "Start from Delhi by 4–5am to avoid traffic and reach before night",
        "During peak season, parking is usually available at Sonprayag only",
        "Shared shuttle runs between Sonprayag and Gaurikund",
        "Start trek before 5am for best weather and less crowd",
        "Carry raincoat and warm layers even in summer — weather changes fast",
        "Helicopter service available from Phata, Sersi, and Guptkashi",
        "Book hotels and registrations in advance during May–June",
        "Oxygen level drops near Kedarnath — walk slowly and stay hydrated",
    ],
  },
};

const fuelTypes = [
  { value: "petrol", label: "⛽ Petrol", unit: "litre" },
  { value: "diesel", label: "🛢️ Diesel", unit: "litre" },
  { value: "cng", label: "🔵 CNG", unit: "kg" },
  { value: "electric", label: "⚡ Electric", unit: null },
];

const destinationList = Object.keys(routes);

export default function RoutePlanner() {
  const [destination, setDestination] = useState("Manali");
  const [fuelType, setFuelType] = useState("petrol");
  const [fuelPrice, setFuelPrice] = useState("");
  const [mileage, setMileage] = useState("");
  const [calculated, setCalculated] = useState(false);

  const route = routes[destination];
  const selectedFuel = fuelTypes.find((f) => f.value === fuelType);
  const isElectric = fuelType === "electric";

  const oneWayCost =
    fuelPrice && mileage
      ? Math.round((route.distance / Number(mileage)) * Number(fuelPrice))
      : null;
  const totalCost = oneWayCost ? oneWayCost * 2 : null;

  const handleCalculate = () => {
    if (!fuelPrice || !mileage) return;
    setCalculated(true);
  };

  const resetCalc = () => {
    setCalculated(false);
  };

  return (
    <div className="bg-neutral-900 border border-white/10 rounded-2xl p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center text-xl">
          🗺️
        </div>
        <div>
          <h3 className="text-xl font-semibold">Route Planner</h3>
          <p className="text-xs opacity-40">Delhi → Your Destination + Fuel Cost</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        {/* From — Fixed */}
        <div className="flex items-center gap-3 p-4 bg-black/40 rounded-xl border border-green-500/20">
          <span className="text-green-400 text-lg">📍</span>
          <div>
            <p className="text-xs opacity-40 uppercase tracking-widest mb-0.5">From</p>
            <p className="font-semibold">New Delhi</p>
          </div>
          <span className="ml-auto text-xs text-green-400 opacity-60">Fixed</span>
        </div>

        {/* Destination Selector */}
        <div>
          <label className="block text-xs opacity-50 uppercase tracking-widest mb-2">To</label>
          <select
            value={destination}
            onChange={(e) => {
              setDestination(e.target.value);
              resetCalc();
            }}
            className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded-xl text-sm focus:border-blue-500 outline-none transition"
          >
            {destinationList.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Route Summary Cards */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Distance", value: `${route.distance} km` },
            { label: "Drive Time", value: route.driveTime },
            { label: "Plan For", value: route.days },
          ].map((item) => (
            <div key={item.label} className="bg-black/40 rounded-xl p-3 text-center">
              <p className="text-xs opacity-40 mb-1">{item.label}</p>
              <p className="text-xs sm:text-sm font-semibold leading-snug">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Fuel Type */}
        <div>
          <label className="block text-xs opacity-50 uppercase tracking-widest mb-2">
            Fuel Type
          </label>
          <div className="grid grid-cols-4 gap-2">
            {fuelTypes.map((ft) => (
              <button
                key={ft.value}
                onClick={() => {
                  setFuelType(ft.value);
                  resetCalc();
                }}
                className={`py-2 px-1 rounded-xl text-xs border transition-all ${
                  fuelType === ft.value
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-white/10 opacity-60 hover:opacity-100"
                }`}
              >
                {ft.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fuel Inputs */}
        {!isElectric && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs opacity-50 uppercase tracking-widest mb-2">
                Price (₹/{selectedFuel?.unit})
              </label>
              <input
                type="number"
                value={fuelPrice}
                onChange={(e) => {
                  setFuelPrice(e.target.value);
                  resetCalc();
                }}
                placeholder={
                  fuelType === "petrol"
                    ? "e.g. 95"
                    : fuelType === "diesel"
                    ? "e.g. 88"
                    : "e.g. 75"
                }
                className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded-xl text-sm focus:border-blue-500 outline-none transition placeholder:opacity-30"
              />
            </div>
            <div>
              <label className="block text-xs opacity-50 uppercase tracking-widest mb-2">
                Avg Mileage (km/{selectedFuel?.unit})
              </label>
              <input
                type="number"
                value={mileage}
                onChange={(e) => {
                  setMileage(e.target.value);
                  resetCalc();
                }}
                placeholder="e.g. 15"
                className="w-full bg-black border border-white/20 text-white px-4 py-3 rounded-xl text-sm focus:border-blue-500 outline-none transition placeholder:opacity-30"
              />
            </div>
          </div>
        )}

        {/* EV Notice */}
        {isElectric && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-sm text-green-400 leading-relaxed">
            ⚡ Charging infrastructure is very limited beyond Manali and major Rajasthan
            cities. Plan charging stops carefully for high-altitude routes. Recommend
            checking PlugShare for current charger locations.
          </div>
        )}
      </div>

      {/* Calculate Button */}
      {!isElectric && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleCalculate}
          disabled={!fuelPrice || !mileage}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white py-4 rounded-xl font-semibold tracking-widest uppercase text-sm transition"
        >
          Calculate Route & Fuel Cost →
        </motion.button>
      )}

      {/* Results */}
      <AnimatePresence>
        {calculated && oneWayCost && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 space-y-4"
          >
            {/* Cost Breakdown */}
            <div className="bg-black rounded-xl p-5 border border-blue-500/20">
              <p className="text-xs opacity-40 uppercase tracking-widest mb-4">
                Fuel Cost Breakdown
              </p>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="opacity-60">
                    One Way ({route.distance} km)
                  </span>
                  <span className="font-semibold">
                    ₹{oneWayCost.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="opacity-60">Return Journey</span>
                  <span className="font-semibold">
                    ₹{oneWayCost.toLocaleString()}
                  </span>
                </div>
                <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                  <span className="text-blue-400 font-semibold">
                    Total Fuel Cost
                  </span>
                  <span className="text-blue-400 font-bold text-2xl">
                    ₹{totalCost?.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs opacity-30">
                  {route.distance} km ÷ {mileage} km/{selectedFuel?.unit} × ₹
                  {fuelPrice}/{selectedFuel?.unit} × 2 (both ways)
                </p>
              </div>
            </div>

            {/* Route Stops */}
            <div className="bg-black rounded-xl p-5 border border-white/10">
              <p className="text-xs opacity-40 uppercase tracking-widest mb-4">
                Recommended Stops
              </p>
              <div className="space-y-1">
                {/* Start */}
                <div className="flex items-center gap-3 py-1">
                  <div className="w-3 h-3 rounded-full bg-green-500 shrink-0 ring-2 ring-green-500/30" />
                  <div className="flex-1 flex justify-between items-center">
                    <p className="text-sm font-semibold text-green-400">New Delhi</p>
                    <p className="text-xs opacity-40">0 km</p>
                  </div>
                </div>

                {route.stops.map((stop, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex flex-col items-center shrink-0 pt-1">
                      <div className="w-px h-5 bg-white/15" />
                      <div className="w-2.5 h-2.5 rounded-full bg-white/30 ring-1 ring-white/20" />
                    </div>
                    <div className="flex-1 pb-1">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-sm font-semibold">{stop.name}</p>
                        <p className="text-xs opacity-40 shrink-0">{stop.km} km</p>
                      </div>
                      <p className="text-xs opacity-50 mt-0.5">{stop.note}</p>
                    </div>
                  </div>
                ))}

                {/* Destination */}
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center shrink-0 pt-1">
                    <div className="w-px h-5 bg-white/15" />
                    <div className="w-3 h-3 rounded-full bg-blue-500 shrink-0 ring-2 ring-blue-500/30" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-sm font-semibold text-blue-400">
                        {destination}
                      </p>
                      <p className="text-xs opacity-40">{route.distance} km</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Highway + Tips */}
            <div className="bg-black rounded-xl p-5 border border-white/10">
              <p className="text-xs opacity-40 uppercase tracking-widest mb-2">
                Highway Route
              </p>
              <p className="text-sm font-mono text-blue-400 mb-5">
                {route.highway}
              </p>
              <p className="text-xs opacity-40 uppercase tracking-widest mb-3">
                Driver Tips
              </p>
              <div className="space-y-2">
                {route.tips.map((tip, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <span className="text-blue-500 shrink-0 mt-0.5 text-xs">✓</span>
                    <p className="text-xs opacity-70 leading-relaxed">{tip}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}