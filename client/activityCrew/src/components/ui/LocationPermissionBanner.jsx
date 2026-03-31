/**
 * LocationPermissionBanner
 * Shows a friendly prompt explaining WHY location is needed.
 * Best practice: explain value before the browser permission dialog.
 */
export default function LocationPermissionBanner({ status, onDismiss }) {
  if (status !== 'requesting' && status !== 'denied') return null;

  const isDenied = status === 'denied';

  return (
    <div style={{
      margin: '0 0 20px',
      padding: '14px 18px',
      borderRadius: 14,
      background: isDenied ? 'rgba(252,129,129,0.08)' : 'rgba(255,107,53,0.08)',
      border: `1px solid ${isDenied ? 'rgba(252,129,129,0.2)' : 'rgba(255,107,53,0.2)'}`,
      display: 'flex', alignItems: 'flex-start', gap: 12,
    }}>
      <div style={{ fontSize: 22, flexShrink: 0 }}>
        {isDenied ? '📍' : '🧭'}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 13, fontWeight: 700, color: '#fff',
          fontFamily: "'DM Sans', sans-serif", marginBottom: 4,
        }}>
          {isDenied ? 'Location access denied' : 'Requesting your location…'}
        </div>
        <div style={{
          fontSize: 12, color: 'rgba(255,255,255,0.45)',
          fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6,
        }}>
          {isDenied
            ? 'Enable location in your browser settings to see real nearby people and activities. Showing simulated data for now.'
            : 'ActivityCrew uses your location only to show nearby people and events — never shared without your consent.'}
        </div>
      </div>
      {onDismiss && (
        <button onClick={onDismiss} style={{
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)',
          cursor: 'pointer', fontSize: 16, flexShrink: 0, padding: 0,
        }}>✕</button>
      )}
    </div>
  );
}
