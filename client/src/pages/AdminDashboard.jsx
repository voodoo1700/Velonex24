import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, MessageCircle, Users,
  CheckCircle2, PauseCircle, Send, X, Plus, Edit3,
  Truck, Clock, LogOut, Search, Shield, Trash2,
  RefreshCw, AlertTriangle, DollarSign, FileText,
  Globe, RotateCcw, Zap, Hash
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import api from '../services/api';

/* ─── Constants ──────────────────────────────────────────── */
const STATUS_LABELS = {
  pending: 'Pending', picked_up: 'Picked Up', in_transit: 'In Transit',
  out_for_delivery: 'Out for Delivery', delivered: 'Delivered', on_hold: 'On Hold'
};
const STATUS_ICONS = {
  pending: '⏳', picked_up: '📦', in_transit: '🚚',
  out_for_delivery: '🚀', delivered: '✅', on_hold: '⏸'
};
const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending' },
  { value: 'picked_up', label: 'Picked Up' },
  { value: 'in_transit', label: 'In Transit' },
  { value: 'out_for_delivery', label: 'Out for Delivery' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'on_hold', label: 'On Hold' },
];
const INVOICE_TYPES = [
  { value: 'shipping_fee', label: '📦 Shipping Fee' },
  { value: 'delay_fee',    label: '⚠️ Delay Fee' },
  { value: 'customs_fee',  label: '🛃 Customs Fee' },
  { value: 'storage_fee',  label: '🏭 Storage Fee' },
  { value: 'other',        label: '💼 Other' },
];

/* ─── Tracking ID generator ─────────────────────────────── */
const genTrackingId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let id = 'VLX-';
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
};

const EMPTY_FORM = () => ({
  trackingId: genTrackingId(),
  senderName: '', senderAddress: '',
  receiverName: '', receiverAddress: '',
  weight: '', packageType: 'Standard',
  origin:      { city: '', lat: 40.7128, lng: -74.006 },
  destination: { city: '', lat: 34.0522, lng: -118.243 },
  currentLocation: { city: '', lat: 40.7128, lng: -74.006 },
  status: 'pending',
  holdReason: '', delayReason: '', delayDescription: '',
  customsIntercepted: false, borderClearanceEligible: false, customsNotes: '',
  estimatedDelivery: '',
  invoices: [],
});

/* ─── Toggle switch component ───────────────────────────── */
function Toggle({ value, onChange, label, sub }) {
  return (
    <div className="admin-toggle" onClick={() => onChange(!value)}>
      <div className="admin-toggle-label">
        <span>{label}</span>
        {sub && <span>{sub}</span>}
      </div>
      <div className={`admin-switch ${value ? 'on' : ''}`} />
    </div>
  );
}

