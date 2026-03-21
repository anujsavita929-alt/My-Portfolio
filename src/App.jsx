import { useEffect, useState, useRef } from 'react';
import * as THREE from 'three';
import LiquidEther from './components/LiquidEther/LiquidEther';
import './style.css';
import emailjs from '@emailjs/browser';
import gurukulImg from './assets/gurukul.jpg';
import ClickSpark from './components/ClickSpark/ClickSpark';
import GooeyNav from './components/GooeyNav/GooeyNav';
import RotatingText from './components/RotatingText/RotatingText';
import ArcaneCursor from './components/ArcaneCursor/ArcaneCursor';
import { ParticleCard, GlobalSpotlight } from './components/MagicBento/MagicBento';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function App() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('portfolio-theme') || 'dark'
  );
  const projectsGridRef = useRef(null);
  const formRef = useRef(null);
  const [formStatus, setFormStatus] = useState('idle');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  /* ══════════════════════════════════════════════════════
     BUGATTI 3D MODEL
  ══════════════════════════════════════════════════════ */
  useEffect(() => {
    const canvas = document.getElementById('bugatti-canvas');
    if (!canvas) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 600 / 420, 0.1, 1000);
    camera.position.set(4, 2, 6);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(600, 420);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.setClearColor(0x000000, 0);
    scene.add(new THREE.AmbientLight(0xffffff, 1.2));
    const dir = new THREE.DirectionalLight(0xffffff, 2.5);
    dir.position.set(5, 10, 5); dir.castShadow = true; scene.add(dir);
    const fill = new THREE.DirectionalLight(0xa8c8ff, 1.0); fill.position.set(-5, 2, -5); scene.add(fill);
    const rim = new THREE.DirectionalLight(0xffd0a0, 0.8); rim.position.set(0, 5, -8); scene.add(rim);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; controls.dampingFactor = 0.05; controls.enablePan = false;
    controls.minDistance = 3; controls.maxDistance = 12; controls.maxPolarAngle = Math.PI / 2.1;
    controls.autoRotate = true; controls.autoRotateSpeed = 1.2;
    const loader = new GLTFLoader();
    loader.load('/model/bugatti_chiron_white.glb', (gltf) => {
      const model = gltf.scene;
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const scale = 4 / Math.max(size.x, size.y, size.z);
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));
      model.traverse(child => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; } });
      scene.add(model);
    });
    let rafId, running = true;
    function animateBugatti() {
      if (!running) return;
      rafId = requestAnimationFrame(animateBugatti);
      controls.update();
      renderer.render(scene, camera);
    }
    animateBugatti();
    const onResize = () => {
      const w = canvas.parentElement?.clientWidth || 600;
      camera.aspect = w / 420; camera.updateProjectionMatrix();
      renderer.setSize(w, 420); canvas.width = w; canvas.height = 420;
    };
    window.addEventListener('resize', onResize);
    const stopAuto = () => { controls.autoRotate = false; };
    canvas.addEventListener('pointerdown', stopAuto);
    return () => {
      running = false; cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      canvas.removeEventListener('pointerdown', stopAuto);
      controls.dispose(); renderer.dispose();
    };
  }, []);

  /* ══════════════════════════════════════════════════════
     MAIN THREE.JS INTRO SCENE
  ══════════════════════════════════════════════════════ */
  useEffect(() => {
    const wrap = document.getElementById('canvas-wrap');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, innerWidth / innerHeight, 0.1, 2000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(innerWidth, innerHeight);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    wrap.appendChild(renderer.domElement);

    const N = 10000;
    const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), spd = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const a = Math.random() * Math.PI * 2, r = 1.2 + Math.pow(Math.random(), 0.5) * 3.5;
      pos[i*3] = Math.cos(a)*r; pos[i*3+1] = Math.sin(a)*r; pos[i*3+2] = (Math.random()-0.5)*320;
      spd[i] = 0.3 + Math.random()*1.8;
      const t = Math.random(); col[i*3] = t*0.3; col[i*3+1] = 0.85+t*0.15; col[i*3+2] = 1;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const cloud = new THREE.Points(pGeo, new THREE.PointsMaterial({ size: 0.035, vertexColors: true, transparent: true, opacity: 0.75 }));
    scene.add(cloud);
    const ico = new THREE.Mesh(new THREE.IcosahedronGeometry(1.15,1), new THREE.MeshBasicMaterial({ color:0x00f5ff, wireframe:true, transparent:true, opacity:0.18 }));
    scene.add(ico);
    scene.add(new THREE.Mesh(new THREE.IcosahedronGeometry(0.85,0), new THREE.MeshBasicMaterial({ color:0x000d1a, transparent:true, opacity:0.92 })));
    function makeRing(radius, color, opacity) {
      const m = new THREE.Mesh(new THREE.TorusGeometry(radius,0.007,4,90), new THREE.MeshBasicMaterial({ color, transparent:true, opacity }));
      scene.add(m); return m;
    }
    const ring1 = makeRing(2.1,0x00f5ff,0.28);
    const ring2 = makeRing(2.7,0xff6b35,0.18); ring2.rotation.x = Math.PI*0.42;
    const ring3 = makeRing(1.6,0x00f5ff,0.12); ring3.rotation.x = Math.PI*0.22; ring3.rotation.z = Math.PI*0.15;
    const starPos = new Float32Array(3000*3);
    for (let i=0;i<3000;i++) {
      const th=Math.random()*Math.PI*2, ph=Math.acos(2*Math.random()-1), r=80+Math.random()*200;
      starPos[i*3]=r*Math.sin(ph)*Math.cos(th); starPos[i*3+1]=r*Math.sin(ph)*Math.sin(th); starPos[i*3+2]=r*Math.cos(ph);
    }
    const sGeo = new THREE.BufferGeometry();
    sGeo.setAttribute('position', new THREE.BufferAttribute(starPos,3));
    scene.add(new THREE.Points(sGeo, new THREE.PointsMaterial({ size:0.25, color:0xaaddff, transparent:true, opacity:0.35 })));

    let flowSpeed=0.65, targetSpeed=0.65, clockTime=0, animId, running=true;
    function animate() {
      if (!running) return;
      animId = requestAnimationFrame(animate);
      clockTime += 0.016; flowSpeed += (targetSpeed-flowSpeed)*0.04;
      const pa = cloud.geometry.attributes.position.array;
      for (let i=0;i<N;i++) { pa[i*3+2] += spd[i]*flowSpeed*0.016*60*0.016; if(pa[i*3+2]>12) pa[i*3+2]-=320; }
      cloud.geometry.attributes.position.needsUpdate = true;
      ico.rotation.x+=0.0025; ico.rotation.y+=0.004;
      ring1.rotation.z+=0.0018; ring2.rotation.y+=0.0022; ring3.rotation.x+=0.003;
      camera.position.x=Math.sin(clockTime*0.12)*0.18; camera.position.y=Math.cos(clockTime*0.09)*0.12;
      camera.lookAt(0,0,0); renderer.render(scene,camera);
    }
    animate();
    const onResize = () => { camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth,innerHeight); };
    window.addEventListener('resize', onResize);

    const bar = document.getElementById('ld-bar'), pct = document.getElementById('ld-pct');
    let prog = 0;
    const loadInterval = setInterval(() => {
      prog += Math.random()*12+3;
      if (prog>=100) { prog=100; clearInterval(loadInterval); setTimeout(revealIntro,300); }
      bar.style.width=prog+'%'; pct.textContent=Math.round(prog)+'%';
    }, 90);

    function revealIntro() {
      const loader = document.getElementById('loader');
      loader.classList.add('out'); setTimeout(()=>{ loader.style.display='none'; },900);
      document.querySelectorAll('.corner').forEach((c,i)=>setTimeout(()=>c.classList.add('show'),i*80+100));
      ['h1','h2','h3','h4','h5','h6','h7','h8'].forEach((id,i)=>setTimeout(()=>document.getElementById(id)?.classList.add('show'),i*100+300));
      setTimeout(()=>{ document.getElementById('ititle').classList.add('show'); document.getElementById('isub').classList.add('show'); },600);
      setTimeout(()=>document.getElementById('sbar').classList.add('show'),1200);
      setTimeout(()=>document.getElementById('cte').classList.add('show'),2200);
    }

    let entered=false;
    const onCteClick = () => {
      if(entered) return; entered=true; targetSpeed=18;
      const flash=document.createElement('div');
      Object.assign(flash.style,{position:'fixed',inset:'0',background:'rgba(0,245,255,0.07)',zIndex:'999',pointerEvents:'none',transition:'opacity 0.7s ease'});
      document.body.appendChild(flash);
      setTimeout(()=>{ document.getElementById('intro').classList.add('exit'); document.getElementById('canvas-wrap').style.opacity='0'; flash.style.opacity='0'; },500);
      setTimeout(()=>{
        document.getElementById('intro').style.display='none';
        document.getElementById('canvas-wrap').style.display='none';
        flash.remove(); document.body.classList.add('portfolio-active');
        const portfolio=document.getElementById('portfolio');
        portfolio.style.display='block'; portfolio.style.opacity='0';
        requestAnimationFrame(()=>requestAnimationFrame(()=>{
          portfolio.style.transition='opacity 0.9s ease'; portfolio.style.opacity='1';
          portfolio.classList.add('animate-in');
        }));
        targetSpeed=0.5;
      },1600);
    };
    const cteEl=document.getElementById('cte');
    cteEl.addEventListener('click',onCteClick);

    const track=document.querySelector('.skills-track');
    let isDown=false,startX=0,scrollLeft=0;
    const onTrackDown=e=>{ isDown=true; startX=e.pageX-track.offsetLeft; scrollLeft=track.scrollLeft; track.style.cursor='grabbing'; };
    const onTrackUp=()=>{ isDown=false; track.style.cursor='grab'; };
    const onTrackMove=e=>{ if(!isDown) return; e.preventDefault(); const x=e.pageX-track.offsetLeft; track.scrollLeft=scrollLeft-(x-startX)*1.5; };
    if(track){ track.addEventListener('mousedown',onTrackDown); track.addEventListener('mouseleave',onTrackUp); track.addEventListener('mouseup',onTrackUp); track.addEventListener('mousemove',onTrackMove); }

    return () => {
      running=false; cancelAnimationFrame(animId); clearInterval(loadInterval);
      cteEl.removeEventListener('click',onCteClick); window.removeEventListener('resize',onResize);
      renderer.dispose();
      if(wrap&&wrap.contains(renderer.domElement)) wrap.removeChild(renderer.domElement);
      if(track){ track.removeEventListener('mousedown',onTrackDown); track.removeEventListener('mouseleave',onTrackUp); track.removeEventListener('mouseup',onTrackUp); track.removeEventListener('mousemove',onTrackMove); }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('sending');
    emailjs.sendForm('service_wl8iieg','template_nn8jbm4',formRef.current,'Me5cayM2taeL1Davu')
      .then(()=>{ setFormStatus('sent'); formRef.current.reset(); setTimeout(()=>setFormStatus('idle'),5000); })
      .catch(()=>{ setFormStatus('error'); setTimeout(()=>setFormStatus('idle'),5000); });
  };

  return (
    <>
      <ArcaneCursor />

      {/* ════════ LOADER ════════ */}
      <div id="loader">
        <div id="loader-bg">
          <LiquidEther colors={['#00f5ff','#0077aa','#003355']} mouseForce={17} cursorSize={85}
            isViscous={false} viscous={30} iterationsViscous={32} iterationsPoisson={32}
            resolution={0.5} isBounce={false} autoDemo autoSpeed={0.4} autoIntensity={2.5}
            takeoverDuration={0.25} autoResumeDelay={3000} autoRampDuration={0.6} />
        </div>
        <div id="loader-content">
          <div id="loader-header">
            <img src={gurukulImg} alt="Anuj" id="loader-img" />
            <div className="ld-logo">Anuj Savita</div>
          </div>
          <div className="ld-label">Initializing Portfolio</div>
          <div className="ld-bar-wrap"><div className="ld-bar" id="ld-bar"></div></div>
          <div className="ld-pct ld-label" id="ld-pct">0%</div>
        </div>
      </div>

      {/* ════════ WORMHOLE ════════ */}
      <div id="canvas-wrap"></div>

      {/* ════════ INTRO ════════ */}
      <div id="intro">
        <div className="corner c-tl"></div><div className="corner c-tr"></div>
        <div className="corner c-bl"></div><div className="corner c-br"></div>
        <div id="intro-bg">
          <LiquidEther colors={['#00f5ff','#003355','#0a0a2e']} mouseForce={15} cursorSize={80}
            autoDemo autoSpeed={0.3} autoIntensity={2.0} resolution={0.5}
            style={{ width:'100%', height:'100%' }} />
        </div>
        <div className="hud-col">
          <div className="hud-row" id="h1"><div className="hud-dot"></div>SYS&nbsp;&nbsp;ONLINE</div>
          <div className="hud-row" id="h2"><div className="hud-dot"></div>VER&nbsp;&nbsp;2.4.1</div>
          <div className="hud-row" id="h3"><div className="hud-dot orange"></div>AUTH&nbsp;&nbsp;PENDING</div>
          <div className="hud-row" id="h4"><div className="hud-dot"></div>ENV&nbsp;&nbsp;SECURE</div>
        </div>
        <div className="hud-right hud-col">
          <div className="hud-row" id="h5">CORE&nbsp;&nbsp;ACTIVE<div className="hud-dot"></div></div>
          <div className="hud-row" id="h6">GRID&nbsp;&nbsp;STABLE<div className="hud-dot"></div></div>
          <div className="hud-row" id="h7">SIGNAL&nbsp;&nbsp;CLEAR<div className="hud-dot"></div></div>
          <div className="hud-row" id="h8">NODE&nbsp;&nbsp;READY<div className="hud-dot orange"></div></div>
        </div>
        <h1 className="intro-title" id="ititle">An<span>uj Sa</span>vita</h1>
        <p className="intro-sub" id="isub">Creative Portfolio &nbsp;/&nbsp; 2026</p>
        <div id="cte">◈ &nbsp;&nbsp; Click to Enter &nbsp;&nbsp; ◈</div>
        <div className="status-bar" id="sbar">
          <span className="st-item">Three.js r183</span><span className="st-item">◈</span>
          <span className="st-item">WebGL Renderer</span><span className="st-item">◈</span>
          <span className="st-item">Particles: 10K</span>
        </div>
      </div>

      {/* ════════ PORTFOLIO ════════ */}
      <div id="portfolio">
        <ClickSpark sparkColor='#00e5a0' sparkSize={10} sparkRadius={18} sparkCount={8} duration={450} easing='ease-out' extraScale={1.2}>

          <div className="orbs">
            <div className="orb"></div><div className="orb"></div><div className="orb"></div>
            <div className="orb blurred"></div><div className="orb blurred"></div>
            <div className="orb"></div><div className="orb blurred"></div>
          </div>

          {/* NAV */}
          <div className="nav-logo-fixed">ANUJ SAVITA<span>.</span></div>
          <div className="nav-sidebar">
            <GooeyNav
              items={[
                { label:'Home',    href:'#'        },
                { label:'About',   href:'#about'   },
                { label:'Work',    href:'#work'    },
                { label:'Skills',  href:'#skills'  },
                { label:'Contact', href:'#contact' },
              ]}
              particleCount={10} particleDistances={[80,10]} particleR={80}
              animationTime={600} timeVariance={300} colors={[1,2,3,4,1,2,3]} initialActiveIndex={0}
            />
            <button className="theme-toggle" onClick={()=>setTheme(t=>t==='light'?'dark':'light')} aria-label="Toggle theme">
              {theme==='light'?'◐':'◑'}
            </button>
          </div>

          <div className="wrapper">

            {/* ── HERO ── */}
            <section className="hero" id="home">
              <div className="hero-text">
                <div className="hero-greeting">Hi, I'm</div>
                <h1>
                  Anuj Savita<br />
                  <em>
                    <RotatingText
                      texts={['I build immersive','I craft interactive','I design creative','I code beautiful','I ship fast']}
                      mainClassName="hero-rotating-text"
                      elementLevelClassName="hero-rotating-char"
                      splitBy="characters" staggerDuration={0.03} staggerFrom="first"
                      rotationInterval={2500} transition={{ type:'spring', damping:25, stiffness:300 }}
                    />
                  </em><br />
                  web experiences.
                </h1>
                <p>Frontend Developer focused on crafting interactive, animated, and visually engaging websites using React, Three.js, and Blender.</p>
                <div className="hero-btns">
                  <a href="#work" className="btn-primary">View Projects</a>
                  <a href="#contact" className="btn-ghost">Contact Me</a>
                </div>
              </div>
              <div className="hero-card glass">
                <span className="tag">Available for work</span>
                <h2>Frontend Developer &amp; CS Student</h2>
                <p>Gwalior, Madhya Pradesh — building with React, Three.js, and Blender to craft immersive web experiences.</p>
                <div className="stat-row">
                  <div className="stat"><span className="num">12+</span><span className="lbl">Projects</span></div>
                  <div className="stat"><span className="num">3+</span><span className="lbl">Years coding</span></div>
                  <div className="stat"><span className="num">∞</span><span className="lbl">Ideas</span></div>
                </div>
              </div>
            </section>

            {/* ── ABOUT ── */}
            <section className="section" id="about">
              <div className="section-header reveal"><h2>About Me</h2><div className="line"></div></div>
              <div className="about-grid">
                <ParticleCard className="about-card glass magic-bento-card magic-bento-card--border-glow reveal delay-1" glowColor="216, 120, 128" particleCount={10} enableTilt={true} clickEffect={true}>
                  <div className="about-icon">👨‍💻</div><h3>Who I Am</h3>
                  <p>I'm a frontend developer who enjoys blending design and development to create unique digital experiences. I specialize in building responsive, animated, and interactive websites using React and Three.js.</p>
                </ParticleCard>
                <ParticleCard className="about-card glass magic-bento-card magic-bento-card--border-glow reveal delay-2" glowColor="216, 120, 128" particleCount={10} enableTilt={true} clickEffect={true}>
                  <div className="about-icon">🎯</div><h3>What I Do</h3>
                  <p>I work with Blender to integrate 3D elements into the web, making projects feel more alive. I'm focused on improving through projects, hackathons, and experimenting with creative UI/UX concepts.</p>
                </ParticleCard>
                <ParticleCard className="about-card glass magic-bento-card magic-bento-card--border-glow reveal delay-3" glowColor="0, 245, 255" particleCount={10} enableTilt={true} clickEffect={true}>
                  <div className="about-icon">🚀</div><h3>Currently</h3>
                  <p>CS student at MITS Gwalior — building full-stack apps, experimenting with WebGL shaders, and participating in hackathons to push creative boundaries.</p>
                </ParticleCard>
              </div>
            </section>

            {/* ── SKILLS ── */}
            <section className="section" id="skills">
              <div className="section-header reveal"><h2>Craft &amp; Tools</h2><div className="line"></div></div>
              <div className="skills-scroll-wrapper">
                <div className="skills-track">
                  <div className="skill-card glass"><div className="skill-icon">🌐</div><h3>HTML &amp; CSS</h3><p>Semantic markup, CSS animations, glassmorphism — interfaces that feel alive.</p><div className="skill-bar-wrap"><div className="skill-bar" style={{width:'92%'}}></div></div></div>
                  <div className="skill-card glass"><div className="skill-icon">⚡</div><h3>JavaScript</h3><p>ES6+, DOM manipulation, async patterns, and creative interaction logic.</p><div className="skill-bar-wrap"><div className="skill-bar" style={{width:'88%'}}></div></div></div>
                  <div className="skill-card glass"><div className="skill-icon">⚛️</div><h3>React.js</h3><p>Component-driven SPAs, hooks, state management, and modern patterns.</p><div className="skill-bar-wrap"><div className="skill-bar" style={{width:'85%'}}></div></div></div>
                  <div className="skill-card glass"><div className="skill-icon">📱</div><h3>Responsive Design</h3><p>Mobile-first layouts, CSS grid and flexbox — pixel-perfect across all devices.</p><div className="skill-bar-wrap"><div className="skill-bar" style={{width:'90%'}}></div></div></div>
                  <div className="skill-card glass"><div className="skill-icon">🔮</div><h3>Three.js</h3><p>3D scenes, particle systems, and shader-based visual experiences in the browser.</p><div className="skill-bar-wrap"><div className="skill-bar" style={{width:'72%'}}></div></div></div>
                  <div className="skill-card glass"><div className="skill-icon">🎨</div><h3>Blender</h3><p>3D models, animations, and assets for web integration and visual storytelling.</p><div className="skill-bar-wrap"><div className="skill-bar" style={{width:'65%'}}></div></div></div>
                  <div className="skill-card glass"><div className="skill-icon">🎬</div><h3>GSAP / Animations</h3><p>Timeline animations, scroll triggers, and smooth micro-interactions.</p><div className="skill-bar-wrap"><div className="skill-bar" style={{width:'75%'}}></div></div></div>
                  <div className="skill-card glass"><div className="skill-icon">📦</div><h3>Git &amp; GitHub</h3><p>Version control, branching workflows, and collaborative development.</p><div className="skill-bar-wrap"><div className="skill-bar" style={{width:'85%'}}></div></div></div>
                  <div className="skill-card glass"><div className="skill-icon">🖌️</div><h3>Figma</h3><p>UI design, prototyping, and design-to-code handoff for polished interfaces.</p><div className="skill-bar-wrap"><div className="skill-bar" style={{width:'70%'}}></div></div></div>
                  <div className="skill-card glass"><div className="skill-icon">🐍</div><h3>Python &amp; C++</h3><p>Algorithms, Flask backends, genetic algorithms, and graphics.h animations.</p><div className="skill-bar-wrap"><div className="skill-bar" style={{width:'78%'}}></div></div></div>
                </div>
              </div>
            </section>

            {/* ── 3D MODELS ── */}
            <section className="section" id="models">
              <div className="section-header reveal"><h2>Explore in 3D</h2><div className="line"></div></div>
              <div className="models-grid">
                <div className="model-frame reveal delay-1">
                  <div className="model-canvas-wrap"><canvas id="canvas"></canvas></div>
                  <span className="model-caption">Dodecahedron · Drag to orbit</span>
                </div>
                <div className="model-frame reveal delay-2">
                  <div className="model-canvas-wrap"><canvas id="cube-canvas"></canvas></div>
                  <span className="model-caption">Cube · Drag to orbit</span>
                </div>
              </div>
            </section>

            {/* ── PROJECTS ── */}
            <section className="section" id="work">
              <div className="section-header reveal"><h2>Selected Work</h2><div className="line"></div></div>
              <div className="work-split">
                <div className="bugatti-frame reveal delay-1">
                  <div className="bugatti-label">Bugatti Chiron · Drag to orbit</div>
                  <canvas id="bugatti-canvas" width="600" height="420"></canvas>
                  <div className="bugatti-hint">🖱 drag · scroll to zoom</div>
                </div>
                <div className="projects-stack bento-section" ref={projectsGridRef}>
                  <GlobalSpotlight gridRef={projectsGridRef} glowColor="216, 120, 128" spotlightRadius={280} />
                  <ParticleCard className="project-card glass magic-bento-card magic-bento-card--border-glow reveal delay-1" glowColor="216, 120, 128" particleCount={10} enableTilt={true} clickEffect={true} enableMagnetism={false}>
                    <div className="proj-number">01</div>
                    <h3>School Timetable Management System</h3>
                    <p>Full-stack app automating school timetables with Next.js, TypeScript, Prisma, and a genetic algorithm engine.</p>
                    <div className="tags"><span className="tag-pill">Next.js</span><span className="tag-pill">TypeScript</span><span className="tag-pill">Prisma</span><span className="tag-pill">Gemini AI</span><span className="tag-pill">Tailwind</span></div>
                    <a href="https://github.com/anujsavita929-alt/v0-school-timetable-ui" className="proj-link">View on GitHub →</a>
                  </ParticleCard>
                  <ParticleCard className="project-card glass magic-bento-card magic-bento-card--border-glow reveal delay-2" glowColor="216, 120, 128" particleCount={10} enableTilt={true} clickEffect={true} enableMagnetism={false}>
                    <div className="proj-number">02</div>
                    <h3>Madhav Cafeteria</h3>
                    <p>Landing page for a local café in Gwalior — Instagram-inspired palette, CSS animations, and hover effects.</p>
                    <div className="tags"><span className="tag-pill">HTML/CSS</span><span className="tag-pill">Animations</span><span className="tag-pill">CSS Variables</span></div>
                    <a href="#" className="proj-link">Live Site →</a>
                  </ParticleCard>
                  <ParticleCard className="project-card glass magic-bento-card magic-bento-card--border-glow reveal delay-3" glowColor="216, 120, 128" particleCount={10} enableTilt={true} clickEffect={true} enableMagnetism={false}>
                    <div className="proj-number">03</div>
                    <h3>Animation Assets Library</h3>
                    <p>A modular collection of reusable CSS and JS animations — magic cursor, glitch text, neon glow, wave text, rainbow shift, and more.</p>
                    <div className="tags"><span className="tag-pill">CSS</span><span className="tag-pill">JavaScript</span><span className="tag-pill">Animations</span><span className="tag-pill">Open Source</span></div>
                    <a href="https://github.com/anujsavita929-alt/assets" target="_blank" rel="noreferrer" className="proj-link">View on GitHub →</a>
                  </ParticleCard>
                </div>
              </div>
            </section>

            {/* ── HACKATHON / EXPERIENCE ── */}
            <section className="section" id="experience">
              <div className="section-header reveal"><h2>Hackathons &amp; Experience</h2><div className="line"></div></div>
              <div className="experience-grid">
                <ParticleCard className="exp-card glass magic-bento-card magic-bento-card--border-glow reveal delay-1" glowColor="0, 245, 255" particleCount={10} enableTilt={true} clickEffect={true}>
                  <div className="exp-badge">🏆 Hackathon</div>
                  <h3>Frontend Battle 2K26</h3>
                  <div className="exp-meta">MITS Gwalior &nbsp;·&nbsp; Round 1: Portfolio Showdown</div>
                  <p>Built a futuristic "developer OS" portfolio using Three.js with 80,000-particle spiral galaxy and glassmorphism UI.</p>
                  <div className="tags"><span className="tag-pill">Three.js</span><span className="tag-pill">React</span><span className="tag-pill">WebGL</span><span className="tag-pill">GSAP</span></div>
                </ParticleCard>
                <ParticleCard className="exp-card glass magic-bento-card magic-bento-card--border-glow reveal delay-2" glowColor="0, 245, 255" particleCount={10} enableTilt={true} clickEffect={true}>
                  <div className="exp-badge">🎓 Academic</div>
                  <h3>OS Architecture Analysis</h3>
                  <div className="exp-meta">MITS Gwalior &nbsp;·&nbsp; Operating Systems Course</div>
                  <p>Comparative analysis of Linux and Windows NT kernel architectures — scheduling, memory management, and security models.</p>
                  <div className="tags"><span className="tag-pill">Linux</span><span className="tag-pill">Windows NT</span><span className="tag-pill">OS Design</span></div>
                </ParticleCard>
                <ParticleCard className="exp-card glass magic-bento-card magic-bento-card--border-glow reveal delay-3" glowColor="216, 120, 128" particleCount={10} enableTilt={true} clickEffect={true}>
                  <div className="exp-badge">💡 Project</div>
                  <h3>AI Timetable Generator</h3>
                  <div className="exp-meta">Full-Stack &nbsp;·&nbsp; Flask + Gemini API</div>
                  <p>AI-powered timetable generator with Aurora Glassmorphism frontend and role-based access for admin/teacher/student views.</p>
                  <div className="tags"><span className="tag-pill">Flask</span><span className="tag-pill">Gemini API</span><span className="tag-pill">Python</span><span className="tag-pill">Glassmorphism</span></div>
                </ParticleCard>
                <ParticleCard className="exp-card glass magic-bento-card magic-bento-card--border-glow reveal delay-1" glowColor="216, 120, 128" particleCount={10} enableTilt={true} clickEffect={true}>
                  <div className="exp-badge">🎨 Creative Dev</div>
                  <h3>3D Galaxy Visualizer</h3>
                  <div className="exp-meta">Three.js &nbsp;·&nbsp; WebGL</div>
                  <p>80,000-particle spiral galaxy with interactive orbit controls, custom shaders, and real-time rotation.</p>
                  <div className="tags"><span className="tag-pill">Three.js</span><span className="tag-pill">Vite</span><span className="tag-pill">Shaders</span><span className="tag-pill">Particles</span></div>
                </ParticleCard>
              </div>
            </section>

            {/* ── CONTACT ── */}
            <div className="contact-row" id="contact">
              <div className="contact-card glass reveal delay-1">
                <h2>Let's build something.</h2>
                <p>Have a project idea or want to collaborate? Let's build something amazing together. Based in Gwalior — happy to work remotely.</p>
                <div className="social-links">
                  <a href="mailto:anujsavita395@gmail.com" className="social-link"><span className="icon">✉️</span> anujsavita395@gmail.com</a>
                  <a href="https://github.com/anujsavita929-alt" target="_blank" rel="noreferrer" className="social-link"><span className="icon">💻</span> github.com/anujsavita929-alt</a>
                  <a href="https://www.linkedin.com/in/anuj-savita-b1a4a6391/" target="_blank" rel="noreferrer" className="social-link"><span className="icon">💼</span> linkedin.com/in/anuj-savita</a>
                </div>
              </div>
              <div className="form-card glass reveal delay-2">
                <form ref={formRef} onSubmit={handleSubmit}>
                  <div className="form-group"><label>Name</label><input type="text" name="from_name" placeholder="Your name" required /></div>
                  <div className="form-group"><label>Email</label><input type="email" name="from_email" placeholder="your@email.com" required /></div>
                  <div className="form-group"><label>Message</label><textarea name="message" placeholder="Tell me about your project..." required></textarea></div>
                  <button type="submit" className="btn-primary" style={{width:'100%',textAlign:'center'}} disabled={formStatus==='sending'}>
                    {formStatus==='idle'&&'Send Message'}
                    {formStatus==='sending'&&'⏳ Sending...'}
                    {formStatus==='sent'&&'✅ Message Sent!'}
                    {formStatus==='error'&&'❌ Try Again'}
                  </button>
                  {formStatus==='sent'&&<p className="form-feedback success">Thanks! I'll get back to you soon.</p>}
                  {formStatus==='error'&&<p className="form-feedback error">Something went wrong. Email me directly at anujsavita395@gmail.com</p>}
                </form>
              </div>
            </div>

            <footer>
              Crafted with care by <span>Anuj Savita</span> · Gwalior, India · 2026
            </footer>

          </div>{/* /wrapper */}
        </ClickSpark>
      </div>{/* /portfolio */}
    </>
  );
}