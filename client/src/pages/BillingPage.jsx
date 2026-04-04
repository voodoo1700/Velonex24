import { useState } from 'react';
import { CreditCard, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const invoices = [
  { id: 'INV-2024-0041', date: 'Mar 28, 2024', due: 'Apr 12, 2024', amount: '$1,284.50', status: 'due', packages: 12 },
  { id: 'INV-2024-0038', date: 'Mar 14, 2024', due: 'Mar 29, 2024', amount: '$876.20', status: 'paid', packages: 8 },
  { id: 'INV-2024-0035', date: 'Feb 29, 2024', due: 'Mar 15, 2024', amount: '$2,110.00', status: 'paid', packages: 21 },
  { id: 'INV-2024-0031', date: 'Feb 15, 2024', due: 'Mar 01, 2024', amount: '$540.75', status: 'paid', packages: 5 },
  { id: 'INV-2024-0028', date: 'Feb 01, 2024', due: 'Feb 16, 2024', amount: '$3,450.00', status: 'paid', packages: 31 },
];

const statusBadge = (s) => {
  const cfg = {
    paid: { bg: '#e8f8f0', color: '#1a7a45', label: 'PAID', icon: <CheckCircle size={12} /> },
    due:  { bg: '#fff8e6', color: '#b06a00', label: 'DUE',  icon: <Clock size={12} /> },
    overdue: { bg: '#fff0f0', color: '#c01', label: 'OVERDUE', icon: <AlertCircle size={12} /> },
  }[s];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: cfg.bg, color: cfg.color, padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700 }}>
      {cfg.icon}{cfg.label}
    </span>
  );
};

const BillingPage = () => {
  const [payingId, setPayingId] = useState(null);
  const [paid, setPaid] = useState([]);

  const payNow = (id) => {
    setPayingId(id);
    setTimeout(() => { setPaid(p => [...p, id]); setPayingId(null); }, 1200);
  };

  return (
    <div className="page" style={{ background: '#f5f5f5', paddingTop: 56 }}>
      <div style={{ background: 'var(--primary)', padding: '36px 0 32px' }}>
        <div className="container">
          <h1 style={{ color: 'white', margin: 0, fontWeight: 300, fontSize: '1.75rem' }}>View & Pay Bill</h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', margin: '6px 0 0', fontSize: '0.9rem' }}>Manage invoices, payment methods, and billing history</p>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Amount Due', value: '$1,284.50', color: '#b06a00', bg: '#fff8e6' },
            { label: 'Last Payment', value: '$876.20', color: '#1a7a45', bg: '#e8f8f0' },
            { label: 'Total This Year', value: '$8,261.45', color: '#1a4a8a', bg: '#E8F0FB' },
            { label: 'Credit Balance', value: '$0.00', color: '#555', bg: '#f5f5f5' },
          ].map(c => (
            <div key={c.label} style={{ background: c.bg, border: `1px solid ${c.color}30`, borderRadius: 4, padding: '18px 20px' }}>
              <p style={{ margin: '0 0 6px', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#666' }}>{c.label}</p>
              <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: c.color }}>{c.value}</p>
            </div>
          ))}
        </div>

        {/* Payment method */}
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 4, marginBottom: 20 }}>
          <div style={{ padding: '13px 20px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
            <h3 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#222' }}>Payment Method</h3>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 30, background: '#1a4a8a', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CreditCard size={18} color="white" />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 600, fontSize: '0.92rem', color: '#222' }}>Visa ending in •••• 4291</p>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#888' }}>Expires 09/2026</p>
            </div>
            <button style={{ marginLeft: 'auto', background: 'none', border: '1px solid #ccc', padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer', borderRadius: 2, color: '#555' }}>Update</button>
            <button style={{ background: 'none', border: '1px solid #ccc', padding: '6px 14px', fontSize: '0.8rem', cursor: 'pointer', borderRadius: 2, color: '#555' }}>+ Add Card</button>
          </div>
        </div>

        {/* Invoices table */}
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 4 }}>
          <div style={{ padding: '13px 20px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
            <h3 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#222' }}>Invoice History</h3>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.87rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee', background: '#f9f9f9' }}>
                  {['Invoice #', 'Date', 'Due Date', 'Packages', 'Amount', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: '#444', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {invoices.map(inv => {
                  const isPaid = paid.includes(inv.id) || inv.status === 'paid';
                  return (
                    <tr key={inv.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#4D148C', fontFamily: 'monospace' }}>{inv.id}</td>
                      <td style={{ padding: '12px 16px', color: '#555' }}>{inv.date}</td>
                      <td style={{ padding: '12px 16px', color: '#555' }}>{inv.due}</td>
                      <td style={{ padding: '12px 16px', color: '#555', textAlign: 'center' }}>{inv.packages}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#222' }}>{inv.amount}</td>
                      <td style={{ padding: '12px 16px' }}>{statusBadge(isPaid ? 'paid' : inv.status)}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: '1px solid #ddd', padding: '4px 10px', fontSize: '0.75rem', cursor: 'pointer', borderRadius: 2, color: '#555' }}>
                            <Download size={12} /> PDF
                          </button>
                          {!isPaid && (
                            <button
                              onClick={() => payNow(inv.id)}
                              disabled={payingId === inv.id}
                              style={{ background: payingId === inv.id ? '#aaa' : '#FF6200', color: 'white', border: 'none', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', borderRadius: 2, letterSpacing: '0.04em' }}
                            >
                              {payingId === inv.id ? '...' : 'PAY'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;
