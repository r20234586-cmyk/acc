import { useState, useMemo, useEffect } from "react";
import { CATEGORIES } from "../../data/constants";
import api from "../../api/api";

/* Convert activities array (from /api/activities) to calendar event shape */
function activitiesToEvents(activities, userId) {
  return activities.map(a => {
    const isHost = a.hostId === userId;
    const isPast = new Date(a.time) < new Date();
    return {
      id:       a.id,
      date:     new Date(a.time),
      title:    a.title,
      category: a.category,
      color:    a.color || '#FF6B35',
      time:     new Date(a.time).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      location: a.location,
      type:     isPast ? 'past' : isHost ? 'hosting' : 'joined',
    };
  });
}

const DAYS    = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MONTHS  = ["January","February","March","April","May","June","July","August","September","October","November","December"];

function isSameDay(a, b) {
  return a.getFullYear() === b.getFullYear() &&
         a.getMonth()    === b.getMonth()    &&
         a.getDate()     === b.getDate();
}

function typeStyle(type) {
  if (type === "hosting") return { color:"#FF6B35", label:"Hosting" };
  if (type === "past")    return { color:"rgba(255,255,255,0.25)", label:"Past" };
  return                         { color:"#34D399",  label:"Joined"  };
}

// ── Single event row ─────────────────────────────────────────────────
function EventCard({ ev, onOpen }) {
  const cat    = CATEGORIES.find(c => c.id === ev.category);
  const ts     = typeStyle(ev.type);
  const isPast = ev.type === "past";
  return (
    <div
      onClick={() => !isPast && onOpen && onOpen(ev)}
      style={{
        display:"flex", gap:12, padding:"13px 14px",
        background:"rgba(255,255,255,0.03)",
        border:`1px solid ${isPast ? "rgba(255,255,255,0.05)" : ev.color+"22"}`,
        borderRadius:14, cursor: isPast ? "default" : "pointer",
        transition:"background 0.15s",
        opacity: isPast ? 0.5 : 1,
      }}
      onMouseEnter={e=>{ if(!isPast) e.currentTarget.style.background="rgba(255,255,255,0.07)"; }}
      onMouseLeave={e=>{ if(!isPast) e.currentTarget.style.background="rgba(255,255,255,0.03)"; }}
    >
      {/* Left colour pip */}
      <div style={{ width:3, borderRadius:3, background:ev.color, flexShrink:0, alignSelf:"stretch", opacity: isPast ? 0.4 : 1 }} />

      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:5 }}>
          <span style={{ fontSize:13, fontWeight:700, color: isPast ? "rgba(255,255,255,0.4)" : "#fff", fontFamily:"'DM Sans', sans-serif", lineHeight:1.3 }}>
            {ev.title}
          </span>
          <span style={{
            fontSize:9, fontWeight:700, color:ts.color,
            background:`${ts.color}18`, padding:"2px 8px", borderRadius:20,
            fontFamily:"'DM Sans', sans-serif", flexShrink:0, marginLeft:8,
            border:`1px solid ${ts.color}30`,
          }}>{ts.label}</span>
        </div>
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)", fontFamily:"'DM Sans', sans-serif", display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ color:ev.color, fontSize:10 }}>◷</span> {ev.time}
          </span>
          <span style={{ fontSize:11, color:"rgba(255,255,255,0.35)", fontFamily:"'DM Sans', sans-serif", display:"flex", alignItems:"center", gap:4 }}>
            <span style={{ color:ev.color, fontSize:10 }}>◎</span> {ev.location}
          </span>
          <span style={{ fontSize:10, color:ev.color, fontFamily:"'DM Sans', sans-serif" }}>
            {cat?.emoji} {ev.category}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Main CalendarView ────────────────────────────────────────────────
