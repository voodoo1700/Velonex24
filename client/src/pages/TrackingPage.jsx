import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Search, Package, MapPin, Calendar, Weight,
  AlertTriangle, DollarSign, Globe, CheckCircle2,
  Clock, Truck, Info, ShieldAlert, FileText
} from 'lucide-react';
import api from '../services/api';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

/* ─── Status config ─────────────────────────────────────── */
const STATUS_META = {
  pending:          { label: 'Shipment Created',    icon: <FileText size={18} />, color: '#8b5cf6', bg: 'rgba(139,92,246,0.08)' },
  picked_up:        { label: 'Picked Up',           icon: <Package size={18} />, color: '#3b82f6', bg: 'rgba(59,130,246,0.08)' },
  in_transit:       { label: 'In Transit',          icon: <Truck size={18} />, color: '#6366f1', bg: 'rgba(99,102,241,0.08)' },
  out_for_delivery: { label: 'Out for Delivery',    icon: <Truck size={18} />, color: '#f97316', bg: 'rgba(249,115,22,0.08)' },
  delivered:        { label: 'Delivered',           icon: <CheckCircle2 size={18} />, color: '#10b981', bg: 'rgba(16,185,129,0.08)' },
  on_hold:          { label: 'On Hold',             icon: <AlertTriangle size={18} />,  color: '#ef4444', bg: 'rgba(239,68,68,0.08)' },
};

const STEPS = ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered'];

