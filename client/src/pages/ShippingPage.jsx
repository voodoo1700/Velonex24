import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Plane, Clock, Shield, ArrowRight, CheckCircle2, Globe, Zap } from 'lucide-react';

const ShippingPage = () => {
  const [fromZip, setFromZip] = useState('');
  const [toZip, setToZip] = useState('');
  const [weight, setWeight] = useState('');
  const [quoteResult, setQuoteResult] = useState(null);

  const handleQuote = (e) => {
    e.preventDefault();
    if (!fromZip || !toZip || !weight) return;
    // Simulated rate calculation
    const base = parseFloat(weight) * 2.5;
    setQuoteResult({
      express: (base * 1.8).toFixed(2),
      standard: (base * 1.2).toFixed(2),
      economy: base.toFixed(2),
      expressDays: '1-2',
      standardDays: '3-5',
      economyDays: '5-7'
    });
  };

  const services = [
    {
      icon: <Zap size={28} />,
      name: 'Velonex Express',
      desc: 'Next-day delivery for your most urgent shipments. Guaranteed delivery by 10:30 AM.',
      features: ['Next-day delivery', 'Real-time tracking', 'Signature required', 'Money-back guarantee'],
      color: '#FF6200'
    },
    {
      icon: <Truck size={28} />,
      name: 'Velonex Ground',
      desc: 'Reliable ground shipping for everyday packages. Cost-effective with full tracking.',
      features: ['3-5 day delivery', 'Full tracking', 'Up to 150 lbs', 'Residential & commercial'],
      color: '#4D148C'
    },
    {
      icon: <Plane size={28} />,
      name: 'Velonex International',
      desc: 'Ship worldwide to 150+ countries with customs clearance and door-to-door service.',
      features: ['150+ countries', 'Customs included', 'Door-to-door', 'Import/export support'],
      color: '#007AB7'
    },
    {
      icon: <Package size={28} />,
      name: 'Velonex Freight',
      desc: 'Heavy freight and pallet shipping for large commercial shipments over 150 lbs.',
      features: ['LTL & FTL options', 'Liftgate service', 'Inside delivery', 'White glove available'],
      color: '#00805A'
    }
  ];

  return (
    <div className="page" style={{ background: 'var(--bg-white)' }}>
      {/* Header */}
      <div style={{ background: 'var(--primary)', padding: '48px 0', color: 'white' }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: 8 }}>Shipping Services</h1>
          <p style={{ opacity: 0.85, fontSize: '1rem' }}>Choose the right shipping solution for every package</p>
        </div>
      </div>

      {/* Get a Quote */}
      <section style={{ padding: '48px 0', background: 'var(--bg-light)' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24, color: 'var(--text-dark)' }}>Get a Shipping Quote</h2>
          <div style={{
            background: 'white', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)', padding: '28px 32px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <form onSubmit={handleQuote} style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 16, alignItems: 'end'
            }}>
              <div className="input-group">
                <label>From (ZIP Code)</label>
                <input className="input" type="text" placeholder="e.g. 10001" value={fromZip} onChange={e => setFromZip(e.target.value)} />
              </div>
              <div className="input-group">
                <label>To (ZIP Code)</label>
                <input className="input" type="text" placeholder="e.g. 90210" value={toZip} onChange={e => setToZip(e.target.value)} />
              </div>
              <div className="input-group">
                <label>Weight (lbs)</label>
                <input className="input" type="number" placeholder="e.g. 5" value={weight} onChange={e => setWeight(e.target.value)} />
              </div>
              <button type="submit" className="btn btn-accent" style={{ height: 46 }}>GET QUOTE</button>
            </form>

            {quoteResult && (
              <div style={{
                marginTop: 24, display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16
              }}>
                {[
                  { name: 'Express', price: quoteResult.express, days: quoteResult.expressDays, color: '#FF6200' },
                  { name: 'Standard', price: quoteResult.standard, days: quoteResult.standardDays, color: '#4D148C' },
                  { name: 'Economy', price: quoteResult.economy, days: quoteResult.economyDays, color: '#007AB7' },
                ].map((rate, i) => (
                  <div key={i} style={{
                    border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                    padding: '20px', borderTop: `3px solid ${rate.color}`
                  }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase', color: rate.color, marginBottom: 4 }}>{rate.name}</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)' }}>${rate.price}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
                      <Clock size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />
                      {rate.days} business days
                    </div>
                    <Link to="/tracking" className="btn btn-outline btn-sm" style={{ marginTop: 12, width: '100%', borderColor: rate.color, color: rate.color }}>
                      SHIP NOW
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '64px 0' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-dark)' }}>Our Shipping Solutions</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '0.95rem' }}>
            From overnight to international, we have the right option for your needs.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
            {services.map((svc, i) => (
              <div key={i} style={{
                border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
                padding: '28px', borderTop: `3px solid ${svc.color}`,
                background: 'white', transition: 'box-shadow 0.2s'
              }}
                onMouseOver={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ color: svc.color, marginBottom: 16 }}>{svc.icon}</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 8 }}>{svc.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 16 }}>{svc.desc}</p>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {svc.features.map((f, j) => (
                    <li key={j} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle2 size={14} style={{ color: svc.color, flexShrink: 0 }} /> {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Shipping Calculator Info */}
      <section style={{ padding: '48px 0', background: 'var(--bg-light)' }}>
        <div className="container" style={{
          display: 'flex', gap: 48, alignItems: 'center', flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1 1 300px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 12, color: 'var(--text-dark)' }}>
              Simple, transparent pricing
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20 }}>
              No hidden fees, no surprises. Our rates are calculated based on package dimensions, weight, and destination. Get an instant quote above or contact our team for custom rates.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/support" className="btn btn-primary">CONTACT SALES</Link>
              <Link to="/tracking" className="btn btn-outline">SHIP NOW</Link>
            </div>
          </div>
          <div style={{ flex: '1 1 300px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { icon: <Globe size={22} />, label: '150+ Countries' },
              { icon: <Shield size={22} />, label: 'Fully Insured' },
              { icon: <Clock size={22} />, label: 'On-Time Guarantee' },
              { icon: <Package size={22} />, label: 'Any Size Package' },
            ].map((item, i) => (
              <div key={i} style={{
                background: 'white', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', padding: '20px',
                display: 'flex', alignItems: 'center', gap: 12
              }}>
                <span style={{ color: 'var(--primary)' }}>{item.icon}</span>
                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-dark)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ShippingPage;
