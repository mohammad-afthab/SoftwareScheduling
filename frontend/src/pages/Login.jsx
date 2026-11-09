import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Lock, User, UserCheck, UserPlus, Shield, Database } from 'lucide-react';
import { apiService } from '../services/api';
import { supabase } from '../lib/supabaseClient';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('DEVELOPER');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [authMsg, setAuthMsg] = useState(null);
  const navigate = useNavigate();

  const handleQuickLogin = async (userAcc, passAcc) => {
    setUsername(userAcc);
    setPassword(passAcc);
    setAuthError(null);
    setLoading(true);
    try {
      const userRes = await apiService.login(userAcc, passAcc);
      localStorage.setItem('user_session', JSON.stringify(userRes));
      if (onLogin) onLogin(userRes);
      navigate('/dashboard');
    } catch (err) {
      setAuthError(err.response?.data?.error || 'Authentication failed. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError(null);
    setAuthMsg(null);
    setLoading(true);

    try {
      if (isSignUp) {
        // Register via MySQL REST API
        try {
          const newUser = await apiService.register(username.trim(), password, fullName, role);
          localStorage.setItem('user_session', JSON.stringify(newUser));
          if (onLogin) onLogin(newUser);
          navigate('/dashboard');
          return;
        } catch (apiErr) {
          // Fallback to Supabase if API registration fails
          console.warn('MySQL auth fallback to Supabase:', apiErr.message);
          const { data, error } = await supabase.auth.signUp({
            email: username.includes('@') ? username.trim() : `${username.trim()}@company.com`,
            password,
            options: { data: { role } }
          });
          if (error) throw error;
          if (data.session?.user) {
            if (onLogin) onLogin();
            navigate('/dashboard');
          } else {
            setAuthMsg('Registration successful! Check email or try logging in.');
          }
        }
        return;
      }

      // Login via MySQL REST API
      try {
        const userRes = await apiService.login(username.trim(), password);
        localStorage.setItem('user_session', JSON.stringify(userRes));
        if (onLogin) onLogin(userRes);
        navigate('/dashboard');
      } catch (apiErr) {
        // Supabase Fallback
        console.warn('MySQL Auth error, attempting Supabase fallback...', apiErr);
        const emailInput = username.includes('@') ? username.trim() : `${username.trim()}@company.com`;
        const { data, error } = await supabase.auth.signInWithPassword({
          email: emailInput,
          password
        });
        if (error) throw new Error(apiErr.response?.data?.error || 'Invalid credentials or backend unreachable.');
        if (data.session?.user) {
          if (onLogin) onLogin();
          navigate('/dashboard');
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setAuthError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.08) 0%, rgba(248, 250, 252, 1) 80%)',
        padding: '20px'
      }}
    >
      <div
        className="glass-card"
        style={{ width: '460px', maxWidth: '100%', padding: '36px', background: '#ffffff', boxShadow: '0 10px 30px rgba(15, 23, 42, 0.08)', border: '1px solid #e2e8f0' }}
      >
        {/* Header */}
        <div style={{ marginBottom: '24px', textAlign: 'center' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px auto',
              boxShadow: '0 4px 14px rgba(79, 70, 229, 0.3)'
            }}
          >
            <Cpu size={30} color="#ffffff" />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '700', color: '#0f172a' }}>
            Resource Optimizer AI
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>
            {isSignUp ? 'Create New Account' : 'MySQL Database Security Portal'}
          </p>
        </div>

        {authError && (
          <div
            style={{
              fontSize: '0.78rem',
              color: '#e11d48',
              background: '#fff1f2',
              padding: '10px 12px',
              borderRadius: '8px',
              marginBottom: '14px',
              border: '1px solid #fecdd3'
            }}
          >
            ⚠ {authError}
          </div>
        )}

        {authMsg && (
          <div
            style={{
              fontSize: '0.78rem',
              color: '#047857',
              background: '#ecfdf5',
              padding: '10px 12px',
              borderRadius: '8px',
              marginBottom: '14px',
              border: '1px solid #a7f3d0'
            }}
          >
            ✓ {authMsg}
          </div>
        )}

        {/* Quick Demo Login Preset Buttons */}
        {!isSignUp && (
          <div style={{ marginBottom: '18px' }}>
            <label style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: '600' }}>
              <Shield size={12} color="#4f46e5" /> Quick Demo Sign-in (Seeded MySQL Accounts):
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => handleQuickLogin('admin', 'password')}
                style={{ fontSize: '0.72rem', padding: '6px', justifyContent: 'center' }}
              >
                👑 Admin
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => handleQuickLogin('pm', 'password')}
                style={{ fontSize: '0.72rem', padding: '6px', justifyContent: 'center' }}
              >
                💼 PM
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => handleQuickLogin('dev', 'password')}
                style={{ fontSize: '0.72rem', padding: '6px', justifyContent: 'center' }}
              >
                👨‍💻 Developer
              </button>
            </div>
          </div>
        )}

        {/* Login / Register Form */}
        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
        >
          <div>
            <label
              style={{
                fontSize: '0.8rem',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '500'
              }}
            >
              <User size={14} /> {isSignUp ? 'Username' : 'Username or Email'}
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin or dev"
              style={{
                width: '100%',
                padding: '10px 12px',
                marginTop: '4px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                color: '#0f172a',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {isSignUp && (
            <div>
              <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '500' }}>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Priyanshu Sharma"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  marginTop: '4px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  color: '#0f172a',
                  fontSize: '0.9rem'
                }}
              />
            </div>
          )}

          <div>
            <label
              style={{
                fontSize: '0.8rem',
                color: '#475569',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '500'
              }}
            >
              <Lock size={14} /> Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                marginTop: '4px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '8px',
                color: '#0f172a',
                fontSize: '0.9rem'
              }}
            />
          </div>

          {isSignUp && (
            <div>
              <label style={{ fontSize: '0.8rem', color: '#475569', fontWeight: '500' }}>Role Authorization</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  marginTop: '4px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '8px',
                  color: '#0f172a',
                  fontSize: '0.9rem'
                }}
              >
                <option value="DEVELOPER">DEVELOPER</option>
                <option value="PROJECT_MANAGER">PROJECT_MANAGER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          )}

          <div
            style={{
              fontSize: '0.75rem',
              color: '#047857',
              background: '#ecfdf5',
              padding: '8px 12px',
              borderRadius: '6px',
              border: '1px solid #a7f3d0',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Database size={14} /> Authenticated directly via MySQL 8.0 `users` table
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
          >
            {loading ? (
              'Authenticating...'
            ) : isSignUp ? (
              <UserPlus size={18} />
            ) : (
              <UserCheck size={18} />
            )}
            {isSignUp ? ' Register Account in MySQL' : ' Login with MySQL'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setAuthError(null);
              setAuthMsg(null);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#4f46e5',
              fontSize: '0.8rem',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontWeight: '500'
            }}
          >
            {isSignUp
              ? 'Already have an account? Login here'
              : "Don't have an account? Register new user in MySQL"}
          </button>
        </div>
      </div>
    </div>
  );
}
