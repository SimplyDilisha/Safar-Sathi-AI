import { useState, useEffect } from "react";
import { Plane, MapPin, Globe, Compass } from "lucide-react";
import Logo from "../assets/Logo.png";
import SplashBg from "../assets/SplashBg.png";

const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  delay: Math.random() * 2,
  duration: Math.random() * 3 + 4,
}));

const FLOATING_ICONS = [
  { Icon: MapPin, x: 15, y: 20, delay: 0.3, size: 18 },
  { Icon: Globe, x: 80, y: 25, delay: 0.6, size: 20 },
  { Icon: Compass, x: 20, y: 75, delay: 0.9, size: 16 },
  { Icon: Plane, x: 75, y: 70, delay: 1.2, size: 18 },
];

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 100),
      setTimeout(() => setPhase(2), 800),
      setTimeout(() => setPhase(3), 1600),
      setTimeout(() => setPhase(4), 2400),
      setTimeout(() => setPhase(5), 3200),
      setTimeout(() => onComplete(), 3900),
    ];
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-700 ${
        phase >= 5 ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
      
      style={{
        backgroundImage: `url(${SplashBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "transparent",
      }}
      
    >
      <div className="absolute inset-0 backdrop-blur-sm bg-background/1 pointer-events-none" />
      {/* Animated grid pattern */}
      <div
        className={`absolute inset-0 transition-opacity duration-[2000ms] ${
          phase >= 1 ? "opacity-[0.03]" : "opacity-0"
        }`}
        style={{
          backgroundImage: `linear-gradient(hsl(217,91%,60%) 1px, transparent 1px), linear-gradient(90deg, hsl(217,91%,60%) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />
      {/* Floating particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full transition-opacity duration-1000 ${
            phase >= 1 ? "opacity-100" : "opacity-0"
          }`}
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `hsl(217, 91%, ${60 + Math.random() * 20}%)`,
            animation: `splashFloat ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
      {/* Soft ambient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute -top-20 -left-20 w-[600px] h-[600px] rounded-full transition-all duration-[2500ms] ${
            phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
          style={{ background: "radial-gradient(circle, hsl(217,91%,60%,0.08) 0%, transparent 70%)" }}
        />
        <div
          className={`absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full transition-all duration-[2500ms] delay-300 ${
            phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
          style={{ background: "radial-gradient(circle, hsl(270,60%,65%,0.08) 0%, transparent 70%)" }}
        />
        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full transition-all duration-[2500ms] delay-500 ${
            phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
          style={{ background: "radial-gradient(circle, hsl(175,80%,45%,0.06) 0%, transparent 70%)" }}
        />
      </div>
      {/* Floating travel icons */}
      {FLOATING_ICONS.map(({ Icon, x, y, delay, size }, i) => (
        <div
          key={i}
          className={`absolute transition-all duration-1000 ${
            phase >= 2 ? "opacity-20" : "opacity-0 scale-0"
          }`}
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transitionDelay: `${delay}s`,
            animation: phase >= 2 ? `splashFloat ${5 + i}s ease-in-out ${delay}s infinite` : "none",
          }}
        >
          <Icon size={size} strokeWidth={1.5} style={{ color: "hsl(217,91%,60%)" }} />
        </div>
      ))}
      {/* Main content */}
      <div className="relative flex flex-col items-center gap-10">
        {/* Animated rings + center icon */}
        <div className="relative w-44 h-44">
          {/* Pulsing background glow */}
          <div
            className={`absolute inset-0 rounded-full transition-all duration-1000 ${
              phase >= 1 ? "opacity-100" : "opacity-0"
            }`}
            style={{
              background: "radial-gradient(circle, hsl(217,91%,60%,0.12) 0%, transparent 60%)",
              animation: phase >= 1 ? "splashPulse 2.5s ease-in-out infinite" : "none",
              transform: "scale(1.8)",
            }}
          />
          {/* Outer ring 1 */}
          <svg
            viewBox="0 0 180 180"
            className={`absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] transition-all duration-1000 ${
              phase >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"
            }`}
            style={{ animation: phase >= 1 ? "spin 8s linear infinite" : "none" }}
          >
            <defs>
              <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(217,91%,60%)" />
                <stop offset="50%" stopColor="hsl(270,60%,60%)" />
                <stop offset="100%" stopColor="hsl(175,80%,45%)" />
              </linearGradient>
              <linearGradient id="splashRing1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(217,91%,60%)" stopOpacity="0.6" />
                <stop offset="50%" stopColor="hsl(270,60%,65%)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(175,80%,45%)" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            <circle
              cx="80" cy="80" r="72"
              fill="none"
              stroke="url(#ringGrad)"
              strokeWidth="2"
              strokeDasharray="120 340"
              strokeLinecap="round"
            />
            <circle cx="90" cy="90" r="84" fill="none" stroke="url(#splashRing1)" strokeWidth="1.5" strokeDasharray="100 430" strokeLinecap="round" />
          </svg>
          {/* Outer ring 2 */}
          <svg
            viewBox="0 0 180 180"
            className={`absolute -inset-2 w-[calc(100%+16px)] h-[calc(100%+16px)] transition-all duration-1000 delay-150 ${
              phase >= 1 ? "opacity-80 scale-100" : "opacity-0 scale-50"
            }`}
            style={{ animation: phase >= 1 ? "spin 6s linear infinite reverse" : "none" }}
          >
            <circle cx="90" cy="90" r="76" fill="none" stroke="hsl(217,91%,60%,0.15)" strokeWidth="1" strokeDasharray="60 420" strokeLinecap="round" />
          </svg>
          {/* Inner dashed ring */}
          <svg
            viewBox="0 0 160 160"
            className={`absolute inset-0 w-full h-full transition-all duration-1000 delay-300 ${
              phase >= 1 ? "opacity-40 scale-100" : "opacity-0 scale-75"
            }`}
            style={{ animation: phase >= 1 ? "spin 12s linear infinite" : "none" }}
          >
            <circle
              cx="80" cy="80" r="56"
              fill="none"
              stroke="hsl(var(--primary) / 0.3)"
              strokeWidth="1.5"
              strokeDasharray="80 280"
              strokeLinecap="round"
            />
            <circle cx="80" cy="80" r="64" fill="none" stroke="hsl(270,60%,65%,0.2)" strokeWidth="1" strokeDasharray="4 12" />
          </svg>
          {/* Center icon with bounce */}
          <div className="absolute inset-0 flex items-center justify-center transition-all duration-700 delay-300">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl scale-150" />
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center shadow-glow-blue overflow-hidden">
                <img src={Logo} alt="Logo" className="w-18 h-18 object-contain" />
              </div>
            </div>
          </div>
          {/* Orbiting dots */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-all duration-700 ${
                phase >= 2 ? "opacity-100" : "opacity-0"
              }`}
              style={{
                animation: phase >= 2 ? `spin ${3 + i * 0.8}s linear infinite` : "none",
                animationDelay: `${i * 0.3}s`,
              }}
            >
              <div
                className="absolute rounded-full"
                style={{
                  top: i % 2 === 0 ? "2px" : "6px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: [
                    "hsl(124, 91%, 50%)",
                    "hsl(57, 100%, 51%)",
                    "hsl(175, 100%, 51%)",
                    "hsl(22, 100%, 50%)",
                  ][i],
                  boxShadow: `0 0 10px ${["hsl(217,91%,60%,0.5)", "hsl(270,60%,65%,0.5)", "hsl(175,80%,45%,0.5)", "hsl(217,91%,75%,0.5)"][i]}`,
                  width: 6 - i,
                  height: 6 - i,
                }}
              />
            </div>
          ))}
        </div>
        {/* Brand name with letter animation */}
        <div className="flex flex-col items-center gap-4">
          <h1
            className={`font-display text-5xl md:text-6xl font-bold tracking-tight transition-all duration-700 ${
              phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {"Safar Saathi".split("").map((char, i) => (
              <span
                key={i}
                className="inline-block"
                style={{
                  background: "linear-gradient(135deg, hsl(124, 91%, 50%), hsl(185, 100%, 53%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  animation: phase >= 2 ? `splashLetterPop 0.5s ease-out ${i * 0.05}s both` : "none",
                }}
              >
                {char}
              </span>
            ))}
          </h1>
          <p
            className={`text-sm tracking-[0.3em] uppercase transition-all duration-700 delay-700 ${
              phase >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 "
            }`}
            style={{
              background: "linear-gradient(135deg, hsl(124, 91%, 50%), hsl(185, 100%, 53%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            AI-Powered Travel Planning
          </p>
          {/* Divider line */}
          <div
            className={`h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent transition-all duration-700 delay-300 ${
              phase >= 3 ? "opacity-100 w-48" : "opacity-0 w-0"
            }`}
          />
        </div>
        {/* Loading bar */}
        <div
          className={`w-56 transition-all duration-500 ${
            phase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="h-[3px] rounded-full overflow-hidden" style={{ background: "hsl(220,15%,92%)" }}>
            <div
              className="h-full rounded-full transition-all duration-[1400ms] ease-out"
              style={{
                width: phase >= 4 ? "100%" : "0%",
                background: "linear-gradient(135deg, hsl(124, 91%, 50%), hsl(185, 100%, 53%))",
                backgroundSize: "200% 100%",
                animation: phase >= 3 ? "splashShimmer 1.5s ease-in-out infinite" : "none",
              }}
            />
          </div>
          <p
            className={`text-center text-xs mt-3 transition-opacity duration-500 ${
              phase >= 4 ? "opacity-60" : "opacity-0"
            }`}
            style={{
              background: "linear-gradient(135deg, hsl(124, 91%, 50%), hsl(185, 100%, 53%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Preparing your journey...
          </p>
        </div>
      </div>
      {/* Inline keyframes */}
      <style>{`
        @keyframes splashFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        @keyframes splashPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        @keyframes splashBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes splashLetterPop {
          0% { transform: translateY(20px) scale(0.5); opacity: 0; }
          60% { transform: translateY(-4px) scale(1.05); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes splashShimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
      `}</style>
    </div>
  );
};
