import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BrainCircuit, CheckCircle2, Play, Award, ShieldCheck, Sparkles, ArrowRight, UserCheck, Layers, Users, Code, Shield, Cpu, Compass } from 'lucide-react';

export default function TaskAssignment({ tasks = [], teams = [], developers = [], onAssignTask }) {
  const location = useLocation();

  const passedDev = location.state?.recommendDev || 'Developer D';
  const passedTaskName = location.state?.recommendTask || 'Payment Gateway API';

  const initialTaskObj = tasks.find(t => (t.name || '').toLowerCase().includes(passedTaskName.toLowerCase())) || tasks[0];
  const [selectedTaskId, setSelectedTaskId] = useState(initialTaskObj?.id || 1);
  const [isAnalyzed, setIsAnalyzed] = useState(!!location.state?.recommendDev || false);
  const [assignedSuccess, setAssignedSuccess] = useState(false);

  const selectedTask = tasks.find(t => t.id === Number(selectedTaskId)) || tasks[0];

  // Helper to determine Discipline based on task name/required skills
  const getTaskDiscipline = (task) => {
    const nameStr = (task?.name || '').toLowerCase();
    const skillStr = (task?.requiredSkills || []).map(s => (typeof s === 'object' ? s.name : s).toLowerCase()).join(' ');

    if (nameStr.includes('test') || nameStr.includes('qa') || skillStr.includes('testing') || skillStr.includes('cypress')) {
      return { category: 'QA & Testing', icon: ShieldCheck, color: '#059669', badgeBg: '#ecfdf5', borderColor: '#a7f3d0', defaultRole: 'QA Engineer', targetTeam: 'QA & Infrastructure Team' };
    }
    if (nameStr.includes('docker') || nameStr.includes('ci/cd') || nameStr.includes('deploy') || nameStr.includes('server') || skillStr.includes('docker')) {
      return { category: 'DevOps & Infrastructure', icon: Cpu, color: '#d97706', badgeBg: '#fffbeb', borderColor: '#fde68a', defaultRole: 'DevOps Engineer', targetTeam: 'Cloud Migration Squad' };
    }
    if (nameStr.includes('review') || nameStr.includes('oauth') || nameStr.includes('arch') || nameStr.includes('auth')) {
      return { category: 'Code Review & Architecture', icon: Compass, color: '#7c3aed', badgeBg: '#f5f3ff', borderColor: '#ddd6fe', defaultRole: 'Team Lead', targetTeam: 'E-Commerce Squad' };
    }
    return { category: 'Development (Backend / API)', icon: Code, color: '#4f46e5', badgeBg: '#eef2ff', borderColor: '#c7d2fe', defaultRole: 'Backend Developer', targetTeam: 'E-Commerce Squad' };
  };

  const discipline = getTaskDiscipline(selectedTask);

  // Dynamic 2-Level Allocation Data Calculation
  const getDynamicAllocationResult = () => {
    if (discipline.category === 'QA & Testing') {
      return {
        targetTeam: 'QA & Infrastructure Team',
        targetRole: 'QA Engineer',
        recommendedDev: 'Sana Khan',
        score: 95,
        skillMatch: '98%',
        teamCapacity: '58%',
        candidateWorkload: '45%',
        reasons: [
          'Identified QA & Infrastructure Team as primary squad for software testing discipline',
          'Selected QA Engineer specialist (Sana Khan) over general developers',
          'Workload is only 45% (Low Overload Risk)',
          'Automated testing suite experience (Selenium, Cypress)'
        ],
        comparison: [
          { team: 'QA & Infrastructure Team', role: 'QA Engineer', dev: 'Sana Khan (AI Recommended)', match: '98%', workload: '45%', score: 95, status: 'Best Match', isBest: true },
          { team: 'QA & Infrastructure Team', role: 'Automation Engineer', dev: 'Rakesh Gupta', match: '90%', workload: '45%', score: 88, status: 'Acceptable', isBest: false },
          { team: 'E-Commerce Squad', role: 'Backend Developer', dev: 'Developer A', match: '60%', workload: '88%', score: 45, status: 'Role & Skill Mismatch', isBest: false }
        ]
      };
    }

    if (discipline.category === 'DevOps & Infrastructure') {
      return {
        targetTeam: 'Cloud Migration Squad',
        targetRole: 'DevOps Engineer',
        recommendedDev: 'Ahmed Ali',
        score: 93,
        skillMatch: '95%',
        teamCapacity: '67%',
        candidateWorkload: '50%',
        reasons: [
          'Identified Cloud Migration Squad as optimal infrastructure team',
          'Selected DevOps Specialist (Ahmed Ali) for Docker & CI/CD deployment',
          'Cloud infrastructure & Kubernetes deployment experience',
          'Available capacity within project timeline'
        ],
        comparison: [
          { team: 'Cloud Migration Squad', role: 'DevOps Engineer', dev: 'Ahmed Ali (AI Recommended)', match: '95%', workload: '50%', score: 93, status: 'Best Match', isBest: true },
          { team: 'Cloud Migration Squad', role: 'Cloud Engineer', dev: 'Rohan Verma', match: '85%', workload: '76%', score: 81, status: 'Acceptable', isBest: false },
          { team: 'Mobile Platform Team', role: 'Mobile Developer', dev: 'Developer B', match: '40%', workload: '65%', score: 38, status: 'Discipline Mismatch', isBest: false }
        ]
      };
    }

    if (discipline.category === 'Code Review & Architecture') {
      return {
        targetTeam: 'E-Commerce Squad',
        targetRole: 'Team Lead / Senior Specialist',
        recommendedDev: 'Rahul Kumar',
        score: 96,
        skillMatch: '97%',
        teamCapacity: '82%',
        candidateWorkload: '52%',
        reasons: [
          'Identified E-Commerce Squad leadership for security & architecture review',
          'Selected Team Lead (Rahul Kumar) for system architecture oversight',
          '97% Skill match in Java, Security, and OAuth2 specifications',
          'Reduces Developer A overload while maintaining quality gates'
        ],
        comparison: [
          { team: 'E-Commerce Squad', role: 'Team Lead', dev: 'Rahul Kumar (AI Recommended)', match: '97%', workload: '52%', score: 96, status: 'Best Match', isBest: true },
          { team: 'Cloud Migration Squad', role: 'Cloud Security Lead', dev: 'Developer C', match: '88%', workload: '45%', score: 86, status: 'Acceptable', isBest: false },
          { team: 'E-Commerce Squad', role: 'Engineering Manager', dev: 'Developer A', match: '92%', workload: '88%', score: 48, status: 'High Overload Risk', isBest: false }
        ]
      };
    }

    // Default: Development (Backend / API)
    return {
      targetTeam: 'E-Commerce Squad',
      targetRole: 'Backend Developer',
      recommendedDev: location.state?.recommendDev || 'Priyanshu Sharma',
      score: 94,
      skillMatch: '96%',
      teamCapacity: '82%',
      candidateWorkload: '30%',
      reasons: [
        'Level 1: Evaluated E-Commerce Squad as responsible team for storefront & payment microservices',
        'Level 2: Selected Backend Developer discipline for Payment Gateway API task',
        'Recommends Priyanshu Sharma with 96% Java/Spring Boot/Security skill match',
        'Reduces Developer A workload from 88% to 64% (24% Workload Impact)'
      ],
      comparison: [
        { team: 'E-Commerce Squad', role: 'Backend Developer', dev: `${location.state?.recommendDev || 'Priyanshu Sharma'} (AI Recommended)`, match: '96%', workload: '30%', score: 94, status: 'Best Match', isBest: true },
        { team: 'Cloud Migration Squad', role: 'Backend Developer', dev: 'Developer C', match: '88%', workload: '40%', score: 82, status: 'Acceptable', isBest: false },
        { team: 'Mobile Platform Team', role: 'Mobile Developer', dev: 'Developer B', match: '65%', workload: '55%', score: 64, status: 'Skill Mismatch', isBest: false },
        { team: 'E-Commerce Squad', role: 'Backend Developer', dev: 'Developer A (Currently Assigned)', match: '92%', workload: '88%', score: 48, status: 'High Overload Risk', isBest: false }
      ]
    };
  };

  const allocationResult = getDynamicAllocationResult();

  const handleRunAssignment = () => {
    setIsAnalyzed(true);
    setAssignedSuccess(false);
  };

  const handleConfirmAssignment = () => {
    if (onAssignTask && selectedTask) {
      onAssignTask(selectedTask.id, allocationResult.recommendedDev);
    }
    setAssignedSuccess(true);
  };

  const DisciplineIcon = discipline.icon;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header Banner */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a' }}>
          Two-Level AI Resource Allocation Engine
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '2px' }}>
          Hierarchical Allocation Pipeline: <strong>Project → Responsible Squad → Discipline & Role → Individual Specialist</strong>.
        </p>
      </div>

      {/* Organizational Hierarchy Reference Bar */}
      <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '16px' }}>
        <span style={{ fontSize: '0.72rem', color: '#4f46e5', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Enterprise Resource Organizational Structure
        </span>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginTop: '10px' }}>
          <div style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#1e293b' }}>1. PMO & Leadership</div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Scope, deadlines, budgets, oversight</div>
          </div>
          <div style={{ padding: '10px', background: '#eef2ff', borderRadius: '8px', border: '1px solid #c7d2fe' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#4338ca' }}>2. Development Squads</div>
            <div style={{ fontSize: '0.72rem', color: '#6366f1' }}>Frontend, Backend, APIs, Mobile</div>
          </div>
          <div style={{ padding: '10px', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#047857' }}>3. QA & Testing Team</div>
            <div style={{ fontSize: '0.72rem', color: '#059669' }}>Test automation, QA verification</div>
          </div>
          <div style={{ padding: '10px', background: '#fffbeb', borderRadius: '8px', border: '1px solid #fde68a' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#b45309' }}>4. DevOps & Infra</div>
            <div style={{ fontSize: '0.72rem', color: '#d97706' }}>Docker, CI/CD, cloud, servers</div>
          </div>
          <div style={{ padding: '10px', background: '#f5f3ff', borderRadius: '8px', border: '1px solid #ddd6fe' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '700', color: '#6d28d9' }}>5. Code Review Leads</div>
            <div style={{ fontSize: '0.72rem', color: '#7c3aed' }}>Senior review, quality gates, leads</div>
          </div>
        </div>
      </div>

      {/* Task Selection & AI Two-Level Allocation Workflow */}
      <div className="glass-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(15,23,42,0.05)', padding: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <BrainCircuit color="#4f46e5" size={20} /> 1. Select Software Task for Two-Level AI Allocation
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '20px', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: '500' }}>Select Task</label>
            <select
              value={selectedTaskId}
              onChange={(e) => { setSelectedTaskId(Number(e.target.value)); setIsAnalyzed(false); setAssignedSuccess(false); }}
              style={{
                width: '100%', padding: '10px 12px', marginTop: '4px',
                background: '#ffffff', border: '1px solid #cbd5e1',
                borderRadius: '8px', color: '#0f172a', fontWeight: '600'
              }}
            >
              {tasks.map(t => (
                <option key={t.id} value={t.id}>{t.name} ({t.priority} Priority)</option>
              ))}
            </select>
          </div>

          <div style={{ background: discipline.badgeBg, border: `1px solid ${discipline.borderColor}`, padding: '12px 16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: discipline.color, fontWeight: '700', textTransform: 'uppercase' }}>Target Task Discipline</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '800', color: '#0f172a', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DisciplineIcon size={16} color={discipline.color} /> {discipline.category}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Required Role</div>
              <strong style={{ color: discipline.color, fontSize: '0.88rem' }}>{discipline.defaultRole}</strong>
            </div>
          </div>
        </div>

        <button className="btn-primary" onClick={handleRunAssignment} style={{ marginTop: '18px' }}>
          <Sparkles size={16} /> Execute 2-Level AI Allocation (Project → Squad → Role → Member)
        </button>
      </div>

      {/* Two-Level AI Allocation Result */}
      {isAnalyzed && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Level 1 & Level 2 Allocation Pipeline Box */}
          <div className="glass-card" style={{ borderLeft: '5px solid #059669', background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '20px' }}>
            
            {/* Header Result */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#047857', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Two-Level AI Allocation Recommendation
                </span>
                <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#0f172a', margin: '4px 0 0 0' }}>
                  {allocationResult.recommendedDev}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#334155', marginTop: '4px', fontWeight: '500' }}>
                  Assigned Team: <strong style={{ color: '#1e1b4b' }}>{allocationResult.targetTeam}</strong> • Target Role: <strong style={{ color: '#047857' }}>{allocationResult.targetRole}</strong>
                </p>
              </div>

              <div style={{ textAlign: 'right', background: '#ffffff', padding: '10px 18px', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>AI Suitability Score</div>
                <div style={{ fontSize: '2rem', fontWeight: '800', color: '#047857', lineHeight: 1, marginTop: '2px' }}>
                  {allocationResult.score}%
                </div>
              </div>
            </div>

            {/* Visual Two-Level Flow Pipeline */}
            <div style={{ marginTop: '16px', padding: '14px', background: '#ffffff', borderRadius: '10px', border: '1px solid #a7f3d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#4f46e5', color: '#ffffff', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</span>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>LEVEL 1: SQUAD ALLOCATION</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1e1b4b' }}>{allocationResult.targetTeam}</div>
                </div>
              </div>

              <ArrowRight size={16} color="#059669" />

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#059669', color: '#ffffff', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</span>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>LEVEL 2: ROLE SELECTION</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#047857' }}>{allocationResult.targetRole}</div>
                </div>
              </div>

              <ArrowRight size={16} color="#059669" />

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#7c3aed', color: '#ffffff', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
                <div>
                  <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: '600' }}>INDIVIDUAL SPECIALIST</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: '800', color: '#6d28d9' }}>{allocationResult.recommendedDev}</div>
                </div>
              </div>

            </div>

            {/* AI Decision Rationale List */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px',
              marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #a7f3d0', fontSize: '0.82rem'
            }}>
              {allocationResult.reasons.map((reason, idx) => (
                <div key={idx} style={{ color: '#0f172a', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <CheckCircle2 size={16} color="#047857" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <span>{reason}</span>
                </div>
              ))}
            </div>

            <button className="btn-primary" onClick={handleConfirmAssignment} disabled={assignedSuccess} style={{ marginTop: '18px' }}>
              {assignedSuccess
                ? `✓ Task Successfully Assigned to ${allocationResult.recommendedDev} (${allocationResult.targetRole})!`
                : `Confirm & Assign Task to ${allocationResult.recommendedDev} (${allocationResult.targetRole})`}
            </button>
          </div>

          {/* Candidate Comparison Table */}
          <div className="glass-card" style={{ background: '#ffffff', border: '1px solid #e2e8f0', padding: '20px' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '14px' }}>
              Hierarchical Team & Role Suitability Comparison Breakdown
            </h3>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 14px', fontWeight: '600' }}>Candidate Squad</th>
                  <th style={{ padding: '12px 14px', fontWeight: '600' }}>Target Role</th>
                  <th style={{ padding: '12px 14px', fontWeight: '600' }}>Candidate Employee</th>
                  <th style={{ padding: '12px 14px', fontWeight: '600' }}>Skill Match</th>
                  <th style={{ padding: '12px 14px', fontWeight: '600' }}>Workload</th>
                  <th style={{ padding: '12px 14px', fontWeight: '600' }}>AI Score</th>
                  <th style={{ padding: '12px 14px', fontWeight: '600' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {allocationResult.comparison.map((row, idx) => (
                  <tr key={idx} style={{
                    borderBottom: '1px solid #f1f5f9',
                    background: row.isBest ? '#ecfdf5' : 'transparent'
                  }}>
                    <td style={{ padding: '12px 14px', fontWeight: '600', color: '#4338ca' }}>
                      {row.team}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#475569', fontWeight: '500' }}>
                      {row.role}
                    </td>
                    <td style={{ padding: '12px 14px', fontWeight: row.isBest ? '700' : '500', color: '#0f172a' }}>
                      {row.dev}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#2563eb' }}>{row.match}</td>
                    <td style={{ padding: '12px 14px', color: '#64748b' }}>{row.workload}</td>
                    <td style={{ padding: '12px 14px', fontWeight: '700', color: row.isBest ? '#047857' : '#0f172a' }}>
                      {row.score}%
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span className={`badge ${row.isBest ? 'badge-emerald' : (row.score > 65 ? 'badge-blue' : 'badge-rose')}`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
}