/* ─── Form field helpers ────────────────────────────────── */
function Field({ label, children }) {
  return (
    <div className="input-group" style={{ marginBottom: 0 }}>
      <label style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, display: 'block', marginBottom: 6 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

/* ─── Shipment Modal ────────────────────────────────────── */
function ShipmentModal({ initial, onClose, onSaved }) {
  const isEdit = !!initial?._id;
  const [form, setForm] = useState(() => {
    if (initial) {
      const copy = { ...initial, trackingId: initial.trackingId || genTrackingId() };
      if (copy.estimatedDelivery) {
        copy.estimatedDelivery = new Date(copy.estimatedDelivery).toISOString().substring(0, 10);
      }
      return copy;
    }
    return EMPTY_FORM();
  });
  const [newInvoice, setNewInvoice] = useState({ amount: '', description: '', type: 'shipping_fee' });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (path, val) => {
    setForm(prev => {
      const parts = path.split('.');
      if (parts.length === 1) return { ...prev, [path]: val };
      return { ...prev, [parts[0]]: { ...prev[parts[0]], [parts[1]]: val } };
    });
  };

  const addInvoice = () => {
    if (!newInvoice.amount || !newInvoice.description) return;
    setForm(prev => ({
      ...prev,
      invoices: [...(prev.invoices || []), { ...newInvoice, amount: parseFloat(newInvoice.amount), paid: false, createdAt: new Date().toISOString() }]
    }));
    setNewInvoice({ amount: '', description: '', type: 'shipping_fee' });
  };

  const removeInvoice = (idx) => setForm(prev => ({ ...prev, invoices: prev.invoices.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setErr('');
    try {
      const payload = { ...form };
      if (!isEdit) {
        // Fallback currentLocation.city to origin.city since it is hidden in the form but required by mongoose
        if (!payload.currentLocation?.city && payload.origin?.city) {
          payload.currentLocation = { ...payload.currentLocation, city: payload.origin.city };
        } else if (!payload.currentLocation?.city) {
          payload.currentLocation = { ...payload.currentLocation, city: 'Origin Facility' };
        }
      }
      if (!payload.estimatedDelivery) delete payload.estimatedDelivery;

      if (isEdit) { await api.updateShipment(form._id, payload); }
      else { await api.createShipment(payload); }
      onSaved(); onClose();
    } catch (e) { setErr(e.message); } finally { setSaving(false); }
  };

  const inp = (label, path, type='text', placeholder='', extra={}) => (
    <Field label={label}>
      <input
        className="input"
        type={type}
        placeholder={placeholder}
        value={path.includes('.') ? (form[path.split('.')[0]]?.[path.split('.')[1]] ?? '') : (form[path] ?? '')}
        onChange={e => set(path, type === 'number' ? +e.target.value : e.target.value)}
        style={{ fontSize: '0.87rem' }}
        {...extra}
      />
    </Field>
  );

  const totalInvoices = (form.invoices || []).reduce((s, inv) => s + (inv.amount || 0), 0);

  return (
    <div className="admin-modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="admin-modal">
        {/* Header */}
        <div className="admin-modal-header">
          <div className="admin-modal-title">
            {isEdit ? <><Edit3 size={18} /> Edit Shipment</> : <><Zap size={18} /> Create New Shipment</>}
          </div>
          <button className="admin-modal-close" onClick={onClose}><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
          <div className="admin-modal-body">
            {err && <div style={{ padding: '10px 14px', marginBottom: 16, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#f87171', fontSize: '0.85rem' }}>{err}</div>}

            {/* Tracking ID */}
            {!isEdit && (
              <div className="admin-form-section">
                <div className="admin-form-section-title"><Hash size={13} /> Tracking ID</div>
                <div className="admin-tracking-preview">
                  <div>
                    <div className="admin-tracking-preview-label">Auto-generated tracking number</div>
                    <div className="admin-tracking-preview-id">{form.trackingId}</div>
                  </div>
                  <button type="button" onClick={() => set('trackingId', genTrackingId())} className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>
                    <RotateCcw size={13} /> Regenerate
                  </button>
                </div>
              </div>
            )}

            {/* Sender */}
            <div className="admin-form-section">
              <div className="admin-form-section-title">📤 Sender Details</div>
              <div className="admin-form-grid">
                {inp('Sender Name', 'senderName', 'text', 'Full name or company')}
                {inp('Sender Address', 'senderAddress', 'text', '123 Main St, City, ST')}
                {inp('Origin City', 'origin.city', 'text', 'New York')}
              </div>
            </div>

            {/* Receiver */}
            <div className="admin-form-section">
              <div className="admin-form-section-title">📥 Receiver Details</div>
              <div className="admin-form-grid">
                {inp('Receiver Name', 'receiverName', 'text', 'Full name')}
                {inp('Receiver Address', 'receiverAddress', 'text', '456 Oak Ave, City, ST')}
                {inp('Destination City', 'destination.city', 'text', 'Los Angeles')}
              </div>
            </div>

            {/* Package */}
            <div className="admin-form-section">
              <div className="admin-form-section-title">📦 Package Info</div>
              <div className="admin-form-grid">
                {inp('Weight (lbs)', 'weight', 'number', '2.5')}
                {inp('Est. Delivery', 'estimatedDelivery', 'date')}
                <Field label="Package Type">
                  <select className="input" style={{ fontSize: '0.87rem' }} value={form.packageType} onChange={e => set('packageType', e.target.value)}>
                    {['Standard', 'Express', 'Flat Rate', 'Fragile', 'Oversized', 'Priority'].map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </Field>
                <Field label="Current Status" >
                  <select className="input" style={{ fontSize: '0.87rem' }} value={form.status} onChange={e => set('status', e.target.value)}>
                    {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </Field>
              </div>
            </div>

            {/* Delay & Hold */}
            <div className="admin-form-section">
              <div className="admin-form-section-title">⚠️ Delay & Hold Information</div>
              <div className="admin-form-grid">
                <Field label="Hold Reason">
                  <input className="input" placeholder="e.g. Address verification required" value={form.holdReason || ''} onChange={e => set('holdReason', e.target.value)} style={{ fontSize: '0.87rem' }} />
                </Field>
                <Field label="Delay Reason">
                  <input className="input" placeholder="e.g. Weather, port congestion" value={form.delayReason || ''} onChange={e => set('delayReason', e.target.value)} style={{ fontSize: '0.87rem' }} />
                </Field>
                <div style={{ gridColumn: '1/-1' }}>
                  <Field label="Delay Description (shown to customer)" >
                    <textarea className="input" placeholder="Provide a detailed explanation for the customer..." value={form.delayDescription || ''} onChange={e => set('delayDescription', e.target.value)} rows={2} style={{ fontSize: '0.87rem', resize: 'vertical', width: '100%' }} />
                  </Field>
                </div>
              </div>
            </div>

            {/* Customs */}
            <div className="admin-form-section">
              <div className="admin-form-section-title"><Globe size={13} /> Customs & Border Control</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14 }}>
                <Toggle
                  value={form.customsIntercepted}
                  onChange={v => set('customsIntercepted', v)}
                  label="Customs Intercepted"
                  sub="Package held by customs officers"
                />
                <Toggle
                  value={form.borderClearanceEligible}
                  onChange={v => set('borderClearanceEligible', v)}
                  label="Eligible for Border Clearance"
                  sub="Item qualifies for clearance processing"
                />
              </div>
              <Field label="Customs Notes">
                <textarea className="input" placeholder="Notes for customs officers, clearance instructions, HS code..." value={form.customsNotes || ''} onChange={e => set('customsNotes', e.target.value)} rows={2} style={{ fontSize: '0.87rem', resize: 'vertical', width: '100%' }} />
              </Field>
            </div>

            {/* Invoices */}
            <div className="admin-form-section">
              <div className="admin-form-section-title">
                <DollarSign size={13} /> Invoices & Fees
                {totalInvoices > 0 && <span style={{ marginLeft: 8, color: '#fbbf24', fontWeight: 700 }}>Total: ${totalInvoices.toFixed(2)}</span>}
              </div>

              {/* Existing invoices */}
              {(form.invoices || []).map((inv, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, padding: '10px 14px', background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: 8 }}>
                  <DollarSign size={14} color="#fbbf24" />
                  <div style={{ flex: 1 }}>
                    <span style={{ fontWeight: 700, color: '#fbbf24', fontSize: '0.9rem' }}>${parseFloat(inv.amount).toFixed(2)}</span>
                    <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginLeft: 8 }}>{inv.description}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', marginLeft: 8 }}>[{INVOICE_TYPES.find(t => t.value === inv.type)?.label || inv.type}]</span>
                  </div>
                  <button type="button" onClick={() => removeInvoice(i)} style={{ background: 'none', border: 'none', color: 'rgba(239,68,68,0.6)', cursor: 'pointer', padding: 4 }}>
                    <X size={14} />
                  </button>
                </div>
              ))}

              {/* Add new invoice */}
              <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 140px 40px', gap: 8, alignItems: 'end' }}>
                <Field label="Amount ($)">
                  <input className="input" type="number" min="0" step="0.01" placeholder="2000.00" value={newInvoice.amount} onChange={e => setNewInvoice(p => ({ ...p, amount: e.target.value }))} style={{ fontSize: '0.87rem' }} />
                </Field>
                <Field label="Description">
                  <input className="input" placeholder="e.g. Due shipping fee, customs clearance..." value={newInvoice.description} onChange={e => setNewInvoice(p => ({ ...p, description: e.target.value }))} style={{ fontSize: '0.87rem' }} />
                </Field>
                <Field label="Fee Type">
                  <select className="input" value={newInvoice.type} onChange={e => setNewInvoice(p => ({ ...p, type: e.target.value }))} style={{ fontSize: '0.82rem' }}>
                    {INVOICE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </Field>
                <button type="button" onClick={addInvoice} className="btn btn-accent btn-sm" style={{ height: 40, alignSelf: 'flex-end', padding: '0 10px' }} disabled={!newInvoice.amount || !newInvoice.description}>
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="admin-modal-footer">
            <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              {saving ? <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2, margin: '0 8px', borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> : isEdit ? '💾 Save Changes' : '⚡ Create Shipment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ────────────────────────────────────── */
const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading, logout } = useAuth();
  const { socket, connected } = useSocket();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [shipments, setShipments] = useState([]);
  const [users, setUsers] = useState([]);
  const [chatSessions, setChatSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [adminInput, setAdminInput] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingShipment, setEditingShipment] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [quickEdit, setQuickEdit] = useState(null); // { id, holdReason, delayReason, delayDescription, customsNotes }
  const chatEndRef = useRef(null);

  useEffect(() => { if (!authLoading && !isAdmin) navigate('/admin/login'); }, [authLoading, isAdmin, navigate]);
  useEffect(() => { if (isAdmin) { fetchStats(); fetchShipments(); fetchChatSessions(); } }, [isAdmin]);
  useEffect(() => { if (activeTab === 'users' && isAdmin) fetchUsers(); }, [activeTab, isAdmin]);

  useEffect(() => {
    if (!socket || !connected || !isAdmin) return;
    socket.emit('adminConnect');
    socket.on('newMessage', (data) => {
      if (selectedSession && data.sessionId === selectedSession.sessionId) {
        setChatMessages(prev => prev.some(m => m.timestamp === data.timestamp && m.message === data.message) ? prev : [...prev, data]);
      }
      fetchChatSessions();
    });
    socket.on('sessionUpdate', fetchChatSessions);
    socket.on('shipmentUpdate', () => { fetchShipments(); fetchStats(); });
    return () => { socket.off('newMessage'); socket.off('sessionUpdate'); socket.off('shipmentUpdate'); };
  }, [socket, connected, isAdmin, selectedSession]);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMessages]);

  const fetchStats = async () => { try { const d = await api.getAdminStats(); setStats(d.stats); } catch (e) { console.error(e); } };
  const fetchShipments = async () => { try { const d = await api.getShipments(); setShipments(d.shipments); } catch (e) { console.error(e); } };
  const fetchUsers = async () => { setLoadingUsers(true); try { const d = await api.getAdminUsers(); setUsers(d.users || []); } catch (e) { console.error(e); } finally { setLoadingUsers(false); } };
  const fetchChatSessions = async () => { try { const d = await api.getChatSessions(); setChatSessions(d.sessions); } catch (e) { console.error(e); } };

  const updateStatus = async (id, status) => { try { await api.updateShipmentStatus(id, { status }); fetchShipments(); fetchStats(); } catch (e) { console.error(e); } };
  const applyQuickEdit = async () => {
    if (!quickEdit) return;
    try {
      await api.updateShipment(quickEdit.id, {
        holdReason: quickEdit.holdReason,
        delayReason: quickEdit.delayReason,
        delayDescription: quickEdit.delayDescription,
        customsNotes: quickEdit.customsNotes,
      });
      setQuickEdit(null); fetchShipments();
    } catch (e) { console.error(e); }
  };
  const openQuickEdit = (s) => {
    if (quickEdit?.id === s._id) { setQuickEdit(null); return; }
    setQuickEdit({ id: s._id, holdReason: s.holdReason || '', delayReason: s.delayReason || '', delayDescription: s.delayDescription || '', customsNotes: s.customsNotes || '' });
  };
  const doDelete = async (id) => { if (!confirm('Permanently delete this shipment?')) return; try { await api.deleteShipment(id); fetchShipments(); fetchStats(); } catch (e) { console.error(e); } };
  const doDeleteUser = async (id) => { if (!confirm('Delete this user account?')) return; try { await api.deleteUser(id); fetchUsers(); fetchStats(); } catch (e) { console.error(e); } };
  const doToggleRole = async (u) => { try { await api.updateUserRole(u._id, u.role === 'admin' ? 'user' : 'admin'); fetchUsers(); } catch (e) { console.error(e); } };
  const selectChatSession = async (session) => {
    setSelectedSession(session);
    try { const d = await api.getChatSession(session.sessionId); setChatMessages(d.messages); if (socket) socket.emit('joinSession', { sessionId: session.sessionId }); } catch (e) { console.error(e); }
  };
  const sendAdminMessage = (e) => {
    e.preventDefault(); if (!adminInput.trim() || !socket || !selectedSession) return;
    socket.emit('adminMessage', { sessionId: selectedSession.sessionId, message: adminInput.trim(), adminId: user._id });
    setAdminInput('');
  };
  const closeChat = async (sessionId) => {
    try { if (socket) socket.emit('closeSession', { sessionId }); await api.closeChatSession(sessionId); fetchChatSessions(); if (selectedSession?.sessionId === sessionId) { setSelectedSession(null); setChatMessages([]); } } catch (e) { console.error(e); }
  };

  const filteredShipments = shipments.filter(s => {
    const matchStatus = !statusFilter || s.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || s.trackingId?.toLowerCase().includes(q) || s.senderName?.toLowerCase().includes(q) || s.receiverName?.toLowerCase().includes(q) || s.origin?.city?.toLowerCase().includes(q) || s.destination?.city?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const timeAgo = (d) => {
    if (!d) return '—';
    const diff = Date.now() - new Date(d).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'just now';
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  if (authLoading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0D0D14' }}><div className="spinner" /></div>;

  const statBar = stats ? [
    { icon: <Package size={20} />,       value: stats.totalShipments,    label: 'Total Shipments', cls: 'purple' },
    { icon: <Truck size={20} />,         value: stats.activeShipments,   label: 'Active',          cls: 'blue' },
    { icon: <CheckCircle2 size={20} />,  value: stats.deliveredShipments,label: 'Delivered',       cls: 'green' },
    { icon: <PauseCircle size={20} />,   value: stats.onHoldShipments,   label: 'On Hold',         cls: 'red' },
    { icon: <Clock size={20} />,         value: stats.pendingShipments,  label: 'Pending',         cls: 'yellow' },
    { icon: <MessageCircle size={20} />, value: stats.activeChatSessions,label: 'Live Chats',      cls: 'purple' },
    { icon: <Users size={20} />,         value: stats.totalUsers,        label: 'Users',           cls: 'blue' },
  ] : [];

  const navItems = [
    { id: 'overview',  icon: <LayoutDashboard size={19} />, label: 'Overview' },
    { id: 'shipments', icon: <Package size={19} />,         label: 'Shipments', badge: shipments.filter(s => s.status === 'on_hold').length || null },
    { id: 'users',     icon: <Users size={19} />,           label: 'Users' },
    { id: 'chat',      icon: <MessageCircle size={19} />,   label: 'Live Chat', badge: chatSessions.filter(s => s.status !== 'closed').length || null },
  ];

  return (
    <div className="admin-layout">
      {/* ─────────────── SIDEBAR ─────────────────────── */}
      <aside className="admin-sidebar">
        {/* Brand */}
        <div style={{ padding: '22px 18px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginBottom: 4 }}>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#a78bfa' }}>Velon</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#f97316' }}>Ex</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'rgba(255,255,255,0.3)', marginLeft: 1 }}>24</span>
          </div>
          <div style={{ fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.25)', fontWeight: 700 }}>Admin Console</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 12 }}>
            <div style={{ width: 7, height: 7, borderRadius: '50%', background: connected ? '#34d399' : '#f87171', boxShadow: connected ? '0 0 8px #34d399' : '0 0 8px #f87171', flexShrink: 0 }} />
            <span className="admin-nav-text" style={{ fontSize: '0.72rem', color: connected ? '#6ee7b7' : '#fca5a5', fontWeight: 600 }}>{connected ? 'System Live' : 'Offline'}</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="admin-sidebar-nav" style={{ paddingTop: 12 }}>
          {navItems.map(item => (
            <button key={item.id} id={`admin-tab-${item.id}`} className={`admin-nav-item ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)}>
              {item.icon}
              <span className="admin-nav-text">{item.label}</span>
              {item.badge > 0 && (
                <span style={{ marginLeft: 'auto', background: 'linear-gradient(135deg,#ef4444,#dc2626)', color: 'white', fontSize: '0.65rem', fontWeight: 800, padding: '2px 7px', borderRadius: 99, boxShadow: '0 0 10px rgba(239,68,68,0.4)' }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '16px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 34, height: 34, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.88rem', fontWeight: 800, flexShrink: 0, boxShadow: '0 0 12px rgba(124,58,237,0.4)' }}>
              {user?.name?.[0]?.toUpperCase() || 'A'}
            </div>
            <div className="admin-nav-text" style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Admin'}</div>
              <div style={{ fontSize: '0.65rem', color: '#f97316', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>ADMIN</div>
            </div>
          </div>
          <button className="admin-nav-item" onClick={() => { logout(); navigate('/admin/login'); }} style={{ color: '#f87171', width: '100%', justifyContent: 'flex-start' }}>
            <LogOut size={17} /><span className="admin-nav-text">Log Out</span>
          </button>
        </div>
      </aside>

      {/* ─────────────── CONTENT ─────────────────────── */}
      <main className="admin-content">

        {/* ══ OVERVIEW ══════════════════════════════════ */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
              <div>
                <div className="admin-page-title">Dashboard Overview</div>
                <div className="admin-page-subtitle">Welcome back, {user?.name}. Here's what's happening.</div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => { fetchStats(); fetchShipments(); }}>
                <RefreshCw size={14} /> Refresh
              </button>
            </div>

            <div className="admin-stats-grid">
              {statBar.map((card, i) => (
                <motion.div key={i} className="stat-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <div className="stat-card-header">
                    <div className={`stat-card-icon ${card.cls}`}>{card.icon}</div>
                  </div>
                  <div className="stat-card-value">{card.value ?? '—'}</div>
                  <div className="stat-card-label">{card.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="data-table-container">
              <div className="data-table-header">
                <h3>🕐 Recent Shipments</h3>
                <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('shipments')}>View All →</button>
              </div>
              <table className="data-table">
                <thead><tr><th>Tracking ID</th><th>Route</th><th>Receiver</th><th>Status</th><th>Invoices</th><th>Updated</th></tr></thead>
                <tbody>
                  {shipments.slice(0, 7).map(s => (
                    <tr key={s._id}>
                      <td>{s.trackingId}</td>
                      <td style={{ color: 'rgba(255,255,255,0.5)' }}>{s.origin?.city} → {s.destination?.city}</td>
                      <td style={{ color: 'rgba(255,255,255,0.65)' }}>{s.receiverName}</td>
                      <td><span className={`status-badge ${s.status}`}>{STATUS_ICONS[s.status]} {STATUS_LABELS[s.status]}</span></td>
                      <td>
                        {s.invoices?.length > 0 && (
                          <span className="invoice-badge"><DollarSign size={11} />${s.invoices.reduce((a, i) => a + i.amount, 0).toFixed(2)}</span>
                        )}
                      </td>
                      <td style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>{timeAgo(s.updatedAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* ══ SHIPMENTS ══════════════════════════════════ */}
        {activeTab === 'shipments' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
              <div className="admin-page-title" style={{ flex: 1 }}>Shipments</div>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 11, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
                <input className="input" placeholder="Search ID, name, city…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: 34, fontSize: '0.85rem', width: 220 }} id="shipment-search" />
              </div>
              <select className="input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ fontSize: '0.85rem', width: 165 }} id="shipment-status-filter">
                <option value="">All Statuses</option>
                {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
              <button className="btn btn-primary btn-sm" onClick={() => { setEditingShipment(null); setShowModal(true); }} id="create-shipment-btn">
                <Plus size={16} /> New Shipment
              </button>
            </div>

            <div className="data-table-container">
              <div className="data-table-header"><h3>{filteredShipments.length} of {shipments.length} shipments</h3></div>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead><tr><th>Tracking ID</th><th>Sender</th><th>Receiver</th><th>Route</th><th>Wt.</th><th>Status</th><th>Invoices</th><th>Flags</th><th>Update</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filteredShipments.length === 0 && <tr><td colSpan={10} style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.2)' }}>No shipments found</td></tr>}
                    {filteredShipments.map(s => (
                      <>
                      <tr key={s._id}>
                        <td>{s.trackingId}</td>
                        <td style={{ color: 'rgba(255,255,255,0.65)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.senderName}</td>
                        <td style={{ color: 'rgba(255,255,255,0.65)', maxWidth: 110, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.receiverName}</td>
                        <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{s.origin?.city} → {s.destination?.city}</td>
                        <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{s.weight}lb</td>
                        <td><span className={`status-badge ${s.status}`}>{STATUS_ICONS[s.status]} {STATUS_LABELS[s.status]}</span></td>
                        <td>
                          {s.invoices?.length > 0
                            ? <span className="invoice-badge"><DollarSign size={10} />${s.invoices.reduce((a, i) => a + i.amount, 0).toFixed(0)}</span>
                            : <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.78rem' }}>—</span>}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            {s.customsIntercepted && <span title="Customs Intercepted" style={{ fontSize: '0.9rem' }}>🛃</span>}
                            {s.delayReason && <span title={`Delay: ${s.delayReason}`} style={{ fontSize: '0.9rem' }}>⚠️</span>}
                          </div>
                        </td>
                        <td>
                          <select className="input" value={s.status} onChange={e => updateStatus(s._id, e.target.value)} style={{ fontSize: '0.78rem', padding: '4px 8px', minWidth: 145 }}>
                            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                          </select>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 5 }}>
                            {/* Quick-edit toggle for on_hold / in_transit */}
                            {(s.status === 'on_hold' || s.status === 'in_transit') && (
                              <button
                                className={`btn btn-sm ${quickEdit?.id === s._id ? 'btn-accent' : 'btn-ghost'}`}
                                onClick={() => openQuickEdit(s)}
                                title="Quick Apply Changes"
                                style={{ padding: '4px 8px', fontSize: '0.72rem', gap: 4, display: 'flex', alignItems: 'center' }}
                              >
                                ⚡ Apply
                              </button>
                            )}
                            <button className="btn btn-ghost btn-sm" onClick={() => { setEditingShipment(s); setShowModal(true); }} title="Full Edit" style={{ padding: '4px 8px' }}><Edit3 size={13} /></button>
                            <button className="btn btn-danger btn-sm" onClick={() => doDelete(s._id)} title="Delete" style={{ padding: '4px 8px' }}><Trash2 size={13} /></button>
                          </div>
                        </td>
                      </tr>

                      {/* ── Quick-apply inline row ── */}
                      {quickEdit?.id === s._id && (
                        <tr key={`qe-${s._id}`}>
                          <td colSpan={10} style={{ padding: 0, border: 'none' }}>
                            <div style={{
                              background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(239,68,68,0.05))',
                              border: '1px solid rgba(245,158,11,0.25)',
                              borderRadius: 10, margin: '2px 6px 8px', padding: '14px 16px',
                              display: 'flex', flexDirection: 'column', gap: 10,
                            }}>
                              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 2 }}>
                                ⚡ Quick Apply — {STATUS_LABELS[s.status]}
                              </div>
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                {s.status === 'on_hold' && (
                                  <div style={{ gridColumn: '1/-1' }}>
                                    <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>Hold Reason</label>
                                    <input className="input" value={quickEdit.holdReason} onChange={e => setQuickEdit(p => ({ ...p, holdReason: e.target.value }))} placeholder="e.g. Address verification required…" />
                                  </div>
                                )}
                                <div>
                                  <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>Delay Reason</label>
                                  <input className="input" value={quickEdit.delayReason} onChange={e => setQuickEdit(p => ({ ...p, delayReason: e.target.value }))} placeholder="e.g. Weather disruption…" />
                                </div>
                                <div>
                                  <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>Delay Description</label>
                                  <input className="input" value={quickEdit.delayDescription} onChange={e => setQuickEdit(p => ({ ...p, delayDescription: e.target.value }))} placeholder="Detailed note shown to customer…" />
                                </div>
                                <div style={{ gridColumn: '1/-1' }}>
                                  <label style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: 4 }}>Customs / Internal Notes</label>
                                  <input className="input" value={quickEdit.customsNotes} onChange={e => setQuickEdit(p => ({ ...p, customsNotes: e.target.value }))} placeholder="Optional internal notes…" />
                                </div>
                              </div>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                                <button className="btn btn-ghost btn-sm" onClick={() => setQuickEdit(null)}>Cancel</button>
                                <button className="btn btn-accent btn-sm" onClick={applyQuickEdit} style={{ fontWeight: 700 }}>
                                  ✓ Save Changes
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {/* ══ USERS ══════════════════════════════════════ */}
        {activeTab === 'users' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div className="admin-page-title">Users</div>
              <button className="btn btn-ghost btn-sm" onClick={fetchUsers}><RefreshCw size={14} /> Refresh</button>
            </div>
            <div className="data-table-container">
              <div className="data-table-header"><h3>{users.length} registered users</h3></div>
              {loadingUsers ? <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" /></div> : (
                <table className="data-table">
                  <thead><tr><th>#</th><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
                  <tbody>
                    {users.length === 0 && <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.2)' }}>No users found</td></tr>}
                    {users.map((u, i) => (
                      <tr key={u._id}>
                        <td style={{ color: 'rgba(255,255,255,0.25)', fontFamily: 'monospace' }}>{i + 1}</td>
                        <td style={{ fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                            <div style={{ width: 30, height: 30, borderRadius: '50%', background: u.role === 'admin' ? 'linear-gradient(135deg,#f97316,#ea580c)' : 'linear-gradient(135deg,#7c3aed,#6d28d9)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.78rem', fontWeight: 800, flexShrink: 0 }}>
                              {u.name?.[0]?.toUpperCase()}
                            </div>
                            {u.name}
                          </div>
                        </td>
                        <td style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>{u.email}</td>
                        <td><span className={`status-badge ${u.role === 'admin' ? 'out_for_delivery' : 'picked_up'}`}>{u.role === 'admin' ? '👑 ADMIN' : '👤 USER'}</span></td>
                        <td style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                        <td>
                          {u._id !== user?._id ? (
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="btn btn-ghost btn-sm" onClick={() => doToggleRole(u)} style={{ fontSize: '0.72rem', color: u.role === 'admin' ? '#fbbf24' : '#34d399' }}>
                                <Shield size={12} /> {u.role === 'admin' ? 'Demote' : 'Promote'}
                              </button>
                              <button className="btn btn-danger btn-sm" onClick={() => doDeleteUser(u._id)} style={{ padding: '4px 8px' }}><Trash2 size={12} /></button>
                            </div>
                          ) : <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.2)' }}>You</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        )}

        {/* ══ LIVE CHAT ══════════════════════════════════ */}
        {activeTab === 'chat' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="admin-chat-layout">
            <div className="admin-chat-list">
              <div className="admin-chat-list-header"><h3>💬 Conversations ({chatSessions.filter(s => s.status !== 'closed').length})</h3></div>
              <div className="admin-chat-list-items">
                {chatSessions.filter(s => s.status !== 'closed').length === 0 && (
                  <div style={{ padding: 24, textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.85rem' }}>No active conversations</div>
                )}
                {chatSessions.filter(s => s.status !== 'closed').map(session => (
                  <div key={session.sessionId} className={`admin-chat-item ${selectedSession?.sessionId === session.sessionId ? 'active' : ''}`} onClick={() => selectChatSession(session)}>
                    <div className="admin-chat-item-header">
                      <span className="admin-chat-item-name">{session.userName || 'Visitor'}</span>
                      <span className="admin-chat-item-time">{timeAgo(session.updatedAt)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="admin-chat-item-preview">{session.lastMessage?.message?.substring(0, 40) || '—'}</span>
                      <span className={`status-badge ${session.status === 'human' ? 'out_for_delivery' : 'pending'}`} style={{ fontSize: '0.58rem', padding: '2px 6px' }}>
                        {session.status === 'human' ? '🟢 LIVE' : '🤖 BOT'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="admin-chat-conversation">
              {selectedSession ? (
                <>
                  <div className="admin-chat-conv-header">
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'white' }}>{selectedSession.userName || 'Visitor'}</div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Session: {selectedSession.sessionId?.substring(0, 20)}…</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {selectedSession.status === 'bot' && <button className="btn btn-accent btn-sm" onClick={() => { socket?.emit('adminJoin', { sessionId: selectedSession.sessionId, adminId: user._id }); setSelectedSession(p => ({ ...p, status: 'human' })); }}><MessageCircle size={13} /> Take Over</button>}
                      <button className="btn btn-danger btn-sm" onClick={() => closeChat(selectedSession.sessionId)}><X size={13} /> Close</button>
                    </div>
                  </div>
                  <div className="admin-chat-conv-messages">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`chat-bubble ${msg.sender}`}>
                        <div className="sender-label">{msg.sender === 'user' ? '👤 User' : msg.sender === 'admin' ? '👑 Admin' : '🤖 Bot'}</div>
                        <div style={{ whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem' }}>{msg.message}</div>
                        <div className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>
                  {selectedSession.status === 'human' ? (
                    <form className="admin-chat-conv-input" onSubmit={sendAdminMessage}>
                      <input type="text" className="input" value={adminInput} onChange={e => setAdminInput(e.target.value)} placeholder="Type your message…" style={{ flex: 1 }} id="admin-chat-input" />
                      <button type="submit" className="btn btn-primary btn-sm" disabled={!adminInput.trim()}><Send size={14} /></button>
                    </form>
                  ) : (
                    <div style={{ padding: '14px 18px', borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>
                      Click <strong>"Take Over"</strong> to join as a live agent
                    </div>
                  )}
                </>
              ) : (
                <div className="admin-empty-state"><MessageCircle size={48} /><p>Select a conversation</p></div>
              )}
            </div>
          </motion.div>
        )}
      </main>

      {/* ─── Modals ─────────────────────────────────── */}
      {showModal && (
        <ShipmentModal
          initial={editingShipment}
          onClose={() => { setShowModal(false); setEditingShipment(null); }}
          onSaved={() => { fetchShipments(); fetchStats(); }}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