const formatDate = (d) => {
  if (!d) return 'N/A';
  return new Date(d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
};
const formatDateTime = (d) => {
  if (!d) return 'N/A';
  return new Date(d).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
};

/* ─── Progress Stepper ──────────────────────────────────── */
function ProgressStepper({ shipment }) {
  const status = shipment?.status;
  const isHold = status === 'on_hold';
  const activeIdx = isHold ? -1 : STEPS.indexOf(status);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, padding: '0 0 4px' }}>
      {STEPS.map((step, i) => {
        const meta = STATUS_META[step];
        const done = i <= activeIdx;
        const isCurrent = i === activeIdx;
        return (
          <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div style={{
                position: 'absolute', top: 18, left: '50%', right: '-50%', height: 3,
                background: done && i < activeIdx ? meta.color : '#E5E7EB',
                zIndex: 0, transition: 'background 0.4s'
              }} />
            )}
            {/* Dot */}
            <div style={{
              width: 36, height: 36, borderRadius: '50%', zIndex: 1,
              background: done ? meta.color : '#F3F4F6',
              border: `3px solid ${done ? meta.color : '#D1D5DB'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1rem', marginBottom: 8,
              boxShadow: isCurrent ? `0 0 0 5px ${meta.color}25` : 'none',
              transition: 'all 0.3s'
            }}>
              {done ? (i < activeIdx ? <CheckCircle2 size={18} color="white" style={{ strokeWidth: 3 }} /> : <span>{meta.icon}</span>) : <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#D1D5DB' }} />}
            </div>
            {/* Label */}
            <div style={{ textAlign: 'center', fontSize: '0.72rem', fontWeight: isCurrent ? 700 : 500, color: done ? '#111827' : '#9CA3AF', lineHeight: 1.3 }}>
              {isCurrent && step === 'in_transit' && shipment.currentLocation?.city ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ color: meta.color, fontWeight: 800 }}>{shipment.currentLocation.city}</span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.7 }}>In Transit</span>
                </div>
              ) : meta.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Alert Banner ──────────────────────────────────────── */
function AlertBanner({ icon, title, text, color, bg, border }) {
  return (
    <div style={{ display: 'flex', gap: 14, padding: '16px 20px', background: bg, border: `1px solid ${border}`, borderRadius: 12, marginBottom: 16 }}>
      <div style={{ color, fontSize: '1.3rem', flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontWeight: 700, color, fontSize: '0.9rem', marginBottom: 3 }}>{title}</div>
        <div style={{ color: '#374151', fontSize: '0.85rem', lineHeight: 1.6 }}>{text}</div>
      </div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────── */
const TrackingPage = () => {
  const [searchParams] = useSearchParams();
  const [trackingId, setTrackingId] = useState(searchParams.get('id') || '');
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const mapContainer = useRef(null);
  const mapRef = useRef(null);
  const [mapStyle, setMapStyle] = useState('light-v11');
  const animationRef = useRef(null);

  const handleTrack = async (e) => {
    e?.preventDefault();
    if (!trackingId.trim()) return;
    setLoading(true); setError(''); setShipment(null);
    try {
      const data = await api.trackShipment(trackingId.trim().toUpperCase());
      setShipment(data.shipment);
    } catch (err) {
      setError(err.message || 'Shipment not found. Please check your tracking number.');
    } finally { setLoading(false); }
  };

  useEffect(() => { if (searchParams.get('id')) handleTrack(); }, []);

  useEffect(() => {
    if (!shipment || !mapContainer.current) return;
    if (mapRef.current) mapRef.current.remove();
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    try {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: `mapbox://styles/mapbox/${mapStyle}`,
        center: [shipment.currentLocation.lng, shipment.currentLocation.lat],
        zoom: 4,
        projection: 'globe'
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.on('load', () => {
        // Origin marker
        new mapboxgl.Marker({ color: '#4D148C' }).setLngLat([shipment.origin.lng, shipment.origin.lat]).setPopup(new mapboxgl.Popup().setHTML(`<strong>Origin:</strong> ${shipment.origin.city}`)).addTo(map);
        // Destination marker
        new mapboxgl.Marker({ color: '#10b981' }).setLngLat([shipment.destination.lng, shipment.destination.lat]).setPopup(new mapboxgl.Popup().setHTML(`<strong>Destination:</strong> ${shipment.destination.city}`)).addTo(map);
        // Current location pulse
        const el = document.createElement('div');
        el.innerHTML = `<div style="position:relative;width:22px;height:22px"><div style="position:absolute;inset:0;background:#f97316;border-radius:50%;opacity:0.3;animation:markerPulse 2s ease-out infinite"></div><div style="position:absolute;inset:5px;background:#f97316;border-radius:50%;border:2px solid white;z-index:1"></div></div>`;
        new mapboxgl.Marker({ element: el }).setLngLat([shipment.currentLocation.lng, shipment.currentLocation.lat]).setPopup(new mapboxgl.Popup().setHTML(`<strong>Current:</strong> ${shipment.currentLocation.city}`)).addTo(map);
        // Route lines
        map.addSource('route', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [[shipment.origin.lng, shipment.origin.lat],[shipment.currentLocation.lng, shipment.currentLocation.lat],[shipment.destination.lng, shipment.destination.lat]] } } });
        map.addLayer({ id: 'route-line', type: 'line', source: 'route', paint: { 'line-color': '#4D148C', 'line-width': 2, 'line-dasharray': [4, 3], 'line-opacity': 0.4 } });
        map.addSource('traveled', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: [[shipment.origin.lng, shipment.origin.lat],[shipment.currentLocation.lng, shipment.currentLocation.lat]] } } });
        map.addLayer({ id: 'traveled-line', type: 'line', source: 'traveled', paint: { 'line-color': '#f97316', 'line-width': 3 } });

        // Animation Layer (Marching Ants)
        map.addLayer({
          id: 'route-animation',
          type: 'line',
          source: 'traveled',
          paint: {
            'line-color': 'rgba(255,255,255,0.8)',
            'line-width': 2,
            'line-dasharray': [0, 2]
          }
        });

        let step = 0;
        const animate = () => {
          step = (step + 0.2) % 30;
          if (map.getLayer('route-animation')) {
            map.setPaintProperty('route-animation', 'line-dasharray', [0, 4, 3, step/10]);
          }
          animationRef.current = requestAnimationFrame(animate);
        };
        animate();

        const bounds = new mapboxgl.LngLatBounds().extend([shipment.origin.lng, shipment.origin.lat]).extend([shipment.destination.lng, shipment.destination.lat]).extend([shipment.currentLocation.lng, shipment.currentLocation.lat]);
        map.fitBounds(bounds, { padding: 60 });
      });
      mapRef.current = map;
    } catch (err) { console.error('Map error:', err); }
    return () => { 
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; } 
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [shipment, mapStyle]);

  const meta = shipment ? (STATUS_META[shipment.status] || STATUS_META.pending) : null;
  const totalInvoice = (shipment?.invoices || []).reduce((s, i) => s + i.amount, 0);

  return (
    <div style={{ background: '#F8F9FA', minHeight: '100vh' }}>

      {/* ── HERO SEARCH SECTION ──────────────────────── */}
      <div style={{ background: 'linear-gradient(135deg, #1a0533 0%, #2d1254 50%, #1a0533 100%)', padding: '48px 0 56px' }}>
        <div className="container">
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: 6, letterSpacing: '-0.02em' }}>
            Track Your Shipment
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 28, fontSize: '0.95rem' }}>
            Get real-time updates on your package location and delivery status
          </p>
          <form onSubmit={handleTrack} style={{ display: 'flex', gap: 0, maxWidth: 640, background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={18} style={{ position: 'absolute', left: 18, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
              <input
                type="text"
                value={trackingId}
                onChange={e => setTrackingId(e.target.value)}
                placeholder="Enter tracking number (e.g. VLX-A1B2C3D4)"
                style={{ width: '100%', height: 56, border: 'none', outline: 'none', paddingLeft: 50, paddingRight: 16, fontSize: '0.98rem', color: '#111827', background: 'transparent', fontFamily: 'inherit' }}
                id="tracking-input"
              />
            </div>
            <button type="submit" disabled={loading} id="track-button" style={{ background: '#f97316', color: 'white', border: 'none', padding: '0 32px', fontSize: '0.9rem', fontWeight: 800, letterSpacing: '0.06em', cursor: 'pointer', transition: 'background 0.2s', textTransform: 'uppercase', minWidth: 120 }}>
              {loading ? <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white' }} /> : 'TRACK'}
            </button>
          </form>


        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px 64px' }}>
        {/* Error */}
        {error && (
          <div style={{ display: 'flex', gap: 12, padding: '16px 20px', background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, color: '#DC2626', marginBottom: 24 }}>
            <AlertTriangle size={20} style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, marginBottom: 2 }}>Shipment Not Found</div>
              <div style={{ fontSize: '0.88rem', color: '#7F1D1D' }}>{error}</div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!shipment && !error && !loading && (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'white', border: '2px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Package size={36} style={{ color: '#D1D5DB' }} />
            </div>
            <h3 style={{ color: '#374151', fontWeight: 600, marginBottom: 8 }}>Enter a tracking number</h3>
            <p style={{ color: '#9CA3AF', fontSize: '0.9rem' }}>Use the search bar above to track your Velonex24 shipment</p>
          </div>
        )}

        {/* RESULTS */}
        {shipment && meta && (
          <div>

            {/* ── STATUS HERO CARD ──────────────────────── */}
            <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', marginBottom: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              {/* Color bar */}
              <div style={{ height: 6, background: `linear-gradient(90deg, ${meta.color}, ${meta.color}99)` }} />
              <div style={{ padding: '24px 28px' }}>
                {/* Top row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 24 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                      <span style={{ fontSize: '1.35rem', fontWeight: 900, color: meta.color }}>
                        {shipment.status === 'in_transit' && shipment.currentLocation?.city 
                          ? `Currently in ${shipment.currentLocation.city}` 
                          : meta.label}
                      </span>
                      {shipment.status === 'in_transit' && (
                        <span style={{ 
                          width: 8, height: 8, borderRadius: '50%', background: '#f97316', 
                          boxShadow: '0 0 0 3px rgba(249,115,22,0.2)',
                          animation: 'pulse 2s infinite'
                        }} />
                      )}
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '1.05rem', fontWeight: 700, color: '#374151', letterSpacing: '0.05em' }}>
                      {shipment.trackingId}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#6B7280', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Globe size={14} style={{ opacity: 0.5 }} />
                      <span>{shipment.origin?.city}</span>
                      <span style={{ color: '#D1D5DB' }}>→</span>
                      {shipment.status === 'in_transit' && shipment.currentLocation?.city && (
                        <>
                          <span style={{ color: '#f97316', fontWeight: 600 }}>{shipment.currentLocation.city}</span>
                          <span style={{ color: '#D1D5DB' }}>→</span>
                        </>
                      )}
                      <span>{shipment.destination?.city}</span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 4 }}>Est. Delivery</div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#111827' }}>{formatDate(shipment.estimatedDelivery)}</div>
                    {shipment.status === 'delivered' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4, justifyContent: 'flex-end', color: '#10b981', fontSize: '0.85rem', fontWeight: 600 }}>
                        <CheckCircle2 size={15} /> Package Delivered
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress stepper */}
                {shipment.status !== 'on_hold' && <ProgressStepper shipment={shipment} />}
                {shipment.status === 'on_hold' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: '#FEF2F2', borderRadius: 10, border: '1px solid #FECACA' }}>
                    <AlertTriangle size={20} style={{ color: '#EF4444', flexShrink: 0 }} />
                    <span style={{ fontWeight: 600, color: '#DC2626' }}>Shipment is currently on hold — see details below</span>
                  </div>
                )}
              </div>
            </div>

            {/* ── INFO CARDS ────────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))', gap: 14, marginBottom: 20 }}>
              {[
                { icon: <MapPin size={17} />, label: 'Current Location', value: shipment.currentLocation?.city || 'N/A', accent: '#f97316' },
                { icon: <Calendar size={17} />, label: 'Est. Delivery', value: formatDate(shipment.estimatedDelivery), accent: '#6366f1' },
                { icon: <Weight size={17} />, label: 'Weight', value: `${shipment.weight} lbs`, accent: '#3b82f6' },
                { icon: <Package size={17} />, label: 'Package Type', value: shipment.packageType || 'Standard', accent: '#8b5cf6' },
              ].map((info, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 12, padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: info.accent, marginBottom: 10 }}>
                    {info.icon}
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#9CA3AF' }}>{info.label}</span>
                  </div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: '#111827' }}>{info.value}</div>
                </div>
              ))}
            </div>

            {/* ── SENDER / RECEIVER ─────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
              {[
                { title: '📤 From', name: shipment.senderName, address: shipment.senderAddress, city: shipment.origin?.city },
                { title: '📥 To', name: shipment.receiverName, address: shipment.receiverAddress, city: shipment.destination?.city },
              ].map((p, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 12, padding: '20px 22px', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', border: '1px solid #F3F4F6' }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#9CA3AF', marginBottom: 12 }}>{p.title}</div>
                  <div style={{ fontWeight: 700, color: '#111827', fontSize: '0.98rem', marginBottom: 4 }}>{p.name}</div>
                  <div style={{ color: '#6B7280', fontSize: '0.85rem', lineHeight: 1.5 }}>{p.address}</div>
                  <div style={{ color: '#9CA3AF', fontSize: '0.8rem', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <MapPin size={12} />{p.city}
                  </div>
                </div>
              ))}
            </div>

            {/* ── ALERTS ───────────────────────────────── */}
            {shipment.status === 'on_hold' && shipment.holdReason && (
              <AlertBanner icon="⏸" title="Shipment On Hold" text={shipment.holdReason} color="#DC2626" bg="#FEF2F2" border="#FECACA" />
            )}
            {shipment.delayReason && (
              <AlertBanner icon="⚠️" title={`Delay Notice: ${shipment.delayReason}`} text={shipment.delayDescription || 'Your shipment has been delayed. We apologize for the inconvenience.'} color="#D97706" bg="#FFFBEB" border="#FDE68A" />
            )}
            {shipment.customsIntercepted && (
              <AlertBanner
                icon="🛃"
                title="Customs Inspection"
                text={`Your package is currently being processed by customs authorities. ${shipment.borderClearanceEligible ? 'This item is eligible for border clearance processing.' : 'Clearance may take additional time.'} ${shipment.customsNotes ? shipment.customsNotes : ''}`}
                color="#1D4ED8"
                bg="#EFF6FF"
                border="#BFDBFE"
              />
            )}
            {totalInvoice > 0 && (
              <div style={{ display: 'flex', gap: 14, padding: '20px 24px', background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 12, marginBottom: 16 }}>
                <DollarSign size={24} style={{ color: '#D97706', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, color: '#92400E', fontSize: '0.93rem', marginBottom: 8 }}>
                    Outstanding Balance: ${totalInvoice.toFixed(2)}
                  </div>
                  {(shipment.invoices || []).map((inv, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderTop: i > 0 ? '1px solid #FDE68A' : 'none' }}>
                      <div>
                        <span style={{ fontSize: '0.85rem', color: '#374151', fontWeight: 600 }}>{inv.description}</span>
                        <span style={{ marginLeft: 8, fontSize: '0.72rem', color: '#D97706', background: '#FEF3C7', padding: '2px 6px', borderRadius: 4, fontWeight: 700 }}>
                          {inv.type?.replace(/_/g, ' ').toUpperCase()}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontWeight: 800, color: '#92400E', fontSize: '0.95rem' }}>${parseFloat(inv.amount).toFixed(2)}</span>
                        <span style={{ fontSize: '0.72rem', color: inv.paid ? '#10b981' : '#EF4444', fontWeight: 700, background: inv.paid ? '#ECFDF5' : '#FEF2F2', padding: '2px 8px', borderRadius: 6 }}>
                          {inv.paid ? '✓ PAID' : '⚠ UNPAID'}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div style={{ marginTop: 12, fontSize: '0.82rem', color: '#92400E', display: 'flex', gap: 6, alignItems: 'center' }}>
                    <Info size={14} /> Please contact support at +1(603) 661-9146 to arrange payment and release your shipment.
                  </div>
                </div>
              </div>
            )}

            {/* ── MAP ──────────────────────────────────── */}
            <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', marginBottom: 20, boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
              <div style={{ padding: '16px 22px', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <MapPin size={17} style={{ color: '#6366f1' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#111827' }}>Live Tracking Map</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: '0.75rem', color: '#9CA3AF' }}>
                  <div style={{ display: 'flex', background: '#F3F4F6', borderRadius: 8, padding: 3, gap: 2 }}>
                    <button 
                      onClick={() => setMapStyle('light-v11')}
                      style={{ 
                        border: 'none', padding: '4px 10px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700,
                        background: mapStyle === 'light-v11' ? 'white' : 'transparent',
                        color: mapStyle === 'light-v11' ? '#4D148C' : '#6B7280',
                        boxShadow: mapStyle === 'light-v11' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                        cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >Light</button>
                    <button 
                      onClick={() => setMapStyle('satellite-v9')}
                      style={{ 
                        border: 'none', padding: '4px 10px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 700,
                        background: mapStyle === 'satellite-v9' ? 'white' : 'transparent',
                        color: mapStyle === 'satellite-v9' ? '#4D148C' : '#6B7280',
                        boxShadow: mapStyle === 'satellite-v9' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                        cursor: 'pointer', transition: 'all 0.2s'
                      }}
                    >Satellite</button>
                  </div>
                  <div style={{ width: 1, height: 16, background: '#E5E7EB' }} />
                  <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#4D148C', marginRight: 5 }} />Origin</span>
                  <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#f97316', marginRight: 5 }} />Current</span>
                  <span><span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: '#10b981', marginRight: 5 }} />Destination</span>
                </div>
              </div>
              <div ref={mapContainer} style={{ height: 380 }} id="tracking-map" />
            </div>

            {/* ── TIMELINE ──────────────────────────────── */}
            <div style={{ background: 'white', borderRadius: 16, padding: '24px 28px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #F3F4F6' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 32 }}>
                <FileText size={17} style={{ color: '#6366f1' }} />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111827', margin: 0 }}>Shipment History</h3>
              </div>
              <div style={{ paddingLeft: 8 }}>
                {shipment.timeline?.length === 0 && (
                  <div style={{ color: '#9CA3AF', fontSize: '0.9rem', textAlign: 'center', padding: '20px 0' }}>No timeline events yet</div>
                )}
                
                {/* Changed to Chronological Order */}
                {shipment.timeline?.map((entry, i) => {
                  const eMeta = STATUS_META[entry.status] || STATUS_META.pending;
                  const isLast = i === shipment.timeline.length - 1;
                  const isCurrent = isLast; // The last event in chronological order is the current/latest status
                  
                  return (
                    <div key={i} style={{ display: 'flex', gap: 24, paddingBottom: isLast ? 0 : 36, position: 'relative' }}>
                      
                      {/* Left timeline connector line */}
                      {!isLast && (
                        <div style={{ position: 'absolute', top: 40, left: 19, bottom: 0, width: 2, background: 'linear-gradient(to bottom, #E5E7EB, #F3F4F6)' }} />
                      )}
                      
                      {/* Node Icon */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, zIndex: 1 }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: '50%',
                          background: 'white',
                          border: `2px solid ${isCurrent ? eMeta.color : '#E5E7EB'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: isCurrent ? eMeta.color : '#9CA3AF',
                          boxShadow: isCurrent ? `0 0 0 6px ${eMeta.bg}` : 'none',
                          transition: 'all 0.3s'
                        }}>
                          {eMeta.icon}
                        </div>
                      </div>
                      
                      {/* Details Area */}
                      <div style={{ flex: 1, paddingTop: 2 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'nowrap', gap: 12, marginBottom: 4 }}>
                          {/* Title */}
                          <span style={{ fontWeight: 800, fontSize: '0.98rem', color: isCurrent ? eMeta.color : '#111827', marginTop: 2 }}>
                            {eMeta.label}
                          </span>
                          
                          {/* Right Aligned Split Timestamp */}
                          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flexShrink: 0 }}>
                             <span style={{ fontSize: '0.85rem', color: '#111827', fontWeight: 600 }}>{formatDate(entry.timestamp)}</span>
                             <span style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: 2 }}>{formatDateTime(entry.timestamp).split(', ')[1] || formatDateTime(entry.timestamp)}</span>
                          </div>
                        </div>
                        
                        {/* Description */}
                        <div style={{ fontSize: '0.87rem', color: '#4B5563', marginBottom: 8, lineHeight: 1.5, paddingRight: '20%' }}>
                          {entry.description}
                        </div>
                        
                        {/* Location Tag */}
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#F8F9FA', border: '1px solid #E5E7EB', padding: '4px 8px', borderRadius: 6, fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>
                          <MapPin size={12} /> {entry.location}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;
