/* ═══════════════════════════════════════════════════════════════════
   ActivityDetail — Full activity view shown in the slide panel.
   Features: hero image/video, info grid, participants, join/chat actions.
   Correctly reads backend array for joined count.
   ═══════════════════════════════════════════════════════════════════ */
import { useState } from "react";
import { CATEGORIES } from "../../data/constants";
import UserAvatar from "../ui/UserAvatar";
import BackButton from "../ui/BackButton";
import ProgressBar from "../ui/ProgressBar";
import ActivityInfoGrid from "./ActivityInfoGrid";
import styles from "./ActivityDetail.module.css";

/* SVG icons */
const ChatIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
const HeartIcon  = ({ filled }) => <svg width="15" height="15" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>;
const CheckIcon  = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;

export default function ActivityDetail({ activity, onBack, onChat, onJoin, isJoined = false }) {
  const [likes, setLikes] = useState({});
  const category = CATEGORIES.find((c) => c.id === activity.category);

  /* Compute counts from backend array or mock number */
  const joinedCount = Array.isArray(activity.joined)
    ? activity.joined.length
    : (activity.joined ?? 0);
  const isFull = joinedCount >= activity.max;

  const handleJoin = () => {
    if (!isJoined && !isFull) onJoin && onJoin(activity);
  };

  const toggleLike = (key) => setLikes(l => ({ ...l, [key]: !l[key] }));

  /* Build display-friendly host name */
  const hostName = activity.host?.name || activity.host || 'Unknown';

  return (
    <div className={styles.container}>
      {/* ── Hero section: video > image > gradient fallback ── */}
      {activity.coverImage || activity.coverVideo ? (
        <div className={styles.hero}>
          {activity.coverVideo
            ? <video src={activity.coverVideo} autoPlay muted loop playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <img src={activity.coverImage} alt={activity.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          }
          <div className={styles.heroOverlay} />
          <div className={styles.heroBack}><BackButton onBack={onBack} style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }} /></div>
          <div className={styles.heroContent}>
            <span className={styles.categoryBadge} style={{ color: activity.color, background: 'rgba(0,0,0,0.5)', border: `1px solid ${activity.color}44` }}>
              {category?.emoji} {activity.category}
            </span>
            <h1 className={styles.heroTitle}>{activity.title}</h1>
            <div className={styles.hostRow}>
              <UserAvatar initials={activity.hostAvatar || 'HO'} size={24} />
              <span className={styles.hostName}>by <strong style={{ color: '#fff' }}>{hostName}</strong></span>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.heroGradient} style={{ background: `linear-gradient(160deg, ${activity.color}33 0%, #0d0d12 60%)` }}>
          <BackButton onBack={onBack} style={{ marginBottom: 20 }} />
          <span className={styles.categoryBadge} style={{ color: activity.color, background: `${activity.color}18` }}>
            {category?.emoji} {activity.category}
          </span>
          <h1 className={styles.heroTitle}>{activity.title}</h1>
          <div className={styles.hostRow}>
            <UserAvatar initials={activity.hostAvatar || 'HO'} size={28} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans', sans-serif" }}>
              Hosted by <strong style={{ color: 'rgba(255,255,255,0.8)' }}>{hostName}</strong>
            </span>
          </div>
        </div>
      )}

      <div className={styles.body}>
        {/* Info grid: time, location, capacity */}
        <ActivityInfoGrid activity={activity} count={joinedCount} />

        {/* Media gallery */}
        {activity.media?.length > 0 && (
          <div className={styles.section}>
            <div className={styles.sectionTitle}>Media ({activity.media.length})</div>
            <div className={styles.mediaGrid}>
              {activity.media.map((m, i) => (
                <div key={i} className={styles.mediaItem} style={{ border: i === 0 ? `2px solid ${activity.color}` : '2px solid transparent' }}>
                  {m.type === 'video'
                    ? <video src={m.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <img src={m.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  }
                  {i === 0 && <div style={{ position: 'absolute', bottom: 5, left: 5, background: activity.color, color: '#fff', fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 20, fontFamily: "'DM Sans', sans-serif" }}>COVER</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description */}
        <div className={styles.section}>
          <div className={styles.sectionTitle}>About</div>
          <p className={styles.description}>{activity.description}</p>
        </div>

        {/* Tags */}
        {activity.tags?.length > 0 && (
          <div className={styles.tags}>
            {activity.tags.map(tag => (
              <span key={tag} className={styles.tag} style={{ color: activity.color, background: `${activity.color}15`, border: `1px solid ${activity.color}30` }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Participants list */}
        <div className={styles.section}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div className={styles.sectionTitle}>Participants</div>
            {isJoined && <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Sans', sans-serif" }}>♥ like people you'd activity with again</span>}
          </div>
          {(activity.attendees || []).map((initials, i) => {
            const isMe = initials === 'ME';
            const liked = likes[initials];
            return (
              <div key={i} className={styles.participant} style={{ border: liked ? `1px solid ${activity.color}44` : '1px solid rgba(255,255,255,0.06)' }}>
                <UserAvatar initials={initials} size={36} />
                <div style={{ flex: 1 }}>
                  <div className={styles.participantName}>{isMe ? 'You' : initials}</div>
                  {liked && <div style={{ fontSize: 10, color: activity.color, fontFamily: "'DM Sans', sans-serif", marginTop: 2 }}>♥ liked</div>}
                </div>
                {isJoined && !isMe && (
                  <button
                    onClick={() => toggleLike(initials)}
                    className={styles.likeBtn}
                    style={{
                      background: liked ? `${activity.color}22` : 'rgba(255,255,255,0.06)',
                      color: liked ? activity.color : 'rgba(255,255,255,0.3)',
                    }}
                    title={liked ? 'Unlike' : 'Like'}
                  >
                    <HeartIcon filled={liked} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div style={{ marginBottom: 20 }}>
          <ProgressBar value={joinedCount} max={activity.max} color={activity.color} showLabels />
        </div>

        {/* Action buttons */}
        <div className={styles.actions}>
          <button
            onClick={handleJoin}
            className={styles.joinBtn}
            style={{
              border:      isJoined ? `1px solid ${activity.color}44` : 'none',
              cursor:      isJoined || isFull ? 'default' : 'pointer',
              background:  isJoined ? `${activity.color}22` : isFull ? 'rgba(255,255,255,0.06)' : `linear-gradient(135deg, ${activity.color}, ${activity.color}cc)`,
              color:       isJoined ? activity.color : isFull ? 'rgba(255,255,255,0.3)' : '#fff',
            }}
          >
            {isFull ? 'Activity Full' : isJoined ? <><CheckIcon /> Joined</> : 'Join Activity'}
          </button>
          <button onClick={onChat} className={styles.chatBtn} title="Open group chat">
            <ChatIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
