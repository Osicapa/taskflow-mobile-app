import React, { useMemo } from 'react';

const CATEGORY_COLORS = {
  Work:     '#4F46E5',
  Personal: '#EC4899',
  Health:   '#10B981',
  Shopping: '#F59E0B',
  Other:    '#6B7280',
};

function calcStreak(tasks) {
  if (tasks.length === 0) return 0;
  const doneTasks = tasks.filter(t => t.done);
  if (doneTasks.length === 0) return 0;

  const doneDays = new Set(
    doneTasks.map(t => t.createdAt.split('T')[0])
  );

  const today = new Date();
  let streak = 0;
  let current = new Date(today);

  for (let i = 0; i < 365; i++) {
    const dateStr = current.toISOString().split('T')[0];
    if (doneDays.has(dateStr)) {
      streak++;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export default function StatsScreen({ tasks }) {
  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    const pending = total - done;
    const rate = total > 0 ? Math.round((done / total) * 100) : 0;
    const streak = calcStreak(tasks);

    const byCat = {};
    CATEGORY_COLORS && Object.keys(CATEGORY_COLORS).forEach(cat => {
      const count = tasks.filter(t => t.category === cat).length;
      byCat[cat] = count;
    });
    const maxCat = Math.max(1, ...Object.values(byCat));

    return { total, done, pending, rate, streak, byCat, maxCat };
  }, [tasks]);

  // SVG donut
  const r = 54;
  const cx = 70;
  const cy = 70;
  const circumference = 2 * Math.PI * r;
  const dashOffset = circumference - (circumference * stats.rate) / 100;

  return (
    <div style={{ padding: '20px 16px' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          margin: 0,
          fontSize: 26,
          fontWeight: 800,
          color: '#111827',
          letterSpacing: '-0.5px',
          fontFamily: 'inherit',
        }}>
          📊 Your Stats
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#9CA3AF', fontFamily: 'inherit' }}>
          Track your productivity journey
        </p>
      </div>

      {/* Completion rate card */}
      <div style={{
        background: 'white',
        borderRadius: 20,
        padding: '24px',
        marginBottom: 16,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
      }}>
        {/* Donut */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            {/* Background circle */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="#F3F4F6"
              strokeWidth="14"
            />
            {/* Progress circle */}
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="url(#progressGrad)"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="donut-ring"
              style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
            />
            <defs>
              <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
            {/* Center text */}
            <text x={cx} y={cy - 6} textAnchor="middle" fontSize="22" fontWeight="800" fill="#111827" fontFamily="inherit">
              {stats.rate}%
            </text>
            <text x={cx} y={cy + 14} textAnchor="middle" fontSize="11" fontWeight="600" fill="#9CA3AF" fontFamily="inherit">
              done
            </text>
          </svg>
        </div>

        {/* Right side stats */}
        <div style={{ flex: 1 }}>
          <p style={{ margin: '0 0 4px', fontSize: 14, color: '#6B7280', fontWeight: 500, fontFamily: 'inherit' }}>Completion Rate</p>
          <p style={{ margin: '0 0 16px', fontSize: 28, fontWeight: 800, color: '#111827', letterSpacing: '-0.5px', fontFamily: 'inherit' }}>
            {stats.rate}%
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Stat label="Total" value={stats.total} color="#4F46E5" />
            <Stat label="Done" value={stats.done} color="#10B981" />
            <Stat label="Pending" value={stats.pending} color="#F97316" />
          </div>
        </div>
      </div>

      {/* Quick stats row */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <QuickStatCard
          emoji="🔥"
          label="Day Streak"
          value={stats.streak}
          color="#F97316"
          bg="#FFF7ED"
        />
        <QuickStatCard
          emoji="✅"
          label="Completed"
          value={stats.done}
          color="#10B981"
          bg="#ECFDF5"
        />
        <QuickStatCard
          emoji="⏳"
          label="Pending"
          value={stats.pending}
          color="#4F46E5"
          bg="#EEF2FF"
        />
      </div>

      {/* Category breakdown */}
      <div style={{
        background: 'white',
        borderRadius: 20,
        padding: '20px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        marginBottom: 16,
      }}>
        <h3 style={{
          margin: '0 0 16px',
          fontSize: 16,
          fontWeight: 700,
          color: '#111827',
          fontFamily: 'inherit',
        }}>
          Tasks by Category
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {Object.entries(stats.byCat).map(([cat, count]) => (
            <div key={cat}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 5,
              }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: '#374151', fontFamily: 'inherit' }}>
                  {cat}
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: CATEGORY_COLORS[cat], fontFamily: 'inherit' }}>
                  {count}
                </span>
              </div>
              <div style={{
                height: 8,
                background: '#F3F4F6',
                borderRadius: 999,
                overflow: 'hidden',
              }}>
                <div
                  className="progress-fill"
                  style={{
                    height: '100%',
                    width: `${stats.maxCat > 0 ? (count / stats.maxCat) * 100 : 0}%`,
                    background: CATEGORY_COLORS[cat],
                    borderRadius: 999,
                    minWidth: count > 0 ? 8 : 0,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational footer */}
      <div style={{
        background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
        borderRadius: 20,
        padding: '20px',
        textAlign: 'center',
        color: 'white',
        marginBottom: 8,
      }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>
          {stats.rate === 100 ? '🏆' : stats.rate >= 70 ? '🚀' : stats.rate >= 40 ? '💪' : '🌱'}
        </div>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 700, fontFamily: 'inherit' }}>
          {stats.rate === 100 ? 'Perfect score! Amazing work!' :
           stats.rate >= 70 ? "You're on a roll! Keep going!" :
           stats.rate >= 40 ? 'Good progress! Push a bit more!' :
           'Every task counts. Start small!'}
        </p>
        {stats.streak > 0 && (
          <p style={{ margin: '6px 0 0', fontSize: 13, opacity: 0.8, fontFamily: 'inherit' }}>
            🔥 {stats.streak}-day streak — don't break it!
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontSize: 13, color: '#6B7280', flex: 1, fontFamily: 'inherit' }}>{label}</span>
      <span style={{ fontSize: 14, fontWeight: 700, color: '#111827', fontFamily: 'inherit' }}>{value}</span>
    </div>
  );
}

function QuickStatCard({ emoji, label, value, color, bg }) {
  return (
    <div style={{
      flex: 1,
      background: bg,
      borderRadius: 16,
      padding: '14px 12px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 22, marginBottom: 4 }}>{emoji}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color, marginBottom: 2, fontFamily: 'inherit' }}>{value}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: '#9CA3AF', fontFamily: 'inherit' }}>{label}</div>
    </div>
  );
}
