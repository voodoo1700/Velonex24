import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChevronDown, User, Search, X, Menu,
  Package, Clock, Truck, Globe, RotateCcw, ArchiveX,
  Layers, Printer, ShoppingBag, MapPin, Store,
  HelpCircle, FileText, Settings, MessageSquare, CreditCard, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

/* ─── Dropdown data ─────────────────────────────────────────────── */

const NAV_ITEMS = [
  {
    label: 'Shipping',
    items: [
      { label: 'Create a Shipment',               to: '/shipping',   icon: <Package size={15} /> },
      { label: 'Shipping Rates & Delivery Times',  to: '/shipping',   icon: <Clock size={15} /> },
      { label: 'Schedule & Manage Pickups',        to: '/shipping',   icon: <Truck size={15} /> },
      { label: 'Packing & Shipping Supplies',      to: '/shipping',   icon: <ArchiveX size={15} /> },
      { label: 'International Shipping Guide',     to: '/shipping',   icon: <Globe size={15} /> },
      { label: 'Freight',                          to: '/shipping',   icon: <Layers size={15} /> },
      { label: 'Manage a Return',                  to: '/shipping',   icon: <RotateCcw size={15} /> },
    ],
    cta: { label: 'ALL SHIPPING SERVICES', to: '/shipping' },
  },
  {
    label: 'Tracking',
    type: 'tracking',  // special: has inline track form
    items: [
      { label: 'Advanced Shipment Tracking',  to: '/tracking', icon: <Search size={15} /> },
      { label: 'Manage Your Delivery',        to: '/tracking', icon: <Package size={15} /> },
    ],
    cta: { label: 'ALL TRACKING SERVICES', to: '/tracking' },
  },
  {
    label: 'Design & Print',
    items: [
      { label: 'Explore Print, Products & Design', to: '/shipping', icon: <Printer size={15} /> },
      { label: 'Browse Services',                  to: '/shipping', icon: <ShoppingBag size={15} /> },
    ],
    cta: { label: 'VISIT NEW MARKETPLACE', to: '/shipping' },
  },
  {
    label: 'Locations',
    items: [
      { label: 'Drop Off a Package', to: '/drop-off', icon: <Package size={15} /> },
    ],
    cta: { label: 'FIND A LOCATION', to: '/locations' },
  },
  {
    label: 'Support',
    items: [
      { label: 'Small Business Center',      to: '/support', icon: <Store size={15} /> },
      { label: 'Velonex24 Service Guide',    to: '/support', icon: <FileText size={15} /> },
      { label: 'Account Management Tools',   to: '/support', icon: <Settings size={15} /> },
      { label: 'Frequently Asked Questions', to: '/support', icon: <HelpCircle size={15} /> },
      { label: 'File a Claim',               to: '/support', icon: <AlertCircle size={15} /> },
      { label: 'Billing & Invoicing',        to: '/support', icon: <CreditCard size={15} /> },
    ],
    cta: { label: 'CUSTOMER SUPPORT', to: '/support' },
  },
];

/* ─── Single dropdown menu ──────────────────────────────────────── */

