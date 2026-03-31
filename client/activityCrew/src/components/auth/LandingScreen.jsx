import { useEffect, useRef, useState } from "react";

// ── Data ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: "◎",
    color: "#FF6B35",
    title: "Find Activities Near You",
    desc: "Browse real-time activities happening within your radius — sports, music, study groups, meetups. Filter by vibe, not algorithm.",
  },
  {
    icon: "⊞",
    color: "#A78BFA",
    title: "Join in One Tap",
    desc: "No forms, no waitlists. See an open spot? Tap join. You're in. Chat with attendees before you even show up.",
  },
  {
    icon: "⚡",
    color: "#34D399",
    title: "Host Your Own",
    desc: "Create an activity in 30 seconds. Set the location, time, and headcount. Your crew finds you.",
  },
  {
    icon: "◉",
    color: "#60A5FA",
    title: "Meet Your People",
    desc: "Connect with people who share your interests — not through a feed, but by actually doing things together.",
  },
];

const ACTIVITY_CARDS = [
  { category: "Sports",  emoji: "⚡", color: "#FF6B35", title: "Badminton Doubles",      location: "YMCA Court 3",       time: "Tomorrow 6 AM",  joined: 3, max: 5,  avatars: ["AK","PR","SM"] },
  { category: "Music",   emoji: "♪",  color: "#A78BFA", title: "Jam Session – Guitar",   location: "Studio 7, Banjara", time: "Sat 5 PM",       joined: 4, max: 6,  avatars: ["MD","VR","KT","JS"] },
  { category: "Fitness", emoji: "◉",  color: "#F472B6", title: "Morning Run 5K",         location: "KBR Park",           time: "Tomorrow 6:30 AM",joined: 7,max: 10, avatars: ["RT","AD","SK","PL"] },
  { category: "Study",   emoji: "◈",  color: "#34D399", title: "GATE CS Study Group",    location: "Starbucks, Jubilee", time: "Sunday 10 AM",   joined: 5, max: 8,  avatars: ["PS","RT","AM"] },
  { category: "Gaming",  emoji: "◆",  color: "#60A5FA", title: "Board Game Night",       location: "Dice & Brew Café",   time: "Fri 7 PM",       joined: 4, max: 8,  avatars: ["AR","KS","VB"] },
  { category: "Social",  emoji: "◎",  color: "#FBBF24", title: "Startup Founders Chat",  location: "T-Hub, IIIT",        time: "Wed 6 PM",       joined: 12, max: 20, avatars: ["KM","SR","PD"] },
];

const TESTIMONIALS = [
  { initials: "AR", color: "#FF6B35", name: "Arjun R.", role: "Badminton player", text: "Found my doubles partner after 3 years of playing solo. We play three times a week now." },
  { initials: "MD", color: "#A78BFA", name: "Meera D.", role: "Musician",         text: "Joined a jam session on a whim. Now I'm in a band with two people I met that evening." },
  { initials: "KT", color: "#34D399", name: "Kiran T.", role: "Runner",           text: "My morning runs were lonely. Now I have a crew of 8 and we genuinely push each other." },
];

const STATS = [
  { value: "2,400+", label: "Active Users",     color: "#FF6B35" },
  { value: "180+",   label: "Activities/Week",  color: "#A78BFA" },
  { value: "12",     label: "Categories",       color: "#34D399" },
  { value: "4.9★",   label: "Avg Rating",       color: "#FBBF24" },
];

// ── Hook: scroll-triggered visibility ────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ── Mini avatar stack ─────────────────────────────────────────────────
const AVATAR_COLORS = ["#FF6B35","#A78BFA","#34D399","#F472B6","#60A5FA","#FBBF24"];
function MiniAvatar({ initials, idx }) {
  return (
    <div style={{
      width: 22, height: 22, borderRadius: "50%",
      background: AVATAR_COLORS[idx % AVATAR_COLORS.length],
      border: "2px solid #0f0f18",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 8, fontWeight: 800, color: "#fff",
      fontFamily: "'DM Sans', sans-serif",
      marginLeft: idx === 0 ? 0 : -6,
      zIndex: 10 - idx, position: "relative",
    }}>{initials}</div>
  );
}

