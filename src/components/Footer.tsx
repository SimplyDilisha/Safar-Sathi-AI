import { Plane, Twitter, Instagram, Linkedin, Github, Mail } from "lucide-react";
import WorldMap from "./WorldMap";

const Footer = () => {
  const year = new Date().getFullYear();

  const links = {
    
    Support: ["Help Center", "Privacy Policy", "Terms of Service", "Contact"]

  };

  const socials = [
    { Icon: Twitter, href: "#" },
    { Icon: Instagram, href: "#" },
    { Icon: Linkedin, href: "#" },
    { Icon: Github, href: "#" },
    { Icon: Mail, href: "#" },
  ];

  return (
    <footer className="relative border-t border-border overflow-hidden bg-black">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-primary/5 blur-3xl rounded-full dark:bg-primary/6" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center glow-blue">
                <img src="\src\assets\Logo.png" alt="Logo" className="w-18 h-18 object-contain" />
              </div>
              <span className="font-display font-bold text-xl">
                <span className="text-white">Safar</span>
                <span className="text-white">Sathi</span>
                <span className="text-white"> AI</span>
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
              Plan your perfect trip in seconds with AI-powered itineraries, weather forecasts, and smart budgeting.
            </p>
            <div className="flex gap-3">
              {socials.map(({ Icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-9 h-9 rounded-xl glass-card border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/40 transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category} className="col-span-1">
              <h4 className={`font-semibold text-sm mb-4 ${category === "Support" ? "text-white" : "text-foreground"}`}>{category}</h4>
              <ul className="space-y-3">
                {items.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-muted-foreground hover:text-foreground text-sm transition-colors duration-200"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* World Map */}
          <div className="col-span-1 md:col-span-1 lg:col-span-1 h-80 md:h-96 lg:h-96">
            <h4 className="font-semibold text-white text-sm mb-3">Travel Activity</h4>
            <WorldMap />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-border">
          <p className="text-muted-foreground text-sm">
            © {year} SafarSathi AI. All rights reserved. 
          </p>
          <p className="text-muted-foreground text-sm">
            Built with ❤️ for travelers worldwide.
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-teal pulse-glow" />
            <span className="text-xs text-muted-foreground">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
