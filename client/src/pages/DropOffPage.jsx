import { Link } from 'react-router-dom';
import {
  Package, Tag, QrCode, Printer, MapPin, CheckCircle2,
  ArrowRight, HelpCircle, Store, Truck, Shield, Clock
} from 'lucide-react';

const DropOffPage = () => {
  return (
    <div className="page" style={{ background: 'var(--bg-white)' }}>

      {/* ========== HERO: Fast and easy package drop off ========== */}
      <section style={{
        position: 'relative',
        background: 'var(--primary)',
        minHeight: 320,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 32,
          position: 'relative',
          zIndex: 2,
          flexWrap: 'wrap',
          padding: '48px 24px'
        }}>
          {/* Left */}
          <div style={{ flex: '1 1 400px', maxWidth: 520 }}>
            <h1 style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'white',
              lineHeight: 1.3,
              marginBottom: 12
            }}>
              Fast and easy<br />package drop off
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              marginBottom: 24
            }}>
              Drop off pre-labeled, pre-packaged shipments at a Velonex24 location near you.
            </p>

            <Link
              to="/locations"
              style={{
                display: 'inline-block',
                background: 'var(--accent)',
                color: 'white',
                padding: '14px 28px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.85rem',
                letterSpacing: '0.04em',
                textDecoration: 'none',
                textTransform: 'uppercase',
                transition: 'background 0.2s'
              }}
            >
              FIND A DROP OFF LOCATION
            </Link>

            <p style={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: '0.78rem',
              marginTop: 12
            }}>
              <a href="/locations" style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'underline' }}>
                Full service locations &gt;
              </a>
            </p>
          </div>

          {/* Right — Image */}
          <div style={{ flex: '1 1 300px', maxWidth: 460 }}>
            <img
              src="/dropoff-hero.png"
              alt="Velonex24 drop off location"
              style={{
                width: '100%',
                borderRadius: 'var(--radius-md)',
                objectFit: 'cover',
                maxHeight: 280
              }}
            />
          </div>
        </div>
      </section>

      {/* ========== Quick Drop Off Options ========== */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--text-dark)',
            textAlign: 'center',
            marginBottom: 36
          }}>
            You're busy. Drop off quickly on the go.
          </h2>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 48,
            flexWrap: 'wrap'
          }}>
            {[
              { icon: <Tag size={28} />, label: 'PRE-PAID LABEL\nDROP OFF' },
              { icon: <Package size={28} />, label: 'PACKING &\nDROP OFF' },
              { icon: <QrCode size={28} />, label: 'LABEL-FREE\nDROP OFF' },
              { icon: <Printer size={28} />, label: 'PRINT LABEL &\nDROP OFF' },
            ].map((action, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  transition: 'color 0.2s',
                  width: 120,
                  textAlign: 'center'
                }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--primary)'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <div style={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  border: '2px solid currentColor',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}>
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Where can I drop off a Velonex24 package? ========== */}
      <section style={{ padding: '48px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--text-dark)',
            marginBottom: 12
          }}>
            Where can I drop off a Velonex24 package?
          </h2>
          <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            lineHeight: 1.7,
            maxWidth: 700,
            margin: '0 auto 24px'
          }}>
            Thousands of Velonex24 locations are available across the US including Velonex24 Offices, retail partner locations,
            and authorized shipping centers. Find drop off points at major retailers near you.
          </p>

          <Link
            to="/locations"
            className="btn btn-outline"
            style={{
              borderColor: 'var(--primary)',
              color: 'var(--primary)',
              fontWeight: 700,
              fontSize: '0.82rem',
              padding: '10px 24px',
              marginBottom: 36,
              textDecoration: 'none',
              display: 'inline-block'
            }}
          >
            FIND DROP OFF LOCATIONS NEAR YOU
          </Link>

          {/* Partner Logos Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 16,
            maxWidth: 700,
            margin: '0 auto'
          }}>
            {[
              { name: 'Velonex Express', color: '#4D148C', sub: '' },
              { name: 'Velonex Office', color: '#FF6200', sub: '' },
              { name: 'Dollar General', color: '#FEDD00', textColor: '#333' },
              { name: 'Walgreens', color: '#E31837', sub: '' },
              { name: 'Office Depot', color: '#CC0000', sub: 'OfficeMax' },
              { name: 'Walmart', color: '#0071CE', sub: '' },
              { name: 'PakMail', color: '#003087', sub: '' },
              { name: 'PostalAnnex+', color: '#1A237E', sub: '' },
              { name: 'PostNet', color: '#009933', sub: '' },
            ].map((partner, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '14px 12px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-light)',
                border: '1px solid var(--border)',
                transition: 'box-shadow 0.2s',
                cursor: 'pointer'
              }}
                onMouseOver={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
                onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ textAlign: 'center' }}>
                  <span style={{
                    fontWeight: 800,
                    fontSize: i < 2 ? '1rem' : '0.82rem',
                    color: partner.textColor || partner.color,
                    letterSpacing: '-0.01em'
                  }}>
                    {partner.name}
                  </span>
                  {partner.sub && (
                    <span style={{ display: 'block', fontSize: '0.65rem', color: partner.color, fontWeight: 600 }}>
                      {partner.sub}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== How does Velonex24 drop off work? — 3 Steps ========== */}
      <section style={{ padding: '56px 0', background: 'var(--bg-section)' }}>
        <div className="container">
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--text-dark)',
            textAlign: 'center',
            marginBottom: 40
          }}>
            How does Velonex24 drop off work?
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 32
          }}>
            {[
              {
                step: 'STEP 1',
                image: '/step1-pack.png',
                title: 'Pack and seal your package securely',
                desc: 'Make sure your items are well-protected inside the box. Use bubble wrap, packing peanuts, or crumpled paper to cushion contents. Seal all seams with strong packing tape.'
              },
              {
                step: 'STEP 2',
                image: '/step2-label.png',
                title: 'Attach your shipping label to the package',
                desc: 'Print your prepaid Velonex24 label and attach it to the largest flat surface of your box. Cover old labels or barcodes. You can create labels at velonex24.com or through the app.'
              },
              {
                step: 'STEP 3',
                image: '/step3-dropoff.png',
                title: 'Drop off at a Velonex24 location near you',
                desc: 'Bring your sealed, labeled package to any Velonex24 drop off location. No waiting in line needed at self-service kiosks. Get a receipt for your records and track your shipment.'
              }
            ].map((step, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ position: 'relative', marginBottom: 16 }}>
                  <img
                    src={step.image}
                    alt={step.title}
                    style={{
                      width: '100%',
                      height: 220,
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-md)'
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: -14,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--primary)',
                    color: 'white',
                    padding: '6px 20px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em'
                  }}>
                    {step.step}
                  </div>
                </div>
                <h3 style={{
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--text-dark)',
                  marginTop: 24,
                  marginBottom: 8
                }}>{step.title}</h3>
                <p style={{
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.65
                }}>{step.desc}</p>
              </div>
            ))}
          </div>

          <div style={{
            textAlign: 'center',
            marginTop: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            color: 'var(--text-muted)',
            fontSize: '0.85rem'
          }}>
            <CheckCircle2 size={18} style={{ color: 'var(--success)' }} />
            If you haven't packed yet, our partners can help with packing at many locations.
          </div>
        </div>
      </section>

      {/* ========== Can I drop off without a printed label? ========== */}
      <section style={{ padding: '56px 0' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--text-dark)',
            textAlign: 'center',
            marginBottom: 28
          }}>
            Can I drop off without a printed label?
          </h2>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 20
          }}>
            {/* Option 1 */}
            <div style={{
              display: 'flex',
              gap: 16,
              alignItems: 'flex-start',
              padding: '20px 24px',
              background: 'var(--bg-light)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: '#F0E6FF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--primary)', flexShrink: 0
              }}>
                <QrCode size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-dark)', marginBottom: 4 }}>
                  Use a QR code for label-free drop off
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Our <strong>Velonex24 Label-Free</strong> service allows you to drop off packages without printing a label. 
                  Simply show your QR code at participating locations and the staff will print and apply the label for you. 
                  Compatible with many major e-commerce return platforms.
                </p>
              </div>
            </div>

            {/* Option 2 */}
            <div style={{
              display: 'flex',
              gap: 16,
              alignItems: 'flex-start',
              padding: '20px 24px',
              background: 'var(--bg-light)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)'
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: '#FFE8D6',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent)', flexShrink: 0
              }}>
                <Printer size={22} />
              </div>
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-dark)', marginBottom: 4 }}>
                  Print at a Velonex24 Office or retail location
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Visit any <strong>Velonex24 Office</strong> or <strong>partner retail location</strong> to print your shipping label on-site. 
                  Just bring your shipment details or confirmation email, and our team will help you get your label printed and attached.
                </p>
              </div>
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: 20 }}>
            <a
              href="/locations"
              style={{
                color: 'var(--text-link)',
                fontWeight: 700,
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                textDecoration: 'none'
              }}
            >
              FIND LABEL-FREE DROP OFF LOCATIONS
            </a>
          </div>
        </div>
      </section>

      {/* ========== Purple CTA Banner ========== */}
      <section style={{
        background: 'var(--primary)',
        padding: '40px 0',
        overflow: 'hidden'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          gap: 32,
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{
              fontSize: '1.4rem',
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'white',
              marginBottom: 12,
              lineHeight: 1.35
            }}>
              Get the best from locations near you — with handy shipping tips & tools
            </h2>
            <p style={{
              color: 'rgba(255,255,255,0.75)',
              fontSize: '0.88rem',
              lineHeight: 1.6,
              marginBottom: 20
            }}>
              Find full-service Velonex24 locations that offer packing services, printing, shipping supplies, 
              mailbox rental, notary services, and more. Everything you need for your business or personal shipments.
            </p>
            <Link
              to="/locations"
              style={{
                display: 'inline-block',
                background: 'var(--accent)',
                color: 'white',
                padding: '12px 24px',
                borderRadius: 'var(--radius-sm)',
                fontWeight: 700,
                fontSize: '0.82rem',
                letterSpacing: '0.04em',
                textDecoration: 'none'
              }}
            >
              FIND LOCATIONS NEAR YOU
            </Link>
          </div>
          <div style={{ flex: '1 1 350px' }}>
            <img
              src="/card-delivery.png"
              alt="Velonex24 locations and services"
              style={{
                width: '100%',
                borderRadius: 'var(--radius-md)',
                maxHeight: 260,
                objectFit: 'cover'
              }}
            />
          </div>
        </div>
      </section>

      {/* ========== Can I get packing help? ========== */}
      <section style={{ padding: '56px 0' }}>
        <div className="container">
          <div style={{
            display: 'flex',
            gap: 40,
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: '1 1 400px' }}>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 300,
                fontStyle: 'italic',
                color: 'var(--text-dark)',
                marginBottom: 12
              }}>
                Can I get packing help?
              </h2>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                lineHeight: 1.7,
                marginBottom: 16
              }}>
                Yes! Velonex24 Office locations and select retail partners offer professional packing services. 
                Our trained team members can help you pack your items securely using the right box, proper cushioning materials, 
                and professional packing techniques to protect your shipment.
              </p>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                marginBottom: 20
              }}>
                {[
                  'Professional packing materials available for purchase',
                  'Expert pack & ship services — we do it for you',
                  'Custom crating for fragile or oversized items',
                  'Free packing advice and supplies checklist'
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)'
                  }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    {item}
                  </div>
                ))}
              </div>
              <Link
                to="/locations"
                style={{
                  color: 'var(--text-link)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  textDecoration: 'none'
                }}
              >
                FIND PACKING SERVICES NEAR YOU
              </Link>
            </div>
            <div style={{ flex: '1 1 340px' }}>
              <img
                src="/packing-help.png"
                alt="Packing help at Velonex24"
                style={{
                  width: '100%',
                  borderRadius: 'var(--radius-md)',
                  maxHeight: 320,
                  objectFit: 'cover'
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ========== Purple Secondary Nav ========== */}
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

      {/* ========== Account / Returns CTA ========== */}
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
                Made an online purchase? Almost nothing is easier to return.
              </h3>
              <p style={{
                fontSize: '0.88rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginBottom: 14
              }}>
                Returning items from online retailers? Many retailers offer Velonex24 label-free returns — 
                just bring the item and your QR code to a participating location. No box, no label, no hassle.
              </p>
              <Link
                to="/support"
                style={{
                  color: 'var(--text-link)',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  textDecoration: 'none'
                }}
              >
                LEARN ABOUT EASY RETURNS
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DropOffPage;
