import { useState, useEffect } from 'react';
import { CATEGORIES } from '../../data/constants';
import { useLocation } from '../../hooks/useLocation';
import { useNearby } from '../../hooks/useNearby';
import LocationPermissionBanner from '../ui/LocationPermissionBanner';
import api from '../../api/api';

// ──────────────────────── helpers ────────────────────────────────────────
const AVATAR_COLORS = ['#FF6B35','#A78BFA','#34D399','#F472B6','#60A5FA','#FBBF24','#FB923C','#818CF8'];
function getColor(id) {
  const index = typeof id === 'string' ? id.charCodeAt(0) % AVATAR_COLORS.length : (id || 0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function Initials({ name = '', size = 38, color }) {
  const parts = name.split(' ');
  const letters = parts.length >= 2 ? parts[0][0] + parts[1][0] : name.slice(0,2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: `${color}22`, border: `1.5px solid ${color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <span style={{ fontSize: size * 0.34, fontWeight: 700, color, fontFamily: "'Syne', sans-serif" }}>{letters}</span>
    </div>
  );
}

function formatDateTime(isoString) {
  if (!isoString) return '';
  const d = new Date(isoString);
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const today = new Date(); today.setHours(0,0,0,0);
  const target = new Date(d); target.setHours(0,0,0,0);
  const diff = Math.round((target - today) / 86400000);
  const dayLabel = diff === 0 ? 'Today' : diff === 1 ? 'Tomorrow' : `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
  const timeLabel = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return { dayLabel, timeLabel, dayNum: d.getDate(), dayShort: days[d.getDay()].toUpperCase() };
}

// ──────────────────────── sub-components ─────────────────────────────────
function SectionTitle({ children, action, onAction }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
      <h3 style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: 1.4, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>{children}</h3>
      {action && <button onClick={onAction} style={{ background: 'none', border: 'none', fontSize: 11, color: '#FF6B35', fontWeight: 600, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer' }}>{action}</button>}
    </div>
  );
}

function StatCard({ stat }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
      <div style={{ fontSize: 18 }}>{stat.icon}</div>
      <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{stat.value}</div>
      <div>
        <div style={{ fontSize: 11, color: stat.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{stat.unit}</div>
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: "'DM Sans', sans-serif" }}>{stat.label}</div>
      </div>
    </div>
  );
}

// ── Upcoming Activity Item (location-aware) ────────────────────────────
function UpcomingItem({ activity }) {
  const dt = formatDateTime(activity.time);
  const category = CATEGORIES.find(c => c.id === activity.category);
  const color = activity.color || '#FF6B35';

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      {/* Date badge */}
      <div style={{ width: 46, height: 46, borderRadius: 12, flexShrink: 0, background: `${color}14`, border: `1px solid ${color}30`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 9, fontWeight: 700, color, fontFamily: "'DM Sans', sans-serif", letterSpacing: 0.5 }}>{dt.dayShort}</div>
        <div style={{ fontSize: 17, fontWeight: 900, color: '#fff', fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>{dt.dayNum}</div>
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: "'DM Sans', sans-serif", overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {activity.title}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: "'DM Sans', sans-serif", display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 2 }}>
          <span>{category?.emoji} {dt.timeLabel}</span>
          {activity.distance && <span>📍 {activity.distance}</span>}
          {activity.host?.name && <span>by {activity.host.name}</span>}
        </div>
      </div>

      {/* Capacity dot */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
        <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', fontFamily: "'DM Sans', sans-serif" }}>
          {activity.joined}/{activity.max}
        </div>
      </div>
    </div>
  );
}

// ── Person row in dashboard sidebar ───────────────────────────────────
function PersonRow({ person, onSelectPerson }) {
  const [connected, setConnected] = useState(false);
  const color = getColor(person.id);

  return (
    <div
      onClick={() => onSelectPerson && onSelectPerson(person)}
      style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'opacity 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
    >
      {person.profilePicture
        ? <img src={person.profilePicture} alt={person.name} style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
        : <Initials name={person.name} size={38} color={color} />
      }

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', fontFamily: "'DM Sans', sans-serif" }}>{person.name}</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Sans', sans-serif" }}>
          📍 {person.distance}
        </div>
        <div style={{ display: 'flex', gap: 5, marginTop: 4, flexWrap: 'wrap' }}>
          {(person.interests || []).slice(0,2).map(tag => (
            <span key={tag} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif" }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); setConnected(c => !c); }}
        style={{ padding: '6px 14px', borderRadius: 50, border: 'none', cursor: 'pointer', background: connected ? 'rgba(255,255,255,0.06)' : 'rgba(96,165,250,0.12)', color: connected ? 'rgba(255,255,255,0.35)' : '#60A5FA', fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", flexShrink: 0, transition: 'all 0.2s', border: connected ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(96,165,250,0.2)' }}
      >
        {connected ? '✓ Connected' : '+ Connect'}
      </button>
    </div>
  );
}

function SkeletonRow({ width = '100%' }) {
  return <div style={{ height: 12, borderRadius: 8, background: 'rgba(255,255,255,0.06)', marginBottom: 8, width }} />;
}

// ─────────────────────────────────────────────────────────────────────────
export default function DashboardView({ user, onCreateClick, activities, onOpen, onNavigate, onSelectPerson }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const userName = user?.name || 'Friend';

  const [stats, setStats]               = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Location + nearby data
  const { coords, status: locStatus } = useLocation();
  const { nearbyUsers, nearbyActivities, loading: nearbyLoading, usingDummy } = useNearby(coords);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/api/auth/stats');
        setStats(data.stats);
      } catch {
        setStats({ activitiesThisWeek: 0, dayStreak: 0, people: 0, rating: 0 });
      } finally {
        setStatsLoading(false);
      }
    })();
  }, []);

  const USER_STATS = stats ? [
    { label: 'This week',  value: stats.activitiesThisWeek, unit: 'activities', icon: '⚡', color: '#FF6B35' },
    { label: 'Day streak', value: stats.dayStreak,          unit: 'days',       icon: '🔥', color: '#FBBF24' },
    { label: 'People met', value: stats.people || 0,        unit: 'total',      icon: '◎',  color: '#34D399' },
    { label: 'Rating',     value: Number(stats.rating || 0).toFixed(1), unit: 'avg', icon: '★', color: '#A78BFA' },
  ] : [];

  // Show 4 nearest upcoming activities
  const upcomingActivities = nearbyActivities.slice(0, 4);
  // Show 4 nearest people
  const peopleSample = nearbyUsers.slice(0, 4);

  return (
    <div style={{ height: '100%', overflowY: 'auto', background: '#0d0d12', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{ padding: '28px 32px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
          {user?.profilePicture && (
            <img src={user.profilePicture} alt={user.name} style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover', marginTop: 10 }} />
          )}
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Sans', sans-serif", marginBottom: 4 }}>{greeting} ☀️</div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#fff', fontFamily: "'Syne', sans-serif", letterSpacing: -0.5, margin: 0 }}>{userName}</h1>
            {user?.email && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif", marginTop: 6 }}>📧 {user.email}</div>}
            {/* Show real-time location status */}
            <div style={{ fontSize: 12, fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
              {locStatus === 'granted'    && <span style={{ color: '#34D399' }}>📍 Location on · showing real nearby data</span>}
              {locStatus === 'requesting' && <span style={{ color: '#FBBF24' }}>🧭 Getting your location…</span>}
              {locStatus === 'denied'     && <span style={{ color: 'rgba(255,255,255,0.35)' }}>📍 {user?.location || 'Location off'}</span>}
            </div>
          </div>
        </div>
        <button onClick={onCreateClick} style={{ padding: '10px 22px', borderRadius: 50, border: 'none', cursor: 'pointer', background: 'linear-gradient(135deg, #FF6B35, #e85a25)', color: '#fff', fontSize: 13, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", boxShadow: '0 4px 16px rgba(255,107,53,0.3)', transition: 'transform 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
        >+ Create</button>
      </div>

      <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 32 }}>

        {/* ── Location banner ─────────────────────────────── */}
        {!bannerDismissed && (
          <LocationPermissionBanner status={locStatus} onDismiss={() => setBannerDismissed(true)} />
        )}

        {/* ── Interests ───────────────────────────────────── */}
        {user?.interests?.length > 0 && (
          <section>
            <SectionTitle>Your Interests</SectionTitle>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {user.interests.map(interest => (
                <span key={interest} style={{ fontSize: 12, padding: '6px 14px', borderRadius: 20, background: 'rgba(255,107,53,0.15)', color: '#FF6B35', fontFamily: "'DM Sans', sans-serif", fontWeight: 600, border: '1px solid rgba(255,107,53,0.3)' }}>♦ {interest}</span>
              ))}
            </div>
          </section>
        )}

        {/* ── Stats ───────────────────────────────────────── */}
        <section>
          <SectionTitle>Your Activity</SectionTitle>
          <div style={{ display: 'flex', gap: 12 }}>
            {statsLoading
              ? <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', padding: '40px 20px', fontFamily: "'DM Sans', sans-serif" }}>Loading stats…</div>
              : USER_STATS.map(s => <StatCard key={s.label} stat={s} />)
            }
          </div>
        </section>

        {/* ── Two-column: Upcoming Near You + People Near You ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>

          {/* Upcoming Near You */}
          <section>
            <SectionTitle action="View all →" onAction={() => onNavigate && onNavigate('calendar')}>
              Upcoming Near You
              {usingDummy && <span style={{ color: '#FBBF24', fontSize: 10, marginLeft: 6, fontWeight: 400 }}>demo</span>}
            </SectionTitle>
            {nearbyLoading ? (
              <div>{[1,2,3,4].map(i => <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}><SkeletonRow /><SkeletonRow width="60%" /></div>)}</div>
            ) : upcomingActivities.length > 0 ? (
              upcomingActivities.map(a => <UpcomingItem key={a.id} activity={a} />)
            ) : (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>No upcoming activities nearby</div>
            )}
          </section>

          {/* People Near You */}
          <section>
            <SectionTitle action="Browse all →" onAction={() => onNavigate && onNavigate('people')}>
              People Near You
              {usingDummy && <span style={{ color: '#FBBF24', fontSize: 10, marginLeft: 6, fontWeight: 400 }}>demo</span>}
            </SectionTitle>
            {nearbyLoading ? (
              <div>{[1,2,3,4].map(i => <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: 12, alignItems: 'center' }}><div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} /><div style={{ flex: 1 }}><SkeletonRow /><SkeletonRow width="50%" /></div></div>)}</div>
            ) : peopleSample.length > 0 ? (
              peopleSample.map(p => <PersonRow key={p.id} person={p} onSelectPerson={onSelectPerson} />)
            ) : (
              <div style={{ padding: '24px 0', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>No people found nearby</div>
            )}
          </section>
        </div>

      </div>
    </div>
  );
}
