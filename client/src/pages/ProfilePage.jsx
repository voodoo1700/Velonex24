import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, MapPin, Edit3, Save, X } from 'lucide-react';

const Section = ({ title, children }) => (
  <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 4, marginBottom: 20 }}>
    <div style={{ padding: '14px 24px', borderBottom: '1px solid #e5e5e5', background: '#fafafa' }}>
      <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#222', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{title}</h2>
    </div>
    <div style={{ padding: 24 }}>{children}</div>
  </div>
);

const Field = ({ label, value, icon: Icon }) => (
  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 18 }}>
    <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#f0ebf8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={16} color="#4D148C" />
    </div>
    <div>
      <p style={{ margin: 0, fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '0.95rem', color: '#222', fontWeight: 500 }}>{value}</p>
    </div>
  </div>
);

const ProfilePage = () => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'johndoe@email.com',
    phone: '+1 (555) 012-3456',
    address: '1 Velonex Way, Memphis, TN 38125',
  });
  const [saved, setSaved] = useState(false);

  const save = () => { setEditing(false); setSaved(true); setTimeout(() => setSaved(false), 2500); };

  return (
    <div className="page" style={{ background: '#f5f5f5', paddingTop: 56 }}>
      {/* Header */}
      <div style={{ background: 'var(--primary)', padding: '36px 0 32px' }}>
        <div className="container">
          <h1 style={{ color: 'white', margin: 0, fontWeight: 300, fontSize: '1.75rem' }}>My Profile</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', margin: '6px 0 0', fontSize: '0.9rem' }}>Manage your personal information and account details</p>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        {saved && (
          <div style={{ background: '#e8f8f0', border: '1px solid #a8d8c0', borderRadius: 4, padding: '12px 20px', marginBottom: 20, color: '#1a7a45', fontSize: '0.9rem' }}>
            ✓ Profile updated successfully.
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20, alignItems: 'start' }}>
          {/* Avatar card */}
          <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 4, padding: 28, textAlign: 'center' }}>
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <span style={{ fontSize: '2rem', color: 'white', fontWeight: 700 }}>{(form.name || 'U')[0].toUpperCase()}</span>
            </div>
            <h3 style={{ margin: '0 0 4px', fontSize: '1.05rem', color: '#222' }}>{form.name}</h3>
            <p style={{ margin: '0 0 16px', fontSize: '0.8rem', color: '#888' }}>{form.email}</p>
            <div style={{ background: '#f0ebf8', borderRadius: 20, padding: '4px 14px', display: 'inline-block' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: 700 }}>VELONEX24 MEMBER</span>
            </div>
            <div style={{ marginTop: 20, padding: '12px 0', borderTop: '1px solid #eee' }}>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Account Number</p>
              <p style={{ margin: '4px 0 0', fontWeight: 700, color: '#333', fontSize: '0.95rem', fontFamily: 'monospace' }}>VLX-{((user?._id || '000000').slice(-6)).toUpperCase()}</p>
            </div>
          </div>

          {/* Info sections */}
          <div>
            <Section title="Personal Information">
              {editing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[['Full Name', 'name'], ['Email', 'email'], ['Phone', 'phone'], ['Address', 'address']].map(([label, key]) => (
                    <div key={key}>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#555', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
                      <input
                        value={form[key]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '9px 12px', border: '1px solid #ccc', fontSize: '0.9rem', borderRadius: 2, outline: 'none' }}
                      />
                    </div>
                  ))}
                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button onClick={save} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#FF6200', color: 'white', border: 'none', padding: '9px 20px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', letterSpacing: '0.05em' }}><Save size={14} /> SAVE CHANGES</button>
                    <button onClick={() => setEditing(false)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#eee', color: '#444', border: 'none', padding: '9px 16px', fontSize: '0.82rem', cursor: 'pointer' }}><X size={14} /> Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <Field label="Full Name" value={form.name} icon={User} />
                  <Field label="Email Address" value={form.email} icon={Mail} />
                  <Field label="Phone Number" value={form.phone} icon={Phone} />
                  <Field label="Primary Address" value={form.address} icon={MapPin} />
                  <button onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--primary)', color: 'white', border: 'none', padding: '9px 20px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', letterSpacing: '0.05em', borderRadius: 2 }}>
                    <Edit3 size={14} /> EDIT PROFILE
                  </button>
                </>
              )}
            </Section>

            <Section title="Account Security">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f0f0f0' }}>
                <div><p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Password</p><p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>Last changed 3 months ago</p></div>
                <button style={{ background: 'none', border: '1px solid #ccc', padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer', color: '#555', borderRadius: 2 }}>Change</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0' }}>
                <div><p style={{ margin: 0, fontWeight: 600, fontSize: '0.9rem' }}>Two-Factor Authentication</p><p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>Not enabled</p></div>
                <button style={{ background: 'none', border: '1px solid #ccc', padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer', color: '#555', borderRadius: 2 }}>Enable</button>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
