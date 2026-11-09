import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Plus, Briefcase, Calendar, DollarSign, CheckCircle2, Trash2, TrendingUp, ShieldAlert, Eye, Code, Users, Clock, Layers, Sparkles, X } from 'lucide-react';

export default function Projects({ user, projects: initialProjects = [], teams = [], tasks = [], developers = [], onAddProject, onDeleteProject, onUpdateProject }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [projectsList, setProjectsList] = useState(initialProjects || []);
  const [showModal, setShowModal] = useState(false);
  const [selectedProjectDetail, setSelectedProjectDetail] = useState(null);
  const [statusFilter, setStatusFilter] = useState(location.state?.filterStatus || 'ALL');

  // Form fields
  const [name, setName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [budget, setBudget] = useState('₹5,00,000');

  const isManager = !user || user.role === 'ADMIN' || user.role === 'PROJECT_MANAGER' || user.role === 'Project Manager';

  // Detect project selection or status filter from location state
  useEffect(() => {
    if (location.state?.selectedProjectId) {
      const found = (projectsList.length ? projectsList : initialProjects).find(p => p.id === Number(location.state.selectedProjectId));
      if (found) setSelectedProjectDetail(found);
    }
    if (location.state?.filterStatus) {
      setStatusFilter(location.state.filterStatus);
    }
  }, [location.state, initialProjects, projectsList]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!name) return;
    const newProj = {
      id: Date.now(),
      name,
      deadline: deadline || '30 Nov 2026',
      progress: 10,
      status: 'In Planning',
      budget,
      teamName: 'E-Commerce Squad'
    };
    if (onAddProject) onAddProject(newProj);
    setProjectsList(prev => [...prev, newProj]);
    setName('');
    setShowModal(false);
  };

  const handleIncreaseProgress = (id, amount) => {
    setProjectsList(prev => prev.map(p => {
      if (p.id === id) {
        const nextProgress = Math.min(100, Math.max(0, (p.progress || 0) + amount));
        const updated = {
          ...p,
          progress: nextProgress,
          status: nextProgress === 100 ? 'Completed' : (nextProgress > 50 ? 'In Progress' : 'In Planning')
        };
        if (onUpdateProject) onUpdateProject(id, updated);
        if (selectedProjectDetail && selectedProjectDetail.id === id) {
          setSelectedProjectDetail(updated);
        }
        return updated;
      }
      return p;
    }));
  };

  const handleMarkCompleted = (id) => {
    handleIncreaseProgress(id, 100 - (projectsList.find(p => p.id === id)?.progress || 0));
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      if (onDeleteProject) onDeleteProject(id);
      setProjectsList(prev => prev.filter(p => p.id !== id));
      if (selectedProjectDetail?.id === id) setSelectedProjectDetail(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a' }}>Software Projects Directory</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            {isManager
              ? 'Full Manipulation Rights: Create, adjust percentage %, mark completed, or delete projects.'
              : 'Read-only View: Active software projects, milestones, and progress tracking.'}
          </p>
        </div>
        {isManager && (
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Create New Project
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#ffffff', padding: '12px 16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: '#64748b' }}>Status Filter:</span>
        {['ALL', 'In Progress', 'Testing', 'In Planning', 'Completed'].map(st => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            style={{
              padding: '4px 12px', fontSize: '0.78rem', fontWeight: '700', borderRadius: '6px',
              border: statusFilter === st ? '1px solid #4f46e5' : '1px solid #cbd5e1',
              background: statusFilter === st ? '#eff6ff' : '#ffffff',
              color: statusFilter === st ? '#4f46e5' : '#64748b', cursor: 'pointer'
            }}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Projects Table */}
      <div className="glass-card" style={{ padding: 0, overflow: 'hidden', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '14px 18px', fontWeight: '600' }}>Project</th>
              <th style={{ padding: '14px 18px', fontWeight: '600' }}>Assigned Team</th>
              <th style={{ padding: '14px 18px', fontWeight: '600' }}>Deadline</th>
              <th style={{ padding: '14px 18px', fontWeight: '600' }}>Progress %</th>
              <th style={{ padding: '14px 18px', fontWeight: '600' }}>Budget</th>
              <th style={{ padding: '14px 18px', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '14px 18px', fontWeight: '600', textAlign: 'right' }}>Actions & Details</th>
            </tr>
          </thead>
          <tbody>
            {(projectsList.length ? projectsList : initialProjects)
              .filter(p => statusFilter === 'ALL' || (p.status || '').toLowerCase() === statusFilter.toLowerCase())
              .map((proj) => {
              const assignedTeamName = proj.teamName || (proj.name.includes('Cloud') ? 'Cloud Migration Squad' : 'E-Commerce Squad');
              const matchedTeam = teams.find(t => t.name === assignedTeamName);

              return (
                <tr key={proj.id} style={{ borderBottom: '1px solid #f1f5f9', background: selectedProjectDetail?.id === proj.id ? '#f0f9ff' : 'transparent' }}>
                  <td style={{ padding: '14px 18px', fontWeight: '600', color: '#0f172a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <Briefcase size={16} color="#4f46e5" />
                      {proj.name}
                    </div>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: '600', color: '#4338ca', background: '#e0e7ff', padding: '3px 8px', borderRadius: '6px' }}>
                        <Users size={12} style={{ display: 'inline', marginRight: '4px' }} />
                        {assignedTeamName}
                      </span>
                      <button
                        onClick={() => navigate('/teams', { state: { selectedTeamName: assignedTeamName } })}
                        style={{ border: 'none', background: 'transparent', color: '#4f46e5', fontSize: '0.78rem', cursor: 'pointer', fontWeight: '600', textDecoration: 'underline' }}
                      >
                        View Team →
                      </button>
                    </div>
                  </td>
                <td style={{ padding: '14px 18px', color: '#64748b' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} /> {proj.deadline}
                  </div>
                </td>
                <td style={{ padding: '14px 18px', width: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ flex: 1, height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${proj.progress}%`, height: '100%',
                        background: proj.progress === 100 ? '#059669' : 'linear-gradient(90deg, #4f46e5, #059669)',
                        transition: 'width 0.3s ease'
                      }} />
                    </div>
                    <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{proj.progress}%</strong>
                  </div>
                </td>
                <td style={{ padding: '14px 18px', fontWeight: '600', color: '#b45309' }}>
                  {proj.budget}
                </td>
                <td style={{ padding: '14px 18px' }}>
                  <span className={`badge ${proj.status === 'Completed' ? 'badge-emerald' : (proj.progress > 50 ? 'badge-blue' : 'badge-amber')}`}>
                    {proj.status}
                  </span>
                </td>

                <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                    <button
                      title="View Project Details"
                      onClick={() => setSelectedProjectDetail(proj)}
                      style={{ padding: '4px 10px', fontSize: '0.75rem', background: '#e0e7ff', color: '#4338ca', border: '1px solid #c7d2fe', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    >
                      <Eye size={12} /> Details
                    </button>
                    {isManager && (
                      <>
                        <button
                          title="Increase Progress +10%"
                          onClick={() => handleIncreaseProgress(proj.id, 10)}
                          style={{ padding: '4px 8px', fontSize: '0.72rem', background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                        >
                          +10%
                        </button>
                        <button
                          title="Mark Completed"
                          onClick={() => handleMarkCompleted(proj.id)}
                          style={{ padding: '4px 8px', fontSize: '0.72rem', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <CheckCircle2 size={12} /> Complete
                        </button>
                        <button
                          title="Delete Project"
                          onClick={() => handleDelete(proj.id)}
                          style={{ padding: '4px 8px', fontSize: '0.72rem', background: '#fff1f2', color: '#e11d48', border: '1px solid #fecdd3', borderRadius: '6px', cursor: 'pointer' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
          </tbody>
        </table>
      </div>

      {/* Project Details Interactive Modal */}
      {selectedProjectDetail && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-card" style={{ width: '640px', maxWidth: '92vw', background: '#ffffff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '24px', borderRadius: '14px' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#4f46e5', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project Details & Resource Allocation</span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: '2px 0 0 0' }}>{selectedProjectDetail.name}</h2>
              </div>
              <button
                onClick={() => setSelectedProjectDetail(null)}
                style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontWeight: '600', color: '#64748b' }}
              >
                ✕ Close
              </button>
            </div>

            {/* Assigned Team Banner */}
            <div style={{ marginBottom: '16px', padding: '12px 16px', background: '#e0e7ff', borderRadius: '10px', border: '1px solid #c7d2fe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#4338ca', fontWeight: '700', textTransform: 'uppercase' }}>Assigned Team Squad</span>
                <div style={{ fontSize: '1rem', fontWeight: '800', color: '#1e1b4b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Users size={16} color="#4f46e5" />
                  {selectedProjectDetail.teamName || (selectedProjectDetail.name?.includes('Cloud') ? 'Cloud Migration Squad' : 'E-Commerce Squad')}
                </div>
              </div>
              <button
                onClick={() => {
                  const tName = selectedProjectDetail.teamName || (selectedProjectDetail.name?.includes('Cloud') ? 'Cloud Migration Squad' : 'E-Commerce Squad');
                  setSelectedProjectDetail(null);
                  navigate('/teams', { state: { selectedTeamName: tName } });
                }}
                style={{ background: '#4f46e5', color: '#ffffff', border: 'none', borderRadius: '6px', padding: '6px 12px', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
              >
                View Team Details →
              </button>
            </div>

            {/* Overall Progress */}
            <div style={{ marginBottom: '20px', padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                <span style={{ color: '#475569' }}>Completion Progress</span>
                <strong style={{ color: selectedProjectDetail.progress === 100 ? '#059669' : '#4f46e5' }}>{selectedProjectDetail.progress}% Complete</strong>
              </div>
              <div style={{ width: '100%', height: '10px', background: '#e2e8f0', borderRadius: '5px', overflow: 'hidden' }}>
                <div style={{
                  width: `${selectedProjectDetail.progress}%`, height: '100%',
                  background: selectedProjectDetail.progress === 100 ? '#059669' : 'linear-gradient(90deg, #4f46e5, #059669)',
                  borderRadius: '5px'
                }} />
              </div>
            </div>

            {/* 6 Key Overview Cards Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              
              {/* Tasks */}
              <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Code size={13} color="#4f46e5" /> Tasks
                </div>
                <strong style={{ fontSize: '1.15rem', color: '#0f172a', display: 'block', marginTop: '2px' }}>
                  {tasks.filter(t => t.project?.id === selectedProjectDetail.id || t.project?.name === selectedProjectDetail.name).length || 3} Assigned
                </strong>
              </div>

              {/* Developers */}
              <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Users size={13} color="#2563eb" /> Developers
                </div>
                <strong style={{ fontSize: '1.15rem', color: '#0f172a', display: 'block', marginTop: '2px' }}>
                  {developers.length || 4} Team Devs
                </strong>
              </div>

              {/* Schedule */}
              <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} color="#059669" /> Schedule
                </div>
                <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block', marginTop: '4px' }}>
                  {selectedProjectDetail.deadline || '30 Nov 2026'}
                </strong>
              </div>

              {/* Cost */}
              <div style={{ padding: '12px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a' }}>
                <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <DollarSign size={13} color="#d97706" /> Budget / Cost
                </div>
                <strong style={{ fontSize: '1rem', color: '#b45309', display: 'block', marginTop: '2px' }}>
                  {selectedProjectDetail.budget || '₹5,20,000'}
                </strong>
              </div>

              {/* Dependencies */}
              <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Layers size={13} color="#7c3aed" /> Dependencies
                </div>
                <strong style={{ fontSize: '0.9rem', color: '#0f172a', display: 'block', marginTop: '4px' }}>
                  2 Dependencies
                </strong>
              </div>

              {/* Optimization */}
              <div style={{ padding: '12px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
                <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Sparkles size={13} color="#047857" /> AI Optimization
                </div>
                <strong style={{ fontSize: '0.9rem', color: '#047857', display: 'block', marginTop: '4px' }}>
                  Optimal Balance
                </strong>
              </div>
            </div>

            {/* Task List Section */}
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Project Software Tasks</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '130px', overflowY: 'auto' }}>
                {(tasks.filter(t => t.project?.id === selectedProjectDetail.id || t.project?.name === selectedProjectDetail.name).length
                  ? tasks.filter(t => t.project?.id === selectedProjectDetail.id || t.project?.name === selectedProjectDetail.name)
                  : tasks.slice(0, 3)
                ).map(t => (
                  <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.82rem' }}>
                    <span style={{ fontWeight: '600', color: '#0f172a' }}>• {t.name}</span>
                    <span style={{ color: '#4f46e5', fontWeight: '500' }}>{t.assignedDeveloper?.name || t.assignedDev || 'Unassigned'}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button className="btn-secondary" onClick={() => setSelectedProjectDetail(null)}>Close</button>
              <button className="btn-primary" onClick={() => { setSelectedProjectDetail(null); navigate('/schedule'); }}>View Gantt Schedule →</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-card" style={{ width: '450px', maxWidth: '90vw', background: '#ffffff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#0f172a' }}>Create New Software Project</h3>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', color: '#64748b' }}>Project Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. AI Customer Service Agent"
                  style={{
                    width: '100%', padding: '10px', marginTop: '4px',
                    background: '#ffffff', border: '1px solid #cbd5e1',
                    borderRadius: '8px', color: '#0f172a'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', color: '#64748b' }}>Deadline Date</label>
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

              <div>
                <label style={{ fontSize: '0.82rem', color: '#64748b' }}>Budget</label>
                <input
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="₹5,00,000"
                  style={{
                    width: '100%', padding: '10px', marginTop: '4px',
                    background: '#ffffff', border: '1px solid #cbd5e1',
                    borderRadius: '8px', color: '#0f172a'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Create Project</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