const NavDropdown = ({ item, isOpen, onOpen, onClose }) => {
  const navigate = useNavigate();
  const [trackId, setTrackId] = useState('');
  const timerRef = useRef(null);
  const ref = useRef(null);
  const location = useLocation();

  const isActive = item.items.some(i => location.pathname === i.to) ||
    (item.cta && location.pathname === item.cta.to);

  const enter = () => { clearTimeout(timerRef.current); onOpen(); };
  const leave = () => { timerRef.current = setTimeout(onClose, 120); };

  const handleTrack = (e) => {
    e.preventDefault();
    if (trackId.trim()) { navigate('/tracking'); onClose(); }
  };

  return (
    <div
      ref={ref}
      style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <button
        onClick={() => isOpen ? onClose() : onOpen()}
        style={{
          height: '100%',
          padding: '0 10px',
          background: 'transparent',
          border: 'none',
          color: 'white',
          fontSize: '0.83rem',
          fontWeight: isActive ? 700 : 400,
          display: 'flex',
          alignItems: 'center',
          gap: 3,
          cursor: 'pointer',
          fontFamily: 'var(--font)',
          borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
          opacity: isActive ? 1 : 0.92,
          transition: 'opacity 0.15s',
          whiteSpace: 'nowrap',
        }}
        onMouseOver={e => e.currentTarget.style.opacity = 1}
        onMouseOut={e => { if (!isActive) e.currentTarget.style.opacity = 0.88; }}
      >
        {item.label}
        <ChevronDown
          size={13}
          style={{ transition: 'transform 0.2s', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)' }}
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: 'white',
            border: '1px solid #e0e0e0',
            borderTop: '3px solid var(--accent)',
            borderRadius: '0 0 4px 4px',
            boxShadow: '0 6px 24px rgba(0,0,0,0.13)',
            minWidth: item.type === 'tracking' ? 260 : 260,
            zIndex: 300,
            padding: '6px 0 4px',
          }}
          onMouseEnter={enter}
          onMouseLeave={leave}
        >
          {/* Tracking dropdown: inline tracking form first */}
          {item.type === 'tracking' && (
            <div style={{ padding: '14px 20px 6px', borderBottom: '1px solid #eee', marginBottom: 4 }}>
              <p style={{ fontSize: '0.72rem', fontWeight: 700, color: '#444', marginBottom: 8, letterSpacing: '0.03em' }}>
                Tracking ID
              </p>
              <form onSubmit={handleTrack} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <input
                  value={trackId}
                  onChange={e => setTrackId(e.target.value)}
                  placeholder="Tracking ID"
                  style={{
                    border: '1px solid #ccc',
                    borderRadius: 3,
                    padding: '9px 12px',
                    fontSize: '0.83rem',
                    outline: 'none',
                    fontFamily: 'var(--font)',
                    color: 'var(--text-dark)'
                  }}
                />
                <button
                  type="submit"
                  style={{
                    background: 'var(--accent)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 3,
                    padding: '9px 16px',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    fontFamily: 'var(--font)'
                  }}
                >
                  TRACK →
                </button>
              </form>
            </div>
          )}

          {/* Regular items */}
          {item.items.map((link, i) => (
            <Link
              key={i}
              to={link.to}
              onClick={onClose}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '11px 20px',
                color: '#222',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 400,
                borderBottom: i < item.items.length - 1 ? '1px solid #f0f0f0' : 'none',
                transition: 'background 0.12s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#f7f7f7'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ color: '#888', flexShrink: 0 }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}

          {/* CTA link at bottom */}
          {item.cta && (
            <Link
              to={item.cta.to}
              onClick={onClose}
              style={{
                display: 'block',
                padding: '11px 20px',
                color: 'var(--primary)',
                fontWeight: 700,
                fontSize: '0.78rem',
                letterSpacing: '0.06em',
                textDecoration: 'none',
                borderTop: '1px solid #eee',
                marginTop: 2,
                transition: 'background 0.12s'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#f7f7f7'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              {item.cta.label}
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

/* ─── Search overlay ─────────────────────────────────────────────── */

const SearchOverlay = ({ open, onClose }) => {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => ref.current?.focus(), 60);
  }, [open]);

  const submit = (e) => {
    e.preventDefault();
    if (q.trim()) { navigate('/tracking'); onClose(); }
  };

  if (!open) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
      zIndex: 500, display: 'flex', alignItems: 'flex-start', paddingTop: 64
    }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%', background: 'white',
          padding: '20px var(--container-padding)',
          display: 'flex', gap: 12, alignItems: 'center', maxWidth: 720, margin: '0 auto'
        }}
        onClick={e => e.stopPropagation()}
      >
        <Search size={20} style={{ color: '#888', flexShrink: 0 }} />
        <form onSubmit={submit} style={{ flex: 1 }}>
          <input
            ref={ref}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search Velonex24..."
            style={{
              width: '100%', border: 'none', outline: 'none',
              fontSize: '1rem', fontFamily: 'var(--font)', color: 'var(--text-dark)'
            }}
          />
        </form>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <X size={20} style={{ color: '#666' }} />
        </button>
      </div>
    </div>
  );
};

/* ─── Main Navbar ─────────────────────────────────────────────────── */

