export default function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer circle */}
      <circle cx="20" cy="20" r="19" fill="url(#logoGrad)" />
      {/* People / crew dots */}
      <circle cx="20" cy="13" r="4" fill="white" opacity="0.95" />
      <circle cx="12" cy="26" r="3.2" fill="white" opacity="0.8" />
      <circle cx="28" cy="26" r="3.2" fill="white" opacity="0.8" />
      {/* Connection lines */}
      <line x1="20" y1="17" x2="12" y2="23" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
      <line x1="20" y1="17" x2="28" y2="23" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
      <line x1="15.2" y1="26" x2="24.8" y2="26" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" />
      {/* Lightning bolt accent */}
      <path d="M22 8 L18 15 L21 15 L17 22 L23 14 L20 14 Z" fill="#FF6B35" />
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1a1a2e" />
          <stop offset="100%" stopColor="#16213e" />
        </linearGradient>
      </defs>
    </svg>
  );
}
