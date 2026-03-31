/* ═══════════════════════════════════════════════════════════════════
   ActivityCard — Feed card for a single activity.
   Shows: category, title, join button, time, location,
   attendee avatars, and a capacity progress bar.
   SVG icons replace invisible unicode characters.
   ═══════════════════════════════════════════════════════════════════ */
import { CATEGORIES } from "../../data/constants";
import AvatarStack from "../ui/AvatarStack";
import ProgressBar from "../ui/ProgressBar";
import styles from "./ActivityCard.module.css";

/* Lucide-style SVG icons — visible on dark backgrounds */
const ClockIcon    = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
const LocationIcon = () => <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const CheckIcon    = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;

export default function ActivityCard({ activity, onJoin, onOpen, isJoined = false }) {
  const isFull   = (activity.joined?.length ?? activity.joined ?? 0) >= activity.max;
  const category = CATEGORIES.find(c => c.id === activity.category);

  /* joined count: backend returns array, mock data returns number */
  const joinedCount = Array.isArray(activity.joined)
    ? activity.joined.length
    : (activity.joined ?? 0);

  const handleJoin = (e) => {
    e.stopPropagation();
    if (!isJoined && !isFull) onJoin && onJoin(activity);
  };

  return (
    <div className={styles.card} onClick={() => onOpen(activity)}>
      {/* Top colour accent bar */}
      <div className={styles.colorBar} style={{ background: `linear-gradient(90deg, ${activity.color}, ${activity.color}44)` }} />

      <div className={styles.body}>
        {/* Category pill + distance */}
        <div className={styles.topRow}>
          <span
            className={styles.categoryPill}
            style={{ color: activity.color, background: `${activity.color}18` }}
          >
            {category?.emoji} {activity.category}
          </span>
          {activity.distance && (
            <span className={styles.distance}>{activity.distance}</span>
          )}
        </div>

        {/* Title + Join button */}
        <div className={styles.titleRow}>
          <h3 className={styles.title}>{activity.title}</h3>
          <button
            onClick={handleJoin}
            className={styles.joinBtn}
            style={{
              border:      isJoined ? `1px solid ${activity.color}44` : 'none',
              cursor:      isJoined || isFull ? 'default' : 'pointer',
              background:  isJoined ? `${activity.color}22` : isFull ? 'rgba(255,255,255,0.06)' : activity.color,
              color:       isJoined ? activity.color : isFull ? 'rgba(255,255,255,0.3)' : '#fff',
            }}
          >
            {isJoined ? <><CheckIcon /> Joined</> : isFull ? 'Full' : 'Join'}
          </button>
        </div>

        {/* Description preview */}
        <p className={styles.description}>{activity.description}</p>

        {/* Time + Location */}
        <div className={styles.meta}>
          <span className={styles.metaItem}>
            <span className={styles.metaIcon} style={{ color: activity.color }}><ClockIcon /></span>
            {activity.time}
          </span>
          <span className={styles.metaItem}>
            <span className={styles.metaIcon} style={{ color: activity.color }}><LocationIcon /></span>
            {activity.location}
          </span>
        </div>

        {/* Avatars + capacity */}
        <div className={styles.bottom}>
          <div className={styles.bottomRow}>
            <AvatarStack attendees={activity.attendees || []} />
            <span className={styles.joinCount}>{joinedCount}/{activity.max} joined</span>
          </div>
          <ProgressBar value={joinedCount} max={activity.max} color={activity.color} />
        </div>
      </div>
    </div>
  );
}
