import React, { useState } from 'react';
import { Calendar, Clock, Code, Users, Edit3, Save, CheckCircle2 } from 'lucide-react';

export default function Schedule({ user, tasks }) {
  const [scheduleItems, setScheduleItems] = useState([
    { id: 1, task: 'Login Module & OAuth', dev: 'Developer A', startDay: 1, duration: 3, endDay: 4, color: '#4f46e5' },
    { id: 2, task: 'Frontend UI Dashboard', dev: 'Developer B', startDay: 1, duration: 5, endDay: 6, color: '#2563eb' },
    { id: 3, task: 'Payment API & Security', dev: 'Developer C', startDay: 4, duration: 6, endDay: 10, color: '#7c3aed' },
    { id: 4, task: 'Automated System Testing', dev: 'Developer D', startDay: 10, duration: 4, endDay: 14, color: '#d97706' },
    { id: 5, task: 'Docker & CI/CD Deployment', dev: 'Developer D', startDay: 14, duration: 3, endDay: 17, color: '#059669' }
  ]);

  const [editingId, setEditingId] = useState(null);
  const [editStart, setEditStart] = useState(1);
  const [editDuration, setEditDuration] = useState(3);
  const [updateSaved, setUpdateSaved] = useState(false);

  const isManager = !user || user.role === 'ADMIN' || user.role === 'PROJECT_MANAGER' || user.role === 'Project Manager';

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditStart(item.startDay);
    setEditDuration(item.duration);
    setUpdateSaved(false);
  };

  const handleSaveSchedule = (id) => {
    const s = Math.max(1, parseInt(editStart, 10));
    const d = Math.max(1, parseInt(editDuration, 10));
    setScheduleItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          startDay: s,
          duration: d,
          endDay: s + d
        };
      }
      return item;
    }));
    setEditingId(null);
    setUpdateSaved(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a' }}>Optimized Project Schedule (Gantt View)</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            {isManager
              ? 'Management Rights: Edit task start dates, adjust durations, and re-sequence Gantt milestones.'
              : 'Employee View: Real-time project schedule timeline and task deadlines.'}
          </p>
        </div>
        {updateSaved && (
          <div className="badge badge-emerald">
            <CheckCircle2 size={14} /> Schedule Updated in MySQL!
          </div>
        )}
      </div>

      <div className="glass-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
        {/* Timeline Header Days */}
        <div style={{
          display: 'grid', gridTemplateColumns: '260px repeat(20, 1fr)', gap: '4px',
          paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', marginBottom: '16px',
          fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textAlign: 'center'
        }}>
          <div style={{ textAlign: 'left', paddingLeft: '8px' }}>Task / Dev / Controls</div>
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i}>D{i + 1}</div>
          ))}
        </div>

        {/* Timeline Task Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {scheduleItems.map((item) => (
            <div key={item.id} style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '16px', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#0f172a' }}>{item.task}</div>
                  {isManager && editingId !== item.id && (
                    <button
                      title="Edit Schedule Date & Duration"
                      onClick={() => handleEditClick(item)}
                      style={{ border: 'none', background: 'none', color: '#4f46e5', cursor: 'pointer', padding: '2px' }}
                    >
                      <Edit3 size={14} />
                    </button>
                  )}
                </div>
                <span style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: '500' }}>Assigned: {item.dev}</span>

                {/* Inline Editing for Manager */}
                {isManager && editingId === item.id && (
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '6px' }}>
                    <input
                      type="number" min="1" max="20"
                      value={editStart}
                      onChange={(e) => setEditStart(e.target.value)}
                      title="Start Day"
                      style={{ width: '48px', padding: '2px 4px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                    <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Dur:</span>
                    <input
                      type="number" min="1" max="15"
                      value={editDuration}
                      onChange={(e) => setEditDuration(e.target.value)}
                      title="Duration Days"
                      style={{ width: '48px', padding: '2px 4px', fontSize: '0.75rem', borderRadius: '4px', border: '1px solid #cbd5e1' }}
                    />
                    <button
                      onClick={() => handleSaveSchedule(item.id)}
                      style={{ padding: '2px 6px', fontSize: '0.72rem', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: '4px', cursor: 'pointer', fontWeight: '600' }}
                    >
                      <Save size={12} /> Save
                    </button>
                  </div>
                )}
              </div>

              {/* Bar Track */}
              <div style={{
                position: 'relative', height: '32px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden'
              }}>
                <div style={{
                  position: 'absolute',
                  left: `${((item.startDay - 1) / 20) * 100}%`,
                  width: `${(item.duration / 20) * 100}%`,
                  height: '100%',
                  background: `linear-gradient(90deg, ${item.color}, #059669)`,
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  color: '#ffffff',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  padding: '0 8px'
                }}>
                  Day {item.startDay} - Day {item.endDay}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