// ── Activity preview card ─────────────────────────────────────────────
function ActivityPreviewCard({ card, delay, onSignUp }) {
  const [ref, inView] = useInView(0.1);
  const pct = Math.round((card.joined / card.max) * 100);
  return (
    <div ref={ref} style={{
      background: "rgba(255,255,255,0.04)",
      border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 20, padding: 18,
      transition: `opacity 0.6s ${delay}ms, transform 0.6s ${delay}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0) scale(1)" : "translateY(30px) scale(0.97)",
      cursor: "pointer",
      backdropFilter: "blur(8px)",
    }}
      onClick={onSignUp}
      onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; e.currentTarget.style.transform = "translateY(-3px)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Top bar */}
      <div style={{ height: 3, borderRadius: 3, background: `linear-gradient(90deg, ${card.color}, ${card.color}44)`, marginBottom: 14 }} />
      
      {/* Category */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <span style={{
          fontSize: 9, fontWeight: 800, color: card.color,
          background: `${card.color}18`, padding: "3px 9px",
          borderRadius: 20, textTransform: "uppercase", letterSpacing: 1.2,
          fontFamily: "'DM Sans', sans-serif",
        }}>{card.emoji} {card.category}</span>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif" }}>📍 Hyderabad</span>
      </div>

      <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", marginBottom: 6, lineHeight: 1.25 }}>
        {card.title}
      </div>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif", marginBottom: 12 }}>
        ◷ {card.time} &nbsp;·&nbsp; ◎ {card.location}
      </div>

      {/* Progress + avatars */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex" }}>
          {card.avatars.slice(0, 4).map((a, i) => <MiniAvatar key={i} initials={a} idx={i} />)}
        </div>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif" }}>
          {card.joined}/{card.max} joined
        </span>
      </div>
      <div style={{ height: 4, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: `linear-gradient(90deg, ${card.color}, ${card.color}bb)`, borderRadius: 4, transition: "width 0.8s ease" }} />
      </div>
    </div>
  );
}

// ── Feature card ──────────────────────────────────────────────────────
function FeatureCard({ feat, idx }) {
  const [ref, inView] = useInView(0.15);
  return (
    <div ref={ref} style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${feat.color}22`,
      borderRadius: 24, padding: "28px 26px",
      transition: `opacity 0.7s ${idx * 120}ms, transform 0.7s ${idx * 120}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(40px)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Corner glow */}
      <div style={{
        position: "absolute", top: -40, right: -40,
        width: 120, height: 120, borderRadius: "50%",
        background: `radial-gradient(circle, ${feat.color}22 0%, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{
        width: 48, height: 48, borderRadius: 14,
        background: `${feat.color}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, marginBottom: 18,
        border: `1px solid ${feat.color}30`,
      }}>{feat.icon}</div>
      <h3 style={{ fontSize: 18, fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", margin: "0 0 10px", lineHeight: 1.3 }}>
        {feat.title}
      </h3>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, margin: 0 }}>
        {feat.desc}
      </p>
    </div>
  );
}

// ── Testimonial card ──────────────────────────────────────────────────
function TestimonialCard({ t, idx }) {
  const [ref, inView] = useInView(0.15);
  return (
    <div ref={ref} style={{
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      borderRadius: 20, padding: "26px",
      transition: `opacity 0.7s ${idx * 150}ms, transform 0.7s ${idx * 150}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(30px)",
    }}>
      <div style={{ fontSize: 28, color: "rgba(255,255,255,0.1)", fontFamily: "Georgia, serif", lineHeight: 1, marginBottom: 14 }}>"</div>
      <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.8, margin: "0 0 20px", fontStyle: "italic" }}>
        {t.text}
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 40, height: 40, borderRadius: "50%",
          background: `linear-gradient(135deg, ${t.color}, ${t.color}88)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 800, color: "#fff",
          fontFamily: "'DM Sans', sans-serif",
        }}>{t.initials}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>{t.name}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>{t.role}</div>
        </div>
      </div>
    </div>
  );
}

// ── Stat pill ─────────────────────────────────────────────────────────
function StatPill({ stat, idx }) {
  const [ref, inView] = useInView(0.2);
  return (
    <div ref={ref} style={{
      textAlign: "center", padding: "20px 16px",
      transition: `opacity 0.6s ${idx * 100}ms, transform 0.6s ${idx * 100}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(20px)",
    }}>
      <div style={{ fontSize: 32, fontWeight: 900, color: stat.color, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
        {stat.value}
      </div>
      <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif", marginTop: 6, letterSpacing: 0.5 }}>
        {stat.label}
      </div>
    </div>
  );
}

