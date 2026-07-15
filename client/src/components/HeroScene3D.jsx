import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { SemiTruck } from './HeroFleet';

/* ─── Canvas-drawn brand textures ─────────────────────────── */

const makeTrailerTexture = (mirror = false) => {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 440;
  const g = c.getContext('2d');
  // panel
  const grad = g.createLinearGradient(0, 0, 0, 440);
  grad.addColorStop(0, '#FFFFFF');
  grad.addColorStop(1, '#DCE6F2');
  g.fillStyle = grad;
  g.fillRect(0, 0, 1024, 440);
  // rib lines
  g.strokeStyle = '#D0DAE8';
  g.lineWidth = 3;
  for (let x = 64; x < 1024; x += 96) {
    g.beginPath(); g.moveTo(x, 10); g.lineTo(x, 400); g.stroke();
  }
  // navy skirt + blue swoosh
  g.fillStyle = '#16264C';
  g.fillRect(0, 406, 1024, 34);
  g.strokeStyle = '#2563EB';
  g.lineWidth = 16;
  g.beginPath(); g.moveTo(10, 386); g.quadraticCurveTo(340, 330, 1014, 366); g.stroke();

  if (mirror) { g.translate(1024, 0); g.scale(-1, 1); }

  // VX mark
  g.lineCap = 'round';
  g.strokeStyle = '#16264C'; g.lineWidth = 26;
  g.beginPath(); g.moveTo(110, 110); g.lineTo(148, 226); g.stroke();
  g.beginPath(); g.moveTo(186, 110); g.lineTo(148, 226); g.stroke();
  g.strokeStyle = '#2563EB';
  g.beginPath(); g.moveTo(146, 212); g.lineTo(218, 138); g.stroke();
  g.fillStyle = '#2563EB';
  g.beginPath(); g.moveTo(204, 112); g.lineTo(252, 122); g.lineTo(222, 158); g.closePath(); g.fill();

  // wordmark
  g.textBaseline = 'alphabetic';
  g.font = 'italic 800 118px Inter, Arial, sans-serif';
  g.fillStyle = '#16264C';
  g.fillText('Velon', 290, 210);
  const w1 = g.measureText('Velon').width;
  g.fillStyle = '#2563EB';
  g.fillText('Ex', 290 + w1, 210);
  const w2 = g.measureText('Ex').width;
  g.font = '700 62px Inter, Arial, sans-serif';
  g.fillStyle = '#5B7290';
  g.fillText('24', 290 + w1 + w2 + 16, 168);
  g.font = '600 44px Inter, Arial, sans-serif';
  g.fillStyle = '#5B7290';
  const sub = 'E X P R E S S   L O G I S T I C S';
  g.fillText(sub, 294, 286);

  const tx = new THREE.CanvasTexture(c);
  tx.anisotropy = 4;
  return tx;
};

/* ─── 3D builders ─────────────────────────────────────────── */

const MAT = {
  fuselage: () => new THREE.MeshStandardMaterial({ color: 0xF2F6FB, metalness: 0.35, roughness: 0.3 }),
  navy:     () => new THREE.MeshStandardMaterial({ color: 0x16304F, metalness: 0.5, roughness: 0.35 }),
  glass:    () => new THREE.MeshStandardMaterial({ color: 0x9CC3E8, metalness: 0.9, roughness: 0.1 }),
  chrome:   () => new THREE.MeshStandardMaterial({ color: 0xC9D3DF, metalness: 0.95, roughness: 0.15 }),
  tire:     () => new THREE.MeshStandardMaterial({ color: 0x11161D, roughness: 0.9 }),
  dark:     () => new THREE.MeshStandardMaterial({ color: 0x1B2A3E, roughness: 0.7 }),
};

const buildTruck = () => {
  const truck = new THREE.Group();
  const wheels = [];

  // trailer
  const trailerMats = [
    MAT.fuselage(), MAT.fuselage(), MAT.fuselage(), MAT.dark(),
    new THREE.MeshStandardMaterial({ map: makeTrailerTexture(false), roughness: 0.5 }),
    new THREE.MeshStandardMaterial({ map: makeTrailerTexture(true), roughness: 0.5 }),
  ];
  const trailer = new THREE.Mesh(new THREE.BoxGeometry(3.1, 1.35, 1.02), trailerMats);
  trailer.position.set(-0.75, 1.02, 0);
  truck.add(trailer);
  // trailer chassis
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(3.1, 0.14, 0.85), MAT.dark());
  chassis.position.set(-0.75, 0.28, 0);
  truck.add(chassis);

  // cab
  const cab = new THREE.Mesh(new THREE.BoxGeometry(0.92, 1.06, 0.98), MAT.navy());
  cab.position.set(1.28, 0.83, 0);
  truck.add(cab);
  // windshield (slanted)
  const shield = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.6, 0.9), MAT.glass());
  shield.position.set(1.8, 0.98, 0);
  shield.rotation.z = -0.28;
  truck.add(shield);
  // hood
  const hood = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.9), MAT.navy());
  hood.position.set(2.02, 0.51, 0);
  truck.add(hood);
  // chrome grille + bumper
  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.34, 0.8), MAT.chrome());
  grille.position.set(2.31, 0.48, 0);
  truck.add(grille);
  const bumper = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 1.0), MAT.chrome());
  bumper.position.set(2.32, 0.26, 0);
  truck.add(bumper);
  // exhaust stack
  const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.1, 10), MAT.chrome());
  stack.position.set(0.86, 1.15, 0.42);
  truck.add(stack);
  // fuel tank
  const tank = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.7, 14), MAT.chrome());
  tank.rotation.z = Math.PI / 2;
  tank.position.set(1.5, 0.3, 0.4);
  truck.add(tank);
  // headlights (emissive)
  const lightMat = new THREE.MeshBasicMaterial({ color: 0xFFE9A8 });
  [-0.32, 0.32].forEach(z => {
    const hl = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.09, 0.14), lightMat);
    hl.position.set(2.36, 0.4, z);
    truck.add(hl);
  });

  // wheels — cylinder inside a group so the rim can spin on its own axis
  const wheelPositions = [
    [-1.95, 0.32], [-1.35, 0.32],   // trailer tandem
    [0.85, 0.32], [1.95, 0.32],     // tractor
  ];
  wheelPositions.forEach(([x, y]) => {
    [-0.44, 0.44].forEach(z => {
      const holder = new THREE.Group();
      holder.rotation.x = Math.PI / 2;
      const tireMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.16, 18), MAT.tire());
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.17, 10), MAT.chrome());
      holder.add(tireMesh, rim);
      holder.position.set(x, y, z);
      truck.add(holder);
      wheels.push(tireMesh, rim);
    });
  });

  return { truck, wheels };
};

