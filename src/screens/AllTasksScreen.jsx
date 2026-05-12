import React, { useState, useMemo } from 'react';
import TaskItem from '../components/TaskItem.jsx';

const CATEGORIES = ['All', 'Work', 'Personal', 'Health', 'Shopping', 'Other'];
const SORT_OPTIONS = [
  { value: 'date', label: 'By Date' },
  { value: 'priority', label: 'By Priority' },
  { value: 'name', label: 'By Name' },
];

const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 };

const CAT_PILL_COLORS = {
  All:      { active: '#111827', bg: '#111827', light: '#F3F4F6' },
  Work:     { active: '#4F46E5', bg: '#EEF2FF', light: '#F0F0FF' },
  Personal: { active: '#EC4899', bg: '#FDF2F8', light: '#FFF0FA' },
  Health:   { active: '#10B981', bg: '#ECFDF5', light: '#F0FEF9' },
  Shopping: { active: '#F59E0B', bg: '#FFFBEB', light: '#FFFCF0' },
  Other:    { active: '#6B7280', bg: '#F9FAFB', light: '#F9FAFB' },
};

export default function AllTasksScreen({ tasks, toggleDone, deleteTask, openEditModal }) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date');

  const filtered = useMemo(() => {
    let result = [...tasks];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.note && t.note.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (activeCategory !== 'All') {
      result = result.filter(t => t.category === activeCategory);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      if (sortBy === 'priority') {
        return (PRIORITY_ORDER[a.priority] ?? 1) - (PRIORITY_ORDER[b.priority] ?? 1);
      }
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return result;
  }, [tasks, search, activeCategory, sortBy]);

  const pending = filtered.filter(t => !t.done);
  const done = filtered.filter(t => t.done);

  const clearSearch = () => setSearch('');

  return (
    <div style={{ padding: '20px 16px' }}>
      {/* Header */}
      <div style={{ marginBottom: 18 }}>
        <h2 style={{
          margin: 0,
          fontSize: 26,
          fontWeight: 800,
          color: '#111827',
          letterSpacing: '-0.5px',
          fontFamily: 'inherit',
        }}>
          All Tasks
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#9CA3AF', fontFamily: 'inherit' }}>
          {tasks.length} total · {tasks.filter(t => !t.done).length} pending
        </p>
      </div>

      {/* Search bar */}
      <div style={{
        position: 'relative',
        marginBottom: 16,
      }}>
        <div style={{
          position: 'absolute',
          left: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#9CA3AF',
          pointerEvents: 'none',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: '100%',
            padding: '13px 40px 13px 42px',
            fontSize: 15,
            fontFamily: 'inherit',
            fontWeight: 500,
            color: '#111827',
            background: 'white',
            border: '2px solid #E5E7EB',
            borderRadius: 14,
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => e.target.style.borderColor = '#4F46E5'}
          onBlur={e => e.target.style.borderColor = '#E5E7EB'}
        />
        {search && (
          <button
            onClick={clearSearch}
            style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 22,
              height: 22,
              borderRadius: '50%',
              background: '#9CA3AF',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: 14,
              lineHeight: 1,
            }}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>

      {/* Category filter chips */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 14,
          overflowX: 'auto',
          paddingBottom: 4,
        }}
        className="no-scrollbar"
      >
        {CATEGORIES.map(cat => {
          const active = activeCategory === cat;
          const s = CAT_PILL_COLORS[cat] || CAT_PILL_COLORS.Other;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0,
                padding: '7px 14px',
                borderRadius: 999,
                border: `2px solid ${active ? s.active : '#E5E7EB'}`,
                background: active ? s.active : 'white',
                color: active ? 'white' : '#6B7280',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Sort row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 18,
      }}>
        <span style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 500, whiteSpace: 'nowrap', fontFamily: 'inherit' }}>
          Sort:
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              style={{
                padding: '5px 12px',
                borderRadius: 999,
                border: '2px solid ' + (sortBy === opt.value ? '#4F46E5' : '#E5E7EB'),
                background: sortBy === opt.value ? '#EEF2FF' : 'white',
                color: sortBy === opt.value ? '#4F46E5' : '#9CA3AF',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <EmptySearch search={search} category={activeCategory} />
      ) : (
        <>
          {/* Pending section */}
          {pending.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <SectionDivider label={`Pending (${pending.length})`} color="#F97316" />
              {pending.map(task => (
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

          {/* Completed section */}
          {done.length > 0 && (
            <div>
              <SectionDivider label={`Completed (${done.length})`} color="#10B981" />
              {done.map(task => (
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
  );
}

function SectionDivider({ label, color }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      marginBottom: 12,
    }}>
      <span style={{
        fontSize: 12,
        fontWeight: 700,
        color,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        whiteSpace: 'nowrap',
        fontFamily: 'inherit',
      }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: '#E5E7EB' }} />
    </div>
  );
}

function EmptySearch({ search, category }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
      <h3 style={{
        margin: '0 0 8px',
        fontSize: 18,
        fontWeight: 700,
        color: '#111827',
        fontFamily: 'inherit',
      }}>
        No tasks found
      </h3>
      <p style={{
        margin: 0,
        fontSize: 14,
        color: '#9CA3AF',
        lineHeight: 1.6,
        fontFamily: 'inherit',
      }}>
        {search
          ? `No tasks matching "${search}"`
          : `No ${category !== 'All' ? category.toLowerCase() : ''} tasks yet`}
      </p>
    </div>
  );
}
