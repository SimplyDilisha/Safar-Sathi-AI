import { useState, useEffect } from "react";
import Logo from "../assets/Logo.png";
import WorldMapBg from "../assets/WorldMap.png";
import {
  Plane, Calendar, DollarSign, MapPin, Loader2,
  Sun, Cloud, CloudRain, Thermometer, Star,
  Coffee, Utensils, Camera, Hotel, Car, ChevronRight, Bookmark
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { GlobeLoader } from "@/components/GlobeLoader";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const currencies = ["USD", "EUR", "GBP", "INR", "AED", "JPY"];

const ICON_MAP: Record<string, any> = {
  Accommodation: Hotel,
  "Food & Dining": Utensils,
  Transport: Car,
  Activities: Camera,
  "Shopping & Misc": Coffee,
};

const WEATHER_ICONS: Record<string, any> = {
  Sunny: Sun,
  Clear: Sun,
  Rainy: CloudRain,
  Cloudy: Cloud,
};

const COLORS = [
  "from-primary to-secondary",
  "from-teal to-primary",
  "from-secondary to-teal",
  "from-primary to-teal",
  "from-secondary to-primary",
];

const Planner = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [city, setCity] = useState("");
  const [days, setDays] = useState(5);
  const [budget, setBudget] = useState(2000);
  const [currency, setCurrency] = useState("USD");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Prefill `city` from query param (e.g. /planner?city=Paris)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("city");
      if (q) setCity(q);
    } catch (e) {
      // ignore
    }
  }, []);

  const tabs = ["overview", "itinerary", "weather", "budget", "places"];

  const handleGenerate = async () => {
    if (!city.trim()) return;
    setLoading(true);
    setResult(null);
    setSaved(false);

    try {
      const { data, error } = await supabase.functions.invoke("generate-itinerary", {
        body: { destination: city, days, budget, currency },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult({ destination: city, days, budget, currency, ...data.itinerary });
      setActiveTab("overview");
    } catch (err: any) {
      toast({
        title: "Generation failed",
        description: err.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({ title: "Please sign in to save trips", variant: "destructive" });
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("saved_trips").insert({
      user_id: user.id,
      destination: result.destination,
      days: result.days,
      budget: result.budget,
      currency: result.currency,
      overview: result.overview,
      itinerary: result.dayPlans,
      weather: result.weather,
      cost_breakdown: result.costBreakdown,
      places: result.places,
    });
    if (error) {
      toast({ title: "Error saving trip", description: error.message, variant: "destructive" });
    } else {
      setSaved(true);
      toast({ title: "Trip saved! ✈️", description: "Find it in your dashboard." });
    }
    setSaving(false);
  };

  return (
    <div className="min-h-screen bg-background bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${WorldMapBg})` }}>
      {loading && <GlobeLoader destination={city} />}

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/30 border-b border-border/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="w-8 h-8 rounded-xl object-contain" />
            <span className="font-display font-bold text-lg">
              <span className="gradient-text">Safar</span>
              <span className="text-foreground">Sathi</span>
              <span className="gradient-text"> AI</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/dashboard" className="px-4 py-2 rounded-xl glass-card border border-border text-sm font-semibold text-foreground hover:border-primary/40 transition-all">
                Dashboard
              </Link>
            ) : (
              <Link to="/auth" className="px-4 py-2 rounded-xl bg-gradient-primary text-white text-sm font-semibold shadow-glow-blue hover:opacity-90 transition-all">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 blur-3xl rounded-full" />
          <div className="absolute top-1/2 left-0 w-80 h-80 bg-teal/5 blur-3xl rounded-full" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Plan Your Dream Trip
              <br />
              <span className="gradient-text">Instantly with AI</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Fill in the details below and let our AI build your personalized planned route in seconds.
            </p>
          </div>

          {/* Input Form */}
          <div className="max-w-3xl mx-auto glass-card rounded-3xl p-6 md:p-8 shadow-elevated mb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-muted-foreground mb-2 block flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" /> Destination City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Paris, Tokyo, Bali, Dubai..."
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-2 block flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-teal" /> Duration: {days} days
                </label>
                <input
                  type="range" min={1} max={30} value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="w-full accent-primary h-2 rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 day</span><span>30 days</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-2 block flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-secondary" /> Budget: {currency} {budget.toLocaleString()}
                </label>
                <input
                  type="range" min={100} max={20000} step={100} value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-secondary h-2 rounded-full cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>100</span><span>20,000</span>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-muted-foreground mb-2 block">Currency</label>
                <div className="flex flex-wrap gap-2">
                  {currencies.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        currency === c
                          ? "bg-gradient-primary text-white shadow-glow-blue"
                          : "glass-card border border-border text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading || !city.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-primary text-white font-bold text-lg shadow-glow-blue hover:opacity-90 hover:scale-[1.01] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Generating with AI...</>
              ) : (
                <><Plane className="w-5 h-5" /> Generate My Trip <ChevronRight className="w-5 h-5" /></>
              )}
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="max-w-4xl mx-auto animate-scale-in">
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

              {/* Overview */}
              {activeTab === "overview" && (
                <div className="glass-card rounded-3xl p-6 md:p-8 shadow-elevated">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center shrink-0">
                      <Plane className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-display text-2xl font-bold text-foreground">{result.destination}</h3>
                      <p className="text-muted-foreground">{result.days} days • {result.currency} {result.budget.toLocaleString()} budget</p>
                    </div>
                  </div>
                  <p className="text-foreground leading-relaxed mb-6 text-base">{result.overview}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: "Days", value: result.days },
                      { label: "Budget", value: `${result.currency} ${result.budget.toLocaleString()}` },
                      { label: "Places", value: result.places?.length || 0 },
                      { label: "Activities", value: result.dayPlans?.reduce((a: number, d: any) => a + (d.activities?.length || 0), 0) || 0 },
                    ].map((s, i) => (
                      <div key={i} className="glass-card rounded-2xl p-4 text-center">
                        <div className="font-display text-2xl font-bold gradient-text">{s.value}</div>
                        <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  {result.tips && (
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                      <h4 className="font-semibold text-foreground mb-2 text-sm">💡 Local Tips</h4>
                      <ul className="space-y-1">
                        {result.tips.map((tip: string, i: number) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>{tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Itinerary */}
              {activeTab === "itinerary" && (
                <div className="space-y-4">
                  {result.dayPlans?.map((plan: any) => (
                    <div key={plan.day} className="glass-card rounded-2xl p-5 shadow-card hover:shadow-elevated transition-all duration-200">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0 text-white font-bold text-sm">
                          {plan.day}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-display font-bold text-foreground">{plan.title}</h4>
                            {plan.cost && <span className="text-sm font-semibold text-primary">{result.currency} {plan.cost}</span>}
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

              {/* Weather */}
              {activeTab === "weather" && (
                <div className="glass-card rounded-3xl p-6 md:p-8 shadow-elevated">
                  <h3 className="font-display text-xl font-bold mb-6 text-foreground flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-primary" /> 5-Day Forecast for {result.destination}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    {result.weather?.map((w: any, i: number) => {
                      const WeatherIcon = WEATHER_ICONS[w.condition] || Sun;
                      return (
                        <div key={i} className="glass-card rounded-2xl p-4 text-center hover:border-primary/30 transition-colors">
                          <div className="text-sm font-semibold text-muted-foreground mb-3">{w.day}</div>
                          <WeatherIcon className={`w-8 h-8 mx-auto mb-3 ${
                            w.condition === "Sunny" || w.condition === "Clear" ? "text-yellow-400" :
                            w.condition === "Rainy" ? "text-blue-400" : "text-muted-foreground"
                          }`} />
                          <div className="font-display text-2xl font-bold gradient-text">{w.temp}°</div>
                          <div className="text-xs text-muted-foreground mt-1">{w.condition}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Budget */}
              {activeTab === "budget" && (
                <div className="glass-card rounded-3xl p-6 md:p-8 shadow-elevated">
                  <h3 className="font-display text-xl font-bold mb-6 text-foreground">Cost Breakdown</h3>
                  <div className="space-y-4">
                    {result.costBreakdown?.map((item: any, i: number) => {
                      const pct = Math.round((item.amount / result.budget) * 100);
                      const Icon = ICON_MAP[item.label] || Coffee;
                      return (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${COLORS[i % COLORS.length]} flex items-center justify-center`}>
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-sm font-medium text-foreground">{item.label}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-xs text-muted-foreground">{pct}%</span>
                              <span className="text-sm font-semibold text-foreground">{result.currency} {item.amount}</span>
                            </div>
                          </div>
                          <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                            <div className={`h-full rounded-full bg-gradient-to-r ${COLORS[i % COLORS.length]} transition-all duration-700`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                    <div className="pt-4 border-t border-border flex justify-between items-center">
                      <span className="font-bold text-foreground">Total Estimated</span>
                      <span className="font-display text-xl font-bold gradient-text">
                        {result.currency} {result.costBreakdown?.reduce((a: number, i: any) => a + i.amount, 0).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Places */}
              {activeTab === "places" && (
                <div className="glass-card rounded-3xl p-6 md:p-8 shadow-elevated">
                  <h3 className="font-display text-xl font-bold mb-6 text-foreground">Top Places to Visit</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.places?.map((place: any, i: number) => (
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

              {/* Action buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleSave}
                  disabled={saving || saved}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    saved
                      ? "bg-teal/20 border border-teal/30 text-teal cursor-default"
                      : "glass-card border border-border hover:border-primary/40 text-foreground hover:glow-blue"
                  }`}
                >
                  <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
                  {saving ? "Saving..." : saved ? "Saved to Dashboard ✓" : "Save to Dashboard"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Planner;