// ── Main Landing ──────────────────────────────────────────────────────
export default function LandingScreen({ onSignIn, onSignUp }) {
  const [scrolled, setScrolled] = useState(false);
  const [heroRef, heroInView] = useInView(0.1);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ background: "#090910", minHeight: "100vh", overflowX: "hidden" }}>
      <LandingStyles />

      {/* ── Sticky Nav ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
        padding: "0 clamp(20px, 5vw, 80px)",
        height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        transition: "background 0.3s, border-color 0.3s, backdrop-filter 0.3s",
        background: scrolled ? "rgba(9,9,16,0.9)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.07)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "linear-gradient(135deg, #FF6B35, #e85a25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 15, boxShadow: "0 4px 12px rgba(255,107,53,0.4)",
          }}>⚡</div>
          <span style={{ fontSize: 16, fontWeight: 900, color: "#fff", fontFamily: "'Syne', sans-serif", letterSpacing: -0.3 }}>
            Activity Crew
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button onClick={onSignIn} style={{
            padding: "8px 20px", borderRadius: 50,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.06)", backdropFilter: "blur(8px)",
            color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.12)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
          >Sign In</button>
          <button onClick={onSignUp} style={{
            padding: "8px 22px", borderRadius: 50, border: "none",
            background: "linear-gradient(135deg, #FF6B35, #e85a25)",
            color: "#fff", fontSize: 13, fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif", cursor: "pointer",
            boxShadow: "0 4px 16px rgba(255,107,53,0.35)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(255,107,53,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 16px rgba(255,107,53,0.35)"; }}
          >Get Started</button>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section style={{
        minHeight: "100vh",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "100px clamp(20px, 5vw, 80px) 60px",
        position: "relative", overflow: "hidden", textAlign: "center",
      }}>
        {/* Animated mesh background */}
        <div className="hero-mesh" />
        <div style={{
          position: "absolute", top: "15%", left: "8%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,107,53,0.10) 0%, transparent 65%)",
          pointerEvents: "none", animation: "floatA 8s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", bottom: "5%", right: "5%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(167,139,250,0.09) 0%, transparent 65%)",
          pointerEvents: "none", animation: "floatB 10s ease-in-out infinite",
        }} />
        <div style={{
          position: "absolute", top: "40%", right: "20%",
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(52,211,153,0.07) 0%, transparent 65%)",
          pointerEvents: "none", animation: "floatA 12s ease-in-out infinite reverse",
        }} />

        <div ref={heroRef} style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
          {/* Eyebrow */}
          <div className={`fade-up ${heroInView ? "visible" : ""}`} style={{ animationDelay: "0ms" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "6px 16px", borderRadius: 50,
              background: "rgba(255,107,53,0.12)",
              border: "1px solid rgba(255,107,53,0.25)",
              fontSize: 11, fontWeight: 700, color: "#FF6B35",
              fontFamily: "'DM Sans', sans-serif",
              letterSpacing: 1, textTransform: "uppercase",
              marginBottom: 28,
            }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B35", boxShadow: "0 0 6px #FF6B35", display: "inline-block" }} />
              Now live in Hyderabad
            </span>
          </div>

          {/* Headline */}
          <h1 className={`fade-up ${heroInView ? "visible" : ""}`} style={{ animationDelay: "80ms", margin: "0 0 24px" }}>
            <span style={{
              display: "block", fontSize: "clamp(44px, 7vw, 88px)",
              fontWeight: 900, color: "#fff",
              fontFamily: "'Syne', sans-serif", lineHeight: 1.0,
              letterSpacing: "-3px",
            }}>Find your people.</span>
            <span style={{
              display: "block", fontSize: "clamp(44px, 7vw, 88px)",
              fontWeight: 900, lineHeight: 1.0, letterSpacing: "-3px",
              fontFamily: "'Syne', sans-serif",
              background: "linear-gradient(135deg, #FF6B35 0%, #FBBF24 50%, #A78BFA 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Do things together.</span>
          </h1>

          {/* Sub */}
          <p className={`fade-up ${heroInView ? "visible" : ""}`} style={{
            animationDelay: "180ms",
            fontSize: "clamp(15px, 2vw, 18px)", color: "rgba(255,255,255,0.45)",
            fontFamily: "'DM Sans', sans-serif", lineHeight: 1.8,
            maxWidth: 560, margin: "0 auto 40px",
          }}>
            Activity Crew connects you with real people doing real things nearby.
            No passive scrolling. No parasocial strangers. Just activities,
            a time, and a place — and the right crew shows up.
          </p>

          {/* CTA row */}
          <div className={`fade-up ${heroInView ? "visible" : ""}`} style={{ animationDelay: "260ms", display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={onSignUp} style={{
              padding: "15px 36px", borderRadius: 50, border: "none", cursor: "pointer",
              background: "linear-gradient(135deg, #FF6B35, #e85a25)",
              color: "#fff", fontSize: 15, fontWeight: 700,
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: "0 8px 32px rgba(255,107,53,0.45)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 14px 40px rgba(255,107,53,0.6)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(255,107,53,0.45)"; }}
            >
              Join for free →
            </button>
            <button onClick={onSignIn} style={{
              padding: "15px 36px", borderRadius: 50, cursor: "pointer",
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.06)", backdropFilter: "blur(8px)",
              color: "rgba(255,255,255,0.8)", fontSize: 15, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              transition: "background 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.11)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
            >
              Sign in
            </button>
          </div>

          {/* Social proof line */}
          <div className={`fade-up ${heroInView ? "visible" : ""}`} style={{ animationDelay: "360ms", marginTop: 32, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <div style={{ display: "flex" }}>
              {["AK","MD","RT","PS","KM"].map((a, i) => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: AVATAR_COLORS[i],
                  border: "2px solid #090910",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 9, fontWeight: 800, color: "#fff",
                  fontFamily: "'DM Sans', sans-serif",
                  marginLeft: i === 0 ? 0 : -8,
                  zIndex: 5 - i, position: "relative",
                }}>{a}</div>
              ))}
            </div>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>
              2,400+ people already exploring
            </span>
          </div>
        </div>

        {/* Scroll cue */}
        <div style={{
          position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
          animation: "bounce 2s ease-in-out infinite",
        }}>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans', sans-serif", letterSpacing: 1.5, textTransform: "uppercase" }}>Scroll</span>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)" }} />
        </div>
      </section>

      {/* ── Stats Band ── */}
      <section style={{
        borderTop: "1px solid rgba(255,255,255,0.07)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        background: "rgba(255,255,255,0.02)",
        padding: "8px clamp(20px, 5vw, 80px)",
        display: "grid", gridTemplateColumns: "repeat(4,1fr)",
        gap: 0,
      }}>
        {STATS.map((s, i) => (
          <div key={s.label} style={{ position: "relative" }}>
            {i > 0 && <div style={{ position: "absolute", left: 0, top: "20%", height: "60%", width: 1, background: "rgba(255,255,255,0.07)" }} />}
            <StatPill stat={s} idx={i} />
          </div>
        ))}
      </section>

      {/* ── Live Activities Section ── */}
      <section style={{ padding: "100px clamp(20px, 5vw, 80px)" }}>
        <SectionHeader
          eyebrow="Happening Near You"
          title={<>Real activities,<br /><span style={{ color: "#FF6B35" }}>happening right now</span></>}
          sub="These aren't curated recommendations — they're real people posting real plans. Pick one and show up."
        />
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 16, marginTop: 48,
        }}>
          {ACTIVITY_CARDS.map((card, i) => (
            <ActivityPreviewCard key={i} card={card} delay={i * 80} onSignUp={onSignUp} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 36 }}>
          <button onClick={onSignUp} style={{
            background: "none", border: "1px solid rgba(255,255,255,0.15)",
            color: "rgba(255,255,255,0.6)", padding: "11px 28px",
            borderRadius: 50, cursor: "pointer", fontSize: 13,
            fontFamily: "'DM Sans', sans-serif", fontWeight: 600,
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF6B35"; e.currentTarget.style.color = "#FF6B35"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
          >
            See all activities near you →
          </button>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section style={{
        padding: "100px clamp(20px, 5vw, 80px)",
        background: "rgba(255,255,255,0.015)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <SectionHeader
          eyebrow="How It Works"
          title={<>Three steps to<br /><span style={{ color: "#A78BFA" }}>your next adventure</span></>}
          sub="Getting started takes less than a minute. Finding your crew takes even less."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20, marginTop: 56 }}>
          {[
            { step: "01", icon: "◎", color: "#FF6B35", title: "Browse nearby",  desc: "Open the map or feed. See what's happening within your radius today, tomorrow, this week." },
            { step: "02", icon: "⊞", color: "#A78BFA", title: "Join or create", desc: "Tap to join an existing activity in one click, or post your own in under 30 seconds." },
            { step: "03", icon: "◉", color: "#34D399", title: "Show up & connect", desc: "Chat with attendees beforehand. Show up. Meet your people. That's literally it." },
          ].map((step, i) => (
            <HowItWorksCard key={i} step={step} idx={i} />
          ))}
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section style={{ padding: "100px clamp(20px, 5vw, 80px)" }}>
        <SectionHeader
          eyebrow="Built Different"
          title={<>Not a social network.<br /><span style={{ color: "#34D399" }}>A doing network.</span></>}
          sub="Activity Crew is built around things, not content. You're here to do, not to scroll."
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginTop: 52 }}>
          {FEATURES.map((feat, i) => <FeatureCard key={i} feat={feat} idx={i} />)}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{
        padding: "100px clamp(20px, 5vw, 80px)",
        background: "rgba(255,255,255,0.015)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        <SectionHeader
          eyebrow="Real Stories"
          title={<>They showed up.<br /><span style={{ color: "#FBBF24" }}>So did their people.</span></>}
        />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginTop: 52 }}>
          {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} t={t} idx={i} />)}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <FinalCTA onSignUp={onSignUp} onSignIn={onSignIn} />

      {/* ── Footer ── */}
      <footer style={{
        padding: "28px clamp(20px, 5vw, 80px)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 7,
            background: "linear-gradient(135deg, #FF6B35, #e85a25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 11,
          }}>⚡</div>
          <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.5)", fontFamily: "'Syne', sans-serif" }}>Activity Crew</span>
        </div>
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontFamily: "'DM Sans', sans-serif" }}>
          © 2025 Activity Crew · Hyderabad, India
        </span>
        <div style={{ display: "flex", gap: 20 }}>
          {["Privacy", "Terms", "Contact"].map(l => (
            <span key={l} style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, sub }) {
  const [ref, inView] = useInView(0.2);
  return (
    <div ref={ref} style={{ textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
      <div style={{
        fontSize: 11, fontWeight: 700, color: "#FF6B35",
        letterSpacing: 1.8, textTransform: "uppercase",
        fontFamily: "'DM Sans', sans-serif", marginBottom: 14,
        transition: "opacity 0.6s, transform 0.6s",
        opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(16px)",
      }}>{eyebrow}</div>
      <h2 style={{
        fontSize: "clamp(28px, 4vw, 46px)", fontWeight: 900, color: "#fff",
        fontFamily: "'Syne', sans-serif", lineHeight: 1.15,
        letterSpacing: "-1.5px", margin: "0 0 18px",
        transition: "opacity 0.6s 80ms, transform 0.6s 80ms",
        opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(16px)",
      }}>{title}</h2>
      {sub && <p style={{
        fontSize: 15, color: "rgba(255,255,255,0.4)",
        fontFamily: "'DM Sans', sans-serif", lineHeight: 1.8, margin: 0,
        transition: "opacity 0.6s 160ms, transform 0.6s 160ms",
        opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(16px)",
      }}>{sub}</p>}
    </div>
  );
}

// ── How it works card ─────────────────────────────────────────────────
function HowItWorksCard({ step, idx }) {
  const [ref, inView] = useInView(0.15);
  return (
    <div ref={ref} style={{
      padding: "32px 28px", borderRadius: 24,
      background: "rgba(255,255,255,0.03)",
      border: "1px solid rgba(255,255,255,0.07)",
      position: "relative", overflow: "hidden",
      transition: `opacity 0.7s ${idx * 150}ms, transform 0.7s ${idx * 150}ms`,
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(40px)",
    }}>
      <div style={{
        position: "absolute", top: 20, right: 24,
        fontSize: 52, fontWeight: 900, color: "rgba(255,255,255,0.04)",
        fontFamily: "'Syne', sans-serif", lineHeight: 1, userSelect: "none",
      }}>{step.step}</div>
      <div style={{
        width: 50, height: 50, borderRadius: 15,
        background: `${step.color}18`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 24, marginBottom: 20,
        border: `1px solid ${step.color}30`,
      }}>{step.icon}</div>
      <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", fontFamily: "'Syne', sans-serif", margin: "0 0 12px" }}>
        {step.title}
      </h3>
      <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, margin: 0 }}>
        {step.desc}
      </p>
    </div>
  );
}

// ── Final CTA ─────────────────────────────────────────────────────────
function FinalCTA({ onSignUp, onSignIn }) {
  const [ref, inView] = useInView(0.2);
  return (
    <section ref={ref} style={{
      padding: "120px clamp(20px, 5vw, 80px)",
      textAlign: "center", position: "relative", overflow: "hidden",
    }}>
      {/* Big glow */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 700, height: 400, borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(255,107,53,0.1) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        <div style={{
          fontSize: 11, fontWeight: 700, color: "#FF6B35",
          letterSpacing: 1.8, textTransform: "uppercase",
          fontFamily: "'DM Sans', sans-serif", marginBottom: 20,
          transition: "opacity 0.6s, transform 0.6s",
          opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)",
        }}>Ready to start?</div>

        <h2 style={{
          fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900,
          fontFamily: "'Syne', sans-serif", lineHeight: 1.05,
          letterSpacing: "-2.5px", margin: "0 0 24px",
          transition: "opacity 0.6s 80ms, transform 0.6s 80ms",
          opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)",
        }}>
          <span style={{ color: "#fff" }}>Your crew is</span><br />
          <span style={{
            background: "linear-gradient(135deg, #FF6B35, #FBBF24)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>already out there.</span>
        </h2>

        <p style={{
          fontSize: 16, color: "rgba(255,255,255,0.4)",
          fontFamily: "'DM Sans', sans-serif", lineHeight: 1.8,
          maxWidth: 480, margin: "0 auto 44px",
          transition: "opacity 0.6s 160ms, transform 0.6s 160ms",
          opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)",
        }}>
          Join for free. Find an activity happening near you today.
          No algorithm, no feed. Just people doing things.
        </p>

        <div style={{
          display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap",
          transition: "opacity 0.6s 240ms, transform 0.6s 240ms",
          opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(20px)",
        }}>
          <button onClick={onSignUp} style={{
            padding: "16px 44px", borderRadius: 50, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #FF6B35, #e85a25)",
            color: "#fff", fontSize: 16, fontWeight: 700,
            fontFamily: "'DM Sans', sans-serif",
            boxShadow: "0 10px 40px rgba(255,107,53,0.5)",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(255,107,53,0.65)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 10px 40px rgba(255,107,53,0.5)"; }}
          >
            Create free account →
          </button>
          <button onClick={onSignIn} style={{
            padding: "16px 44px", borderRadius: 50, cursor: "pointer",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.06)",
            color: "rgba(255,255,255,0.7)", fontSize: 16, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif",
            transition: "background 0.2s",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
          >
            Already have an account
          </button>
        </div>

        <p style={{
          marginTop: 24, fontSize: 12, color: "rgba(255,255,255,0.2)",
          fontFamily: "'DM Sans', sans-serif",
          transition: "opacity 0.6s 320ms",
          opacity: inView ? 1 : 0,
        }}>
          Free forever · No credit card · Hyderabad-first
        </p>
      </div>
    </section>
  );
}

// ── Styles ────────────────────────────────────────────────────────────
function LandingStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=DM+Sans:wght@400;500;600;700&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      .fade-up {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity 0.7s, transform 0.7s;
      }
      .fade-up.visible {
        opacity: 1;
        transform: translateY(0);
      }

      .hero-mesh {
        position: absolute; inset: 0; pointer-events: none; z-index: 0;
        background:
          radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,107,53,0.08) 0%, transparent 60%),
          radial-gradient(ellipse 60% 40% at 90% 80%, rgba(167,139,250,0.06) 0%, transparent 55%),
          radial-gradient(ellipse 40% 50% at 10% 60%, rgba(52,211,153,0.05) 0%, transparent 50%);
      }

      @keyframes floatA {
        0%, 100% { transform: translateY(0px) rotate(0deg); }
        33% { transform: translateY(-18px) rotate(2deg); }
        66% { transform: translateY(10px) rotate(-1deg); }
      }
      @keyframes floatB {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-24px); }
      }
      @keyframes bounce {
        0%, 100% { transform: translateX(-50%) translateY(0); }
        50% { transform: translateX(-50%) translateY(8px); }
      }

      ::-webkit-scrollbar { width: 4px; }
      ::-webkit-scrollbar-track { background: transparent; }
      ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }

      @media (max-width: 600px) {
        .hero-mesh { display: none; }
      }
    `}</style>
  );
}
