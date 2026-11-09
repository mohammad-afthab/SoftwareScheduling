import React, { useState } from 'react';
import { Plus, Calendar, AlertTriangle, CheckCircle2, Clock, Code, Layers } from 'lucide-react';

export default function TasksTab({ tasks, developers, onAddTask }) {
  const [showModal, setShowModal] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [priority, setPriority] = useState('HIGH');
  const [complexity, setComplexity] = useState(5);
  const [duration, setDuration] = useState(4);
  const [selectedSkills, setSelectedSkills] = useState(['Java', 'MySQL']);

  const handleCreate = (e) => {
    e.preventDefault();
    if (!taskName) return;
    onAddTask({
      name: taskName,
      description: 'Custom added software development task',
      priority,
      complexity: parseInt(complexity),
      estimatedDurationDays: parseInt(duration),
      requiredSkills: selectedSkills.map(s => ({ name: s }))
    });
    setTaskName('');
    setShowModal(false);
  };

  const getPriorityBadgeClass = (p) => {
    switch (p) {
      case 'CRITICAL': return 'badge-rose';
      case 'VERY_HIGH': return 'badge-rose';
      case 'HIGH': return 'badge-amber';
      case 'MEDIUM': return 'badge-blue';
      default: return 'badge-purple';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Software Development Tasks & Dependency Matrix</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Define task complexities, priorities, required skills, and dependency links for schedule optimization.
          </p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Add Development Task
        </button>
      </div>

      {/* Tasks Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: 'rgba(0,0,0,0.4)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px 18px' }}>Task Name</th>
              <th style={{ padding: '14px 18px' }}>Priority</th>
              <th style={{ padding: '14px 18px' }}>Complexity</th>
              <th style={{ padding: '14px 18px' }}>Est. Duration</th>
              <th style={{ padding: '14px 18px' }}>Required Skills</th>
              <th style={{ padding: '14px 18px' }}>Dependencies</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }}>
                <td style={{ padding: '14px 18px', fontWeight: '600' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Code size={16} color="var(--accent-indigo)" />
                    {task.name}
                  </div>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '60px', height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${task.complexity * 10}%`, height: '100%',
                        background: task.complexity > 7 ? 'var(--accent-rose)' : (task.complexity > 4 ? 'var(--accent-amber)' : 'var(--accent-emerald)')
                      }} />
                    </div>
                    <span>{task.complexity}/10</span>
                  </div>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="var(--text-muted)" />
                    {task.estimatedDurationDays} Days
                  </div>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {task.requiredSkills?.map((s, idx) => (
                      <span key={idx} style={{
                        background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem'
                      }}>
                        {typeof s === 'object' ? s.name : s}
                      </span>
                    ))}
                  </div>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  {task.dependencyTaskIds && task.dependencyTaskIds.size > 0 ? (
                    <span style={{ color: 'var(--accent-amber)', fontSize: '0.8rem' }}>
                      Depends on Task #{Array.from(task.dependencyTaskIds).join(', #')}
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>None (Parallel Start)</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Interactive Gantt Timeline Preview */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar color="var(--accent-emerald)" /> Estimated Schedule Timeline (Gantt View)
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tasks.map((task, idx) => {
            const startDay = idx * 2; // sample gantt offsets
            const endDay = startDay + task.estimatedDurationDays;
            return (
              <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '180px', fontSize: '0.85rem', fontWeight: '600', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {task.name}
                </div>
                <div style={{ flex: 1, background: 'rgba(0,0,0,0.3)', height: '28px', borderRadius: '6px', position: 'relative', overflow: 'hidden' }}>
                  <div style={{
                    position: 'absolute',
                    left: `${(startDay / 20) * 100}%`,
                    width: `${(task.estimatedDurationDays / 20) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #6366f1, #10b981)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: 'white',
                    boxShadow: '0 0 10px rgba(99,102,241,0.3)'
                  }}>
                    Day {startDay + 1} - Day {endDay}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Task Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-card" style={{ width: '500px', maxWidth: '90vw' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Add New Software Development Task</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Task Name</label>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="e.g. GraphQL API Subsystem"
                  style={{
                    width: '100%', padding: '10px', marginTop: '4px',
                    background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)', color: 'white'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={{
                      width: '100%', padding: '10px', marginTop: '4px',
                      background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)', color: 'white'
                    }}
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="VERY_HIGH">VERY HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Complexity (1-10)</label>
                  <input
                    type="number" min="1" max="10"
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    style={{
                      width: '100%', padding: '10px', marginTop: '4px',
                      background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)', color: 'white'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Duration (Days)</label>
                <input
                  type="number" min="1" max="30"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  style={{
                    width: '100%', padding: '10px', marginTop: '4px',
                    background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)', color: 'white'
                  }}
                />
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