const ACCOUNT_ITEMS = [
  { label: 'My profile',        to: '/profile' },
  { label: 'Email preferences', to: '/email-preferences' },
  { label: 'Address book',      to: '/address-book' },
  { label: 'View & pay bill',   to: '/billing' },
  { label: 'Reporting',         to: '/reporting' },
];

const Navbar = () => {
  const [openMenu, setOpenMenu] = useState(null);   // index of open dropdown
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const accountRef = useRef(null);
  const location = useLocation();
  const { user, logout, isAdmin } = useAuth();

  // Close account dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (accountRef.current && !accountRef.current.contains(e.target)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const isAdminPage = location.pathname.startsWith('/admin');
  if (isAdminPage) return null;

  // Close the active dropdown when route changes
  useEffect(() => { setOpenMenu(null); setMobileOpen(false); }, [location.pathname]);

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 'var(--navbar-height)',
        background: 'var(--primary)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'stretch',
        boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
      }}>
        <div style={{
          width: '100%',
          maxWidth: 'var(--container-max)',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'space-between',
        }}>

          {/* ── Left group: Logo + Nav items ── */}
          <div style={{ display: 'flex', alignItems: 'stretch' }}>
            <Link
              to="/"
              style={{
                display: 'flex', alignItems: 'center', gap: 0,
                textDecoration: 'none', flexShrink: 0, marginRight: 20
              }}
            >
              <span style={{ fontSize: '1.45rem', fontWeight: 900, color: 'white', letterSpacing: '-0.01em' }}>Velon</span>
              <span style={{ fontSize: '1.45rem', fontWeight: 900, color: 'var(--accent)', letterSpacing: '-0.01em' }}>Ex</span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)', marginLeft: 2, alignSelf: 'flex-end', marginBottom: 4 }}>24</span>
            </Link>

            {/* ── Desktop nav items ── */}
            <div className="nav-links" style={{ display: 'flex', alignItems: 'stretch' }}>
              {NAV_ITEMS.map((item, i) => (
                <NavDropdown
                  key={i}
                  item={item}
                  isOpen={openMenu === i}
                  onOpen={() => setOpenMenu(i)}
                  onClose={() => setOpenMenu(null)}
                />
              ))}
            </div>
          </div>

          {/* ── Right side: Account + Search ── */}
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>

            {/* Account button + dropdown */}
            <div ref={accountRef} style={{ position: 'relative', height: '100%', display: 'flex', alignItems: 'center' }}>
              {user ? (
                /* Logged-in: show name + logout */
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button
                    onClick={() => setAccountOpen(o => !o)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      background: 'transparent', border: 'none', color: 'white',
                      fontSize: '0.83rem', fontWeight: 400, cursor: 'pointer',
                      fontFamily: 'var(--font)', padding: '0 10px', height: '100%',
                      opacity: accountOpen ? 1 : 0.92, whiteSpace: 'nowrap',
                      borderBottom: accountOpen ? '2px solid var(--accent)' : '2px solid transparent',
                    }}
                  >
                    <User size={18} />
                    {user.name || user.email}
                  </button>
                </div>
              ) : (
                /* Logged-out: Sign Up or Log In */
                <button
                  onClick={() => setAccountOpen(o => !o)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    background: 'transparent', border: 'none', color: 'white',
                    fontSize: '0.83rem', fontWeight: 400, cursor: 'pointer',
                    fontFamily: 'var(--font)', padding: '0 10px', height: '100%',
                    opacity: accountOpen ? 1 : 0.92, whiteSpace: 'nowrap',
                    borderBottom: accountOpen ? '2px solid var(--accent)' : '2px solid transparent',
                  }}
                >
                  <User size={18} />
                  Sign Up or Log In
                </button>
              )}

              {/* Account dropdown panel */}
              {accountOpen && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0,
                  background: 'white', minWidth: 260,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
                  zIndex: 400,
                  borderTop: '3px solid var(--accent)',
                }}>
                  {/* Header: SIGN UP / LOG IN */}
                  <div style={{ padding: '14px 20px 10px', borderBottom: '1px solid #e8e8e8' }}>
                    <Link
                      to="/auth"
                      onClick={() => setAccountOpen(false)}
                      style={{
                        display: 'block', color: 'var(--primary)',
                        fontSize: '0.9rem', fontWeight: 800,
                        textDecoration: 'underline', letterSpacing: '0.01em',
                      }}
                    >
                      SIGN UP / LOG IN
                    </Link>
                  </div>

                  {/* Menu items */}
                  {(user ? [
                    ...ACCOUNT_ITEMS,
                    { label: 'Log Out', to: null, isLogout: true },
                  ] : ACCOUNT_ITEMS).map((item, idx) => (
                    <div key={idx} style={{ borderBottom: '1px solid #e8e8e8' }}>
                      {item.isLogout ? (
                        <button
                          onClick={() => { logout(); setAccountOpen(false); }}
                          style={{
                            display: 'block', width: '100%', textAlign: 'left',
                            padding: '13px 20px', color: '#222', fontSize: '0.88rem',
                            textDecoration: 'underline', background: 'none', border: 'none',
                            cursor: 'pointer', fontFamily: 'var(--font)',
                          }}
                        >
                          {item.label}
                        </button>
                      ) : (
                        <Link
                          to={item.to}
                          onClick={() => setAccountOpen(false)}
                          style={{
                            display: 'block', padding: '13px 20px',
                            color: '#222', fontSize: '0.88rem',
                            textDecoration: 'underline',
                          }}
                        >
                          {item.label}
                        </Link>
                      )}
                    </div>
                  ))}

                  {/* Footer promo */}
                  {!user && (
                    <div style={{ padding: '14px 20px', background: '#f7f7f7' }}>
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#333', lineHeight: 1.5 }}>
                        <Link
                          to="/auth"
                          onClick={() => setAccountOpen(false)}
                          style={{ fontWeight: 700, color: '#222', textDecoration: 'underline' }}
                        >
                          Open an account
                        </Link>
                        {' '}to save on shipping costs, time-saving tools and more!
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Search icon */}
            <button
              onClick={() => setSearchOpen(true)}
              style={{
                background: 'var(--accent)', border: 'none',
                color: 'white', cursor: 'pointer',
                padding: '0 14px', height: '100%',
                display: 'flex', alignItems: 'center',
                transition: 'opacity 0.15s',
              }}
              title="Search"
            >
              <Search size={20} />
            </button>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            className="mobile-toggle"
            onClick={() => setMobileOpen(o => !o)}
            style={{
              display: 'none', background: 'transparent',
              border: 'none', color: 'white', padding: 8, cursor: 'pointer'
            }}
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 'var(--navbar-height)', left: 0, right: 0,
          background: 'white', borderBottom: '1px solid var(--border)',
          zIndex: 199, boxShadow: 'var(--shadow-md)', maxHeight: '80vh', overflowY: 'auto'
        }}>
          {NAV_ITEMS.flatMap(item => [
            ...item.items.map((link, j) => (
              <Link
                key={`${item.label}-${j}`}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block', padding: '13px 24px',
                  color: 'var(--text-dark)', fontSize: '0.9rem',
                  textDecoration: 'none', borderBottom: '1px solid var(--border-light)',
                  fontWeight: 500
                }}
              >
                {link.label}
              </Link>
            )),
            item.cta ? (
              <Link
                key={`${item.label}-cta`}
                to={item.cta.to}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: 'block', padding: '13px 24px',
                  color: 'var(--primary)', fontSize: '0.8rem',
                  textDecoration: 'none', borderBottom: '2px solid var(--border)',
                  fontWeight: 700, letterSpacing: '0.05em'
                }}
              >
                {item.cta.label}
              </Link>
            ) : null
          ])}
          <Link
            to={user ? '/' : '/auth'}
            onClick={() => { setMobileOpen(false); if (user) logout(); }}
            style={{
              display: 'block', padding: '14px 24px',
              color: 'var(--primary)', fontWeight: 700, fontSize: '0.9rem',
              textDecoration: 'none'
            }}
          >
            {user ? 'Log Out' : 'Sign Up or Log In'}
          </Link>
        </div>
      )}

      {/* ── Search Overlay ── */}
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <style>{`
        @media (max-width: 820px) {
          .nav-links { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </>
  );
};

export default Navbar;
