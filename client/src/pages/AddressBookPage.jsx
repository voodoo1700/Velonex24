import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Plus, Star, Trash2, Home, Building2, Edit3 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const typeIcon = (t) => t === 'home' ? <Home size={14} /> : t === 'work' ? <Building2 size={14} /> : <MapPin size={14} />;

const AddressBook = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: '', name: '', street: '', city: '', state: '', zip: '', country: 'United States', type: 'home' });

  const remove = (id) => setAddresses(prev => prev.filter(a => a.id !== id));
  const setDefault = (id) => setAddresses(prev => prev.map(a => ({ ...a, default: a.id === id })));
  const addNew = () => {
    setAddresses(prev => [...prev, { ...newAddr, id: Date.now(), default: false }]);
    setShowForm(false);
    setNewAddr({ label: '', name: '', street: '', city: '', state: '', zip: '', country: 'United States', type: 'home' });
  };

  // Account pages require a signed-in customer
  useEffect(() => {
    if (!loading && !user) navigate('/auth');
  }, [loading, user, navigate]);

  const inp = (key, placeholder, half) => (
    <input
      placeholder={placeholder}
      value={newAddr[key]}
      onChange={e => setNewAddr({ ...newAddr, [key]: e.target.value })}
      style={{ padding: '9px 12px', border: '1px solid #ccc', fontSize: '0.88rem', borderRadius: 2, outline: 'none', width: half ? 'calc(50% - 5px)' : '100%', boxSizing: 'border-box' }}
    />
  );

  if (loading || !user) return null;

  return (
    <div className="page" style={{ background: '#f5f5f5', paddingTop: 56 }}>
      <div style={{ background: 'var(--primary)', padding: '36px 0 32px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ color: 'white', margin: 0, fontWeight: 300, fontSize: '1.75rem' }}>Address Book</h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', margin: '6px 0 0', fontSize: '0.9rem' }}>Save and manage your frequently used addresses</p>
            </div>
            <button
              onClick={() => setShowForm(p => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#2563EB', color: 'white', border: 'none', padding: '10px 20px', fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.05em', cursor: 'pointer', borderRadius: 2 }}
            >
              <Plus size={16} /> ADD ADDRESS
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        {/* Add form */}
        {showForm && (
          <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 4, padding: 24, marginBottom: 24 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '0.95rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#222' }}>New Address</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', gap: 10 }}>{inp('label', 'Label (e.g. Beach House)', true)}{inp('name', 'Recipient / Company', true)}</div>
              {inp('street', 'Street Address')}
              <div style={{ display: 'flex', gap: 10 }}>{inp('city', 'City', true)}{inp('state', 'State', true)}</div>
              <div style={{ display: 'flex', gap: 10 }}>{inp('zip', 'ZIP Code', true)}{inp('country', 'Country', true)}</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button onClick={addNew} style={{ background: '#2563EB', color: 'white', border: 'none', padding: '9px 22px', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', letterSpacing: '0.05em', borderRadius: 2 }}>SAVE ADDRESS</button>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: '1px solid #ccc', padding: '9px 16px', fontSize: '0.82rem', cursor: 'pointer', color: '#555', borderRadius: 2 }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {addresses.length === 0 && !showForm && (
          <div style={{ background: 'white', border: '1px dashed #ccc', borderRadius: 4, padding: '48px 24px', textAlign: 'center', color: '#888' }}>
            <MapPin size={28} style={{ marginBottom: 10, color: '#bbb' }} />
            <p style={{ margin: 0, fontWeight: 600, color: '#555' }}>No saved addresses yet</p>
            <p style={{ margin: '6px 0 0', fontSize: '0.85rem' }}>Add your first address to speed up shipping and billing.</p>
          </div>
        )}

        {/* Address cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {addresses.map(a => (
            <div key={a.id} style={{ background: 'white', border: a.default ? '2px solid var(--primary)' : '1px solid #e5e5e5', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 8, background: a.default ? '#E8EEF6' : '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ color: a.default ? 'var(--primary)' : '#666' }}>{typeIcon(a.type)}</span>
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: a.default ? 'var(--primary)' : '#333' }}>{a.label || a.type.toUpperCase()}</span>
                {a.default && <span style={{ marginLeft: 'auto', fontSize: '0.7rem', background: 'var(--primary)', color: 'white', padding: '2px 8px', borderRadius: 10, fontWeight: 700 }}>DEFAULT</span>}
              </div>
              <div style={{ padding: '14px 16px' }}>
                <p style={{ margin: '0 0 4px', fontWeight: 600, color: '#222', fontSize: '0.92rem' }}>{a.name}</p>
                <p style={{ margin: 0, color: '#555', fontSize: '0.85rem', lineHeight: 1.6 }}>{a.street}<br />{a.city}, {a.state} {a.zip}<br />{a.country}</p>
              </div>
              <div style={{ padding: '10px 16px', borderTop: '1px solid #f0f0f0', display: 'flex', gap: 8 }}>
                {!a.default && (
                  <button onClick={() => setDefault(a.id)} title="Set as default" style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: '1px solid #ddd', padding: '5px 10px', fontSize: '0.75rem', cursor: 'pointer', color: '#555', borderRadius: 2 }}>
                    <Star size={12} /> Default
                  </button>
                )}
                <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: '1px solid #ddd', padding: '5px 10px', fontSize: '0.75rem', cursor: 'pointer', color: '#555', borderRadius: 2 }}>
                  <Edit3 size={12} /> Edit
                </button>
                <button onClick={() => remove(a.id)} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: '1px solid #f5c0c0', padding: '5px 10px', fontSize: '0.75rem', cursor: 'pointer', color: '#c55', marginLeft: 'auto', borderRadius: 2 }}>
                  <Trash2 size={12} /> Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddressBook;
