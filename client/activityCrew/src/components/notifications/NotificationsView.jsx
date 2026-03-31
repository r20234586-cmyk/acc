/* ═══════════════════════════════════════════════════════════════════
   NotificationsView — Inbox for activity events.
   Uses SVG icons so all notification type icons are visible on dark.
   ═══════════════════════════════════════════════════════════════════ */
import Avatar from "../ui/Avatar";
import styles from "./NotificationsView.module.css";

/* SVG icon components for notification types */
const JoinIcon     = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const RequestIcon  = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="23" y1="11" x2="17" y2="11"/><line x1="20" y1="8" x2="20" y2="14"/></svg>;
const ChatIcon     = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const ReminderIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
const BackIcon     = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;

const TYPE_META = {
  join:     { Icon: JoinIcon,     color: '#34D399', bg: 'rgba(52,211,153,0.15)' },
  request:  { Icon: RequestIcon,  color: '#60A5FA', bg: 'rgba(96,165,250,0.15)' },
  chat:     { Icon: ChatIcon,     color: '#A78BFA', bg: 'rgba(167,139,250,0.15)' },
  reminder: { Icon: ReminderIcon, color: '#FBBF24', bg: 'rgba(251,191,36,0.15)' },
};

function NotifItem({ notif, onRead }) {
  const meta = TYPE_META[notif.type] || TYPE_META.reminder;
  const Icon = meta.Icon;

  return (
    <div
      onClick={() => onRead(notif.id)}
      className={`${styles.item} ${!notif.read ? styles.itemUnread : ''}`}
    >
      {!notif.read && <div className={styles.unreadDot} />}

      {/* Avatar or icon */}
      <div className={styles.avatarWrap}>
        {notif.avatar
          ? <Avatar initials={notif.avatar} size={42} />
          : <div className={styles.iconWrap} style={{ background: meta.bg }}>
              <span style={{ color: meta.color, display: 'flex' }}><Icon /></span>
            </div>
        }
        {/* Type indicator badge */}
        <div className={styles.typeBadge} style={{ background: meta.color }}>
          <span style={{ color: '#fff', display: 'flex' }}><Icon /></span>
        </div>
      </div>

      <div className={styles.itemContent}>
        <div className={styles.itemText}>
          <strong style={{ color: '#fff', fontWeight: 700 }}>{notif.name}</strong>{' '}
          <span style={{ color: 'rgba(255,255,255,0.55)' }}>{notif.text}</span>
        </div>
        <div className={styles.itemTime}>{notif.time}</div>
      </div>
    </div>
  );
}

export default function NotificationsView({ notifications, unreadCount, onMarkAllRead, onMarkRead, onBack }) {
  const unread = notifications.filter(n => !n.read);
  const read   = notifications.filter(n => n.read);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {onBack && (
            <button onClick={onBack} className={styles.backBtn}><BackIcon /></button>
          )}
          <div>
            <h2 className={styles.title}>Notifications</h2>
            {unreadCount > 0 && (
              <p className={styles.subtitle}>{unreadCount} unread</p>
            )}
          </div>
        </div>
        {unreadCount > 0 && (
          <button onClick={onMarkAllRead} className={styles.markAll}>Mark all read</button>
        )}
      </div>

      <div className={styles.list}>
        {notifications.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🔔</div>
            <p className={styles.emptyText}>No notifications yet</p>
          </div>
        ) : (
          <>
            {unread.length > 0 && (
              <>
                <div className={styles.sectionLabel}>New</div>
                {unread.map(n => <NotifItem key={n.id} notif={n} onRead={onMarkRead} />)}
              </>
            )}
            {read.length > 0 && (
              <>
                <div className={styles.sectionLabel}>Earlier</div>
                {read.map(n => <NotifItem key={n.id} notif={n} onRead={onMarkRead} />)}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
