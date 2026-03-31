/* ═══════════════════════════════════════════════════════════════════
   FeedView — Browse and discover activities.
   Features: category filter, sort (newest/closest/popular/ending soon),
   real activity data from API, join from card.
   ═══════════════════════════════════════════════════════════════════ */
import { useState, useEffect, useRef } from "react";
import FeedHeader from "./FeedHeader";
import ActivityCard from "./ActivityCard";
import styles from "./FeedView.module.css";

const SORT_OPTIONS = ["Newest", "Closest", "Most Popular", "Ending Soon"];
const SortIcon = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="12" y1="18" x2="12" y2="18"/></svg>;
const CheckIcon = () => <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>;
const PlusIcon  = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;

export default function FeedView({ activities, onJoin, onOpen, onCreateClick, joinedIds = new Set() }) {
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy]             = useState("Newest");
  const [showSort, setShowSort]         = useState(false);
  const [isDesktop, setIsDesktop]       = useState(window.innerWidth >= 900);
  const sortRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  /* Close sort dropdown when clicking outside */
  useEffect(() => {
    if (!showSort) return;
    const handler = (e) => { if (sortRef.current && !sortRef.current.contains(e.target)) setShowSort(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showSort]);

  /* Filter by category */
  const filtered = activeFilter === "all"
    ? activities
    : activities.filter(a => a.category === activeFilter);

  /* Sort activities */
  const sorted = [...filtered].sort((a, b) => {
    const aJoined = Array.isArray(a.joined) ? a.joined.length : (a.joined ?? 0);
    const bJoined = Array.isArray(b.joined) ? b.joined.length : (b.joined ?? 0);
    if (sortBy === "Most Popular") return bJoined - aJoined;
    if (sortBy === "Closest")      return parseFloat(a.distance || 99) - parseFloat(b.distance || 99);
    if (sortBy === "Ending Soon")  return (a.max - aJoined) - (b.max - bJoined);
    return 0; // Newest — backend already sorted by createdAt DESC
  });

  return (
    <div className={styles.container}>
      <FeedHeader activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* Sort bar */}
      <div className={styles.sortBar}>
        <span className={styles.sortLabel}>{sorted.length} activities</span>
        <div className={styles.sortDropdown} ref={sortRef}>
          <button onClick={() => setShowSort(s => !s)} className={styles.sortBtn}>
            <SortIcon /> {sortBy} ▾
          </button>
          {showSort && (
            <div className={styles.sortMenu}>
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => { setSortBy(opt); setShowSort(false); }}
                  className={`${styles.sortOption} ${sortBy === opt ? styles.sortOptionActive : ''}`}
                >
                  {sortBy === opt && <CheckIcon />}
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity list */}
      <div className={styles.list}>
        {sorted.length === 0 ? (
          <div className={styles.empty}>No activities found</div>
        ) : sorted.map(activity => (
          <ActivityCard
            key={activity.id}
            activity={activity}
            onJoin={onJoin}
            onOpen={onOpen}
            isJoined={joinedIds.has(activity.id)}
          />
        ))}
      </div>

      {/* FAB — mobile only */}
      {!isDesktop && (
        <button onClick={onCreateClick} className={styles.fab}><PlusIcon /></button>
      )}
    </div>
  );
}
