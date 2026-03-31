import { useState } from 'react';
import { useLocation } from '../../hooks/useLocation';
import { useNearby } from '../../hooks/useNearby';
import LocationPermissionBanner from '../ui/LocationPermissionBanner';

const AVATAR_COLORS = ['#FF6B35','#A78BFA','#34D399','#F472B6','#60A5FA','#FBBF24','#FB923C','#818CF8'];

function getColor(id) {
  const index = typeof id === 'string'
    ? id.charCodeAt(0) % AVATAR_COLORS.length
    : id % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

function Initials({ name, size = 50, color }) {
  const parts = (name || '').split(' ');
  const initials = parts.length >= 2
    ? parts[0][0] + parts[1][0]
    : (name || '??').slice(0, 2).toUpperCase();
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: `${color}22`, border: `1.5px solid ${color}55`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <span style={{ fontSize: size * 0.34, fontWeight: 700, color, fontFamily: "'Syne', sans-serif" }}>
        {initials}
      </span>
    </div>
  );
}

const ALL_INTERESTS = ['All','Sports','Music','Fitness','Study','Gaming','Social','Startup','Tech','Language'];
const SORT_OPTIONS  = [{ id:'distance', label:'Nearest' },{ id:'rating', label:'Top Rated' },{ id:'active', label:'Most Active' }];

function PersonCard({ person, onSelectPerson }) {
  const [status, setStatus] = useState('none');
  const color = getColor(person.id);

  const handleConnect = (e) => {
    e.stopPropagation();
    setStatus(s => s === 'none' ? 'pending' : s === 'pending' ? 'connected' : 'none');
  };

  return (
    <div
      onClick={() => onSelectPerson && onSelectPerson(person)}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 20, padding: '20px', cursor: 'pointer',
        transition: 'background 0.15s, transform 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.055)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)';  e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          {person.profilePicture
            ? <img src={person.profilePicture} alt={person.name} style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }} />
            : <Initials name={person.name} size={50} color={color} />
          }
          <div style={{ position: 'absolute', bottom: 1, right: 1, width: 11, height: 11, borderRadius: '50%', background: '#34D399', border: '2px solid #0d0d12' }} />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: "'Syne', sans-serif", marginBottom: 2 }}>
            {person.name}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontFamily: "'DM Sans', sans-serif", display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span>📍 {person.distance}</span>
            {person.rating > 0 && <span>⭐ {Number(person.rating).toFixed(1)}</span>}
          </div>
        </div>

        <button
          onClick={handleConnect}
          style={{
            flexShrink: 0, padding: '7px 14px', borderRadius: 50, cursor: 'pointer',
            fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
            background: status === 'connected' ? 'rgba(52,211,153,0.15)' : status === 'pending' ? 'rgba(255,255,255,0.07)' : `${color}20`,
            color:      status === 'connected' ? '#34D399'               : status === 'pending' ? 'rgba(255,255,255,0.4)'  : color,
            border:     status === 'connected' ? '1px solid rgba(52,211,153,0.3)' : status === 'pending' ? '1px solid rgba(255,255,255,0.1)' : `1px solid ${color}40`,
          }}
        >
          {status === 'connected' ? '✓ Connected' : status === 'pending' ? 'Requested' : '+ Connect'}
        </button>
      </div>

      {person.bio && (
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, margin: '0 0 12px' }}>
          {person.bio}
        </p>
      )}

      {person.interests?.length > 0 && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {person.interests.map(tag => (
            <span key={tag} style={{ fontSize: 10, padding: '3px 10px', borderRadius: 20, background: `${color}15`, color, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonCard() {
  const shimmer = { background: 'rgba(255,255,255,0.06)', borderRadius: 8 };
  return (
    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 20 }}>
      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
        <div style={{ ...shimmer, width: 50, height: 50, borderRadius: '50%' }} />
        <div style={{ flex: 1 }}>
          <div style={{ ...shimmer, height: 14, width: '60%', marginBottom: 8 }} />
          <div style={{ ...shimmer, height: 11, width: '40%' }} />
        </div>
      </div>
      <div style={{ ...shimmer, height: 12, marginBottom: 6 }} />
      <div style={{ ...shimmer, height: 12, width: '75%' }} />
    </div>
  );
}

export default function PeopleNearbyView({ onBack, onSelectPerson }) {
  const { coords, status: locStatus } = useLocation();
  const { nearbyUsers, loading, usingDummy } = useNearby(coords);

  const [filter, setFilter]   = useState('All');
  const [sortBy, setSortBy]   = useState('distance');
  const [search, setSearch]   = useState('');
  const [bannerDismissed, setBannerDismissed] = useState(false);

  const filtered = nearbyUsers
    .filter(p => filter === 'All' || (p.interests || []).some(i => i === filter))
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.interests || []).some(i => i.toLowerCase().includes(search.toLowerCase())))
    .sort((a, b) => sortBy === 'rating' ? b.rating - a.rating : a.distanceKm - b.distanceKm);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#0d0d12' }}>
      {/* Header */}
      <div style={{ padding: '22px 24px 0', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <button onClick={onBack} style={{ width: 34, height: 34, borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.07)', color: '#fff', fontSize: 15, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>←</button>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', fontFamily: "'Syne', sans-serif", margin: 0 }}>People Nearby</h2>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', fontFamily: "'DM Sans', sans-serif", margin: '2px 0 0' }}>
              {loading ? 'Finding people near you…' : `${filtered.length} people within 10 km`}
              {usingDummy && !loading && <span style={{ color: '#FBBF24', marginLeft: 6 }}>· demo data</span>}
            </p>
          </div>
        </div>

        {/* Location banner */}
        {!bannerDismissed && (
          <LocationPermissionBanner status={locStatus} onDismiss={() => setBannerDismissed(true)} />
        )}

        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 50, border: '1px solid rgba(255,255,255,0.09)', padding: '9px 16px', marginBottom: 14 }}>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>⌕</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or interest…" style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: '#fff', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }} />
          {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 14 }}>✕</button>}
        </div>

        {/* Interest filters */}
        <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 10, scrollbarWidth: 'none' }}>
          {ALL_INTERESTS.map(interest => (
            <button key={interest} onClick={() => setFilter(interest)} style={{ flexShrink: 0, padding: '6px 14px', borderRadius: 50, border: 'none', cursor: 'pointer', background: filter === interest ? '#FF6B35' : 'rgba(255,255,255,0.06)', color: filter === interest ? '#fff' : 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", transition: 'all 0.15s' }}>
              {interest}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {SORT_OPTIONS.map(opt => (
            <button key={opt.id} onClick={() => setSortBy(opt.id)} style={{ padding: '5px 14px', borderRadius: 50, cursor: 'pointer', background: sortBy === opt.id ? 'rgba(255,255,255,0.1)' : 'transparent', color: sortBy === opt.id ? '#fff' : 'rgba(255,255,255,0.3)', fontSize: 11, fontWeight: 600, fontFamily: "'DM Sans', sans-serif", border: sortBy === opt.id ? '1px solid rgba(255,255,255,0.15)' : '1px solid transparent', transition: 'all 0.15s' }}>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 32px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👥</div>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Sans', sans-serif" }}>No people found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {filtered.map(p => <PersonCard key={p.id} person={p} onSelectPerson={onSelectPerson} />)}
          </div>
        )}
      </div>
    </div>
  );
}
