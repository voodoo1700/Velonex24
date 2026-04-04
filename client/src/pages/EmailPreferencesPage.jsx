import { useState } from 'react';
import { Mail, Package, AlertCircle, Tag, Bell, Star } from 'lucide-react';

const categories = [
  {
    icon: Package, color: '#4D148C', title: 'Shipment Notifications',
    prefs: [
      { label: 'Shipment picked up', checked: true },
      { label: 'In transit updates', checked: true },
      { label: 'Out for delivery', checked: true },
      { label: 'Delivered confirmation', checked: true },
      { label: 'Delivery exception/delay', checked: false },
    ],
  },
  {
    icon: AlertCircle, color: '#c47a00', title: 'Exceptions & Alerts',
    prefs: [
      { label: 'Package held at location', checked: true },
      { label: 'Address correction needed', checked: false },
      { label: 'Customs hold notification', checked: false },
      { label: 'Return to sender', checked: true },
    ],
  },
  {
    icon: Tag, color: '#1a6bbf', title: 'Billing & Invoices',
    prefs: [
      { label: 'Invoice ready', checked: true },
      { label: 'Payment confirmation', checked: true },
      { label: 'Rate change alerts', checked: false },
      { label: 'Credit limit warnings', checked: true },
    ],
  },
  {
    icon: Star, color: '#2a8a5a', title: 'Promotions & News',
    prefs: [
      { label: 'Exclusive offers and discounts', checked: false },
      { label: 'New service announcements', checked: true },
      { label: 'Velonex24 newsletter', checked: false },
      { label: 'Sustainability updates', checked: false },
    ],
  },
];

const Toggle = ({ checked, onChange }) => (
  <button
    onClick={onChange}
    style={{
      width: 42, height: 24, borderRadius: 12, border: 'none',
      background: checked ? 'var(--primary)' : '#ccc',
      cursor: 'pointer', position: 'relative', flexShrink: 0, transition: 'background 0.2s',
    }}
  >
    <div style={{
      width: 18, height: 18, borderRadius: '50%', background: 'white',
      position: 'absolute', top: 3, left: checked ? 21 : 3, transition: 'left 0.2s',
      boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
    }} />
  </button>
);

const EmailPreferencesPage = () => {
  const [state, setState] = useState(categories.map(c => ({ ...c, prefs: c.prefs.map(p => ({ ...p })) })));
  const [saved, setSaved] = useState(false);

  const toggle = (ci, pi) => {
    setState(prev => prev.map((cat, i) =>
      i !== ci ? cat : { ...cat, prefs: cat.prefs.map((p, j) => j !== pi ? p : { ...p, checked: !p.checked }) }
    ));
  };

  return (
    <div className="page" style={{ background: '#f5f5f5', paddingTop: 56 }}>
      <div style={{ background: 'var(--primary)', padding: '36px 0 32px' }}>
        <div className="container">
          <h1 style={{ color: 'white', margin: 0, fontWeight: 300, fontSize: '1.75rem' }}>Email Preferences</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', margin: '6px 0 0', fontSize: '0.9rem' }}>Choose which email notifications you'd like to receive</p>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px', maxWidth: 720 }}>
        {saved && (
          <div style={{ background: '#e8f8f0', border: '1px solid #a8d8c0', borderRadius: 4, padding: '12px 20px', marginBottom: 20, color: '#1a7a45', fontSize: '0.9rem' }}>
            ✓ Email preferences saved successfully.
          </div>
        )}

        {/* Email address bar */}
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 4, padding: '14px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Mail size={18} color="#4D148C" />
          <div>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notifications sent to</p>
            <p style={{ margin: 0, fontWeight: 600, fontSize: '0.95rem', color: '#222' }}>user@example.com</p>
          </div>
          <button style={{ marginLeft: 'auto', background: 'none', border: '1px solid #ccc', padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer', borderRadius: 2, color: '#555' }}>Change</button>
        </div>

        {/* Categories */}
        {state.map((cat, ci) => {
          const Icon = cat.icon;
          return (
            <div key={ci} style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 4, marginBottom: 16, overflow: 'hidden' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid #f0f0f0', background: '#fafafa', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Icon size={16} color={cat.color} />
                <h3 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#222', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{cat.title}</h3>
              </div>
              {cat.prefs.map((pref, pi) => (
                <div key={pi} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: pi < cat.prefs.length - 1 ? '1px solid #f5f5f5' : 'none' }}>
                  <span style={{ fontSize: '0.88rem', color: '#333' }}>{pref.label}</span>
                  <Toggle checked={pref.checked} onChange={() => toggle(ci, pi)} />
                </div>
              ))}
            </div>
          );
        })}

        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button
            onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2500); }}
            style={{ background: '#FF6200', color: 'white', border: 'none', padding: '11px 28px', fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.06em', cursor: 'pointer', borderRadius: 2 }}
          >
            SAVE PREFERENCES
          </button>
          <button style={{ background: 'none', border: '1px solid #ccc', padding: '11px 20px', fontSize: '0.85rem', cursor: 'pointer', color: '#555', borderRadius: 2 }}>
            Unsubscribe All
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmailPreferencesPage;
