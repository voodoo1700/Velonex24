import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Package, Printer, RefreshCw, MapPin, Truck,
  ShoppingBag, Camera, ChevronRight, Phone, Clock, Navigation,
  Store, WifiOff, Archive
} from 'lucide-react';

/* ─── DATA ─────────────────────────────────────────────────────── */

const usStates = [
  { state: 'Alabama', cities: ['Birmingham', 'Montgomery', 'Mobile', 'Huntsville'] },
  { state: 'Alaska', cities: ['Anchorage', 'Fairbanks', 'Juneau'] },
  { state: 'Arizona', cities: ['Phoenix', 'Tucson', 'Mesa', 'Scottsdale'] },
  { state: 'Arkansas', cities: ['Little Rock', 'Fort Smith', 'Fayetteville'] },
  { state: 'California', cities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento', 'San Jose'] },
  { state: 'Colorado', cities: ['Denver', 'Colorado Springs', 'Aurora', 'Boulder'] },
  { state: 'Connecticut', cities: ['Bridgeport', 'Hartford', 'New Haven'] },
  { state: 'Delaware', cities: ['Wilmington', 'Dover'] },
  { state: 'Florida', cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville', 'Fort Lauderdale'] },
  { state: 'Georgia', cities: ['Atlanta', 'Augusta', 'Savannah', 'Columbus'] },
  { state: 'Hawaii', cities: ['Honolulu', 'Hilo', 'Kailua'] },
  { state: 'Idaho', cities: ['Boise', 'Nampa', 'Meridian'] },
  { state: 'Illinois', cities: ['Chicago', 'Aurora', 'Rockford', 'Joliet'] },
  { state: 'Indiana', cities: ['Indianapolis', 'Fort Wayne', 'Evansville'] },
  { state: 'Iowa', cities: ['Des Moines', 'Cedar Rapids', 'Davenport'] },
  { state: 'Kansas', cities: ['Wichita', 'Overland Park', 'Kansas City'] },
  { state: 'Kentucky', cities: ['Louisville', 'Lexington', 'Bowling Green'] },
  { state: 'Louisiana', cities: ['New Orleans', 'Baton Rouge', 'Shreveport'] },
  { state: 'Maine', cities: ['Portland', 'Lewiston', 'Bangor'] },
  { state: 'Maryland', cities: ['Baltimore', 'Frederick', 'Rockville'] },
  { state: 'Massachusetts', cities: ['Boston', 'Worcester', 'Springfield', 'Lowell'] },
  { state: 'Michigan', cities: ['Detroit', 'Grand Rapids', 'Ann Arbor', 'Flint'] },
  { state: 'Minnesota', cities: ['Minneapolis', 'Saint Paul', 'Rochester'] },
  { state: 'Mississippi', cities: ['Jackson', 'Gulfport', 'Southaven'] },
  { state: 'Missouri', cities: ['Kansas City', 'Saint Louis', 'Springfield'] },
  { state: 'Montana', cities: ['Billings', 'Missoula', 'Great Falls'] },
  { state: 'Nebraska', cities: ['Omaha', 'Lincoln', 'Bellevue'] },
  { state: 'Nevada', cities: ['Las Vegas', 'Henderson', 'Reno'] },
  { state: 'New Hampshire', cities: ['Manchester', 'Nashua', 'Concord'] },
  { state: 'New Jersey', cities: ['Newark', 'Jersey City', 'Trenton', 'Camden'] },
  { state: 'New Mexico', cities: ['Albuquerque', 'Las Cruces', 'Santa Fe'] },
  { state: 'New York', cities: ['New York City', 'Buffalo', 'Rochester', 'Yonkers'] },
  { state: 'North Carolina', cities: ['Charlotte', 'Raleigh', 'Greensboro', 'Durham'] },
  { state: 'Ohio', cities: ['Columbus', 'Cleveland', 'Cincinnati', 'Toledo'] },
  { state: 'Oklahoma', cities: ['Oklahoma City', 'Tulsa', 'Norman'] },
  { state: 'Oregon', cities: ['Portland', 'Salem', 'Eugene'] },
  { state: 'Pennsylvania', cities: ['Philadelphia', 'Pittsburgh', 'Allentown', 'Erie'] },
  { state: 'Rhode Island', cities: ['Providence', 'Cranston', 'Warwick'] },
  { state: 'South Carolina', cities: ['Columbia', 'Charleston', 'Greenville'] },
  { state: 'Tennessee', cities: ['Nashville', 'Memphis', 'Knoxville', 'Chattanooga'] },
  { state: 'Texas', cities: ['Houston', 'Dallas', 'San Antonio', 'Austin', 'Fort Worth'] },
  { state: 'Utah', cities: ['Salt Lake City', 'West Valley City', 'Provo'] },
  { state: 'Virginia', cities: ['Virginia Beach', 'Norfolk', 'Richmond', 'Chesapeake'] },
  { state: 'Washington', cities: ['Seattle', 'Spokane', 'Tacoma', 'Bellevue'] },
  { state: 'Wisconsin', cities: ['Milwaukee', 'Madison', 'Green Bay'] },
  { state: 'Wyoming', cities: ['Cheyenne', 'Casper', 'Laramie'] },
];

const locationTypes = [
  {
    icon: <Store size={32} style={{ color: 'var(--primary)' }} />,
    name: 'Velonex24 Office',
    desc: 'Full-service shipping, packing, printing, passport photos & more. Our flagship locations with every service you need.',
    link: '#',
    linkLabel: 'Find Velonex24 Office locations ›'
  },
  {
    icon: <Truck size={32} style={{ color: 'var(--primary)' }} />,
    name: 'Velonex24 Ship Center®',
    desc: 'Drop off pre-labeled packages and get fast service. These standalone shipping stations offer quick, convenient drop-off.',
    link: '#',
    linkLabel: 'Find Ship Center locations ›'
  },
  {
    icon: <ShoppingBag size={32} style={{ color: 'var(--primary)' }} />,
    name: 'Office Max / Office Depot',
    desc: 'Drop off your Velonex24 packages at participating Office Max and Office Depot retail locations across the US.',
    link: '#',
    linkLabel: 'Find Office Max/Depot locations ›'
  },
];

const inStoreServices = [
  { icon: <Package size={28} />, label: 'Packing\nServices' },
  { icon: <Printer size={28} />, label: 'Printing\nServices' },
  { icon: <RefreshCw size={28} />, label: 'Passport\nPhoto' },
  { icon: <Archive size={28} />, label: 'Mailbox\nServices' },
  { icon: <Camera size={28} />, label: 'Large Format\nPrinting' },
];

const popularLinks = [
  { icon: <Package size={18} />, label: 'Drop Off a Package', to: '/drop-off' },
  { icon: <MapPin size={18} />, label: 'Find Hours & Locations', to: '#' },
  { icon: <Printer size={18} />, label: 'Print Documents', to: '#' },
];

/* ─── COMPONENT ─────────────────────────────────────────────────── */

const LocationsPage = () => {
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      window.open(`https://www.google.com/maps/search/Velonex24+${encodeURIComponent(query)}`, '_blank');
    }
  };

  return (
    <div className="page" style={{ background: 'var(--bg-white)' }}>

      {/* ══════════════════════════════════════════
          HERO: Find Velonex24 Locations — United States
          ══════════════════════════════════════════ */}
      <section style={{ background: 'var(--primary)', padding: '40px 0 0' }}>
        <div className="container">
          <h1 style={{
            color: 'white',
            fontSize: 'clamp(1.5rem, 3vw, 2rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            marginBottom: 20
          }}>
            Find Velonex24 Locations — United States
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} style={{
            display: 'flex',
            background: 'white',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            maxWidth: 640,
            marginBottom: 32,
            boxShadow: '0 2px 12px rgba(0,0,0,0.15)'
          }}>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="FIND LOCATIONS NEAR YOU"
              style={{
                flex: 1,
                padding: '14px 18px',
                border: 'none',
                outline: 'none',
                fontSize: '0.88rem',
                fontWeight: 600,
                letterSpacing: '0.03em',
                color: 'var(--text-dark)',
                fontFamily: 'var(--font)',
                textTransform: 'uppercase'
              }}
            />
            <button
              type="submit"
              style={{
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                padding: '14px 28px',
                fontWeight: 700,
                fontSize: '0.88rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontFamily: 'var(--font)'
              }}
            >
              <Search size={18} /> SEARCH
            </button>
          </form>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          IN-STORE SHIPPING SERVICES ROW
          ══════════════════════════════════════════ */}
      <section style={{ padding: '36px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <p style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            marginBottom: 24
          }}>
            In-store shipping services near you
          </p>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 40,
            flexWrap: 'wrap'
          }}>
            {inStoreServices.map((svc, i) => (
              <div key={i} style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'color 0.2s'
              }}
                onMouseOver={e => e.currentTarget.style.color = 'var(--primary)'}
                onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}
              >
                <div style={{
                  width: 56, height: 56,
                  borderRadius: '50%',
                  border: '2px solid currentColor',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'inherit'
                }}>
                  {svc.icon}
                </div>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  whiteSpace: 'pre-line',
                  textAlign: 'center',
                  lineHeight: 1.3
                }}>
                  {svc.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SUPPORT FEATURES
          ══════════════════════════════════════════ */}
      <section style={{ padding: '56px 0' }}>
        <div className="container">
          <h2 style={{
            fontSize: 'clamp(1.3rem, 2.5vw, 1.7rem)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--text-dark)',
            marginBottom: 40,
            textAlign: 'center'
          }}>
            Whether you're printing, shipping or receiving, you've got support!
          </h2>

          {/* Feature Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 0
          }}>
            {/* Feature 1 */}
            <div style={{
              display: 'flex', gap: 20, padding: '20px 24px 20px 0',
              borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)'
            }}>
              <img
                src="/delivery-woman.png"
                alt="Ship when you want"
                style={{ width: 120, height: 100, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
                onError={e => { e.target.style.display='none'; }}
              />
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 6 }}>
                  Ship when you want
                </h3>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                  Flexible drop-off and pick-up options available 7 days a week. Ship on your schedule at thousands of Velonex24 locations.
                </p>
                <Link to="/drop-off" style={{ color: 'var(--text-link)', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
                  See drop-off options ›
                </Link>
              </div>
            </div>

            {/* Feature 2 */}
            <div style={{
              display: 'flex', gap: 20, padding: '20px 0 20px 24px',
              borderBottom: '1px solid var(--border)'
            }}>
              <img
                src="/packing-help.png"
                alt="Wallet-friendly shipping"
                style={{ width: 120, height: 100, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
                onError={e => { e.target.style.display='none'; }}
              />
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 6 }}>
                  Wallet-friendly shipping with no weighing
                </h3>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                  Use our flat-rate boxes — if it fits, it ships for one simple price. No scale, no surprises. Perfect for irregular items.
                </p>
                <a href="#" style={{ color: 'var(--text-link)', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
                  See flat-rate shipping ›
                </a>
              </div>
            </div>

            {/* Feature 3 */}
            <div style={{
              display: 'flex', gap: 20, padding: '20px 24px 20px 0',
              borderBottom: '1px solid var(--border)', borderRight: '1px solid var(--border)'
            }}>
              <div style={{
                width: 120, height: 100, borderRadius: 'var(--radius-sm)', flexShrink: 0,
                background: 'linear-gradient(135deg, #4D148C 0%, #FF6200 100%)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Camera size={40} color="white" />
              </div>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 6 }}>
                  Need passport photos? No problem.
                </h3>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                  Get government-compliant passport and visa photos at any Velonex24 Office. Fast, professional, printed in minutes for $14.95.
                </p>
                <a href="#" style={{ color: 'var(--text-link)', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
                  Get passport photos ›
                </a>
              </div>
            </div>

            {/* Feature 4 */}
            <div style={{
              display: 'flex', gap: 20, padding: '20px 0 20px 24px',
              borderBottom: '1px solid var(--border)'
            }}>
              <img
                src="/dropoff-hero.png"
                alt="Receiving a package"
                style={{ width: 120, height: 100, objectFit: 'cover', borderRadius: 'var(--radius-sm)', flexShrink: 0 }}
                onError={e => { e.target.style.display='none'; }}
              />
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: 6 }}>
                  Receiving a package while you're away?
                </h3>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 8 }}>
                  Hold your delivery at a Velonex24 location near you. Pick it up at your convenience — no missed deliveries.
                </p>
                <Link to="/tracking" style={{ color: 'var(--text-link)', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none' }}>
                  Redirect your delivery ›
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PURPLE CTA BANNER
          ══════════════════════════════════════════ */}
      <section style={{
        background: 'var(--primary)',
        padding: '28px 0'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 20,
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              border: '2px solid rgba(255,255,255,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <Store size={24} color="white" />
            </div>
            <div>
              <p style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600, lineHeight: 1.4 }}>
                Local shipping for less at the Velonex24 Pack & Ship Store —
              </p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.83rem' }}>
                Ship packages under 50 lbs and save vs standard pricing.
              </p>
            </div>
          </div>
          <Link
            to="/shipping"
            style={{
              background: 'var(--accent)',
              color: 'white',
              padding: '11px 22px',
              borderRadius: 'var(--radius-sm)',
              fontWeight: 700,
              fontSize: '0.8rem',
              letterSpacing: '0.04em',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase'
            }}
          >
            LEARN MORE
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          POPULAR IN-STORE SERVICES (purple links)
          ══════════════════════════════════════════ */}
      <section style={{ padding: '36px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <p style={{
            fontSize: '0.88rem',
            fontWeight: 700,
            color: 'var(--text-dark)',
            marginBottom: 16
          }}>
            Popular in-store services and shipping options:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {popularLinks.map((item, i) => (
              <Link
                key={i}
                to={item.to}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 10,
                  color: 'var(--text-link)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  textDecoration: 'none'
                }}
                onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'}
                onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PICKUP & DROP-OFF LOCATION TYPES
          ══════════════════════════════════════════ */}
      <section style={{ padding: '56px 0', background: 'var(--bg-section)' }}>
        <div className="container">
          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--text-dark)',
            marginBottom: 32
          }}>
            Pickup and Dropoff® locations
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {locationTypes.map((lt, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: 24,
                padding: '24px 0',
                borderBottom: i < locationTypes.length - 1 ? '1px solid var(--border)' : 'none',
                alignItems: 'flex-start'
              }}>
                {/* Icon box */}
                <div style={{
                  width: 90, height: 80,
                  background: '#F0E6FF',
                  borderRadius: 'var(--radius-sm)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {lt.icon}
                </div>
                <div>
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: 'var(--text-dark)',
                    marginBottom: 6
                  }}>
                    {lt.name}
                  </h3>
                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.65,
                    marginBottom: 8,
                    maxWidth: 600
                  }}>
                    {lt.desc}
                  </p>
                  <a
                    href={lt.link}
                    style={{
                      color: 'var(--text-link)',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                    onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}
                  >
                    {lt.linkLabel}
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* "See more" button */}
          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <button style={{
              border: '2px solid var(--primary)',
              color: 'var(--primary)',
              background: 'transparent',
              padding: '10px 32px',
              borderRadius: 'var(--radius-full)',
              fontWeight: 700,
              fontSize: '0.82rem',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
              onMouseOver={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }}
              onMouseOut={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--primary)'; }}
            >
              SEE MORE LOCATIONS
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          LOCAL SHIPPING SERVICES TEXT
          ══════════════════════════════════════════ */}
      <section style={{ padding: '48px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--text-dark)',
            marginBottom: 16
          }}>
            Local shipping services from Velonex24
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 14 }}>
            With thousands of Velonex24 locations across the United States, you're never far from fast, reliable shipping services.
            Whether you're a business owner, online seller, or individual shipper, Velonex24 provides the tools and locations to
            make domestic and international shipping simple.
          </p>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 14 }}>
            Visit a local Velonex24 Office for end-to-end shipping support — from packing your items safely to choosing the
            fastest delivery option. Our locations also offer fax, notary, mail forwarding, PO Box rentals, printing and more.
          </p>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.75 }}>
            For quick drop-offs, head to a Velonex24 Ship Center or one of our authorized partner retail locations.
            Participating stores include major national retailers — providing accessible drop-off points in nearly every ZIP code in America.
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          VELONEX24 LOCATIONS — US STATE GRID
          ══════════════════════════════════════════ */}
      <section style={{ padding: '48px 0' }}>
        <div className="container">
          <h2 style={{
            fontSize: '1.4rem',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--text-dark)',
            marginBottom: 28,
            paddingBottom: 16,
            borderBottom: '2px solid var(--primary)'
          }}>
            Velonex24 locations — United States
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '20px 32px'
          }}>
            {usStates.map((s, i) => (
              <div key={i}>
                <p style={{
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--text-dark)',
                  marginBottom: 6,
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em'
                }}>
                  {s.state}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {s.cities.map((city, j) => (
                    <a
                      key={j}
                      href={`https://www.google.com/maps/search/Velonex24+${encodeURIComponent(city + ', ' + s.state)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: 'var(--text-link)',
                        fontSize: '0.82rem',
                        textDecoration: 'none',
                        lineHeight: 1.6
                      }}
                      onMouseOver={e => e.currentTarget.style.textDecoration = 'underline'}
                      onMouseOut={e => e.currentTarget.style.textDecoration = 'none'}
                    >
                      {city}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default LocationsPage;
