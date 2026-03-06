import { useState, useEffect, useRef } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import DestinationsBg from "../assets/Destinations.png";

interface Destination {
  id: number;
  name: string;
  country: string;
  description: string;
  image: string;
}

const destinations: Destination[] = [
  {
    id: 1,
    name: "Switzerland",
    country: "Europe",
    description: "Snow-capped mountains, pristine lakes & serene Alpine landscapes",
    image: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80",
  },
  {
    id: 2,
    name: "Thailand",
    country: "Southeast Asia",
    description: "Tropical cliffs, turquoise waters & authentic island experiences",
    image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=800&q=80",
  },
  {
    id: 3,
    name: "Australia",
    country: "Oceania",
    description: "Sydney Opera House, Harbour Bridge & breathtaking sunsets",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=800&q=80",
  },
  {
    id: 4,
    name: "Paris",
    country: "Europe",
    description: "The Eiffel Tower, Louvre museum & romantic city strolls",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80",
  },
  {
    id: 5,
    name: "Iceland",
    country: "Europe",
    description: "Northern lights, volcanic landscapes & geothermal spas",
    image: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=800&q=80",
  },
  {
    id: 6,
    name: "New York",
    country: "USA",
    description: "Times Square, Central Park & the iconic skyline",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80",
  },
];

const PopularDestinations = () => {
  const navigate = useNavigate();
  const [visibleCards, setVisibleCards] = useState<Set<number>>(new Set());
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = cardRefs.current.findIndex((ref) => ref === entry.target);
          if (entry.isIntersecting && index !== -1) {
            setTimeout(() => {
              setVisibleCards((prev) => new Set([...prev, index]));
            }, index * 150);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -50px 0px" }
    );

    cardRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, index: number) => {
    const card = cardRefs.current[index];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  };

  const handleMouseLeave = (index: number) => {
    const card = cardRefs.current[index];
    if (card) {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)";
    }
  };

  return (
    <section
      ref={sectionRef}
      id="destinations"
      className="relative py-20 overflow-hidden"
      style={{ backgroundColor: "transparent" }}
    >
      <img
        src={DestinationsBg}
        alt="Destinations background"
        className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none select-none"
        style={{ opacity: 1 }}
      />
      {/* Gradient divider from hero section */}
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: "linear-gradient(to bottom, rgba(255, 255, 255, 0.8), transparent)",
        }}
      />

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 left-10 w-64 h-64 rounded-full blur-3xl opacity-30"
          style={{ background: "radial-gradient(circle, rgba(255, 122, 47, 0.3), transparent)" }}
        />
        <div
          className="absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl opacity-20"
          style={{ background: "radial-gradient(circle, rgba(255, 122, 47, 0.25), transparent)" }}
        />
        <div
          className="absolute top-1/2 left-1/4 w-48 h-48 rounded-full blur-3xl opacity-15"
          style={{ background: "radial-gradient(circle, rgba(14, 31, 65, 0.2), transparent)" }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-5"
            style={{ color: "#0e1f41" }}
          >
            Popular Destinations
          </h2>
          <p
            className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
            style={{ color: "#4a5568" }}
          >
            Explore some of our most sought-after travel spots around the globe.
          </p>
        </div>

        {/* Destinations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 max-w-7xl mx-auto">
          {destinations.map((destination, index) => (
            <div
              key={destination.id}
              ref={(el) => (cardRefs.current[index] = el)}
              className={`destination-card group relative h-[240px] md:h-[300px] cursor-pointer transition-all duration-500 ${
                visibleCards.has(index)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-12"
              }`}
              style={{
                borderRadius: "24px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
                transformStyle: "preserve-3d",
                transition: "transform 0.2s ease-out, box-shadow 0.3s ease",
              }}
              onMouseMove={(e) => handleMouseMove(e, index)}
              onMouseLeave={() => handleMouseLeave(index)}
            >
              {/* Image Container */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ borderRadius: "24px" }}
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div
                  className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(14, 31, 65, 0.9) 0%, rgba(14, 31, 65, 0.4) 50%, transparent 100%)",
                  }}
                />

                {/* Hover Gradient Overlay */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 122, 47, 0.3) 0%, rgba(14, 31, 65, 0.7) 100%)",
                  }}
                />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 relative z-10">
                {/* Country Tag */}
                <span
                  className="inline-flex self-start px-3 py-1 rounded-full text-xs font-medium mb-3 backdrop-blur-md"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    color: "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                  }}
                >
                  {destination.country}
                </span>

                {/* Destination Name */}
                <h3
                  className="font-display text-2xl md:text-3xl font-bold mb-2 text-white"
                  style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)" }}
                >
                  {destination.name}
                </h3>

                {/* Description */}
                <p
                  className="text-sm md:text-base mb-5 line-clamp-2"
                  style={{ color: "rgba(255, 255, 255, 0.85)" }}
                >
                  {destination.description}
                </p>

                {/* CTA Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/planner?city=${encodeURIComponent(destination.name)}`);
                  }}
                  className="discover-btn self-start inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-sm text-white transition-all duration-300 group-hover:gap-4 relative z-20 cursor-pointer"
                  style={{
                    backgroundColor: "#ff7a2f",
                    boxShadow: "0 4px 15px rgba(255, 122, 47, 0.4)",
                  }}
                >
                  <span>Discover More</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

              {/* Glassmorphism Border Effect on Hover */}
              <div
                className="absolute inset-0 rounded-[24px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 20px 50px rgba(0, 0, 0, 0.15)",
                }}
              />
            </div>
          ))}
        </div>

        {/* View All Destinations CTA */}
        <div className="text-center mt-16">
          <button
            className="view-all-btn inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 hover:gap-5"
            style={{
              backgroundColor: "transparent",
              color: "#0e1f41",
              border: "2px solid #0e1f41",
            }}
          >
            <span>View All Destinations</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Bottom gradient transition */}
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background: "linear-gradient(to top, rgba(248, 245, 242, 1), transparent)",
        }}
      />
    </section>
  );
};

export default PopularDestinations;
