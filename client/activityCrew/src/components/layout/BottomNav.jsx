/* ═══════════════════════════════════════════════════════════════════
   BottomNav — Mobile bottom navigation bar.
   SVG icons for all tabs — fully visible on dark background.
   ═══════════════════════════════════════════════════════════════════ */
import styles from "./BottomNav.module.css";

const HomeIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const GridIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const MapIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>;
const BellIcon = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;

const NAV_TABS = [
  { id: "home", Icon: HomeIcon, label: "Home"     },
  { id: "feed", Icon: GridIcon, label: "Discover" },
  { id: "map",  Icon: MapIcon,  label: "Map"      },
];

export default function BottomNav({ activeTab, onTabChange, unreadCount = 0, onNotificationsClick, onProfileClick, user }) {
  const userInitials = (() => {
    if (!user?.name) return 'ME';
    const parts = user.name.split(' ');
    return parts.length >= 2 ? parts[0][0] + parts[1][0] : user.name.slice(0, 2).toUpperCase();
  })();

  return (
    <div className={styles.nav}>
      {NAV_TABS.map(({ id, Icon, label }) => {
        const active = activeTab === id;
        return (
          <button key={id} onClick={() => onTabChange(id)} className={styles.tab}>
            <span className={`${styles.tabIcon} ${active ? styles.tabIconActive : ''}`}
              style={{ color: active ? '#FF6B35' : 'rgba(255,255,255,0.4)' }}>
              <Icon />
            </span>
            <span className={styles.tabLabel} style={{ color: active ? '#FF6B35' : 'rgba(255,255,255,0.35)' }}>
              {label}
            </span>
          </button>
        );
      })}

      {/* Notifications */}
      <button onClick={onNotificationsClick} className={styles.bellWrap}>
        <span style={{ fontSize: 22, display: 'block', color: 'rgba(255,255,255,0.4)' }}><BellIcon /></span>
        {unreadCount > 0 && (
          <span className={styles.badge}>{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
        <span className={styles.tabLabel} style={{ color: 'rgba(255,255,255,0.35)' }}>Alerts</span>
      </button>

      {/* Profile */}
      <button onClick={onProfileClick} className={styles.profileBtn}>
        <div className={styles.profileAvatar}>
          {user?.profilePicture
            ? <img src={user.profilePicture} alt={user.name} className={styles.profileAvatarImg} />
            : userInitials
          }
        </div>
        <span className={styles.tabLabel} style={{ color: 'rgba(255,255,255,0.35)' }}>Profile</span>
      </button>
    </div>
  );
}
