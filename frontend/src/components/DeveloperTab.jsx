import React, { useState } from 'react';
import { Users, Award, DollarSign, Activity, Star, CheckCircle, Calculator } from 'lucide-react';

export default function DeveloperTab({ developers }) {
  const [selectedDev, setSelectedDev] = useState(developers[0] || null);
  const [testSkills, setTestSkills] = useState('Java, MySQL, Security');
  const [testComplexity, setTestComplexity] = useState(7);

  const calculateSampleScore = (dev) => {
    if (!dev) return 0;
    const reqList = testSkills.split(',').map(s => s.trim().toLowerCase());
    const devSkills = dev.skills?.map(s => s.name.toLowerCase()) || [];
    const matches = reqList.filter(req => devSkills.includes(req)).length;
    const skillRatio = reqList.length > 0 ? matches / reqList.length : 0.5;
    
    const skillScore = skillRatio * 40;
    const expScore = Math.min(dev.yearsExperience / 10, 1.0) * 20;
    const perfScore = (dev.performanceRating / 5.0) * 20;
    const workloadPenalty = (dev.currentWorkload / 100.0) * 20;

    return Math.round(Math.max(0, Math.min(100, skillScore + expScore + perfScore - workloadPenalty)));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '700' }}>Human Resource Management & Workload Analytics</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Developer experience levels, skill sets, current workloads, hourly costs, and AI suitability calculation.
        </p>
      </div>

      {/* Developer Cards Grid */}
      <div className="grid-2">
        {developers.map((dev) => {
          const suitability = calculateSampleScore(dev);
          return (
            <div key={dev.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>{dev.name}</h3>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dev.email}</span>
                </div>
                <div className="badge badge-emerald">
                  <Star size={12} /> {dev.performanceRating} / 5.0
                </div>
              </div>

              {/* Skills */}
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Technical Skills</span>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '6px' }}>
                  {dev.skills?.map((skill, idx) => (
                    <span key={idx} style={{
                      background: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '500'
                    }}>
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stats Grid */}
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px',
                background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-sm)'
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Experience</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>{dev.yearsExperience} Years</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Hourly Rate</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700' }}>${dev.hourlyRate}/hr</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Current Load</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: '700', color: dev.currentWorkload > 75 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                    {dev.currentWorkload}%
                  </div>
                </div>
              </div>

              {/* Workload Bar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                  <span>Workload Capacity Utilization</span>
                  <span>{dev.currentWorkload}%</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${dev.currentWorkload}%`, height: '100%',
                    background: dev.currentWorkload > 80 ? 'linear-gradient(90deg, #f59e0b, #f43f5e)' : 'linear-gradient(90deg, #6366f1, #10b981)',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suitability Formula Simulator */}
      <div className="glass-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calculator color="var(--accent-purple)" /> Developer-Task Suitability Scoring Simulator
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Required Skills (comma separated)</label>
              <input
                type="text"
                value={testSkills}
                onChange={(e) => setTestSkills(e.target.value)}
                style={{
                  width: '100%', padding: '10px', marginTop: '4px',
                  background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)', color: 'white'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Task Complexity</label>
              <input
                type="number" min="1" max="10"
                value={testComplexity}
                onChange={(e) => setTestComplexity(e.target.value)}
                style={{
                  width: '100%', padding: '10px', marginTop: '4px',
                  background: 'rgba(0,0,0,0.4)', border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)', color: 'white'
                }}
              />
            </div>
          </div>

          <div style={{
            background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: 'var(--radius-sm)',
            display: 'flex', flexDirection: 'column', gap: '10px'
          }}>
            <h4 style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Suitability Ranking Breakdown</h4>
            {developers.map((dev) => {
              const score = calculateSampleScore(dev);
              return (
                <div key={dev.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                  <span style={{ fontWeight: '600' }}>{dev.name}</span>
                  <div className={`badge ${score >= 80 ? 'badge-emerald' : (score >= 50 ? 'badge-amber' : 'badge-rose')}`}>
                    {score}% Match Score
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
