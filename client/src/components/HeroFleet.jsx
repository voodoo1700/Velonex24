/* Branded fleet vehicles for the homepage hero.
   Pure SVG so they stay crisp at any size and can be animated with CSS. */

export const CargoJet = () => (
  <svg viewBox="0 0 920 300" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', width: '100%', height: 'auto' }}>
    <defs>
      <linearGradient id="jetFuse" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="55%" stopColor="#E9EFF7" />
        <stop offset="100%" stopColor="#C2D0E2" />
      </linearGradient>
      <linearGradient id="jetNavy" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#24466E" />
        <stop offset="100%" stopColor="#0F2138" />
      </linearGradient>
      <linearGradient id="jetSilver" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#EDF1F6" />
        <stop offset="100%" stopColor="#A9B6C6" />
      </linearGradient>
      <linearGradient id="jetTrail" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="rgba(255,255,255,0)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0.35)" />
      </linearGradient>
    </defs>

    {/* contrails */}
    <rect x="-30" y="116" width="150" height="5" rx="2.5" fill="url(#jetTrail)" />
    <rect x="-60" y="148" width="190" height="6" rx="3" fill="url(#jetTrail)" />

    {/* tail fin */}
    <path d="M208 102 L152 16 Q147 8 158 8 L196 8 Q208 8 213 19 L258 100 Z" fill="url(#jetNavy)" />
    {/* tail logo: V + arrow */}
    <g fill="none" strokeLinecap="round">
      <path d="M180 30 L192 62" stroke="#FFFFFF" strokeWidth="7" />
      <path d="M204 30 L192 62" stroke="#FFFFFF" strokeWidth="7" />
      <path d="M191 58 L214 36" stroke="#2E7CF6" strokeWidth="7" />
    </g>
    <polygon points="210,30 224,33 215,44" fill="#2E7CF6" />
    {/* beacon light on fin */}
    <circle className="jet-beacon" cx="182" cy="12" r="4" fill="#F87171" />

    {/* horizontal stabilizer */}
    <polygon points="196,128 108,156 134,166 226,146" fill="url(#jetNavy)" />

    {/* fuselage */}
    <path d="M162 128 Q190 100 268 94 L718 88 Q798 88 860 122 Q884 134 886 142 Q882 158 850 166 L320 178 Q240 178 190 162 Q158 150 162 128 Z" fill="url(#jetFuse)" />

    {/* belly shading */}
    <path d="M196 164 Q260 178 360 176 L846 166 Q872 160 882 148 L880 154 Q870 164 846 169 L330 180 Q244 181 196 168 Z" fill="#14243F" opacity="0.85" />

    {/* blue livery swoosh */}
    <path d="M884 148 Q690 190 430 187 Q280 185 186 158" stroke="#2563EB" strokeWidth="10" fill="none" opacity="0.95" />

    {/* cockpit windows */}
    <polygon points="812,101 842,109 852,122 818,116" fill="#12263F" />
    <polygon points="800,99 808,101 812,113 800,111" fill="#12263F" opacity="0.8" />

    {/* passenger window line */}
    <line x1="252" y1="136" x2="780" y2="128" stroke="#8FA9C8" strokeWidth="3.5" strokeDasharray="5 10" />

    {/* fuselage titles: site name */}
    <text x="366" y="124" fontFamily="Inter, sans-serif" fontWeight="800" fontStyle="italic" fontSize="36" fill="#16264C">Velon<tspan fill="#2563EB">Ex</tspan><tspan fontSize="20" fill="#5B7290" dy="-1"> 24</tspan></text>

    {/* wing (swept toward viewer) */}
    <polygon points="512,150 306,238 372,248 556,164" fill="url(#jetNavy)" />
    <polygon points="512,150 306,238 322,240 548,156" fill="#2E4E78" opacity="0.7" />

    {/* engine nacelle under wing */}
    <polygon points="404,196 420,178 448,178 448,200" fill="url(#jetNavy)" opacity="0.9" />
    <rect x="356" y="194" width="92" height="36" rx="18" fill="url(#jetSilver)" />
    <circle cx="448" cy="212" r="18" fill="#0E1B30" />
    <circle cx="448" cy="212" r="18" fill="none" stroke="#D7DFE9" strokeWidth="3" />
    <circle cx="448" cy="212" r="6" fill="#3E5C82" />
    {/* engine exhaust glow */}
    <rect x="342" y="204" width="16" height="16" rx="8" fill="#7FA6DB" opacity="0.55" />
  </svg>
);

