/* BackButton — SVG chevron back arrow, visible on all dark backgrounds */
import styles from "./BackButton.module.css";

const BackArrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

export default function BackButton({ onBack, style = {} }) {
  return (
    <button onClick={onBack} className={styles.btn} style={style} aria-label="Go back">
      <BackArrow />
    </button>
  );
}
