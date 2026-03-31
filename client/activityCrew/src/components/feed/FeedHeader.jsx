/* FeedHeader — category filter pills + search bar. SVG search icon. */
import { useState } from "react";
import { CATEGORIES } from "../../data/constants";
import CategoryPill from "../ui/CategoryPill";
import styles from "./FeedHeader.module.css";

const SearchIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>;

export default function FeedHeader({ activeFilter, onFilterChange }) {
  const [search, setSearch] = useState('');
  return (
    <div className={styles.header}>
      <div className={styles.topRow}>
        <div>
          <div className={styles.cityLabel}>📍 Nearby</div>
          <h1 className={styles.title}>Discover</h1>
        </div>
      </div>
      <div className={styles.search}>
        <span className={styles.searchIcon}><SearchIcon /></span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search activities, places..." className={styles.searchInput} />
      </div>
      <div className={styles.filters}>
        {CATEGORIES.map(cat => (
          <CategoryPill key={cat.id} category={cat.id} label={cat.label} emoji={cat.emoji} color={cat.color} active={activeFilter === cat.id} onClick={() => onFilterChange(cat.id)} />
        ))}
      </div>
    </div>
  );
}
