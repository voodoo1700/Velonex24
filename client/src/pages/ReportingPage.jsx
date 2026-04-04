import { useState } from 'react';
import { BarChart2, TrendingUp, Package, Clock, MapPin, Download } from 'lucide-react';

const BAR_DATA = [
  { month: 'Oct', count: 34 }, { month: 'Nov', count: 51 },
  { month: 'Dec', count: 89 }, { month: 'Jan', count: 62 },
  { month: 'Feb', count: 45 }, { month: 'Mar', count: 78 },
];
const MAX_COUNT = Math.max(...BAR_DATA.map(d => d.count));

const recentShipments = [
  { id: 'VLX-938471', dest: 'New York, NY', date: 'Mar 28', status: 'Delivered', weight: '2.3 lbs', cost: '$18.40' },
  { id: 'VLX-938304', dest: 'Chicago, IL',  date: 'Mar 26', status: 'Delivered', weight: '5.1 lbs', cost: '$34.20' },
  { id: 'VLX-937889', dest: 'Los Angeles, CA', date: 'Mar 24', status: 'Delivered', weight: '1.0 lbs', cost: '$12.90' },
  { id: 'VLX-937521', dest: 'Miami, FL',   date: 'Mar 21', status: 'Delivered', weight: '8.7 lbs', cost: '$62.50' },
  { id: 'VLX-937100', dest: 'Seattle, WA', date: 'Mar 18', status: 'Delivered', weight: '3.2 lbs', cost: '$28.70' },
];

const Stat = ({ icon: Icon, color, bg, label, value, sub }) => (
  <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 4, padding: '18px 20px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={17} color={color} />
      </div>
      <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{label}</span>
    </div>
    <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#222', lineHeight: 1 }}>{value}</p>
    {sub && <p style={{ margin: '6px 0 0', fontSize: '0.78rem', color: '#888' }}>{sub}</p>}
  </div>
);

const ReportingPage = () => {
  const [range, setRange] = useState('6m');

  return (
    <div className="page" style={{ background: '#f5f5f5', paddingTop: 56 }}>
      <div style={{ background: 'var(--primary)', padding: '36px 0 32px' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h1 style={{ color: 'white', margin: 0, fontWeight: 300, fontSize: '1.75rem' }}>Reporting</h1>
              <p style={{ color: 'rgba(255,255,255,0.75)', margin: '6px 0 0', fontSize: '0.9rem' }}>Shipping analytics and performance insights</p>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {['1m', '3m', '6m', '1y'].map(r => (
                <button key={r} onClick={() => setRange(r)} style={{
                  padding: '6px 14px', border: 'none', borderRadius: 2, fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
                  background: range === r ? '#FF6200' : 'rgba(255,255,255,0.15)',
                  color: 'white', letterSpacing: '0.04em',
                }}>{r.toUpperCase()}</button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        {/* KPI row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
          <Stat icon={Package} color="#4D148C" bg="#f0ebf8" label="Total Shipments" value="359" sub="↑ 14% vs last period" />
          <Stat icon={TrendingUp} color="#1a7a45" bg="#e8f8f0" label="Total Spend" value="$8,261" sub="↑ 8% vs last period" />
          <Stat icon={Clock} color="#b06a00" bg="#fff8e6" label="Avg. Transit Time" value="2.4 days" sub="Within SLA" />
          <Stat icon={MapPin} color="#1a6bbf" bg="#E8F0FB" label="Top Destination" value="New York" sub="48 shipments" />
        </div>

        {/* Bar chart */}
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 4, padding: 24, marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#222' }}>Monthly Shipment Volume</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <BarChart2 size={16} color="#4D148C" />
              <span style={{ fontSize: '0.78rem', color: '#888' }}>Last 6 months</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 140 }}>
            {BAR_DATA.map(d => (
              <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: '0.72rem', color: '#888', fontWeight: 600 }}>{d.count}</span>
                <div style={{
                  width: '100%', background: 'var(--primary)',
                  height: `${(d.count / MAX_COUNT) * 110}px`,
                  borderRadius: '3px 3px 0 0',
                  transition: 'height 0.4s',
                  opacity: 0.85,
                }} />
                <span style={{ fontSize: '0.75rem', color: '#555' }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent shipments table */}
        <div style={{ background: 'white', border: '1px solid #e5e5e5', borderRadius: 4 }}>
          <div style={{ padding: '13px 20px', borderBottom: '1px solid #f0f0f0', background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#222' }}>Recent Shipments</h3>
            <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid #ccc', padding: '5px 12px', fontSize: '0.78rem', cursor: 'pointer', color: '#555', borderRadius: 2 }}>
              <Download size={12} /> Export CSV
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.87rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee', background: '#f9f9f9' }}>
                  {['Tracking ID', 'Destination', 'Date', 'Status', 'Weight', 'Cost'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontWeight: 700, color: '#444', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentShipments.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#4D148C', fontFamily: 'monospace' }}>{s.id}</td>
                    <td style={{ padding: '12px 16px', color: '#333' }}>{s.dest}</td>
                    <td style={{ padding: '12px 16px', color: '#777' }}>{s.date}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ background: '#e8f8f0', color: '#1a7a45', fontSize: '0.72rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>{s.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>{s.weight}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#222' }}>{s.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportingPage;
