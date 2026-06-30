// ============================================
// Hero "Living System" — Three.js hybrid scene
// Phase 1: static composition (no motion yet)
// WebGLRenderer (atmosphere) + CSS3DRenderer (cards/windows/chips)
// Falls back silently to the existing hero if anything is unsupported.
// ============================================

(function () {
    const mount = document.getElementById('heroScene');
    if (!mount) return;

    // Classic build globals (loaded via <script> from CDN)
    const THREE = window.THREE;
    if (!THREE || !THREE.CSS3DRenderer) return; // CDN unavailable -> keep fallback
    const CSS3DRenderer = THREE.CSS3DRenderer;
    const CSS3DObject = THREE.CSS3DObject;

    // Keep the simple fallback hero on small screens (refined in a later phase)
    if (window.innerWidth < 768) return;

    // WebGL capability check — otherwise leave the fallback hero in place
    function webglOK() {
        try {
            const c = document.createElement('canvas');
            return !!(window.WebGLRenderingContext &&
                (c.getContext('webgl') || c.getContext('experimental-webgl')));
        } catch (e) { return false; }
    }
    if (!webglOK()) return;

    let width = mount.clientWidth || 480;
    let height = mount.clientHeight || 600;

    // Two scenes, one shared camera
    const glScene = new THREE.Scene();
    const cssScene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(42, width / height, 1, 5000);
    camera.position.set(0, 0, 1050);

    // WebGL renderer — transparent so the hero gradient shows through
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(width, height);
    renderer.domElement.classList.add('hero-gl');
    mount.appendChild(renderer.domElement);

    // CSS3D renderer — crisp HTML cards in 3D space
    const cssRenderer = new CSS3DRenderer();
    cssRenderer.setSize(width, height);
    cssRenderer.domElement.classList.add('hero-css3d');
    mount.appendChild(cssRenderer.domElement);

    // Tilt the whole system a touch for an isometric feel
    const tilt = new THREE.Euler(-0.09, 0.18, 0);
    const glWorld = new THREE.Group();
    const cssWorld = new THREE.Group();
    glWorld.rotation.copy(tilt);
    cssWorld.rotation.copy(tilt);
    glScene.add(glWorld);
    cssScene.add(cssWorld);

    // ---- Atmosphere: faint particle field ----
    const pCount = 170;
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
        pos[i * 3]     = (Math.random() - 0.5) * 980;
        pos[i * 3 + 1] = (Math.random() - 0.5) * 740;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 520 - 120;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({
        color: 0x9aa6ff, size: 2.6, transparent: true, opacity: 0.45, depthWrite: false
    });
    const points = new THREE.Points(pGeo, pMat);
    glWorld.add(points);

    // Nodes that gently drift (populated by makeNode)
    const drifters = [];
    // Nodes wired to the core with a connector + pulse
    const links = [];

    // ---- CSS3D node helper ----
    // html = inner card markup; opts = { stat, link }
    function makeNode(html, x, y, z, opts) {
        opts = opts || {};
        const node = document.createElement('div');
        node.className = 'node';
        node.innerHTML = html.trim();
        if (opts.stat) {
            const s = document.createElement('span');
            s.className = 'node-stat';
            s.textContent = opts.stat;
            node.appendChild(s);
        }
        const obj = new CSS3DObject(node);
        obj.position.set(x, y, z);
        cssWorld.add(obj);
        drifters.push({
            obj,
            base: obj.position.clone(),
            phase: Math.random() * Math.PI * 2,
            ampX: 3 + Math.random() * 4,
            ampY: 4 + Math.random() * 5,
            speed: 0.4 + Math.random() * 0.35
        });
        if (opts.link !== false) {
            links.push({ obj, t0: Math.random(), pSpeed: 0.18 + Math.random() * 0.16 });
        }
        return obj;
    }

    // Core — the architect (your profile)
    const profileObj = makeNode(`
        <div class="scene-card scene-profile">
            <div class="sp-photo"><img src="images/about.png" alt=""></div>
            <div class="sp-meta"><span class="sp-dot"></span>Harsh Carpenter</div>
        </div>`, 0, 0, 0, { link: false, stat: 'Software Engineer' });

    // App window — Exam Platform (real-time)
    makeNode(`
        <div class="scene-card scene-window">
            <div class="sw-bar"><i></i><i></i><i></i><span>exam-platform</span></div>
            <div class="sw-body">
                <div class="sw-row"><span class="sw-k">Candidates</span><span class="sw-v">1,500+</span></div>
                <div class="sw-line"><b style="width:88%"></b></div>
                <div class="sw-row"><span class="sw-k">Uptime</span><span class="sw-v">99.5%</span></div>
                <div class="sw-line"><b style="width:99%"></b></div>
                <div class="sw-tag">● real-time</div>
            </div>
        </div>`, 205, -120, -20, { stat: 'Real-time · 1,500+ concurrent' });

    // App window — CQ HIMS (multi-tenant SaaS)
    makeNode(`
        <div class="scene-card scene-window">
            <div class="sw-bar"><i></i><i></i><i></i><span>cq-hims</span></div>
            <div class="sw-body">
                <div class="sw-grid"><span></span><span></span><span></span><span></span><span></span><span></span></div>
                <div class="sw-row"><span class="sw-k">Modules</span><span class="sw-v">20+</span></div>
                <div class="sw-line"><b style="width:72%"></b></div>
            </div>
        </div>`, -208, 118, 20, { stat: 'Multi-tenant SaaS · 20+ modules' });

    // Infrastructure chips (outer ring, clear of the windows + profile)
    const chips = [
        ['DB',  'PostgreSQL', 196, 186, 50, 'Primary datastore'],
        ['API', 'FastAPI',   -232, -70, 95, 'Async REST services'],
        ['AI',  'AI Agent',   268, 30, -90, 'RAG · LLM · voice'],
        ['PAY', 'RazorpayX', -104, -198, 30, 'Automated payouts'],
        ['☁',  'AWS',        96, -206, 90, 'Cloud deployments'],
    ];
    chips.forEach(([icon, label, x, y, z, stat]) => {
        makeNode(`<div class="scene-chip"><b>${icon}</b><span>${label}</span></div>`, x, y, z, { stat });
    });

    // ---- Connectors + travelling data-pulses (core → each node) ----
    function makeGlow() {
        const s = 64;
        const cv = document.createElement('canvas');
        cv.width = cv.height = s;
        const ctx = cv.getContext('2d');
        const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(0.3, 'rgba(120,232,255,0.9)');
        g.addColorStop(1, 'rgba(34,211,238,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, s, s);
        return new THREE.CanvasTexture(cv);
    }

    const lineGeo = new THREE.BufferGeometry();
    const linePos = new Float32Array(links.length * 2 * 3);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePos, 3));
    glWorld.add(new THREE.LineSegments(lineGeo, new THREE.LineBasicMaterial({
        color: 0x5b66c4, transparent: true, opacity: 0.22
    })));

    const pulseGeo = new THREE.BufferGeometry();
    const pulsePos = new Float32Array(links.length * 3);
    pulseGeo.setAttribute('position', new THREE.BufferAttribute(pulsePos, 3));
    glWorld.add(new THREE.Points(pulseGeo, new THREE.PointsMaterial({
        size: 10, map: makeGlow(), color: 0x22d3ee, transparent: true, opacity: 0.95,
        blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false
    })));

    function updateLinks(t) {
        const cp = profileObj.position;
        for (let i = 0; i < links.length; i++) {
            const np = links[i].obj.position;
            linePos[i * 6]     = cp.x; linePos[i * 6 + 1] = cp.y; linePos[i * 6 + 2] = cp.z;
            linePos[i * 6 + 3] = np.x; linePos[i * 6 + 4] = np.y; linePos[i * 6 + 5] = np.z;
            const p = (t * links[i].pSpeed + links[i].t0) % 1;
            pulsePos[i * 3]     = cp.x + (np.x - cp.x) * p;
            pulsePos[i * 3 + 1] = cp.y + (np.y - cp.y) * p;
            pulsePos[i * 3 + 2] = cp.z + (np.z - cp.z) * p;
        }
        lineGeo.attributes.position.needsUpdate = true;
        pulseGeo.attributes.position.needsUpdate = true;
    }

    function render() {
        renderer.render(glScene, camera);
        cssRenderer.render(cssScene, camera);
    }

    function resize() {
        width = mount.clientWidth;
        height = mount.clientHeight;
        if (!width || !height) return;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        cssRenderer.setSize(width, height);
        render();
    }
    window.addEventListener('resize', resize);

    // Reveal the scene (hide the fallback hero)
    document.body.classList.add('hero3d-ready');

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ---- Phase 2: drift + parallax ----
    const clock = new THREE.Clock();
    let tmx = 0, tmy = 0;          // raw pointer (-1..1)
    let mx = 0, my = 0;            // smoothed pointer
    let rotX = tilt.x, rotY = tilt.y;
    let scrollK = 0;
    let running = false, rafId = 0;

    const heroEl = document.getElementById('home') || mount;
    const heroH = () => heroEl.offsetHeight || window.innerHeight;

    if (window.matchMedia('(pointer:fine)').matches && !reduce) {
        window.addEventListener('mousemove', (e) => {
            tmx = (e.clientX / window.innerWidth - 0.5) * 2;
            tmy = (e.clientY / window.innerHeight - 0.5) * 2;
        }, { passive: true });
    }
    window.addEventListener('scroll', () => {
        scrollK = Math.min(Math.max(window.scrollY / heroH(), 0), 1);
    }, { passive: true });

    function frame() {
        if (!running) return;
        const t = clock.getElapsedTime();

        // gentle per-node drift
        for (const d of drifters) {
            d.obj.position.x = d.base.x + Math.sin(t * d.speed + d.phase) * d.ampX;
            d.obj.position.y = d.base.y + Math.cos(t * d.speed * 0.9 + d.phase) * d.ampY;
        }
        updateLinks(t);

        // smoothed pointer parallax (perspective makes nearer nodes shift more)
        mx += (tmx - mx) * 0.05;
        my += (tmy - my) * 0.05;
        rotY += ((tilt.y + mx * 0.14) - rotY) * 0.06;
        rotX += ((tilt.x + my * 0.10) - rotX) * 0.06;
        glWorld.rotation.set(rotX, rotY, 0);
        cssWorld.rotation.set(rotX, rotY, 0);

        // scroll: subtle lift + fade as the hero leaves
        const lift = scrollK * 70;
        glWorld.position.y = lift;
        cssWorld.position.y = lift;
        points.rotation.y = t * 0.02;
        mount.style.opacity = scrollK > 0.001 ? String(1 - scrollK * 0.7) : '';

        render();
        rafId = requestAnimationFrame(frame);
    }

    function start() {
        if (running || reduce) return;
        running = true;
        rafId = requestAnimationFrame(frame);
    }
    function stop() {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
    }

    // Pause the loop when the hero is off-screen or the tab is hidden (perf)
    const io = new IntersectionObserver((ents) => {
        if (ents[0].isIntersecting && !document.hidden) start(); else stop();
    }, { threshold: 0 });
    io.observe(heroEl);

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) stop();
        else {
            const r = heroEl.getBoundingClientRect();
            if (r.bottom > 0 && r.top < window.innerHeight) start();
        }
    });

    // Initial paint + settle re-renders (also the static frame for reduced-motion)
    updateLinks(0);
    render();
    setTimeout(render, 300);
    setTimeout(render, 1200);
    window.addEventListener('load', render);
    if (!reduce) start();
})();
