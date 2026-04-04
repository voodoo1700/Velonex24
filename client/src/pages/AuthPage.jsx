import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeOff, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      if (isLogin) {
        await login(form.email, form.password);
        navigate('/');
      } else {
        await register(form.name, form.email, form.password);
        setSuccess('Account created! Redirecting…');
        setTimeout(() => navigate('/'), 1500);
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(p => !p);
    setError('');
    setSuccess('');
    setForm({ name: '', email: '', password: '' });
  };

  /* ── shared field style ── */
  const fieldStyle = {
    display: 'block', width: '100%', boxSizing: 'border-box',
    padding: '10px 12px', fontSize: '1rem',
    border: '1px solid #ccc', borderRadius: 0,
    outline: 'none', fontFamily: 'inherit',
    transition: 'border-color 0.15s',
  };
  const labelStyle = {
    display: 'block', marginBottom: 4,
    fontSize: '0.88rem', color: '#C01', fontWeight: 400,
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'white',
      display: 'flex',
      flexDirection: 'column',
      paddingTop: 56, /* navbar clearance */
      fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
    }}>

      {/* ── Main content ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '60px 20px 40px',
      }}>

        {/* Heading */}
        <h1 style={{
          fontSize: 'clamp(1.5rem, 3vw, 2rem)',
          fontWeight: 400,
          color: '#222',
          marginBottom: 28,
          textAlign: 'center',
          maxWidth: 560,
        }}>
          {isLogin
            ? 'Enter your user ID and password to log in'
            : 'Create your Velonex24 account'}
        </h1>

        {/* CREATE A USER ID / switch link */}
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); switchMode(); }}
          style={{
            color: '#0065FF', fontSize: '0.82rem', fontWeight: 700,
            letterSpacing: '0.06em', textDecoration: 'none',
            textTransform: 'uppercase', marginBottom: 32,
            display: 'inline-block',
          }}
        >
          {isLogin ? 'CREATE A USER ID' : 'ALREADY HAVE AN ACCOUNT? LOG IN'}
        </a>

        {/* ── Form card ── */}
        <form
          onSubmit={handleSubmit}
          style={{ width: '100%', maxWidth: 360, display: 'flex', flexDirection: 'column', gap: 20 }}
        >

          {/* Error */}
          {error && (
            <div style={{
              padding: '10px 14px',
              background: '#FFF3F3', border: '1px solid #f5c0c0',
              color: '#C01', fontSize: '0.85rem', borderRadius: 2,
            }}>
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={{
              padding: '10px 14px',
              background: '#E8F8F0', border: '1px solid #a8d8c0',
              color: '#1a7a45', fontSize: '0.85rem', borderRadius: 2,
            }}>
              {success}
            </div>
          )}

          {/* Full Name — sign up only */}
          {!isLogin && (
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                placeholder=""
                required
                style={fieldStyle}
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                onFocus={e => e.target.style.borderColor = '#C01'}
                onBlur={e => e.target.style.borderColor = '#ccc'}
              />
            </div>
          )}

          {/* User ID / Email */}
          <div>
            <label style={labelStyle}>{isLogin ? 'User ID' : 'Email Address'}</label>
            <input
              type="email"
              placeholder=""
              required
              style={fieldStyle}
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              onFocus={e => e.target.style.borderColor = '#C01'}
              onBlur={e => e.target.style.borderColor = '#ccc'}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ ...labelStyle, color: '#333' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder=""
                required
                minLength={6}
                style={{ ...fieldStyle, paddingRight: 44 }}
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onFocus={e => e.target.style.borderColor = '#555'}
                onBlur={e => e.target.style.borderColor = '#ccc'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                style={{
                  position: 'absolute', right: 12, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  color: '#555', cursor: 'pointer', padding: 0,
                  display: 'flex', alignItems: 'center',
                }}
              >
                {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          {/* Remember me — login only */}
          {isLogin && (
            <label style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: '0.88rem', color: '#333', cursor: 'pointer',
              alignSelf: 'center',
            }}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={e => setRememberMe(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: '#4D148C' }}
              />
              Remember my user ID.
            </label>
          )}

          {/* LOG IN / CREATE ACCOUNT button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#FF6200', color: 'white',
              border: 'none', borderRadius: 2,
              padding: '13px 40px',
              fontSize: '0.95rem', fontWeight: 700,
              letterSpacing: '0.06em', cursor: loading ? 'not-allowed' : 'pointer',
              alignSelf: 'center', minWidth: 160,
              opacity: loading ? 0.75 : 1,
              transition: 'opacity 0.15s',
              fontFamily: 'inherit',
            }}
          >
            {loading
              ? '...'
              : isLogin ? 'LOG IN' : 'CREATE ACCOUNT'}
          </button>

          {/* Forgot link — login only */}
          {isLogin && (
            <a
              href="#"
              style={{
                color: '#0065FF', fontSize: '0.78rem', fontWeight: 700,
                letterSpacing: '0.06em', textDecoration: 'none',
                textTransform: 'uppercase', textAlign: 'center',
                display: 'block',
              }}
            >
              FORGOT YOUR USER ID OR PASSWORD?
            </a>
          )}
        </form>

        {/* Need help */}
        <div style={{ marginTop: 52, textAlign: 'center' }}>
          <p style={{ color: '#222', fontSize: '1rem', marginBottom: 8 }}>Need help?</p>
          <a
            href="#"
            style={{
              color: '#0065FF', fontSize: '0.78rem', fontWeight: 700,
              letterSpacing: '0.06em', textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            CUSTOMER SUPPORT
          </a>
        </div>

      </div>
    </div>
  );
};

export default AuthPage;
