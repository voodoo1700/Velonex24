import { useState } from 'react';
import { useChat } from '../context/ChatContext';
import { Phone, Mail, MessageCircle, FileText, Package, Clock, AlertTriangle, HelpCircle, ChevronDown, ChevronUp, Send } from 'lucide-react';

const faqs = [
  { q: 'How do I track my package?', a: 'Enter your tracking number on our Tracking page or directly in the search bar on the homepage. You\'ll see real-time status updates, current location, and estimated delivery time on an interactive map.' },
  { q: 'What are your shipping rates?', a: 'Our rates depend on package weight, dimensions, and destination. Visit our Shipping page to get an instant quote. We offer Express, Standard, and Economy options to fit your budget.' },
  { q: 'How do I schedule a pickup?', a: 'You can schedule a pickup through our Shipping page or by contacting our support team. Pickups are available Monday through Saturday in most areas.' },
  { q: 'What if my package is delayed?', a: 'If your shipment is delayed, you can check the latest status on the Tracking page. Delays can occur due to weather, customs, or high volume. Contact support for specific delay inquiries.' },
  { q: 'Do you ship internationally?', a: 'Yes! Velonex24 ships to over 150 countries worldwide. Our international service includes customs clearance, door-to-door delivery, and full tracking.' },
  { q: 'How do I file a claim for a damaged package?', a: 'Contact our support team with your tracking number and photos of the damage. All shipments are insured and we process claims within 5-7 business days.' },
  { q: 'Can I redirect my package to a different address?', a: 'Yes, you can redirect packages that haven\'t been delivered yet. Use the Tracking page to request a redirect or contact support for assistance.' },
  { q: 'What are your holiday operating hours?', a: 'We operate on a modified schedule during major holidays. Check our Locations page for specific holiday hours at your nearest location.' },
];

const SupportPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const { toggleChat } = useChat();

  const handleContact = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
    setContactForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="page" style={{ background: 'var(--bg-white)' }}>
      {/* Header */}
      <div style={{ background: 'var(--primary)', padding: '48px 0', color: 'white' }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: 'white', marginBottom: 8 }}>Support</h1>
          <p style={{ opacity: 0.85, fontSize: '1rem' }}>We're here to help. Choose how you'd like to reach us.</p>
        </div>
      </div>

      {/* Contact Options */}
      <section style={{ padding: '48px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 48 }}>
            {[
              { icon: <MessageCircle size={24} />, title: 'Live Chat', desc: 'Chat with our AI assistant or a live agent 24/7', action: 'START CHAT', color: 'var(--primary)', onClick: () => toggleChat() },
              { icon: <Phone size={24} />, title: 'Call Us', desc: '+1 (603) 661-9146\nMon-Sat: 7AM - 10PM ET', action: 'CALL NOW', color: 'var(--accent)', href: 'tel:+16036619146' },
              { icon: <Mail size={24} />, title: 'Email', desc: 'support@velonex24.com\nResponse within 24 hours', action: 'SEND EMAIL', color: 'var(--info)', href: 'mailto:support@velonex24.com' },
              { icon: <FileText size={24} />, title: 'Help Center', desc: 'Browse FAQs and guides for self-service support', action: 'VIEW FAQS', color: 'var(--success)', onClick: () => document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' }) },
            ].map((opt, i) => (
              <div key={i} style={{
                background: 'white', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)', padding: '28px', textAlign: 'center',
                borderTop: `3px solid ${opt.color}`, transition: 'box-shadow 0.2s'
              }}
                onMouseOver={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                onMouseOut={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <div style={{ color: opt.color, marginBottom: 12 }}>{opt.icon}</div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-dark)' }}>{opt.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, whiteSpace: 'pre-line', marginBottom: 16 }}>{opt.desc}</p>
                {opt.href ? (
                  <a href={opt.href} className="btn btn-sm" style={{ background: opt.color, color: 'white', textDecoration: 'none' }}>{opt.action}</a>
                ) : (
                  <button onClick={opt.onClick} className="btn btn-sm" style={{ background: opt.color, color: 'white' }}>{opt.action}</button>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section id="faqs" style={{ padding: '48px 0', background: 'var(--bg-light)' }}>
        <div className="container" style={{ maxWidth: 800 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 24, color: 'var(--text-dark)' }}>Frequently Asked Questions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{
                background: 'white', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', overflow: 'hidden'
              }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{
                    width: '100%', padding: '16px 20px', background: 'transparent',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    cursor: 'pointer', border: 'none', textAlign: 'left'
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-dark)' }}>{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} /> : <ChevronDown size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />}
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 20px 16px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section style={{ padding: '48px 0' }}>
        <div className="container" style={{ maxWidth: 600 }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 8, color: 'var(--text-dark)' }}>Send Us a Message</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.9rem' }}>
            Fill out the form below and our team will respond within 24 hours.
          </p>

          {submitted && (
            <div style={{
              padding: '14px 20px', marginBottom: 20,
              background: '#E0F5EC', border: '1px solid #A8D8C0',
              borderRadius: 'var(--radius-sm)', color: 'var(--success)',
              fontSize: '0.9rem', fontWeight: 500
            }}>
              ✓ Message sent successfully. We'll get back to you soon!
            </div>
          )}

          <form onSubmit={handleContact} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="input-group">
                <label>Name</label>
                <input className="input" type="text" placeholder="Your name" required value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input className="input" type="email" placeholder="your@email.com" required value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} />
              </div>
            </div>
            <div className="input-group">
              <label>Subject</label>
              <select className="input" required value={contactForm.subject} onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}>
                <option value="">Select a topic...</option>
                <option value="tracking">Tracking Issue</option>
                <option value="shipping">Shipping Rate Inquiry</option>
                <option value="claim">File a Claim</option>
                <option value="pickup">Schedule a Pickup</option>
                <option value="account">Account Help</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="input-group">
              <label>Message</label>
              <textarea className="input" rows={5} placeholder="Describe your issue or question..." required style={{ resize: 'vertical' }} value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
              <Send size={16} /> SEND MESSAGE
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default SupportPage;
