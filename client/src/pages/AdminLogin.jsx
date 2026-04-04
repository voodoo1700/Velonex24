import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(email, password);
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else {
        setError('Admin access required');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'var(--bg-section)', padding: 20
    }}>
      <div style={{
        background: 'white', borderRadius: 'var(--radius-lg)',
        padding: '40px 36px', width: '100%', maxWidth: 400,
        boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)'
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 8 }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>Velon</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent)' }}>Ex</span>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)' }}>24</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Admin Control Panel</p>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px', marginBottom: 16,
            background: '#FFF3F3', border: '1px solid #FFD7D7',
            borderRadius: 'var(--radius-sm)', color: 'var(--danger)', fontSize: '0.85rem', textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="input-group">
            <label>Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email" className="input"
                value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@velonex24.com"
                style={{ paddingLeft: 40 }}
                required id="login-email"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password" className="input"
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ paddingLeft: 40 }}
                required id="login-password"
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} id="login-submit" style={{ width: '100%', marginTop: 8 }}>
            {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : 'SIGN IN'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <button
            onClick={() => navigate('/')}
            style={{
              background: 'none', border: 'none', color: 'var(--text-muted)',
              fontSize: '0.85rem', cursor: 'pointer', textDecoration: 'underline'
            }}
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
