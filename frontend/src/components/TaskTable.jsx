import React, { useState, useEffect } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { Clock, Code, Trash2, CheckCircle2, UserCheck, Send, Search, Filter, RefreshCw } from 'lucide-react';

export default function TaskTable({ user, tasks: initialTasks, developers = [], onUpdateTask, onDeleteTask }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [taskList, setTaskList] = useState(initialTasks || []);
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status')?.toUpperCase() || 'ALL');
  const [searchQuery, setSearchQuery] = useState(location.state?.searchTask || searchParams.get('search') || '');
  
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestTask, setRequestTask] = useState(null);
  const [requestReason, setRequestReason] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Sync state if props or location query changes
  useEffect(() => {
    setTaskList(initialTasks || []);
  }, [initialTasks]);

  useEffect(() => {
    const qStatus = searchParams.get('status');
    if (qStatus) {
      setStatusFilter(qStatus.toUpperCase());
    }
  }, [searchParams]);

  useEffect(() => {
    if (location.state?.searchTask) {
      setSearchQuery(location.state.searchTask);
    }
  }, [location.state]);

  const isManager = !user || user.role === 'ADMIN' || user.role === 'PROJECT_MANAGER' || user.role === 'Project Manager';

  const getPriorityBadge = (p) => {
    switch (p?.toUpperCase()) {
      case 'CRITICAL':
      case 'VERY_HIGH': return 'badge-rose';
      case 'HIGH': return 'badge-amber';
      case 'MEDIUM': return 'badge-blue';
      default: return 'badge-purple';
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setTaskList(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, status: newStatus };
        if (onUpdateTask) onUpdateTask(id, updated);
        return updated;
      }
      return t;
    }));
  };

  const handleDevAssignment = (id, devName) => {
    setTaskList(prev => prev.map(t => {
      if (t.id === id) {
        const updated = { ...t, assignedDev: devName, assignedDeveloper: { name: devName }, status: devName ? 'IN_PROGRESS' : t.status };
        if (onUpdateTask) onUpdateTask(id, updated);
        return updated;
      }
      return t;
    }));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this task from MySQL database?')) {
      if (onDeleteTask) onDeleteTask(id);
      setTaskList(prev => prev.filter(t => t.id !== id));
    }
  };

  const openRequestModal = (task) => {
    setRequestTask(task);
    setRequestReason('');
    setRequestSubmitted(false);
    setShowRequestModal(true);
  };

  const handleSendRequest = (e) => {
    e.preventDefault();
    setRequestSubmitted(true);
    setTimeout(() => {
      setShowRequestModal(false);
    }, 1200);
  };

  // Filter tasks based on statusFilter and searchQuery
  const currentTasksToFilter = taskList.length ? taskList : initialTasks;
  const filteredTasks = currentTasksToFilter.filter(t => {
    // Status Filter
    const taskStatus = (t.status || '').toUpperCase();
    const matchStatus = (statusFilter === 'ALL') || (taskStatus === statusFilter);

    // Search Filter
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchStatus;

    const nameMatch = (t.name || '').toLowerCase().includes(q);
    const devMatch = (t.assignedDeveloper?.name || t.assignedDev || '').toLowerCase().includes(q);
    const skillMatch = (t.requiredSkills || []).some(s => 
      (typeof s === 'object' ? s.name : s).toLowerCase().includes(q)
    );

    return matchStatus && (nameMatch || devMatch || skillMatch);
  });

  return (
    <div className="glass-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #e2e8f0', background: '#ffffff', borderRadius: '12px' }}>
      
      {/* Search & Status Filter Controls Bar */}
      <div style={{
        padding: '16px 20px',
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1', minWidth: '240px', maxWidth: '360px' }}>
          <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Filter tasks by name, dev, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              fontSize: '0.85rem',
              outline: 'none',
              background: '#ffffff',
              color: '#0f172a'
            }}
          />
        </div>

        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Filter size={15} color="#64748b" />
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600', marginRight: '4px' }}>Status:</span>
          
          {[
            { label: 'All Tasks', key: 'ALL' },
            { label: 'Completed', key: 'COMPLETED', color: '#059669' },
            { label: 'In Progress', key: 'IN_PROGRESS', color: '#2563eb' },
            { label: 'Testing', key: 'TESTING', color: '#d97706' },
            { label: 'Not Started', key: 'NOT_STARTED', color: '#7c3aed' }
          ].map(btn => {
            const isActive = statusFilter === btn.key;
            return (
              <button
                key={btn.key}
                onClick={() => {
                  setStatusFilter(btn.key);
                  if (btn.key === 'ALL') {
                    setSearchParams({});
                  } else {
                    setSearchParams({ status: btn.key });
                  }
                }}
                style={{
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  border: isActive ? `1px solid ${btn.color || '#4f46e5'}` : '1px solid #cbd5e1',
                  background: isActive ? (btn.color ? `${btn.color}15` : '#eff6ff') : '#ffffff',
                  color: isActive ? (btn.color || '#4f46e5') : '#475569',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {btn.label}
              </button>
            );
          })}

          {(statusFilter !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setSearchQuery('');
                setSearchParams({});
              }}
              style={{
                fontSize: '0.75rem',
                color: '#64748b',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                textDecoration: 'underline',
                marginLeft: '6px'
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
        <thead>
          <tr style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Task Name</th>
            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Priority</th>
            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Duration</th>
            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Required Skills</th>
            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Assigned Dev</th>
            <th style={{ padding: '12px 18px', fontWeight: '600' }}>Status</th>
            <th style={{ padding: '12px 18px', fontWeight: '600', textAlign: 'right' }}>
              {isManager ? 'Management Actions' : 'Employee Actions'}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task) => (
              <tr key={task.id} style={{ borderBottom: '1px solid #f1f5f9', background: searchQuery && task.name.toLowerCase().includes(searchQuery.toLowerCase()) ? '#fefce8' : 'transparent' }}>
                <td style={{ padding: '14px 18px', fontWeight: '600', color: '#0f172a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Code size={15} color="#4f46e5" />
                    {task.name}
                  </div>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span className={`badge ${getPriorityBadge(task.priority)}`}>
                    {task.priority}
                  </span>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#64748b' }}>
                    <Clock size={13} /> {task.duration ?? task.estimatedDurationDays ?? 0} Days
                  </div>
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {task.requiredSkills?.map((skill, idx) => (
                      <span key={idx} style={{
                        background: '#eff6ff',
                        color: '#1d4ed8',
                        border: '1px solid #bfdbfe',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: '500'
                      }}>
                        {typeof skill === 'object' ? skill.name : skill}
                      </span>
                    ))}
                  </div>
                </td>

                {/* Dev Assignment */}
                <td style={{ padding: '14px 18px', fontWeight: '500', color: '#0f172a' }}>
                  {isManager ? (
                    <select
                      value={task.assignedDeveloper?.name || task.assignedDev || ''}
                      onChange={(e) => handleDevAssignment(task.id, e.target.value)}
                      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#ffffff', color: '#0f172a' }}
                    >
                      <option value="">-- Unassigned --</option>
                      {developers && developers.length > 0 ? (
                        developers.map(dev => (
                          <option key={dev.id || dev.name} value={dev.name}>
                            {dev.name} ({dev.workload ?? dev.currentWorkload ?? 0}% Load)
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="Developer A">Developer A</option>
                          <option value="Developer B">Developer B</option>
                          <option value="Developer C">Developer C</option>
                          <option value="Developer D">Developer D</option>
                        </>
                      )}
                    </select>
                  ) : (
                    <span>{task.assignedDeveloper?.name || task.assignedDev || 'Unassigned'}</span>
                  )}
                </td>

                {/* Status Update */}
                <td style={{ padding: '14px 18px' }}>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem', background: '#ffffff', color: '#0f172a', fontWeight: '600' }}
                  >
                    <option value="NOT_STARTED">Not Started</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="TESTING">Testing</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </td>

                {/* Actions based on Role */}
                <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                  {isManager ? (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        title="Mark Task Completed"
                        onClick={() => handleStatusChange(task.id, 'COMPLETED')}
                        style={{ padding: '4px 8px', fontSize: '0.72rem', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <CheckCircle2 size={12} /> Complete
                      </button>
                      <button
                        title="Delete Task"
                        onClick={() => handleDelete(task.id)}
                        style={{ padding: '4px 8px', fontSize: '0.72rem', background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', borderRadius: '6px', cursor: 'pointer' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => openRequestModal(task)}
                      style={{ padding: '4px 10px', fontSize: '0.75rem', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Send size={12} /> Request Task Change
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ padding: '32px', textAlign: 'center', color: '#94a3b8', fontSize: '0.88rem' }}>
                No tasks match the selected status filter (<strong>{statusFilter}</strong>) or search query.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Employee Task Change Request Modal */}
      {showRequestModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-card" style={{ width: '450px', maxWidth: '90vw', background: '#ffffff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '12px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Send color="#4f46e5" size={18} /> Employee Task Change Request
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '14px' }}>
              Submit a formal request to your Manager / Team Lead to reassign or modify <strong>{requestTask?.name}</strong>.
            </p>

            {requestSubmitted ? (
              <div style={{ padding: '12px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', color: '#047857', fontSize: '0.88rem', fontWeight: '600' }}>
                ✓ Request submitted successfully to your Project Manager!
              </div>
            ) : (
              <form onSubmit={handleSendRequest} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Reason for Change Request</label>
                  <textarea
                    required
                    rows="3"
                    value={requestReason}
                    onChange={(e) => setRequestReason(e.target.value)}
                    placeholder="e.g. Need skill assistance for security integration or deadline extension..."
                    style={{ width: '100%', padding: '10px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowRequestModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Submit Request</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
