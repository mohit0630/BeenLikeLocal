import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Been Like Local — Travel Beyond the Obvious",
  description: "Authentic travel guides for Spiti, Ladakh, Kedarnath, Kasol and India's most hidden destinations. Real itineraries, honest budgets, no tourist traps.",
  keywords: "Spiti Valley, Ladakh, Kedarnath trek, Kasol, Manali, Jibhi, offbeat India travel, budget travel India, hidden destinations India",
  authors: [{ name: "Been Like Local" }],
  creator: "Been Like Local",
  metadataBase: new URL("https://beenlikelocal.in"),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://beenlikelocal.in",
    siteName: "Been Like Local",
    title: "Been Like Local — Travel Beyond the Obvious",
    description: "Authentic travel guides for Spiti, Ladakh, Kedarnath, Kasol and India's most hidden destinations. Real itineraries, honest budgets, no tourist traps.",
    images: [
      {
        url: "/photos/mountains.jpg",
        width: 1200,
        height: 630,
        alt: "Been Like Local — Travel Beyond the Obvious",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Been Like Local — Travel Beyond the Obvious",
    description: "Authentic travel guides for India's most hidden destinations. Real itineraries, honest budgets.",
    images: ["/photos/mountains.jpg"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="bg-black text-white antialiased">
        <Navbar />
        {children}
      </body>
    </html>
  );
}