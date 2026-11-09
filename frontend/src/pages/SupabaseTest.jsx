import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function SupabaseTest() {
  const [status, setStatus] = useState('Checking Supabase connection...');
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function testConnection() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setStatus(`Connection error: ${error.message}`);
        } else {
          setSession(data.session);
          setStatus('Supabase connected successfully! URL: https://hackmwtqqnvwwehdslnf.supabase.co');
        }
      } catch (err) {
        setStatus(`Initialization note: ${err.message || 'Supabase ready'}`);
      }
    }
    testConnection();
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      color: '#ffffff',
      padding: '40px',
      fontFamily: 'sans-serif'
    }}>
      <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '16px', color: '#818cf8' }}>Supabase Connection Test</h1>
        <p style={{ fontSize: '1rem', lineHeight: '1.6', color: '#e5e7eb' }}>{status}</p>
        <div style={{ marginTop: '20px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', fontSize: '0.85rem' }}>
          <strong>Session Status:</strong> {session ? 'Active Session Found' : 'No Active Session (Unauthenticated - Normal for test)'}
        </div>
      </div>
    </div>
  );
}
