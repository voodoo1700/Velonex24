const Footer = () => {
  return (
    <footer>
      {/* Main footer */}
      <div style={{ background: 'var(--primary-dark)', padding: '48px 0 32px' }}>
        <div className="container">
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: 32, marginBottom: 32
          }}>
            {/* Our Company */}
            <div>
              <h4 style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Our Company</h4>
              {['About Velonex24', 'Our Portfolio', 'Investor Relations', 'Careers', 'Newsroom', 'Blog'].map(item => (
                <a key={item} href="#" style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: 8, textDecoration: 'none' }}>
                  {item}
                </a>
              ))}
            </div>

            {/* More from VelonEx */}
            <div>
              <h4 style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.04em' }}>More from Velonex</h4>
              {['Velonex Express', 'Velonex Ground', 'Velonex Freight', 'Velonex Logistics', 'Velonex Office'].map(item => (
                <a key={item} href="#" style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: 8, textDecoration: 'none' }}>
                  {item}
                </a>
              ))}
            </div>

            {/* Quick Links */}
            <div>
              <h4 style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Quick Links</h4>
              {['Get a Quote', 'Ship Now', 'Track a Package', 'Shipping Rates', 'Find Locations', 'Contact Support'].map(item => (
                <a key={item} href="#" style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: 8, textDecoration: 'none' }}>
                  {item}
                </a>
              ))}
            </div>

            {/* Connect */}
            <div>
              <h4 style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Connect with Us</h4>
              {/* Phone */}
              <a href="tel:+16036619146" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem', marginBottom: 10, textDecoration: 'none', fontWeight: 600 }}>
                📞 +1 (603) 661-9146
              </a>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', margin: '0 0 14px', paddingLeft: 22 }}>Mon–Sat: 7AM – 10PM ET</p>
              {/* Email placeholder — update when domain mailbox is ready */}
              <a href="mailto:support@velonex24.com" style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: 10, textDecoration: 'none' }}>
                ✉️ support@velonex24.com
              </a>
              {['Service Alerts', 'Developer Portal', 'API Documentation'].map(item => (
                <a key={item} href="#" style={{ display: 'block', color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', marginBottom: 8, textDecoration: 'none' }}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Trust Badges Strip ── */}
      <div style={{
        background: '#1E0640',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        padding: '18px 0',
      }}>
        <div className="container" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 24, flexWrap: 'wrap'
        }}>

          {/* Badge 1: Secure Browsing */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8,
            padding: '10px 18px',
          }}>
            <svg width="36" height="36" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Shield */}
              <path d="M50 6L14 22v24c0 20.5 15.4 39.6 36 44 20.6-4.4 36-23.5 36-44V22L50 6z" fill="white" opacity="0.15" stroke="white" strokeWidth="3"/>
              <path d="M50 6L14 22v24c0 20.5 15.4 39.6 36 44 20.6-4.4 36-23.5 36-44V22L50 6z" fill="none" stroke="white" strokeWidth="3"/>
              {/* Checkmark */}
              <path d="M32 50l12 12 24-24" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Monitor - offset right/down */}
              <rect x="46" y="60" width="28" height="20" rx="3" fill="white" opacity="0.9"/>
              <rect x="54" y="80" width="12" height="4" fill="white" opacity="0.9"/>
              <rect x="49" y="84" width="18" height="2" rx="1" fill="white" opacity="0.7"/>
              {/* Phone */}
              <rect x="76" y="64" width="14" height="22" rx="3" fill="white" opacity="0.9"/>
              <rect x="81" y="83" width="4" height="2" rx="1" fill="#4D148C" opacity="0.7"/>
            </svg>
            <div>
              <p style={{ color: 'white', fontSize: '0.78rem', fontWeight: 700, margin: 0, letterSpacing: '0.02em' }}>
                Secure Browsing
              </p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.68rem', margin: 0 }}>
                Protected on all devices
              </p>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />

          {/* Badge 2: TrustedSite Certified Secure */}
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            background: 'white',
            border: '1px solid #e0e0e0',
            borderRadius: 8,
            overflow: 'hidden',
            minWidth: 160,
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          }}>
            {/* Top portion */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 14px 6px',
              background: 'white', width: '100%', boxSizing: 'border-box'
            }}>
              {/* Green checkmark box */}
              <div style={{
                width: 28, height: 28, background: '#5CB85C',
                borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L20 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#222' }}>Trusted</span>
                <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#5CB85C' }}>Site</span>
                <sup style={{ fontSize: '0.55rem', color: '#222', fontWeight: 400 }}>®</sup>
              </div>
            </div>
            {/* Bottom grey strip */}
            <div style={{
              background: '#e8e8e8', width: '100%',
              padding: '4px 0', textAlign: 'center'
            }}>
              <span style={{
                fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.12em',
                color: '#555', textTransform: 'uppercase'
              }}>
                CERTIFIED SECURE
              </span>
            </div>
          </div>

          {/* Divider */}
          <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.12)', flexShrink: 0 }} />

          {/* Badge 3: SSL Encrypted */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 8,
            padding: '10px 18px',
          }}>
            <svg width="28" height="34" viewBox="0 0 28 34" fill="none">
              <rect x="3" y="14" width="22" height="18" rx="3" fill="white" opacity="0.9"/>
              <path d="M8 14v-5a6 6 0 0 1 12 0v5" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="14" cy="22" r="3" fill="#4D148C"/>
              <rect x="13" y="23" width="2" height="4" rx="1" fill="#4D148C"/>
            </svg>
            <div>
              <p style={{ color: 'white', fontSize: '0.78rem', fontWeight: 700, margin: 0 }}>SSL Encrypted</p>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.68rem', margin: 0 }}>256-bit encryption</p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ background: '#2A0A50', padding: '16px 0' }}>
        <div className="container" style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 12
        }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>
            © 2024 Velonex24. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 16 }}>
            {['Terms of Use', 'Privacy Policy', 'Cookies', 'Ad Choices'].map(item => (
              <a key={item} href="#" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', textDecoration: 'none' }}>
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
