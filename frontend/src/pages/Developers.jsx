import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import DeveloperCard from '../components/DeveloperCard';
import { Users, Plus, ShieldCheck, TrendingUp, Send, Code, Clock, CheckCircle2, Star, Award, Zap, X } from 'lucide-react';

export default function Developers({ user, developers: initialDevelopers = [], tasks = [], onAddDeveloper, onDeleteDeveloper, onUpdateDeveloper }) {
  const location = useLocation();

  const [developersList, setDevelopersList] = useState(initialDevelopers || []);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showEmpRequestModal, setShowEmpRequestModal] = useState(false);
  const [selectedDev, setSelectedDev] = useState(null);
  const [selectedDevDetail, setSelectedDevDetail] = useState(null);

  // Add form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [yearsExperience, setYearsExperience] = useState(5);
  const [hourlyRate, setHourlyRate] = useState(65);
  const [skills, setSkills] = useState('Java, Spring Boot, MySQL');

  // Capability Upgrade fields
  const [extraSkills, setExtraSkills] = useState('');
  const [rateIncrease, setRateIncrease] = useState(10);
  const [expIncrease, setExpIncrease] = useState(1);

  // Employee Request fields
  const [reqQualification, setReqQualification] = useState('');
  const [reqMessage, setReqMessage] = useState('');
  const [reqSubmitted, setReqSubmitted] = useState(false);

  const isManager = !user || user.role === 'ADMIN' || user.role === 'PROJECT_MANAGER' || user.role === 'Project Manager';

  // Detect developer selection from location state (e.g. clicked from Dashboard chart)
  useEffect(() => {
    if (location.state?.selectedDevName || location.state?.selectedDevId) {
      const found = (developersList.length ? developersList : initialDevelopers).find(
        d => (location.state.selectedDevId && d.id === Number(location.state.selectedDevId)) ||
             (location.state.selectedDevName && d.name.trim().toLowerCase() === location.state.selectedDevName.trim().toLowerCase())
      );
      if (found) setSelectedDevDetail(found);
    }
  }, [location.state, initialDevelopers, developersList]);

  const handleSaveDeveloper = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const newDev = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@company.com`,
      yearsExperience: parseInt(yearsExperience, 10),
      hourlyRate: parseFloat(hourlyRate),
      currentWorkload: 0,
      available: true,
      skills: skills.split(',').map(s => ({ name: s.trim() })).filter(s => s.name)
    };
    if (onAddDeveloper) onAddDeveloper(newDev);
    setDevelopersList(prev => [...prev, newDev]);
    setName('');
    setShowAddModal(false);
  };

  const openUpgradeModal = (dev) => {
    setSelectedDev(dev);
    setExtraSkills('');
    setRateIncrease(10);
    setExpIncrease(1);
    setShowUpgradeModal(true);
  };

  const handleApplyCapabilityUpgrade = (e) => {
    e.preventDefault();
    if (!selectedDev) return;

    const newSkills = extraSkills
      .split(',')
      .map(s => ({ name: s.trim() }))
      .filter(s => s.name);

    const updatedDev = {
      ...selectedDev,
      yearsExperience: (selectedDev.yearsExperience || 0) + parseInt(expIncrease, 10),
      hourlyRate: (selectedDev.hourlyRate || 50) + parseFloat(rateIncrease),
      skills: [...(selectedDev.skills || []), ...newSkills]
    };

    if (onUpdateDeveloper) onUpdateDeveloper(selectedDev.id, updatedDev);
    setDevelopersList(prev => prev.map(d => d.id === selectedDev.id ? updatedDev : d));
    if (selectedDevDetail?.id === selectedDev.id) setSelectedDevDetail(updatedDev);
    setShowUpgradeModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete developer record from MySQL database?')) {
      if (onDeleteDeveloper) onDeleteDeveloper(id);
      setDevelopersList(prev => prev.filter(d => d.id !== id));
      if (selectedDevDetail?.id === id) setSelectedDevDetail(null);
    }
  };

  const handleSendEmpRequest = (e) => {
    e.preventDefault();
    setReqSubmitted(true);
    setTimeout(() => {
      setShowEmpRequestModal(false);
    }, 1200);
  };

  const currentDevs = developersList.length ? developersList : initialDevelopers;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a' }}>Developer Management & Capacity Analytics</h2>
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
            {isManager
              ? 'Management Rights: Add developers, delete records, upgrade technical skills & hourly rate capability.'
              : 'Employee Access: View developer workload and request qualification/salary upgrades.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          {isManager ? (
            <button className="btn-primary" onClick={() => setShowAddModal(true)}>
              <Plus size={16} /> Add Developer
            </button>
          ) : (
            <button className="btn-primary" onClick={() => { setReqSubmitted(false); setShowEmpRequestModal(true); }}>
              <Send size={16} /> Request Qualification / Salary Upgrade
            </button>
          )}
        </div>
      </div>

      {/* Developers Cards Grid */}
      <div className="grid-2">
        {currentDevs.map((dev) => (
          <div key={dev.id} onClick={() => setSelectedDevDetail(dev)} style={{ cursor: 'pointer' }}>
            <DeveloperCard
              user={user}
              developer={dev}
              onDeleteDeveloper={handleDelete}
              onIncreaseCapability={openUpgradeModal}
            />
          </div>
        ))}
      </div>

      {/* Visual Workload Distribution Section */}
      <div className="glass-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Users color="#4f46e5" size={18} /> Team Workload Capacity & Availability Status (Click row to inspect)
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {currentDevs.map((dev) => {
            const workloadVal = dev.workload ?? dev.currentWorkload ?? 0;
            return (
              <div
                key={dev.id}
                onClick={() => setSelectedDevDetail(dev)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px', padding: '8px',
                  borderRadius: '8px', cursor: 'pointer', transition: 'background 0.2s ease',
                  background: selectedDevDetail?.id === dev.id ? '#f0f9ff' : 'transparent'
                }}
              >
                <div style={{ width: '130px', fontSize: '0.9rem', fontWeight: '600', color: '#0f172a' }}>
                  {dev.name}
                </div>
                <div style={{ flex: 1, height: '18px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${workloadVal}%`, height: '100%',
                    background: workloadVal >= 75 ? 'linear-gradient(90deg, #f59e0b, #e11d48)' : 'linear-gradient(90deg, #4f46e5, #059669)',
                    borderRadius: '6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: '8px',
                    fontSize: '0.72rem', fontWeight: '700', color: '#ffffff'
                  }}>
                    {workloadVal}%
                  </div>
                </div>
                <div style={{ width: '110px' }}>
                  <span className={`badge ${workloadVal >= 75 ? 'badge-rose' : (workloadVal >= 50 ? 'badge-amber' : 'badge-emerald')}`}>
                    {workloadVal >= 75 ? 'Overloaded' : (workloadVal >= 50 ? 'Busy' : 'Available')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Developer Details Interactive Modal */}
      {selectedDevDetail && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.45)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-card" style={{ width: '580px', maxWidth: '92vw', background: '#ffffff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '24px', borderRadius: '14px' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
              <div>
                <span className={`badge ${(selectedDevDetail.workload ?? selectedDevDetail.currentWorkload ?? 0) >= 75 ? 'badge-rose' : ((selectedDevDetail.workload ?? selectedDevDetail.currentWorkload ?? 0) >= 50 ? 'badge-amber' : 'badge-emerald')}`}>
                  {selectedDevDetail.status || ((selectedDevDetail.workload ?? selectedDevDetail.currentWorkload ?? 0) >= 75 ? 'Overloaded' : 'Available')}
                </span>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f172a', margin: '4px 0 0 0' }}>{selectedDevDetail.name}</h2>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>{selectedDevDetail.email}</span>
              </div>
              <button
                onClick={() => setSelectedDevDetail(null)}
                style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', fontWeight: '600', color: '#64748b' }}
              >
                ✕ Close
              </button>
            </div>

            {/* Workload Progress Bar & Utilization */}
            <div style={{ marginBottom: '20px', padding: '14px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                <span style={{ color: '#475569' }}>Workload Utilization</span>
                <strong style={{ color: (selectedDevDetail.workload ?? selectedDevDetail.currentWorkload ?? 0) >= 75 ? '#e11d48' : '#059669' }}>
                  {selectedDevDetail.workload ?? selectedDevDetail.currentWorkload ?? 0}% Capacity
                </strong>
              </div>
              <div style={{ width: '100%', height: '12px', background: '#e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{
                  width: `${selectedDevDetail.workload ?? selectedDevDetail.currentWorkload ?? 0}%`, height: '100%',
                  background: (selectedDevDetail.workload ?? selectedDevDetail.currentWorkload ?? 0) >= 75 ? 'linear-gradient(90deg, #f59e0b, #e11d48)' : 'linear-gradient(90deg, #4f46e5, #059669)',
                  borderRadius: '6px'
                }} />
              </div>
            </div>

            {/* Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Assigned Tasks</div>
                <strong style={{ fontSize: '1.2rem', color: '#0f172a', display: 'block', marginTop: '2px' }}>
                  {tasks.filter(t => (t.assignedDeveloper?.name || t.assignedDev || '').trim().toLowerCase() === selectedDevDetail.name.trim().toLowerCase()).length || 3} Tasks
                </strong>
              </div>

              <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Current Capacity</div>
                <strong style={{ fontSize: '1.05rem', color: '#0f172a', display: 'block', marginTop: '4px' }}>
                  40 hrs/week
                </strong>
              </div>

              <div style={{ padding: '12px', background: '#f1f5f9', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>Utilization</div>
                <strong style={{ fontSize: '1.05rem', color: (selectedDevDetail.workload ?? selectedDevDetail.currentWorkload ?? 0) >= 75 ? '#be123c' : '#047857', display: 'block', marginTop: '4px' }}>
                  {selectedDevDetail.workload ?? selectedDevDetail.currentWorkload ?? 0}%
                </strong>
              </div>
            </div>

            {/* Skills */}
            <div style={{ marginBottom: '16px' }}>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Technical Skills & Certifications</span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                {(selectedDevDetail.skills || ['Java', 'Spring Boot', 'MySQL']).map((sk, idx) => (
                  <span key={idx} style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '4px 10px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: '500' }}>
                    {typeof sk === 'object' ? sk.name : sk}
                  </span>
                ))}
              </div>
            </div>

            {/* Assigned Tasks List */}
            <div>
              <h4 style={{ fontSize: '0.88rem', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>Active Assigned Tasks</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '120px', overflowY: 'auto' }}>
                {tasks.filter(t => (t.assignedDeveloper?.name || t.assignedDev || '').trim().toLowerCase() === selectedDevDetail.name.trim().toLowerCase()).length > 0 ? (
                  tasks.filter(t => (t.assignedDeveloper?.name || t.assignedDev || '').trim().toLowerCase() === selectedDevDetail.name.trim().toLowerCase()).map(t => (
                    <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.82rem' }}>
                      <span style={{ fontWeight: '600', color: '#0f172a' }}>• {t.name}</span>
                      <span className="badge badge-blue">{t.priority || 'Medium'}</span>
                    </div>
                  ))
                ) : (
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>No active tasks assigned to this developer.</div>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
              <button className="btn-secondary" onClick={() => setSelectedDevDetail(null)}>Close</button>
              {isManager && (
                <button className="btn-primary" onClick={() => { setSelectedDevDetail(null); openUpgradeModal(selectedDevDetail); }}>
                  Upgrade Capability / Rate →
                </button>
              )}
            </div>

          </div>
        </div>
      )}

      {/* Add Developer Modal (Manager) */}
      {showAddModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-card" style={{ width: '480px', maxWidth: '90vw', background: '#ffffff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', color: '#0f172a' }}>Add Software Developer</h3>
            <form onSubmit={handleSaveDeveloper} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Developer Name</label>
                <input
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priyanshu Sharma"
                  style={{ width: '100%', padding: '10px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Email</label>
                <input
                  type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="priyanshu@company.com"
                  style={{ width: '100%', padding: '10px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Technical Skills (comma separated)</label>
                <input
                  type="text" value={skills} onChange={(e) => setSkills(e.target.value)}
                  placeholder="Java, Spring Boot, MySQL"
                  style={{ width: '100%', padding: '10px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Years Experience</label>
                  <input
                    type="number" min="0" max="30" value={yearsExperience} onChange={(e) => setYearsExperience(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Hourly Rate ($)</label>
                  <input
                    type="number" min="10" max="300" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Save Developer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upgrade Developer Capability Modal (Manager) */}
      {showUpgradeModal && selectedDev && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-card" style={{ width: '480px', maxWidth: '90vw', background: '#ffffff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '14px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp color="#4f46e5" size={20} /> Increase Developer Capability — {selectedDev.name}
            </h3>
            <form onSubmit={handleApplyCapabilityUpgrade} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Add Technical Skills / Certifications</label>
                <input
                  type="text"
                  value={extraSkills}
                  onChange={(e) => setExtraSkills(e.target.value)}
                  placeholder="e.g. AWS Certified, Kubernetes, GraphQL"
                  style={{ width: '100%', padding: '10px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Add Experience (+Years)</label>
                  <input
                    type="number" min="0" max="10"
                    value={expIncrease}
                    onChange={(e) => setExpIncrease(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Increase Hourly Rate (+$)</label>
                  <input
                    type="number" min="0" max="100"
                    value={rateIncrease}
                    onChange={(e) => setRateIncrease(e.target.value)}
                    style={{ width: '100%', padding: '10px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" className="btn-secondary" onClick={() => setShowUpgradeModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">Apply Capability Upgrade</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employee Qualification & Salary Upgrade Request Modal */}
      {showEmpRequestModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-card" style={{ width: '480px', maxWidth: '90vw', background: '#ffffff', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '12px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Send color="#4f46e5" size={18} /> Request Qualification & Salary Upgrade
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '14px' }}>
              Submit new qualifications, skill certifications, or hourly rate revision request to your Project Manager.
            </p>

            {reqSubmitted ? (
              <div style={{ padding: '12px', background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '8px', color: '#047857', fontSize: '0.88rem', fontWeight: '600' }}>
                ✓ Upgrade Request sent to Management for approval!
              </div>
            ) : (
              <form onSubmit={handleSendEmpRequest} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>New Qualification / Skills Acquired</label>
                  <input
                    type="text"
                    required
                    value={reqQualification}
                    onChange={(e) => setReqQualification(e.target.value)}
                    placeholder="e.g. Completed Spring Security & Docker Certification"
                    style={{ width: '100%', padding: '10px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Request Details / Rate Revision Note</label>
                  <textarea
                    rows="3"
                    value={reqMessage}
                    onChange={(e) => setReqMessage(e.target.value)}
                    placeholder="Please review my recent task completion records and skill upgrades..."
                    style={{ width: '100%', padding: '10px', marginTop: '4px', background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', color: '#0f172a' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setShowEmpRequestModal(false)}>Cancel</button>
                  <button type="submit" className="btn-primary">Send Upgrade Request</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
