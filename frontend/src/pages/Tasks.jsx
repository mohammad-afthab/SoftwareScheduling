import React, { useState } from 'react';
import TaskTable from '../components/TaskTable';
import { Plus, CheckSquare } from 'lucide-react';

export default function Tasks({ user, tasks, developers, onAddTask, onUpdateTask, onDeleteTask }) {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('Payment Subsystem');
  const [priority, setPriority] = useState('Critical');
  const [complexity, setComplexity] = useState(8);
  const [duration, setDuration] = useState(5);
  const [deadline, setDeadline] = useState('2026-09-30');
  const [skills, setSkills] = useState('Java, Spring Boot, Security');

  const isManager = !user || user.role === 'ADMIN' || user.role === 'PROJECT_MANAGER' || user.role === 'Project Manager';

  const handleSave = (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    onAddTask({
      name: name.trim(),
      priority: priority.toUpperCase(),
      complexity: parseInt(complexity, 10),
      estimatedDurationDays: parseInt(duration, 10),
      status: 'NOT_STARTED',
      requiredSkills: skills
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .map(skill => ({
          name: skill
        }))
    });

    setName('');
    setShowModal(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a' }}>Software Task Management</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            {isManager
              ? 'Management Rights: Add, allocate tasks to devs, change details, delete tasks, or mark completed.'
              : 'Employee Access: Update status of assigned tasks & request task changes from management.'}
          </p>
        </div>
        {isManager && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Add Software Task
          </button>
        )}
      </div>

      {/* Task Table */}
      <TaskTable user={user} tasks={tasks} developers={developers} onUpdateTask={onUpdateTask} onDeleteTask={onDeleteTask} />

      {/* Add Task Modal / Form */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-card" style={{ width: '480px', maxWidth: '90vw', background: '#ffffff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#0f172a' }}>Task Configuration Form</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Task Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Payment API"
                  style={{
                    width: '100%', padding: '10px', marginTop: '4px',
                    background: '#ffffff', border: '1px solid #cbd5e1',
                    borderRadius: '8px', color: '#0f172a'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Required Skills (comma separated)</label>
                <input
                  type="text"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="Java, Spring Boot, Security"
                  style={{
                    width: '100%', padding: '10px', marginTop: '4px',
                    background: '#ffffff', border: '1px solid #cbd5e1',
                    borderRadius: '8px', color: '#0f172a'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={{
                      width: '100%', padding: '10px', marginTop: '4px',
                      background: '#ffffff', border: '1px solid #cbd5e1',
                      borderRadius: '8px', color: '#0f172a'
                    }}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Complexity (1-10)</label>
                  <input
                    type="number" min="1" max="10"
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    style={{
                      width: '100%', padding: '10px', marginTop: '4px',
                      background: '#ffffff', border: '1px solid #cbd5e1',
                      borderRadius: '8px', color: '#0f172a'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Est. Duration (Days)</label>
                  <input
                    type="number" min="1" max="30"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    style={{
                      width: '100%', padding: '10px', marginTop: '4px',
                      background: '#ffffff', border: '1px solid #cbd5e1',
                      borderRadius: '8px', color: '#0f172a'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Deadline Date</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    style={{
                      width: '100%', padding: '10px', marginTop: '4px',
                      background: '#ffffff', border: '1px solid #cbd5e1',
                      borderRadius: '8px', color: '#0f172a'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
