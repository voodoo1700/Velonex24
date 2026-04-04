import { useState } from 'react';
import { Users, Shield, CreditCard, Bell, Building2, Settings, ChevronRight } from 'lucide-react';

const tools = [
  {
    icon: Users, color: '#4D148C', title: 'User Management',
    desc: 'Add, remove, or modify user access levels for your account.',
    actions: ['Add Users', 'Manage Roles', 'Deactivate Users'],
  },
  {
    icon: Shield, color: '#1a6bbf', title: 'Security Settings',
    desc: 'Control login policies, IP restrictions, and access controls.',
    actions: ['SSO Configuration', 'IP Allowlist', 'Session Timeout'],
  },
  {
    icon: CreditCard, color: '#c47a00', title: 'Billing Administration',
    desc: 'Manage payment methods, billing contacts, and invoice settings.',
    actions: ['Payment Methods', 'Billing Contacts', 'Invoice Preferences'],
  },
  {
    icon: Bell, color: '#2a8a5a', title: 'Notification Rules',
    desc: 'Set automated alerts for shipments, billing events, and exceptions.',
    actions: ['Shipment Alerts', 'Billing Alerts', 'Exception Alerts'],
  },
  {
    icon: Building2, color: '#d44', title: 'Company Profile',
    desc: 'Update your company information, logo, and business details.',
    actions: ['Edit Company Info', 'Upload Logo', 'Business Type'],
  },
  {
    icon: Settings, color: '#555', title: 'Preferences',
    desc: 'System-wide preferences including units, language, and defaults.',
    actions: ['Units & Currency', 'Language', 'Default Services'],
  },
];

const AdminToolsPage = () => {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="page" style={{ background: '#f5f5f5', paddingTop: 56 }}>
      <div style={{ background: 'var(--primary)', padding: '36px 0 32px' }}>
        <div className="container">
          <h1 style={{ color: 'white', margin: 0, fontWeight: 300, fontSize: '1.75rem' }}>Administrative Tools</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', margin: '6px 0 0', fontSize: '0.9rem' }}>Manage account settings, users, and business preferences</p>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {tools.map((t, i) => {
            const Icon = t.icon;
            const open = expanded === i;
            return (
              <div key={i} style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 4, overflow: 'hidden', transition: 'box-shadow 0.2s', boxShadow: open ? '0 4px 16px rgba(0,0,0,0.1)' : 'none' }}>
                <button
                  onClick={() => setExpanded(open ? null : i)}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 8, background: `${t.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color={t.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontWeight: 700, color: '#222', fontSize: '0.95rem' }}>{t.title}</p>
                    <p style={{ margin: '3px 0 0', fontSize: '0.8rem', color: '#777' }}>{t.desc}</p>
                  </div>
                  <ChevronRight size={18} color="#aaa" style={{ transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                </button>
                {open && (
                  <div style={{ borderTop: '1px solid #f0f0f0', padding: '4px 0 8px' }}>
                    {t.actions.map((a) => (
                      <button key={a} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 20px 10px 78px', background: 'none', border: 'none', fontSize: '0.88rem', color: '#4D148C', cursor: 'pointer', fontWeight: 500, textDecoration: 'underline' }}>
                        {a}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info banner */}
        <div style={{ background: '#E8F0FB', border: '1px solid #bbcfef', borderRadius: 4, padding: '16px 20px', marginTop: 24, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Shield size={20} color="#1a6bbf" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color: '#1a4a8a' }}>Administrator Access Required</p>
            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#445' }}>Some actions require administrator privileges. Contact your account administrator if you need access to restricted tools.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminToolsPage;
