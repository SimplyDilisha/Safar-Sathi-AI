import { useState, useEffect } from "react";
import { ArrowRight, Play, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import heroBg from "@/assets/hero-bg.jpg";

const TYPING_WORDS = ["Paris in 5 Days", "Bali on $1000", "Tokyo Adventure", "Dubai Luxury Trip"];

const HeroSection = () => {
  const [typingIndex, setTypingIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const word = TYPING_WORDS[typingIndex];
    const speed = isDeleting ? 60 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        setDisplayText(word.slice(0, charIndex + 1));
        if (charIndex + 1 === word.length) {
          setTimeout(() => setIsDeleting(true), 1800);
        } else {
          setCharIndex((c) => c + 1);
        }
      } else {
        setDisplayText(word.slice(0, charIndex - 1));
        if (charIndex - 1 === 0) {
          setIsDeleting(false);
          setTypingIndex((i) => (i + 1) % TYPING_WORDS.length);
          setCharIndex(0);
        } else {
          setCharIndex((c) => c - 1);
        }
      }
    }, speed);

    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, typingIndex]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* BG Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroBg})` }}
      />

      {/* Dark overlay for dark mode, light overlay for light */}
      <div className="absolute inset-0 bg-background/10 dark:bg-background/10" />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-3xl float-1 dark:bg-primary/15" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-secondary/10 blur-3xl float-2 dark:bg-secondary/15" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full bg-teal/10 blur-3xl float-3 dark:bg-teal/10" />

        {/* Floating plane */}
        <div className="absolute top-1/3 animate-plane opacity-30 dark:opacity-40">
          <svg width="48" height="24" viewBox="0 0 48 24" fill="none" className="text-primary">
            <path d="M44 12L8 2L12 12L8 22L44 12Z" fill="currentColor" />
            <path d="M20 12L16 20" stroke="currentColor" strokeWidth="2" />
          </svg>
        </div>

        {/* Floating pins */}
        {[
          { top: "20%", left: "15%", delay: "0s" },
          { top: "30%", right: "20%", delay: "1s" },
          { bottom: "35%", left: "25%", delay: "2s" },
          { bottom: "25%", right: "15%", delay: "0.5s" },
        ].map((pin, i) => (
          <div
            key={i}
            className="absolute float-1 opacity-60 dark:opacity-70"
            style={{ top: pin.top, left: (pin as any).left, right: (pin as any).right, bottom: pin.bottom, animationDelay: pin.delay }}
          >
            <MapPin className="w-5 h-5 text-primary" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center pt-24 pb-12">
        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6 animate-slide-up delay-100">
          Plan Your Perfect Trip
          <br />
          <span style={{ color: 'black' }}>in Seconds with AI</span>
        </h1>

        {/* Typing effect subtitle */}
        <div className="text-xl md:text-2xl text-muted-foreground mb-4 animate-slide-up delay-200 h-8" style={{color:"black"}}>
          Generate:{" "}
          <span className="font-semibold typing-cursor" style={{ color: "black" }}>{displayText}</span>
        </div>

        <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-10 animate-slide-up delay-300" style={{color:"black", fontFamily: "Montserrat, sans-serif" }}>
          Just enter your budget, city, and duration — we handle the rest. Smart itineraries, weather, costs & maps.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-400">
          <Link
            to="/planner"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-500 text-white font-semibold text-lg shadow-glow-blue hover:opacity-90 hover:scale-105 transition-all duration-200 w-full sm:w-auto justify-center border-2 border-black" style={{color:"black"}}
          >
            Generate My Trip
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
