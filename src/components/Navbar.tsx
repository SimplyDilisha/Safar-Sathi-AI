import { useState, useEffect } from "react";
import Logo from "../assets/Logo.png";
import { NoiseBackground } from "@/components/ui/noise-background";
import { Menu, X, Plane, User, LogOut, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "Destinations", href: "#popular-destinations" },
    { label: "Planner", href: "/planner" },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    setDropdownOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "glass-card shadow-card py-3" : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={Logo} alt="Logo" className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center" />
          <span className="font-display font-bold text-3xl md:text-4xl">
            <span className="gradient-text">Safar</span>
            <span className="text-foreground">Sathi</span>
            <span className="gradient-text"> AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            link.href.startsWith("/") ? (
              <Link
                key={link.label}
                to={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium"
              >
                {link.label}
              </a>
            )
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">

          {user ? (
            <div className="relative hidden md:block">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl glass-card border border-border hover:border-primary/40 transition-all duration-200"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center">
                  <User className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-semibold text-foreground max-w-24 truncate">
                  {user.email?.split("@")[0]}
                </span>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 glass-card rounded-2xl shadow-elevated border border-border overflow-hidden z-50 animate-fade-in">
                  <Link
                    to="/dashboard"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-primary" />
                    Dashboard
                  </Link>
                  <Link
                    to="/planner"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-foreground hover:bg-muted transition-colors"
                  >
                    <Plane className="w-4 h-4 text-teal" />
                    Plan a Trip
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-destructive hover:bg-destructive/10 transition-colors border-t border-border"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>            
              <div className="hidden md:block">
                <NoiseBackground
                  containerClassName="w-fit p-3 rounded-full mx-auto"
                  gradientColors={[
                    "rgb(60, 145, 173)",
                    "rgb(78, 112, 161)",
                    "rgb(61, 189, 170)",
                  ]}
                >
                  <Link
                    to="/auth"
                    className="h-full w-full cursor-pointer rounded-full bg-linear-to-r from-neutral-100 via-neutral-100 to-white px-4 py-2 text-black shadow-[0px_2px_0px_0px_var(--color-neutral-50)_inset,0px_0.5px_1px_0px_var(--color-neutral-400)] transition-all duration-100 active:scale-98 dark:from-black dark:via-black dark:to-neutral-900 dark:text-white dark:shadow-[0px_1px_0px_0px_var(--color-neutral-950)_inset,0px_1px_0px_0px_var(--color-neutral-800)]"
                  >
                    📍 Sign in / Register
                  </Link>
                </NoiseBackground>
              </div>
            </>
          )}

          <button
            className="md:hidden p-2 rounded-xl glass-card"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-card mt-2 mx-4 rounded-2xl p-4 flex flex-col gap-3 animate-fade-in">
          {links.map((link) => (
            link.href.startsWith("/") ? (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors py-2 text-sm font-medium border-b border-border last:border-0"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors py-2 text-sm font-medium border-b border-border last:border-0"
              >
                {link.label}
              </a>
            )
          ))}
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="text-foreground py-2 text-sm font-medium">
                Dashboard
              </Link>
              <button onClick={handleSignOut} className="text-destructive py-2 text-sm font-medium text-left">
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/auth" onClick={() => setMobileOpen(false)} className="text-muted-foreground hover:text-foreground py-2 text-sm font-medium">
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
