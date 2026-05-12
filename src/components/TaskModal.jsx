import React, { useState, useEffect, useRef } from 'react';

const CATEGORIES = ['Work', 'Personal', 'Health', 'Shopping', 'Other'];
const PRIORITIES = ['High', 'Medium', 'Low'];

const CAT_COLORS = {
  Work:     { bg: '#EEF2FF', active: '#4F46E5', color: '#4F46E5' },
  Personal: { bg: '#FDF2F8', active: '#EC4899', color: '#EC4899' },
  Health:   { bg: '#ECFDF5', active: '#10B981', color: '#10B981' },
  Shopping: { bg: '#FFFBEB', active: '#F59E0B', color: '#F59E0B' },
  Other:    { bg: '#F3F4F6', active: '#6B7280', color: '#6B7280' },
};

const PRI_COLORS = {
  High:   { bg: '#FEF2F2', active: '#EF4444', color: '#EF4444' },
  Medium: { bg: '#FFF7ED', active: '#F97316', color: '#F97316' },
  Low:    { bg: '#EFF6FF', active: '#3B82F6', color: '#3B82F6' },
};

export default function TaskModal({ task, onSave, onClose }) {
  const isEdit = !!task;
  const titleRef = useRef(null);
  const [closing, setClosing] = useState(false);

  const [form, setForm] = useState({
    title: task?.title || '',
    note: task?.note || '',
    category: task?.category || 'Work',
    priority: task?.priority || 'Medium',
    dueDate: task?.dueDate || '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      titleRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setClosing(true);
    setTimeout(onClose, 250);
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Task title is required';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSave(form);
  };

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div
      className="sheet-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
      }}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className={closing ? 'sheet-exit' : 'sheet-content'}
        style={{
          width: '100%',
          maxWidth: '430px',
          background: 'white',
          borderRadius: '24px 24px 0 0',
          maxHeight: '92dvh',
          overflowY: 'auto',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
        }}
      >
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 4px' }}>
          <div style={{ width: 36, height: 4, background: '#E5E7EB', borderRadius: 999 }} />
        </div>

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 20px 16px',
        }}>
          <h2 style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 800,
            color: '#111827',
            letterSpacing: '-0.3px',
            fontFamily: 'inherit',
          }}>
            {isEdit ? '✏️ Edit Task' : '✨ New Task'}
          </h2>
          <button
            onClick={handleClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: '#F3F4F6',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
              fontSize: 18,
              lineHeight: 1,
            }}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '0 20px 8px' }}>
          {/* Title */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              Task Title <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              ref={titleRef}
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="What needs to be done?"
              style={{
                width: '100%',
                padding: '13px 16px',
                fontSize: 16,
                fontFamily: 'inherit',
                fontWeight: 500,
                color: '#111827',
                background: '#F9FAFB',
                border: `2px solid ${errors.title ? '#EF4444' : '#E5E7EB'}`,
                borderRadius: 12,
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={e => { if (!errors.title) e.target.style.borderColor = '#4F46E5'; }}
              onBlur={e => { if (!errors.title) e.target.style.borderColor = '#E5E7EB'; }}
            />
            {errors.title && (
              <p style={{ margin: '6px 0 0', fontSize: 12, color: '#EF4444', fontWeight: 500 }}>
                ⚠ {errors.title}
              </p>
            )}
          </div>

          {/* Note */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              Note <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span>
            </label>
            <textarea
              value={form.note}
              onChange={e => set('note', e.target.value)}
              placeholder="Add a note or description..."
              rows={3}
              style={{
                width: '100%',
                padding: '13px 16px',
                fontSize: 14,
                fontFamily: 'inherit',
                color: '#111827',
                background: '#F9FAFB',
                border: '2px solid #E5E7EB',
                borderRadius: 12,
                outline: 'none',
                resize: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
                lineHeight: 1.5,
              }}
              onFocus={e => e.target.style.borderColor = '#4F46E5'}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          {/* Category */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10 }}>
              Category
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {CATEGORIES.map(cat => {
                const s = CAT_COLORS[cat];
                const active = form.category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => set('category', cat)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: 999,
                      border: `2px solid ${active ? s.active : '#E5E7EB'}`,
                      background: active ? s.bg : 'white',
                      color: active ? s.color : '#6B7280',
                      fontSize: 13,
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      fontFamily: 'inherit',
                    }}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 10 }}>
              Priority
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              {PRIORITIES.map(pri => {
                const s = PRI_COLORS[pri];
                const active = form.priority === pri;
                return (
                  <button
                    key={pri}
                    type="button"
                    onClick={() => set('priority', pri)}
                    style={{
                      flex: 1,
                      padding: '10px 8px',
                      borderRadius: 12,
                      border: `2px solid ${active ? s.active : '#E5E7EB'}`,
                      background: active ? s.bg : 'white',
                      color: active ? s.color : '#6B7280',
                      fontSize: 13,
                      fontWeight: active ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      fontFamily: 'inherit',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 2,
                    }}
                  >
                    <span style={{ fontSize: 16 }}>
                      {pri === 'High' ? '🔴' : pri === 'Medium' ? '🟠' : '🔵'}
                    </span>
                    <span>{pri}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Due Date */}
          <div style={{ marginBottom: 28 }}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 6 }}>
              Due Date <span style={{ color: '#9CA3AF', fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              type="date"
              value={form.dueDate}
              onChange={e => set('dueDate', e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              style={{
                width: '100%',
                padding: '13px 16px',
                fontSize: 15,
                fontFamily: 'inherit',
                color: form.dueDate ? '#111827' : '#9CA3AF',
                background: '#F9FAFB',
                border: '2px solid #E5E7EB',
                borderRadius: 12,
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.borderColor = '#4F46E5'}
              onBlur={e => e.target.style.borderColor = '#E5E7EB'}
            />
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              type="button"
              onClick={handleClose}
              style={{
                flex: 1,
                padding: '15px',
                borderRadius: 14,
                border: '2px solid #E5E7EB',
                background: 'white',
                color: '#374151',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.15s ease',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 2,
                padding: '15px',
                borderRadius: 14,
                border: 'none',
                background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                color: 'white',
                fontSize: 15,
                fontWeight: 700,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 4px 15px rgba(79,70,229,0.3)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              {isEdit ? 'Save Changes' : '+ Add Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