export const SemiTruck = ({ height = 44 }) => (
  <svg height={height} viewBox="0 0 560 230" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
    <defs>
      <linearGradient id="trkBox" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#DEE7F2" />
      </linearGradient>
      <linearGradient id="trkCab" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2C517E" />
        <stop offset="55%" stopColor="#16304F" />
        <stop offset="100%" stopColor="#0C1D33" />
      </linearGradient>
      <linearGradient id="trkGlass" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#BBD7F2" />
        <stop offset="100%" stopColor="#3E6EA8" />
      </linearGradient>
      <linearGradient id="trkChrome" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#F2F5F9" />
        <stop offset="45%" stopColor="#AEBACA" />
        <stop offset="55%" stopColor="#8A99AC" />
        <stop offset="100%" stopColor="#C9D3DF" />
      </linearGradient>
    </defs>

    {/* ground shadow */}
    <ellipse cx="280" cy="206" rx="262" ry="10" fill="rgba(0,0,0,0.30)" />

    {/* ── trailer ── */}
    <rect x="12" y="34" width="330" height="128" rx="6" fill="url(#trkBox)" />
    {/* rib lines */}
    {[48, 84, 120, 156, 192, 228, 264, 300].map(x => (
      <line key={x} x1={x} y1="38" x2={x} y2="158" stroke="#D3DDEA" strokeWidth="1.5" />
    ))}
    {/* rear door seam */}
    <line x1="22" y1="38" x2="22" y2="158" stroke="#B9C6D6" strokeWidth="2.5" />
    {/* roof edge + skirt */}
    <rect x="12" y="34" width="330" height="7" rx="3.5" fill="#C4D0DF" />
    <rect x="12" y="152" width="330" height="10" fill="#16264C" />
    {/* blue livery swoosh on trailer */}
    <path d="M16 146 Q120 128 338 140" stroke="#2563EB" strokeWidth="7" fill="none" opacity="0.9" />

    {/* trailer branding: mini VX logo + wordmark */}
    <g fill="none" strokeLinecap="round">
      <path d="M52 62 L68 106" stroke="#16264C" strokeWidth="11" />
      <path d="M84 62 L68 106" stroke="#16264C" strokeWidth="11" />
      <path d="M67 100 L98 70" stroke="#2563EB" strokeWidth="11" />
    </g>
    <polygon points="92,62 112,66 100,81 " fill="#2563EB" />
    <text x="124" y="102" fontFamily="Inter, sans-serif" fontWeight="800" fontStyle="italic" fontSize="40" fill="#16264C">Velon<tspan fill="#2563EB">Ex</tspan><tspan fontSize="22" fill="#5B7290" dy="-2"> 24</tspan></text>
    <text x="126" y="126" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="13" letterSpacing="4" fill="#5B7290">EXPRESS LOGISTICS</text>

    {/* landing-gear / chassis */}
    <rect x="12" y="162" width="330" height="8" fill="#1B2A3E" />
    <rect x="150" y="170" width="10" height="18" fill="#3A4B60" />

    {/* ── tractor ── */}
    {/* chassis */}
    <rect x="336" y="146" width="200" height="18" fill="#1B2A3E" />
    {/* cab body */}
    <path d="M352 162 L352 64 Q354 50 372 47 L436 42 Q456 41 466 52 L500 92 Q510 102 522 107 L538 114 Q550 120 550 132 L550 150 Q550 162 538 162 Z" fill="url(#trkCab)" />
    {/* roof air deflector */}
    <path d="M352 64 Q368 40 404 38 L436 42 L372 47 Q354 50 352 64 Z" fill="#0E2138" />
    {/* windshield */}
    <polygon points="452,50 466,54 498,92 458,88" fill="url(#trkGlass)" />
    <line x1="461" y1="55" x2="490" y2="88" stroke="rgba(255,255,255,0.55)" strokeWidth="3" />
    {/* side window */}
    <rect x="396" y="58" width="48" height="36" rx="5" fill="url(#trkGlass)" />
    <line x1="404" y1="62" x2="430" y2="90" stroke="rgba(255,255,255,0.4)" strokeWidth="3" />
    {/* door seam + handle */}
    <line x1="446" y1="56" x2="446" y2="150" stroke="#0B1A2C" strokeWidth="2.5" />
    <rect x="428" y="102" width="14" height="4" rx="2" fill="#9FB0C4" />
    {/* mirror */}
    <line x1="466" y1="54" x2="478" y2="46" stroke="#0B1A2C" strokeWidth="3" />
    <rect x="476" y="38" width="7" height="14" rx="2" fill="#16304F" />
    {/* exhaust stack */}
    <rect x="356" y="46" width="9" height="100" rx="3" fill="url(#trkChrome)" />
    <rect x="354" y="42" width="13" height="7" rx="3" fill="#8A99AC" />
    {/* grille + bumper chrome */}
    <rect x="536" y="116" width="12" height="30" rx="2" fill="url(#trkChrome)" />
    <rect x="516" y="148" width="40" height="12" rx="3" fill="url(#trkChrome)" />
    {/* headlight + beam */}
    <rect x="543" y="134" width="8" height="9" rx="2" fill="#FDE68A" />
    <polygon points="551,132 560,128 560,148 551,145" fill="rgba(253,230,138,0.22)" />
    {/* fuel tank */}
    <rect x="418" y="150" width="76" height="22" rx="11" fill="url(#trkChrome)" />
    {/* mini logo on cab door */}
    <g fill="none" strokeLinecap="round" opacity="0.9">
      <path d="M400 112 L407 130" stroke="#FFFFFF" strokeWidth="5" />
      <path d="M414 112 L407 130" stroke="#FFFFFF" strokeWidth="5" />
      <path d="M407 127 L421 114" stroke="#2E7CF6" strokeWidth="5" />
    </g>

    {/* mudflaps */}
    <rect x="80" y="178" width="14" height="18" rx="2" fill="#0C1622" />
    <rect x="368" y="178" width="14" height="18" rx="2" fill="#0C1622" />

    {/* ── wheels (rims spin via .trk-rim) ── */}
    {[[64, 184], [124, 184], [392, 184], [508, 184]].map(([cx, cy]) => (
      <g key={cx}>
        <circle cx={cx} cy={cy} r="26" fill="#10151C" />
        <circle cx={cx} cy={cy} r="26" fill="none" stroke="#2A3442" strokeWidth="3" />
        <g className="trk-rim">
          <circle cx={cx} cy={cy} r="12" fill="url(#trkChrome)" />
          {[0, 60, 120].map(a => (
            <line
              key={a}
              x1={cx - 11 * Math.cos((a * Math.PI) / 180)}
              y1={cy - 11 * Math.sin((a * Math.PI) / 180)}
              x2={cx + 11 * Math.cos((a * Math.PI) / 180)}
              y2={cy + 11 * Math.sin((a * Math.PI) / 180)}
              stroke="#5B6B7E"
              strokeWidth="3"
            />
          ))}
          <circle cx={cx} cy={cy} r="4" fill="#3A4757" />
        </g>
      </g>
    ))}
  </svg>
);
