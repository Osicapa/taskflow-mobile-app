import React, { useState, useRef } from 'react';

const CATEGORY_STYLES = {
  Work:     { bg: '#EEF2FF', color: '#4F46E5' },
  Personal: { bg: '#FDF2F8', color: '#EC4899' },
  Health:   { bg: '#ECFDF5', color: '#10B981' },
  Shopping: { bg: '#FFFBEB', color: '#F59E0B' },
  Other:    { bg: '#F9FAFB', color: '#6B7280' },
};

const PRIORITY_STYLES = {
  High:   { bg: '#FEF2F2', color: '#EF4444', label: '↑ High' },
  Medium: { bg: '#FFF7ED', color: '#F97316', label: '→ Med' },
  Low:    { bg: '#EFF6FF', color: '#3B82F6', label: '↓ Low' },
};

function formatDueDate(dateStr) {
  if (!dateStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + 'T00:00:00');
  const diff = Math.round((due - today) / 86400000);
  if (diff < 0) return { label: 'Overdue', color: '#EF4444' };
  if (diff === 0) return { label: 'Today', color: '#F97316' };
  if (diff === 1) return { label: 'Tomorrow', color: '#4F46E5' };
  return { label: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), color: '#6B7280' };
}

export default function TaskItem({ task, onToggle, onDelete, onEdit }) {
  const [swipeX, setSwipeX] = useState(0);
  const [swiping, setSwiping] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const isScrolling = useRef(false);

  const catStyle = CATEGORY_STYLES[task.category] || CATEGORY_STYLES.Other;
  const priStyle = PRIORITY_STYLES[task.priority] || PRIORITY_STYLES.Medium;
  const dueInfo = formatDueDate(task.dueDate);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    isScrolling.current = false;
    setSwiping(true);
  };

  const handleTouchMove = (e) => {
    if (!touchStartX.current) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;

    if (!isScrolling.current && Math.abs(dy) > Math.abs(dx)) {
      isScrolling.current = true;
    }
    if (isScrolling.current) return;

    if (dx > 0 && dx < 100) {
      setSwipeX(dx);
      if (e.cancelable) e.preventDefault();
    }
  };

  const handleTouchEnd = () => {
    setSwiping(false);
    if (swipeX > 60) {
      handleDelete();
    } else {
      setSwipeX(0);
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  const handleDelete = () => {
    setDeleting(true);
    setTimeout(() => onDelete(task.id), 300);
  };

  if (deleting) return null;

  const SWIPE_THRESHOLD = 60;
  const showDeleteHint = swipeX > 20;

  return (
    <div style={{ position: 'relative', marginBottom: 10, overflow: 'hidden', borderRadius: 14 }}>
      {/* Delete background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, #EF4444, #DC2626)',
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 20,
        opacity: showDeleteHint ? 1 : 0,
        transition: 'opacity 0.2s ease',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"/>
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
          <path d="M10 11v6M14 11v6"/>
          <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
        </svg>
        <span style={{ color: 'white', fontSize: 12, fontWeight: 600, marginLeft: 8 }}>Delete</span>
      </div>

      {/* Task card */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          background: 'white',
          borderRadius: 14,
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)',
          transform: `translateX(${swipeX}px)`,
          transition: swiping ? 'none' : 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1), opacity 0.3s ease',
          opacity: deleting ? 0 : 1,
          cursor: 'pointer',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
        onClick={(e) => {
          if (e.target.closest('button')) return;
          onToggle(task.id);
        }}
      >
        {/* Checkbox */}
        <div style={{ paddingTop: 2, flexShrink: 0 }}>
          <input
            type="checkbox"
            className="task-checkbox"
            checked={task.done}
            onChange={() => onToggle(task.id)}
            onClick={(e) => e.stopPropagation()}
            aria-label={`Mark "${task.title}" as ${task.done ? 'pending' : 'done'}`}
          />
        </div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            margin: 0,
            fontSize: 15,
            fontWeight: 600,
            color: task.done ? '#9CA3AF' : '#111827',
            textDecoration: task.done ? 'line-through' : 'none',
            lineHeight: 1.4,
            wordBreak: 'break-word',
            transition: 'color 0.2s ease',
          }}>
            {task.title}
          </p>
          {task.note && (
            <p style={{
              margin: '3px 0 0',
              fontSize: 13,
              color: task.done ? '#C4C4C4' : '#9CA3AF',
              lineHeight: 1.4,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}>
              {task.note}
            </p>
          )}

          {/* Tags row */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            marginTop: 8,
            flexWrap: 'wrap',
          }}>
            {/* Category */}
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 999,
              background: catStyle.bg,
              color: catStyle.color,
              letterSpacing: '0.02em',
            }}>
              {task.category}
            </span>

            {/* Priority */}
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              padding: '2px 8px',
              borderRadius: 999,
              background: priStyle.bg,
              color: priStyle.color,
              letterSpacing: '0.02em',
            }}>
              {priStyle.label}
            </span>

            {/* Due date */}
            {dueInfo && (
              <span style={{
                fontSize: 11,
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 999,
                background: '#F9FAFB',
                color: dueInfo.color,
                letterSpacing: '0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: 3,
              }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {dueInfo.label}
              </span>
            )}
          </div>
        </div>

        {/* Edit button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(task);
          }}
          style={{
            flexShrink: 0,
            width: 32,
            height: 32,
            borderRadius: 8,
            background: '#F9FAFB',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9CA3AF',
            transition: 'all 0.15s ease',
          }}
          aria-label={`Edit "${task.title}"`}
          onMouseEnter={e => { e.currentTarget.style.background = '#EEF2FF'; e.currentTarget.style.color = '#4F46E5'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#F9FAFB'; e.currentTarget.style.color = '#9CA3AF'; }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