export default function CalendarView({ onBack, onOpen }) {
  const today   = new Date();
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState(today);
  const [view, setView]         = useState("month"); // "month" | "agenda"
  const [EVENTS, setEVENTS]     = useState([]);

  /* ── Fetch user's activities and convert to calendar events ────── */
  useEffect(() => {
    const load = async () => {
      try {
        const userId = (() => { try { return JSON.parse(localStorage.getItem('user'))?.id; } catch { return null; } })();
        const { data } = await api.get('/api/activities');
        // Only show activities the user has joined or is hosting
        const userActivities = data.filter(a =>
          a.hostId === userId || (Array.isArray(a.joined) && a.joined.includes(userId))
        );
        setEVENTS(activitiesToEvents(userActivities, userId));
      } catch (err) {
        console.warn('[CalendarView] Failed to load activities:', err.message);
        setEVENTS([]);
      }
    };
    load();
  }, []);

  const year  = viewDate.getFullYear();
  const month = viewDate.getMonth();

  // Calendar grid cells
  const cells = useMemo(() => {
    const firstDay    = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const arr = [];
    for (let i = 0; i < firstDay; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) arr.push(new Date(year, month, d));
    return arr;
  }, [year, month]);

  // Events indexed by day
  const eventsByDay = useMemo(() => {
    const map = {};
    EVENTS.forEach(ev => {
      const k = ev.date.toDateString();
      if (!map[k]) map[k] = [];
      map[k].push(ev);
    });
    return map;
  }, [EVENTS]);

  const selectedEvents = eventsByDay[selected.toDateString()] || [];

  // Agenda — all upcoming, grouped by date
  const agendaGroups = useMemo(() => {
    const sorted = [...EVENTS]
      .filter(ev => ev.date >= todayMidnight)
      .sort((a, b) => a.date - b.date);
    const groups = [];
    let lastKey  = null;
    sorted.forEach(ev => {
      const k = ev.date.toDateString();
      if (k !== lastKey) { groups.push({ key:k, date:ev.date, events:[] }); lastKey = k; }
      groups[groups.length - 1].events.push(ev);
    });
    return groups;
  }, [EVENTS, todayMidnight]);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const upcomingCount = EVENTS.filter(e => e.type !== "past").length;

  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column", background:"#0d0d12", overflow:"hidden" }}>

      {/* ── Header ── */}
      <div style={{
        padding:"20px 20px 14px",
        borderBottom:"1px solid rgba(255,255,255,0.07)",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        flexShrink:0,
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {onBack && (
            <button onClick={onBack} style={{
              background:"rgba(255,255,255,0.07)", border:"none", color:"#fff",
              width:34, height:34, borderRadius:"50%", cursor:"pointer",
              fontSize:16, display:"flex", alignItems:"center", justifyContent:"center",
              flexShrink:0,
            }}>←</button>
          )}
          <div>
            <h2 style={{ fontSize:20, fontWeight:800, color:"#fff", fontFamily:"'Syne', sans-serif", margin:0 }}>
              My Schedule
            </h2>
            <p style={{ fontSize:12, color:"rgba(255,255,255,0.3)", fontFamily:"'DM Sans', sans-serif", margin:"2px 0 0" }}>
              {upcomingCount} upcoming activit{upcomingCount!==1?"ies":"y"}
            </p>
          </div>
        </div>

        {/* Month/Agenda toggle */}
        <div style={{ display:"flex", gap:3, background:"rgba(255,255,255,0.06)", borderRadius:10, padding:3 }}>
          {[["month","▦ Month"],["agenda","≡ Agenda"]].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)} style={{
              padding:"6px 11px", borderRadius:8, border:"none",
              background: view===v ? "rgba(255,255,255,0.12)" : "transparent",
              color: view===v ? "#fff" : "rgba(255,255,255,0.35)",
              fontSize:11, cursor:"pointer", fontFamily:"'DM Sans', sans-serif",
              fontWeight:600, transition:"all 0.15s", whiteSpace:"nowrap",
            }}>{label}</button>
          ))}
        </div>
      </div>

      {/* ────────── MONTH VIEW ────────── */}
      {view === "month" && (
        <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>

          {/* Month nav */}
          <div style={{
            display:"flex", alignItems:"center", justifyContent:"space-between",
            padding:"12px 20px 8px", flexShrink:0,
          }}>
            <button onClick={prevMonth} style={{
              background:"rgba(255,255,255,0.07)", border:"none", color:"rgba(255,255,255,0.7)",
              width:30, height:30, borderRadius:"50%", cursor:"pointer",
              fontSize:16, display:"flex", alignItems:"center", justifyContent:"center",
            }}>‹</button>
            <span style={{ fontSize:16, fontWeight:800, color:"#fff", fontFamily:"'Syne', sans-serif" }}>
              {MONTHS[month]} {year}
            </span>
            <button onClick={nextMonth} style={{
              background:"rgba(255,255,255,0.07)", border:"none", color:"rgba(255,255,255,0.7)",
              width:30, height:30, borderRadius:"50%", cursor:"pointer",
              fontSize:16, display:"flex", alignItems:"center", justifyContent:"center",
            }}>›</button>
          </div>

          {/* Day-of-week headers */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", padding:"0 12px 4px", flexShrink:0 }}>
            {DAYS.map(d => (
              <div key={d} style={{
                textAlign:"center", fontSize:9, fontWeight:700, letterSpacing:0.8,
                color:"rgba(255,255,255,0.22)", fontFamily:"'DM Sans', sans-serif", padding:"4px 0",
              }}>{d}</div>
            ))}
          </div>

          {/* Grid */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", padding:"0 12px", gap:3, flexShrink:0 }}>
            {cells.map((day, i) => {
              if (!day) return <div key={`e${i}`} />;
              const evs    = eventsByDay[day.toDateString()] || [];
              const isSel  = isSameDay(day, selected);
              const isTod  = isSameDay(day, today);
              const isPast = day < todayMidnight;

              return (
                <button
                  key={day.toDateString()}
                  onClick={() => setSelected(day)}
                  style={{
                    display:"flex", flexDirection:"column",
                    alignItems:"center", padding:"6px 2px 5px",
                    borderRadius:10, border:"none", cursor:"pointer",
                    background: isSel
                      ? "rgba(255,107,53,0.18)"
                      : isTod
                        ? "rgba(255,255,255,0.06)"
                        : "transparent",
                    outline: isSel
                      ? "1.5px solid rgba(255,107,53,0.55)"
                      : isTod
                        ? "1px solid rgba(255,255,255,0.1)"
                        : "none",
                    transition:"background 0.15s",
                  }}
                  onMouseEnter={e=>{ if(!isSel) e.currentTarget.style.background="rgba(255,255,255,0.05)"; }}
                  onMouseLeave={e=>{ e.currentTarget.style.background = isSel ? "rgba(255,107,53,0.18)" : isTod ? "rgba(255,255,255,0.06)" : "transparent"; }}
                >
                  <span style={{
                    fontSize:13, fontWeight: isSel||isTod ? 800 : 500,
                    color: isSel ? "#FF6B35" : isTod ? "#fff" : isPast ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.8)",
                    fontFamily:"'DM Sans', sans-serif", lineHeight:1, marginBottom:4,
                  }}>{day.getDate()}</span>

                  {/* Event dots */}
                  <div style={{ display:"flex", gap:2, justifyContent:"center", minHeight:5 }}>
                    {evs.slice(0,3).map((ev,idx) => (
                      <div key={idx} style={{
                        width:4, height:4, borderRadius:"50%",
                        background: isPast ? "rgba(255,255,255,0.15)" : ev.color,
                        boxShadow: isPast ? "none" : `0 0 3px ${ev.color}88`,
                      }} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected day detail */}
          <div style={{
            flex:1, overflowY:"auto",
            borderTop:"1px solid rgba(255,255,255,0.07)",
            padding:"14px 16px 20px",
            scrollbarWidth:"thin", scrollbarColor:"rgba(255,255,255,0.08) transparent",
          }}>
            {/* Label row */}
            <div style={{
              display:"flex", alignItems:"center", justifyContent:"space-between",
              marginBottom:12,
            }}>
              <span style={{
                fontSize:11, fontWeight:700, color:"rgba(255,255,255,0.3)",
                fontFamily:"'DM Sans', sans-serif", textTransform:"uppercase", letterSpacing:1.2,
              }}>
                {isSameDay(selected, today)
                  ? "Today"
                  : selected.toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"short" })
                }
              </span>
              {selectedEvents.length > 0 && (
                <span style={{ fontSize:11, color:"#FF6B35", fontFamily:"'DM Sans', sans-serif", fontWeight:700 }}>
                  {selectedEvents.length} event{selectedEvents.length>1?"s":""}
                </span>
              )}
            </div>

            {selectedEvents.length === 0 ? (
              <div style={{ textAlign:"center", padding:"28px 0", color:"rgba(255,255,255,0.18)", fontFamily:"'DM Sans', sans-serif", fontSize:13 }}>
                <div style={{ fontSize:28, marginBottom:8 }}>◎</div>
                Nothing scheduled
              </div>
            ) : (
              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {selectedEvents.map(ev => <EventCard key={ev.id} ev={ev} onOpen={onOpen} />)}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ────────── AGENDA VIEW ────────── */}
      {view === "agenda" && (
        <div style={{ flex:1, overflowY:"auto", padding:"16px 16px 28px", scrollbarWidth:"thin" }}>
          {agendaGroups.length === 0 ? (
            <div style={{ textAlign:"center", padding:"60px 0", color:"rgba(255,255,255,0.2)", fontFamily:"'DM Sans', sans-serif" }}>
              <div style={{ fontSize:36, marginBottom:12 }}>📅</div>
              No upcoming activities
            </div>
          ) : agendaGroups.map(g => (
            <div key={g.key} style={{ marginBottom:24 }}>
              {/* Date header */}
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                <div style={{
                  width:40, height:40, borderRadius:11, flexShrink:0,
                  background: isSameDay(g.date, today) ? "rgba(255,107,53,0.15)" : "rgba(255,255,255,0.05)",
                  border: isSameDay(g.date, today) ? "1px solid rgba(255,107,53,0.35)" : "1px solid rgba(255,255,255,0.08)",
                  display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                }}>
                  <span style={{
                    fontSize:8, fontWeight:700, letterSpacing:0.5, textTransform:"uppercase",
                    color: isSameDay(g.date, today) ? "#FF6B35" : "rgba(255,255,255,0.3)",
                    fontFamily:"'DM Sans', sans-serif",
                  }}>
                    {g.date.toLocaleDateString("en-IN",{weekday:"short"})}
                  </span>
                  <span style={{
                    fontSize:17, fontWeight:900, lineHeight:1,
                    color: isSameDay(g.date, today) ? "#FF6B35" : "#fff",
                    fontFamily:"'Syne', sans-serif",
                  }}>{g.date.getDate()}</span>
                </div>
                <div>
                  <div style={{
                    fontSize:13, fontWeight:700,
                    color: isSameDay(g.date, today) ? "#FF6B35" : "#fff",
                    fontFamily:"'DM Sans', sans-serif",
                  }}>
                    {isSameDay(g.date, today)
                      ? "Today"
                      : g.date.toLocaleDateString("en-IN",{month:"long",day:"numeric",year:"numeric"})
                    }
                  </div>
                  <div style={{ fontSize:10, color:"rgba(255,255,255,0.3)", fontFamily:"'DM Sans', sans-serif" }}>
                    {g.events.length} activit{g.events.length>1?"ies":"y"}
                  </div>
                </div>
              </div>

              <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                {g.events.map(ev => <EventCard key={ev.id} ev={ev} onOpen={onOpen} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
