import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Plane, MapPin, Calendar, DollarSign, Star,
  Hotel, Utensils, Car, Camera, Coffee,
  Sun, Cloud, CloudRain, Thermometer, ArrowLeft, Bookmark
} from "lucide-react";
import Logo from "../assets/Logo.png";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { PageTransition } from "@/components/PageTransition";
import { useToast } from "@/hooks/use-toast";

const ICON_MAP: Record<string, any> = {
  "Accommodation": Hotel,
  "Food & Dining": Utensils,
  "Transport": Car,
  "Activities": Camera,
  "Shopping & Misc": Coffee,
};

const WEATHER_COLORS: Record<string, string> = {
  Sunny: "text-yellow-400",
  Clear: "text-yellow-400",
  Rainy: "text-blue-400",
  Cloudy: "text-muted-foreground",
};

const WEATHER_ICONS: Record<string, any> = {
  Sunny: Sun,
  Clear: Sun,
  Rainy: CloudRain,
  Cloudy: Cloud,
};

const TripDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user) { navigate("/auth"); return; }
    fetchTrip();
  }, [id, user]);

  const fetchTrip = async () => {
    const { data, error } = await supabase
      .from("saved_trips")
      .select("*")
      .eq("id", id)
      .eq("user_id", user!.id)
      .single();

    if (error || !data) {
      toast({ title: "Trip not found", variant: "destructive" });
      navigate("/dashboard");
      return;
    }
    setTrip(data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  const itinerary = trip.itinerary as any[] || [];
  const weather = trip.weather as any[] || [];
  const costBreakdown = trip.cost_breakdown as any[] || [];
  const places = trip.places as any[] || [];
  const tabs = ["overview", "itinerary", "weather", "budget", "places"];

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-40 glass-card border-b border-border">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </button>
            <div className="flex items-center gap-2">
              <img src={Logo} alt="Logo" className="w-7 h-7 rounded-lg" />
              <span className="font-display font-bold text-sm gradient-text">SafarSathi AI</span>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Trip Hero */}
          <div className="glass-card rounded-3xl p-6 md:p-8 mb-6 shadow-elevated">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center shrink-0">
                <Plane className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-1">
                  {trip.destination}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-primary" />
                    {trip.days} days
                  </div>
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-4 h-4 text-secondary" />
                    {trip.currency} {Number(trip.budget).toLocaleString()} budget
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Bookmark className="w-4 h-4 text-teal" />
                    Saved trip
                  </div>
                </div>
              </div>
            </div>
            {trip.overview && (
              <p className="text-foreground leading-relaxed mt-4 text-sm md:text-base">{trip.overview}</p>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-gradient-primary text-white shadow-glow-blue"
                    : "glass-card border border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "overview" && (
            <div className="glass-card rounded-3xl p-6 md:p-8 shadow-elevated">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Days", value: trip.days },
                  { label: "Budget", value: `${trip.currency} ${Number(trip.budget).toLocaleString()}` },
                  { label: "Places", value: places.length },
                  { label: "Activities", value: itinerary.reduce((a: number, d: any) => a + (d.activities?.length || 0), 0) },
                ].map((s, i) => (
                  <div key={i} className="glass-card rounded-2xl p-4 text-center">
                    <div className="font-display text-2xl font-bold gradient-text">{s.value}</div>
                    <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "itinerary" && (
            <div className="space-y-4">
              {itinerary.map((plan: any) => (
                <div key={plan.day} className="glass-card rounded-2xl p-5 shadow-card hover:shadow-elevated transition-all duration-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0 text-white font-bold text-sm">
                      {plan.day}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-display font-bold text-foreground">{plan.title}</h4>
                        {plan.cost && <span className="text-sm font-semibold text-primary">{trip.currency} {plan.cost}</span>}
                      </div>
                      <div className="space-y-2">
                        {plan.activities?.map((act: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="w-1.5 h-1.5 rounded-full bg-teal shrink-0" />
                            {act}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "weather" && (
            <div className="glass-card rounded-3xl p-6 md:p-8 shadow-elevated">
              <h3 className="font-display text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                <Thermometer className="w-5 h-5 text-primary" /> 5-Day Forecast for {trip.destination}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {weather.map((w: any, i: number) => {
                  const WeatherIcon = WEATHER_ICONS[w.condition] || Sun;
                  return (
                    <div key={i} className="glass-card rounded-2xl p-4 text-center hover:border-primary/30 transition-colors">
                      <div className="text-sm font-semibold text-muted-foreground mb-3">{w.day}</div>
                      <WeatherIcon className={`w-8 h-8 mx-auto mb-3 ${WEATHER_COLORS[w.condition] || "text-muted-foreground"}`} />
                      <div className="font-display text-2xl font-bold gradient-text">{w.temp}°</div>
                      <div className="text-xs text-muted-foreground mt-1">{w.condition}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "budget" && (
            <div className="glass-card rounded-3xl p-6 md:p-8 shadow-elevated">
              <h3 className="font-display text-xl font-bold mb-6 text-foreground">Cost Breakdown</h3>
              <div className="space-y-4">
                {costBreakdown.map((item: any, i: number) => {
                  const pct = Math.round((item.amount / Number(trip.budget)) * 100);
                  const Icon = ICON_MAP[item.label] || Coffee;
                  const colors = ["from-primary to-secondary", "from-teal to-primary", "from-secondary to-teal", "from-primary to-teal", "from-secondary to-primary"];
                  return (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center`}>
                            <Icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">{pct}%</span>
                          <span className="text-sm font-semibold text-foreground">{trip.currency} {item.amount}</span>
                        </div>
                      </div>
                      <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full bg-gradient-to-r ${colors[i % colors.length]} transition-all duration-700`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <span className="font-bold text-foreground">Total Estimated</span>
                  <span className="font-display text-xl font-bold gradient-text">
                    {trip.currency} {costBreakdown.reduce((a: number, i: any) => a + i.amount, 0).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {activeTab === "places" && (
            <div className="glass-card rounded-3xl p-6 md:p-8 shadow-elevated">
              <h3 className="font-display text-xl font-bold mb-6 text-foreground">Top Places to Visit</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {places.map((place: any, i: number) => (
                  <div key={i} className="glass-card rounded-2xl p-5 hover:border-primary/30 transition-colors hover:shadow-elevated group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-teal flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-semibold">{place.rating}</span>
                      </div>
                    </div>
                    <h4 className="font-display font-bold text-foreground mb-1">{place.name}</h4>
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{place.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
};

export default TripDetail;
