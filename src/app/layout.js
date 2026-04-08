import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Been Like Local — Travel Beyond the Obvious",
  description: "Authentic travel experiences across India's most beautiful and hidden destinations.",
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