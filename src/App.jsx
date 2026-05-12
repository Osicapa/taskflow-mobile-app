import React, { useState, useEffect, useCallback } from 'react';
import HomeScreen from './screens/HomeScreen.jsx';
import AllTasksScreen from './screens/AllTasksScreen.jsx';
import StatsScreen from './components/StatsScreen.jsx';
import BottomNav from './components/BottomNav.jsx';
import TaskModal from './components/TaskModal.jsx';

const STORAGE_KEY = 'taskly_tasks_v1';

const SEED_TASKS = [
  {
    id: crypto.randomUUID(),
    title: 'Review quarterly goals',
    note: 'Check progress on Q2 OKRs and update status',
    category: 'Work',
    priority: 'High',
    dueDate: new Date().toISOString().split('T')[0],
    done: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Morning run 5km',
    note: '',
    category: 'Health',
    priority: 'Medium',
    dueDate: new Date().toISOString().split('T')[0],
    done: true,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Buy groceries',
    note: 'Milk, eggs, spinach, chicken, olive oil',
    category: 'Shopping',
    priority: 'Low',
    dueDate: new Date().toISOString().split('T')[0],
    done: false,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Call mom',
    note: 'Catch up, ask about weekend plans',
    category: 'Personal',
    priority: 'Medium',
    dueDate: '',
    done: false,
    createdAt: new Date(Date.now() - 86400000 * 4).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Team standup prep',
    note: 'Prepare talking points for Monday standup',
    category: 'Work',
    priority: 'High',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    done: false,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Read 30 pages',
    note: 'Atomic Habits — chapter 4',
    category: 'Personal',
    priority: 'Low',
    dueDate: '',
    done: true,
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Drink 8 glasses of water',
    note: '',
    category: 'Health',
    priority: 'Low',
    dueDate: new Date().toISOString().split('T')[0],
    done: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: crypto.randomUUID(),
    title: 'Update portfolio website',
    note: 'Add recent projects and update bio section',
    category: 'Work',
    priority: 'Medium',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
    done: false,
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
  },
];

function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load tasks:', e);
  }
  return SEED_TASKS;
}

function saveTasks(tasks) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks:', e);
  }
}

export default function App() {
  const [tasks, setTasks] = useState(() => loadTasks());
  const [activeScreen, setActiveScreen] = useState('home');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((taskData) => {
    const newTask = {
      id: crypto.randomUUID(),
      title: taskData.title.trim(),
      note: taskData.note?.trim() || '',
      category: taskData.category || 'Other',
      priority: taskData.priority || 'Medium',
      dueDate: taskData.dueDate || '',
      done: false,
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  }, []);

  const updateTask = useCallback((id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  }, []);

  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const toggleDone = useCallback((id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }, []);

  const openAddModal = useCallback(() => {
    setEditingTask(null);
    setModalOpen(true);
  }, []);

  const openEditModal = useCallback((task) => {
    setEditingTask(task);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingTask(null);
  }, []);

  const handleSaveTask = useCallback((taskData) => {
    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    closeModal();
  }, [editingTask, addTask, updateTask, closeModal]);

  const screenProps = { tasks, toggleDone, deleteTask, openEditModal };

  return (
    <div style={{
      minHeight: '100dvh',
      background: 'linear-gradient(135deg, #E8EAF6 0%, #EDE9FE 50%, #E0F2FE 100%)',
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'center',
      padding: '0',
    }}>
      {/* Phone container */}
      <div style={{
        width: '100%',
        maxWidth: '430px',
        minHeight: '100dvh',
        background: '#F9FAFB',
        position: 'relative',
        boxShadow: '0 0 80px rgba(79,70,229,0.15), 0 25px 50px rgba(0,0,0,0.15)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Top Header */}
        <header style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          background: 'rgba(249,250,251,0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E5E7EB',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 32,
              height: 32,
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </div>
            <span style={{
              fontSize: 22,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '-0.5px',
            }}>Taskly</span>
          </div>
          <button
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#F3F4F6',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#6B7280',
            }}
            aria-label="Settings"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
          </button>
        </header>

        {/* Main scrollable content */}
        <main style={{ flex: 1, overflowY: 'auto', paddingBottom: '90px' }} className="no-scrollbar">
          <div className="screen-enter" key={activeScreen}>
            {activeScreen === 'home' && (
              <HomeScreen {...screenProps} />
            )}
            {activeScreen === 'all' && (
              <AllTasksScreen {...screenProps} />
            )}
            {activeScreen === 'stats' && (
              <StatsScreen tasks={tasks} />
            )}
          </div>
        </main>

        {/* FAB */}
        <button
          onClick={openAddModal}
          className="fab-pulse"
          style={{
            position: 'fixed',
            bottom: '76px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
            color: 'white',
          }}
          aria-label="Add new task"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </button>

        {/* Bottom Nav */}
        <BottomNav activeScreen={activeScreen} setActiveScreen={setActiveScreen} />

        {/* Task Modal */}
        {modalOpen && (
          <TaskModal
            task={editingTask}
            onSave={handleSaveTask}
            onClose={closeModal}
          />
        )}
      </div>

      {/* CreateOS Badge */}
      <style>{`
        #createos-badge {
          position: fixed;
          bottom: 12px;
          right: 12px;
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 999px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.10);
          font-size: 11px;
          font-weight: 500;
          color: #374151;
          text-decoration: none;
          font-family: system-ui, sans-serif;
        }
        #createos-badge:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.15); }
        #createos-badge img { width: 14px; height: 14px; }
      `}</style>
      <a id="createos-badge" href="https://createos.sh/app" target="_blank" rel="noopener noreferrer">
        <img src="https://nodeops.network/SymbolBlack.svg" alt="" />
        Built with CreateOS
      </a>
    </div>
  );
}
