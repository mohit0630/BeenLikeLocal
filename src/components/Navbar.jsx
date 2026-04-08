"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home",         href: "/",                                                    external: false },
  { label: "Destinations", href: "/#destinations",                                       external: false },
  { label: "About",        href: "/about",                                               external: false },
  { label: "Blog",         href: "/blog",                                                external: false },
  { label: "Plan Trip",    href: "/plan",                                                external: false },
  { label: "Compare",      href: "/compare",                                             external: false },
  { label: "Instagram",    href: "https://www.instagram.com/beenlikelocal",             external: true  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "bg-black/80 backdrop-blur-md py-3" : "bg-black/60 backdrop-blur-md py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-xl tracking-widest uppercase">
          Been Like Local
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex gap-6 text-white text-xs tracking-wider">
          {navLinks.map((link, i) => (
            <motion.div
              key={link.label}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i + 0.2 }}
            >
              {link.external ? (
                <a href={link.href} target="_blank" className="hover:opacity-60 transition uppercase">
                  {link.label}
                </a>
              ) : (
                <Link href={link.href} className="hover:opacity-60 transition uppercase">
                  {link.label}
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden text-white text-2xl" onClick={() => setOpen(!open)}>
          {open ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 backdrop-blur-md flex flex-col items-center gap-6 py-10 text-white text-sm tracking-widest overflow-hidden"
          >
            {navLinks.map((link) =>
              link.external ? (
                <a key={link.label} href={link.href} target="_blank" onClick={() => setOpen(false)} className="uppercase hover:opacity-60">
                  {link.label}
                </a>
              ) : (
                <Link key={link.label} href={link.href} onClick={() => setOpen(false)} className="uppercase hover:opacity-60">
                  {link.label}
                </Link>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}