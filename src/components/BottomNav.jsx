import React from 'react';

const tabs = [
  {
    key: 'home',
    label: 'Home',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? '#4F46E5' : 'none'} stroke={active ? '#4F46E5' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    key: 'all',
    label: 'Tasks',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#4F46E5' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6"/>
        <line x1="8" y1="12" x2="21" y2="12"/>
        <line x1="8" y1="18" x2="21" y2="18"/>
        <line x1="3" y1="6" x2="3.01" y2="6"/>
        <line x1="3" y1="12" x2="3.01" y2="12"/>
        <line x1="3" y1="18" x2="3.01" y2="18"/>
      </svg>
    ),
  },
  {
    key: 'stats',
    label: 'Stats',
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={active ? '#4F46E5' : '#9CA3AF'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/>
        <line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
];

export default function BottomNav({ activeScreen, setActiveScreen }) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid #E5E7EB',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '8px 0 max(8px, env(safe-area-inset-bottom))',
      zIndex: 40,
    }}>
      {tabs.map((tab) => {
        const active = activeScreen === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => setActiveScreen(tab.key)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '3px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px 20px',
              borderRadius: 12,
              minWidth: 64,
              transition: 'all 0.2s ease',
            }}
            aria-label={tab.label}
          >
            <div style={{ position: 'relative' }}>
              {tab.icon(active)}
              {active && (
                <div style={{
                  position: 'absolute',
                  bottom: -6,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: '#4F46E5',
                }} />
              )}
            </div>
            <span style={{
              fontSize: 10,
              fontWeight: active ? 700 : 500,
              color: active ? '#4F46E5' : '#9CA3AF',
              letterSpacing: '0.02em',
              fontFamily: 'inherit',
            }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