/* ─── Component ───────────────────────────────────────────── */

const HeroScene3D = () => {
  const mountRef = useRef(null);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    } catch {
      setWebglFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0, 0.6, 21);
    camera.lookAt(0, 0, 0);

    // lighting: cool night key + warm fill
    scene.add(new THREE.AmbientLight(0xBFD4F2, 0.85));
    const key = new THREE.DirectionalLight(0xFFFFFF, 1.6);
    key.position.set(6, 10, 8);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x2563EB, 0.5);
    rim.position.set(-8, 4, -6);
    scene.add(rim);

    // ── ground: road + dashes ──
    const ground = new THREE.Group();
    ground.position.y = -3.55;
    const road = new THREE.Mesh(
      new THREE.BoxGeometry(90, 0.06, 6.5),
      new THREE.MeshStandardMaterial({ color: 0x060D18, roughness: 1 })
    );
    road.position.y = -0.03;
    ground.add(road);
    const dashes = [];
    const dashMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.35 });
    for (let i = 0; i < 16; i++) {
      const d = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.02, 0.07), dashMat);
      d.position.set(-24 + i * 3, 0.03, 0.1);
      ground.add(d);
      dashes.push(d);
    }
    scene.add(ground);

    // ── trucks at three depths ──
    const truckDefs = [
      { z: 1.1, scale: 1.0, speed: 5.2, tint: 1.0 },
      { z: -1.0, scale: 0.8, speed: 3.6, tint: 0.75 },
      { z: -2.6, scale: 0.62, speed: 2.6, tint: 0.55 },
    ];
    const trucks = truckDefs.map((def, i) => {
      const { truck, wheels } = buildTruck();
      truck.scale.setScalar(def.scale);
      truck.rotation.y = -0.1; // slight angle so the cab front shows
      truck.position.set(-14 - i * 9, -3.55, def.z);
      truck.traverse(o => {
        if (o.isMesh && o.material && !Array.isArray(o.material) && o.material.color && def.tint < 1) {
          o.material = o.material.clone();
          o.material.color.multiplyScalar(def.tint);
        }
      });
      scene.add(truck);
      return { obj: truck, wheels, ...def };
    });

    // responsive sizing
    let halfW = 10;
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const halfH = Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
      halfW = halfH * camera.aspect;
      // road hugs the bottom edge of the hero
      const groundY = -halfH + 0.7;
      ground.position.y = groundY;
      trucks.forEach(tr => { tr.obj.position.y = groundY; });
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // visibility-aware loop
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0.05 });
    io.observe(mount);

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible || document.hidden) return;
      const dt = Math.min(clock.getDelta(), 0.05) || 0.016;

      // trucks drive right, loop
      const limit = halfW + 8;
      trucks.forEach(tr => {
        tr.obj.position.x += tr.speed * dt;
        if (tr.obj.position.x > limit) tr.obj.position.x = -limit;
        tr.wheels.forEach(w => { w.rotation.y -= (tr.speed * dt) / 0.32; });
      });

      // road dashes crawl to imply camera pace
      dashes.forEach(d => {
        d.position.x -= 1.6 * dt;
        if (d.position.x < -24) d.position.x += 48;
      });

      renderer.render(scene, camera);
    };

    if (reducedMotion) {
      renderer.render(scene, camera); // single static frame
    } else {
      tick();
    }

    // crisper brand text once webfont loads
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        scene.traverse(o => {
          if (o.isMesh) {
            const mats = Array.isArray(o.material) ? o.material : [o.material];
            mats.forEach(m => { if (m.map) m.map.needsUpdate = true; });
          }
        });
      });
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      renderer.dispose();
      scene.traverse(o => {
        if (o.isMesh) {
          o.geometry?.dispose();
          const mats = Array.isArray(o.material) ? o.material : [o.material];
          mats.forEach(m => { m.map?.dispose(); m.dispose(); });
        }
      });
      mount.removeChild(renderer.domElement);
    };
  }, []);

  /* SVG fallback when WebGL is unavailable */
  if (webglFailed) {
    return (
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 6, pointerEvents: 'none' }}>
        <SemiTruck height={44} />
      </div>
    );
  }

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
    />
  );
};

export default HeroScene3D;
