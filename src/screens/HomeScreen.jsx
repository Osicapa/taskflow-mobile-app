import React, { useMemo } from 'react';
import TaskItem from '../components/TaskItem.jsx';

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function EmptyState() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      {/* SVG illustration */}
      <svg width="140" height="120" viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="20" width="100" height="80" rx="12" fill="#EEF2FF"/>
        <rect x="34" y="38" width="52" height="8" rx="4" fill="#C7D2FE"/>
        <rect x="34" y="54" width="40" height="8" rx="4" fill="#C7D2FE"/>
        <rect x="34" y="70" width="48" height="8" rx="4" fill="#C7D2FE"/>
        <circle cx="104" cy="40" r="20" fill="#4F46E5" opacity="0.15"/>
        <circle cx="104" cy="40" r="12" fill="#4F46E5"/>
        <path d="M98 40l4 4 8-8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {/* Stars */}
        <circle cx="30" cy="15" r="3" fill="#FCD34D"/>
        <circle cx="118" cy="90" r="2" fill="#A78BFA"/>
        <circle cx="15" cy="80" r="2" fill="#34D399"/>
      </svg>

      <h3 style={{
        margin: '20px 0 8px',
        fontSize: 18,
        fontWeight: 700,
        color: '#111827',
        fontFamily: 'inherit',
      }}>
        No tasks for today!
      </h3>
      <p style={{
        margin: 0,
        fontSize: 14,
        color: '#9CA3AF',
        maxWidth: 220,
        lineHeight: 1.6,
        fontFamily: 'inherit',
      }}>
        Tap the <strong style={{ color: '#4F46E5' }}>+</strong> button below to add your first task 🚀
      </p>
    </div>
  );
}

export default function HomeScreen({ tasks, toggleDone, deleteTask, openEditModal }) {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const dayName = DAYS[today.getDay()];
  const dateLabel = `${MONTHS[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;
  const greeting = getGreeting();

  const todayTasks = useMemo(() => {
    return tasks.filter(t => !t.dueDate || t.dueDate === todayStr);
  }, [tasks, todayStr]);

  const overdueTasks = useMemo(() => {
    return tasks.filter(t => t.dueDate && t.dueDate < todayStr && !t.done);
  }, [tasks, todayStr]);

  const totalCount = tasks.length;
  const doneCount = tasks.filter(t => t.done).length;
  const pendingCount = totalCount - doneCount;

  const pendingToday = todayTasks.filter(t => !t.done);
  const doneToday = todayTasks.filter(t => t.done);

  return (
    <div style={{ padding: '20px 16px' }}>
      {/* Greeting */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 800,
          color: '#111827',
          letterSpacing: '-0.4px',
          fontFamily: 'inherit',
        }}>
          {greeting}, {dayName}! 👋
        </h1>
        <p style={{
          margin: '4px 0 0',
          fontSize: 14,
          color: '#9CA3AF',
          fontWeight: 500,
          fontFamily: 'inherit',
        }}>
          {dateLabel}
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: 'flex',
          gap: 10,
          marginBottom: 24,
          overflowX: 'auto',
          paddingBottom: 4,
        }}
        className="no-scrollbar"
      >
        <StatCard label="Total" value={totalCount} color="#4F46E5" bg="#EEF2FF" emoji="📋" />
        <StatCard label="Done" value={doneCount} color="#10B981" bg="#ECFDF5" emoji="✅" />
        <StatCard label="Pending" value={pendingCount} color="#F97316" bg="#FFF7ED" emoji="⏳" />
        {overdueTasks.length > 0 && (
          <StatCard label="Overdue" value={overdueTasks.length} color="#EF4444" bg="#FEF2F2" emoji="⚠️" />
        )}
      </div>

      {/* Overdue section */}
      {overdueTasks.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 12,
            padding: '10px 14px',
            background: '#FEF2F2',
            borderRadius: 12,
            border: '1px solid #FECACA',
          }}>
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#EF4444', fontFamily: 'inherit' }}>
              {overdueTasks.length} overdue task{overdueTasks.length !== 1 ? 's' : ''}
            </span>
          </div>
          {overdueTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={toggleDone}
              onDelete={deleteTask}
              onEdit={openEditModal}
            />
          ))}
        </div>
      )}

      {/* Today's tasks */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 14,
        }}>
          <h2 style={{
            margin: 0,
            fontSize: 18,
            fontWeight: 700,
            color: '#111827',
            letterSpacing: '-0.3px',
            fontFamily: 'inherit',
          }}>
            Today's Tasks
          </h2>
          {todayTasks.length > 0 && (
            <span style={{
              fontSize: 12,
              fontWeight: 700,
              color: '#4F46E5',
              background: '#EEF2FF',
              padding: '3px 10px',
              borderRadius: 999,
              fontFamily: 'inherit',
            }}>
              {doneToday.length}/{todayTasks.length}
            </span>
          )}
        </div>

        {/* Progress bar */}
        {todayTasks.length > 0 && (
          <div style={{
            height: 4,
            background: '#F3F4F6',
            borderRadius: 999,
            marginBottom: 16,
            overflow: 'hidden',
          }}>
            <div
              className="progress-fill"
              style={{
                height: '100%',
                width: `${todayTasks.length > 0 ? (doneToday.length / todayTasks.length) * 100 : 0}%`,
                background: 'linear-gradient(90deg, #4F46E5, #10B981)',
                borderRadius: 999,
              }}
            />
          </div>
        )}

        {todayTasks.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            {/* Pending tasks */}
            {pendingToday.length > 0 && (
              <div style={{ marginBottom: 16 }}>
                {pendingToday.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleDone}
                    onDelete={deleteTask}
                    onEdit={openEditModal}
                  />
                ))}
              </div>
            )}

            {/* Completed tasks */}
            {doneToday.length > 0 && (
              <div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 12,
                }}>
                  <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#9CA3AF',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontFamily: 'inherit',
                  }}>
                    Completed ({doneToday.length})
                  </span>
                  <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
                </div>
                {doneToday.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onToggle={toggleDone}
                    onDelete={deleteTask}
                    onEdit={openEditModal}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color, bg, emoji }) {
  return (
    <div
      className="stat-card"
      style={{
        background: 'white',
        borderRadius: 16,
        padding: '14px 16px',
        flexShrink: 0,
        minWidth: 90,
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        textAlign: 'center',
        border: '1px solid #F3F4F6',
      }}
    >
      <div style={{ fontSize: 20, marginBottom: 4 }}>{emoji}</div>
      <div style={{
        fontSize: 26,
        fontWeight: 800,
        color,
        lineHeight: 1,
        marginBottom: 3,
        fontFamily: 'inherit',
      }}>
        {value}
      </div>
      <div style={{
        fontSize: 11,
        fontWeight: 600,
        color: '#9CA3AF',
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        fontFamily: 'inherit',
      }}>
        {label}
      </div>
    </div>
  );
}
