/* ═══════════════════════════════════════════════════════════════════
   TopNav — Desktop top navigation bar.
   Features: logo, tab navigation, create button, notifications,
   connection requests, and profile dropdown with real user data.
   Uses SVG icons for visibility on dark backgrounds.
   ═══════════════════════════════════════════════════════════════════ */
import { useState } from "react";
import styles from "./TopNav.module.css";

/* ── SVG icon components — all white/visible on dark background ──── */
const HomeIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>;
const GridIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
const MapIcon   = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>;
const BellIcon  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const UsersIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
const UserIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const LogoutIcon= () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const PlusIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;

const NAV_TABS = [
  { id: "home",  Icon: HomeIcon, label: "Home"     },
  { id: "feed",  Icon: GridIcon, label: "Discover" },
  { id: "map",   Icon: MapIcon,  label: "Map"      },
];

export default function TopNav({
  activeTab, onTabChange, unreadCount = 0, requestCount = 0,
  onNotificationsClick, onRequestsClick, onProfileClick, onLogout, onCreateClick, user,
}) {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  /* Build initials from logged-in user's name */
  const userInitials = (() => {
    if (!user?.name) return 'ME';
    const parts = user.name.split(' ');
    return parts.length >= 2 ? parts[0][0] + parts[1][0] : user.name.slice(0, 2).toUpperCase();
  })();

  return (
    <header className={styles.nav}>
      {/* Logo */}
      <div className={styles.logo}>
        <div className={styles.logoIcon}>⚡</div>
        <span className={styles.logoText}>ActivityCrew</span>
      </div>

      {/* Tab navigation */}
      <nav className={styles.tabs}>
        {NAV_TABS.map(({ id, Icon, label }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`${styles.tab} ${active ? styles.tabActive : ''}`}
            >
              <span className={styles.tabIcon} style={{ color: active ? '#FF6B35' : 'rgba(255,255,255,0.4)' }}>
                <Icon />
              </span>
              <span>{label}</span>
              {active && <span className={styles.tabDot} />}
            </button>
          );
        })}
      </nav>

      {/* Right-side actions */}
      <div className={styles.right}>
        {/* Create activity button */}
        <button onClick={onCreateClick} className={styles.createBtn}>
          <PlusIcon /> Create
        </button>

        {/* Connection requests */}
        <button onClick={onRequestsClick} className={styles.iconBtn} title="Connection Requests">
          <span style={{ color: 'rgba(255,255,255,0.7)' }}><UsersIcon /></span>
          {requestCount > 0 && (
            <span className={styles.badge} style={{ background: '#60A5FA' }}>
              {requestCount > 9 ? '9+' : requestCount}
            </span>
          )}
        </button>

        {/* Notifications bell */}
        <button onClick={onNotificationsClick} className={styles.iconBtn} title="Notifications">
          <span style={{ color: 'rgba(255,255,255,0.7)' }}><BellIcon /></span>
          {unreadCount > 0 && (
            <span className={styles.badge} style={{ background: '#FF6B35' }}>
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        {/* Profile avatar + dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowProfileMenu(s => !s)}
            className={styles.avatarBtn}
            title="Profile"
          >
            {user?.profilePicture
              ? <img src={user.profilePicture} alt={user.name} className={styles.avatarImg} />
              : userInitials
            }
          </button>

          {/* Profile dropdown menu */}
          {showProfileMenu && (
            <>
              {/* Backdrop to close menu */}
              <div onClick={() => setShowProfileMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 250 }} />
              <div className={styles.profileMenu}>
                <button
                  className={styles.menuItem}
                  onClick={() => { onProfileClick(); setShowProfileMenu(false); }}
                  style={{ color: '#fff', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <UserIcon /> View Profile
                </button>
                <button
                  className={`${styles.menuItem} ${styles.menuItemDanger}`}
                  onClick={() => { onLogout(); setShowProfileMenu(false); }}
                >
                  <LogoutIcon /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
