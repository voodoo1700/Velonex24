import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package, Search, MapPin, ArrowRight, RotateCcw,
  Clock, Truck, Shield, Globe, Plane, CalendarClock,
  Send, RefreshCw, Store, Navigation
} from 'lucide-react';

const HomePage = () => {
  const [trackingId, setTrackingId] = useState('');
  const navigate = useNavigate();

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      navigate(`/tracking?id=${trackingId.trim()}`);
    }
  };

  return (
    <div className="page">

      {/* ========== SECTION 1: HERO — Dark night sky with plane ========== */}
      <section style={{
        position: 'relative',
        background: 'linear-gradient(to bottom, #1a0533 0%, #2d1054 50%, #4D148C 100%)',
        minHeight: 380,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: 48,
        paddingBottom: 60
      }}>
        {/* Stars */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              background: 'white',
              borderRadius: '50%',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 70}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`
            }} />
          ))}
        </div>

        {/* Plane image positioned right */}
        <img
          src="/hero-night.png"
          alt="Velonex24 cargo plane"
          style={{
            position: 'absolute',
            right: -40,
            top: '50%',
            transform: 'translateY(-55%)',
            width: '55%',
            maxWidth: 700,
            objectFit: 'contain',
            opacity: 0.85,
            pointerEvents: 'none'
          }}
        />

        {/* Hero Text */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: 600, padding: '0 24px' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4.5vw, 3.5rem)',
            fontWeight: 800,
            color: 'white',
            fontStyle: 'italic',
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
            marginBottom: 36,
            textShadow: '0 2px 12px rgba(0,0,0,0.3)'
          }}>
            Ship, manage, track, deliver
          </h1>

          {/* Action Buttons Row */}
          <div className="hero-cta-row" style={{
            display: 'flex',
            gap: 16,
            justifyContent: 'center',
            marginBottom: 24,
            flexWrap: 'wrap'
          }}>
            {[
              { icon: <Send size={20} />, label: 'RATE & SHIP', path: '/shipping' },
              { icon: <Search size={20} />, label: 'TRACK', path: '/tracking', active: true },
              { icon: <MapPin size={20} />, label: 'LOCATIONS', path: '/locations' },
            ].map((btn, i) => (
              <Link
                key={i}
                to={btn.path}
                className={`hero-cta-btn${btn.active ? ' active' : ''}`}
              >
                {btn.icon}
                {btn.label}
              </Link>
            ))}
          </div>

          {/* Tracking Input */}
          <form onSubmit={handleTrack} className="hero-track-form" style={{
            display: 'flex',
            maxWidth: 440,
            margin: '0 auto',
            gap: 0,
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.25)'
          }}>
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="Enter Tracking ID"
              style={{
                flex: 1,
                padding: '13px 18px',
                border: '2px solid rgba(255,255,255,0.35)',
                borderRight: 'none',
                borderRadius: 'var(--radius-sm) 0 0 var(--radius-sm)',
                background: 'rgba(255,255,255,0.12)',
                color: 'white',
                fontSize: '0.95rem',
                outline: 'none',
                fontFamily: 'var(--font)',
                backdropFilter: 'blur(4px)',
              }}
              id="hero-tracking-input"
            />
            <button
              type="submit"
              style={{
                padding: '13px 30px',
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                fontWeight: 700,
                fontSize: '0.88rem',
                letterSpacing: '0.05em',
                cursor: 'pointer',
                fontFamily: 'var(--font)',
                transition: 'background 0.15s',
                minHeight: 44,
              }}
              onMouseOver={e => e.currentTarget.style.background = 'var(--accent-hover)'}
              onMouseOut={e => e.currentTarget.style.background = 'var(--accent)'}
              id="hero-track-btn"
            >
              TRACK
            </button>
          </form>
        </div>

        <style>{`
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
          #hero-tracking-input::placeholder { color: rgba(255,255,255,0.5); }
        `}</style>
      </section>

      {/* ========== SECTION 2: Info Banner ========== */}
      <div style={{
        background: 'var(--primary)',
        padding: '10px 0',
        borderBottom: '3px solid var(--accent)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: '0.82rem',
          color: 'white'
        }}>
          <div style={{
            width: 20, height: 20, borderRadius: '50%',
            border: '2px solid white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.7rem', fontWeight: 700, flexShrink: 0
          }}>i</div>
          <span>
            US Service Alert: Due to increased volume, some deliveries may experience slight delays.{' '}
            <a href="/support" style={{ color: 'white', textDecoration: 'underline', fontWeight: 600 }}>
              Get more info &gt;
            </a>
          </span>
        </div>
      </div>

      {/* ========== SECTION 3: Quick Actions Icon Row ========== */}
      <section style={{ padding: '40px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div className="quick-actions-row" style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 40,
            flexWrap: 'wrap',
          }}>
            {[
              { icon: <Package size={28} />, label: 'MANAGE A\nPACKAGE', path: '/tracking', id: 'qa-manage' },
              { icon: <RefreshCw size={28} />, label: 'REDIRECT A\nPACKAGE', path: '/tracking', id: 'qa-redirect' },
              { icon: <Store size={28} />, label: 'STORE HOURS\n& LOCATIONS', path: '/locations', id: 'qa-stores' },
              { icon: <CalendarClock size={28} />, label: 'SCHEDULE\nA PICKUP', path: '/shipping', id: 'qa-pickup' },
              { icon: <RotateCcw size={28} />, label: 'RETURNS &\nREFUNDS', path: '/support', id: 'qa-returns' },
            ].map((action) => (
              <Link
                key={action.id}
                id={action.id}
                to={action.path}
                className="quick-action-link"
              >
                <div className="quick-action-icon">
                  {action.icon}
                </div>
                <span style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  lineHeight: 1.3,
                  whiteSpace: 'pre-line'
                }}>
                  {action.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 4: Why ship with Velonex24? ========== */}
      <section style={{ padding: '56px 0', background: 'var(--bg-section)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            gap: 48,
            alignItems: 'flex-start',
            flexWrap: 'wrap'
          }}>
            {/* Left — Features */}
            <div style={{ flex: '1 1 420px' }}>
              <h2 style={{
                fontSize: '1.6rem',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'var(--text-dark)',
                marginBottom: 28
              }}>
                Why ship with Velonex24?
              </h2>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 28
              }}>
                {[
                  {
                    title: 'Innovative solutions for reliability & speed',
                    desc: 'Whether it\'s across states or worldwide, we prioritize secure and swift arrival of every package.'
                  },
                  {
                    title: 'Premium shipping at professional rates',
                    desc: 'When you need reliable delivery and careful handling, trust Velonex24 for competitive pricing.'
                  },
                  {
                    title: 'We ship everywhere',
                    desc: 'From local deliveries to 150+ countries, our network covers every ZIP code, every day.'
                  },
                  {
                    title: 'Simple & hassle-free shipping with no weighing',
                    desc: 'Use our pre-made flat rate packages. If it fits, it ships — one simple price, any weight.'
                  },
                ].map((item, i) => (
                  <div key={i} style={{ marginBottom: 12 }}>
                    <h4 style={{
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: 'var(--text-dark)',
                      marginBottom: 8,
                      lineHeight: 1.35
                    }}>{item.title}</h4>
                    <p style={{
                      fontSize: '0.83rem',
                      color: 'var(--text-secondary)',
                      lineHeight: 1.7,
                      marginBottom: 12
                    }}>{item.desc}</p>
                  </div>
                ))}
              </div>

              <p style={{
                fontSize: '0.78rem',
                color: 'var(--text-muted)',
                marginTop: 20,
                fontStyle: 'italic'
              }}>
                *Velonex24 delivers to every US ZIP code, including PO Boxes and military APO/FPO addresses.
              </p>

              <Link
                to="/shipping"
                className="btn btn-primary"
                style={{
                  marginTop: 24,
                  padding: '12px 28px',
                  fontSize: '0.82rem',
                  textDecoration: 'none'
                }}
              >
                START SHIPPING NOW
              </Link>
            </div>

            {/* Right — Image */}
            <div style={{ flex: '1 1 340px' }}>
              <img
                src="/delivery-woman.png"
                alt="Velonex24 delivery professional smiling in uniform"
                loading="lazy"
                style={{
                  width: '100%',
                  maxHeight: 420,
                  objectFit: 'cover',
                  borderRadius: 'var(--radius-md)'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION 5: Delivery options built for busy schedules ========== */}
      <section style={{ padding: '56px 0' }}>
        <div className="container">
          <h2 style={{
            fontSize: '1.6rem',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--text-dark)',
            textAlign: 'center',
            marginBottom: 36
          }}>
            Delivery options built for busy schedules
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 28
          }}>
            {[
              {
                image: '/card-overnight.png',
                title: 'When time is tight, overnight',
                desc: 'Need to ship a last minute item? Our overnight shipping gets your package there by 10:30 AM the next business day with Velonex24 Express.',
                link: 'SHIP OVERNIGHT',
                href: '/shipping'
              },
              {
                image: '/card-delivery.png',
                title: 'Get deliveries on your terms',
                desc: 'Redirect deliveries, schedule when your package arrives, request vacation holds, and more with Velonex24 Delivery Manager.',
                link: 'REVIEW PREFERENCES',
                href: '/tracking'
              },
              {
                image: '/card-tracking.png',
                title: 'Track in the blink of the wrist',
                desc: 'Follow packages in real-time on an interactive map with live GPS updates, delivery notifications, and photo proof of delivery.',
                link: 'DOWNLOAD THE APP',
                href: '/tracking'
              }
            ].map((card, i) => (
              <div key={i}>
                <img
                  src={card.image}
                  alt={card.title}
                  style={{
                    width: '100%',
                    height: 200,
                    objectFit: 'cover',
                    borderRadius: 'var(--radius-md) var(--radius-md) 0 0'
                  }}
                />
                <div style={{ padding: '18px 4px 4px' }}>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text-dark)',
                    marginBottom: 8
                  }}>{card.title}</h3>
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    marginBottom: 14
                  }}>{card.desc}</p>
                  <Link
                    to={card.href}
                    style={{
                      color: 'var(--text-link)',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4
                    }}
                  >
                    {card.link}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== SECTION 6: Comparison Banner ========== */}
      <section style={{
        padding: '48px 0',
        background: 'var(--bg-section)'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            gap: 40,
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{
                fontSize: '1.4rem',
                fontWeight: 700,
                color: 'var(--text-dark)',
                marginBottom: 12,
                lineHeight: 1.35
              }}>
                Velonex24 delivers to every US ZIP code every weekday, with{' '}
                <span style={{ color: 'var(--accent)' }}>NEXT-DAY OPTIONS</span>{' '}
                available nationwide
              </h2>
              <p style={{
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                marginBottom: 20
              }}>
                Fast, transparent, affordable. From overnight express to economy ground, our network 
                of hubs ensures your packages arrive on time, every time. Full tracking included on every shipment.
              </p>
              <Link
                to="/shipping"
                style={{
                  color: 'var(--text-link)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  textDecoration: 'none'
                }}
              >
                SEE WHY CUSTOMERS CHOOSE VELONEX24
              </Link>
            </div>
            <div style={{ flex: '1 1 350px' }}>
              <img
                src="/delivery-van.png"
                alt="Velonex24 delivery van on a city street"
                loading="lazy"
                style={{
                  width: '100%',
                  borderRadius: 'var(--radius-md)',
                  maxHeight: 300,
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION 7: Turn shipping into a business advantage ========== */}
      <section style={{ padding: '48px 0' }}>
        <div className="container">
          <h2 style={{
            fontSize: '1.6rem',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--text-dark)',
            textAlign: 'center',
            marginBottom: 8
          }}>
            Turn shipping into a business advantage
          </h2>
          <p style={{
            textAlign: 'center',
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            marginBottom: 32,
            maxWidth: 600,
            margin: '0 auto 32px'
          }}>
            Ship more responsibly with Velonex24's carbon-neutral shipping options and sustainable packaging solutions.
          </p>

          <div style={{
            background: 'var(--bg-section)',
            borderRadius: 'var(--radius-md)',
            padding: '28px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            flexWrap: 'wrap'
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: '#E0F5EC', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: 'var(--success)', flexShrink: 0
            }}>
              <Globe size={24} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4, color: 'var(--text-dark)' }}>
                Ship more responsibly
              </h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Velonex24 is working to reduce carbon emissions across our global network. Choose sustainable packaging 
                and carbon-offset shipping to help protect the planet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== SECTION 8: Purple Secondary Nav Bar ========== */}
      <div style={{
        background: 'var(--primary)',
        padding: '10px 0'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          flexWrap: 'wrap'
        }}>
          <Link to="/" style={{
            display: 'flex', alignItems: 'center', gap: 4,
            textDecoration: 'none', marginRight: 16
          }}>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'white' }}>Velon</span>
            <span style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--accent)' }}>Ex</span>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>24</span>
          </Link>
          {['Shipping', 'Tracking', 'Quick Tools', 'Locations', 'Support'].map((item, i) => (
            <Link
              key={i}
              to={`/${item === 'Quick Tools' ? 'shipping' : item.toLowerCase()}`}
              style={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.78rem',
                fontWeight: 500,
                padding: '6px 10px',
                textDecoration: 'none'
              }}
            >
              {item}
            </Link>
          ))}
        </div>
      </div>

      {/* ========== SECTION 9: Account / Rewards ========== */}
      <section style={{ padding: '40px 0', background: 'var(--bg-light)' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            gap: 32,
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <Shield size={28} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{
                fontSize: '1.3rem',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'var(--text-dark)',
                marginBottom: 8
              }}>
                ship, earn rewards, repeat
              </h3>
              <p style={{
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: 14
              }}>
                Join Velonex24 Rewards and earn points on every shipment. Redeem for discounts, free shipping, 
                and exclusive member benefits. Create a free account to get started.
              </p>
              <Link
                to="/auth"
                style={{
                  color: 'var(--text-link)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  textDecoration: 'none'
                }}
              >
                OPEN A FREE ACCOUNT
              </Link>
            </div>
          </div>

          {/* Additional Info */}
          <div style={{
            marginTop: 36,
            paddingTop: 24,
            borderTop: '1px solid var(--border)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24
          }}>
            <div>
              <h4 style={{
                fontSize: '0.85rem', fontWeight: 700,
                color: 'var(--text-dark)', marginBottom: 8
              }}>Get rate and surcharge changes</h4>
              <p style={{
                fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6
              }}>
                Get notified about{' '}
                <a href="/shipping" style={{ color: 'var(--text-link)' }}>shipping rate changes</a>
                {' '}and{' '}
                <a href="/shipping" style={{ color: 'var(--text-link)' }}>surcharge updates</a>.
              </p>
            </div>
            <div>
              <h4 style={{
                fontSize: '0.85rem', fontWeight: 700,
                color: 'var(--text-dark)', marginBottom: 8
              }}>Additional legal guidance</h4>
              <p style={{
                fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6
              }}>
                Velonex24 isn't just a shipping company. Find out what other products and services we offer, 
                including{' '}
                <a href="/support" style={{ color: 'var(--text-link)' }}>print or packing services</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
