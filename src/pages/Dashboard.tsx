import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plane, Plus, MapPin, Calendar, DollarSign,
  Trash2, LogOut, User, Globe, BarChart3, Clock, Star
} from "lucide-react";
import Logo from "../assets/Logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PageTransition } from "@/components/PageTransition";

interface SavedTrip {
  id: string;
  destination: string;
  days: number;
  budget: number;
  currency: string;
  overview: string | null;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [{ data: profile }, { data: tripsData }] = await Promise.all([
      supabase.from("profiles").select("display_name").eq("user_id", user!.id).single(),
      supabase.from("saved_trips").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
    ]);
    if (profile) setProfileName(profile.display_name || user!.email || "");
    if (tripsData) setTrips(tripsData);
    setLoading(false);
  };

  const deleteTrip = async (id: string) => {
    await supabase.from("saved_trips").delete().eq("id", id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const totalBudget = trips.reduce((acc, t) => acc + Number(t.budget), 0);
  const destinations = [...new Set(trips.map((t) => t.destination.split(",")[1]?.trim() || t.destination))];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Sidebar + Layout */}
        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden lg:flex w-64 min-h-screen flex-col glass-card border-r border-border fixed left-0 top-0 bottom-0 z-40">
            <div className="p-6 border-b border-border">
              <Link to="/" className="flex items-center gap-2">
                <img src={Logo} alt="Logo" className="w-8 h-8 rounded-xl" />
                <span className="font-display font-bold text-lg">
                  <span className="gradient-text">Safar</span>
                  <span className="text-foreground">Sathi</span>
                </span>
              </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1">
              {[
                { icon: BarChart3, label: "Dashboard", active: true },
                { icon: Globe, label: "Explore", to: "/" },
                { icon: MapPin, label: "My Trips", active: false },
                { icon: User, label: "Profile", active: false },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => item.to && navigate(item.to)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    item.active
                      ? "bg-gradient-primary text-white shadow-glow-blue"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-full bg-gradient-primary flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">{profileName}</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Main content */}
          <main className="flex-1 lg:ml-64 p-6 md:p-8">
            {/* Mobile header */}
            <div className="flex items-center justify-between mb-8 lg:hidden">
              <Link to="/" className="flex items-center gap-2">
                <img src={Logo} alt="Logo" className="w-8 h-8 rounded-xl" />
                <span className="font-display font-bold text-lg gradient-text">SafarSathi AI</span>
              </Link>
              <button onClick={handleSignOut} className="p-2 rounded-xl glass-card text-muted-foreground hover:text-destructive">
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Welcome */}
            <div className="mb-8">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-1">
                Welcome back, <span className="gradient-text">{profileName.split(" ")[0] || "Traveler"}</span> ✈️
              </h1>
              <p className="text-muted-foreground">Ready to plan your next adventure?</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: Plane, label: "Trips Planned", value: trips.length, color: "from-primary to-secondary" },
                { icon: Globe, label: "Countries", value: destinations.length, color: "from-teal to-primary" },
                { icon: DollarSign, label: "Total Budget", value: `$${(totalBudget / 1000).toFixed(1)}K`, color: "from-secondary to-teal" },
                { icon: Star, label: "Saved Places", value: trips.length * 4, color: "from-primary to-teal" },
              ].map((stat, i) => (
                <div key={i} className="glass-card rounded-2xl p-4 hover:shadow-elevated transition-all duration-200">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                    <stat.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="font-display text-2xl font-bold gradient-text">{stat.value}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA + Trips */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-bold text-foreground">My Trips</h2>
              <Link
                to="/planner"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-glow-blue hover:opacity-90 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                Plan New Trip
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card rounded-2xl p-5 animate-pulse h-44" />
                ))}
              </div>
            ) : trips.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Plane className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">No trips yet</h3>
                <p className="text-muted-foreground mb-6">Start planning your first AI-powered adventure!</p>
                <Link
                  to="/planner"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-white font-semibold shadow-glow-blue hover:opacity-90 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Plan Your First Trip
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {trips.map((trip) => (
                  <div
                    key={trip.id}
                    className="glass-card rounded-2xl p-5 hover:shadow-elevated hover:border-primary/30 transition-all duration-200 group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <button
                        onClick={() => deleteTrip(trip.id)}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="font-display font-bold text-foreground mb-1 truncate">{trip.destination}</h3>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{trip.overview || "AI-generated itinerary"}</p>

                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {trip.days} days
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        {trip.currency} {Number(trip.budget).toLocaleString()}
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        {new Date(trip.created_at).toLocaleDateString()}
                      </div>
                      <Link
                        to={`/trip/${trip.id}`}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        View Trip →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
