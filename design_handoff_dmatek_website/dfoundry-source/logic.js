const clamp = (v,a=0,b=1) => Math.max(a, Math.min(b, v));
const PROBLEMS = [
  { text:'A core process still runs on paper and three spreadsheets.', plan:[{ step:'01 DIAGNOSE', title:'Map the paperwork', body:'Who touches each sheet, and when.' },{ step:'02 BUILD', title:'One web app', body:'Roles, approvals and an audit trail.' },{ step:'03 SHIP', title:'Pilot with one team', body:'Rollout after two weeks of real use.' },{ step:'04 RUN', title:'Hosted and supported', body:'On D’Matek Cloud, backed up.' }] },
  { text:'Two systems we rely on refuse to talk to each other.', plan:[{ step:'01 DIAGNOSE', title:'Map the re-keying', body:'Who copies what between systems.' },{ step:'02 BUILD', title:'One integration', body:'Data moves once, validated.' },{ step:'03 SHIP', title:'Shadow mode', body:'Runs beside the manual process until it matches.' },{ step:'04 RUN', title:'Monitored', body:'Failures alert a person, not a log file.' }] },
  { text:'We have an idea that needs to become a real product.', plan:[{ step:'01 DIAGNOSE', title:'Find the core', body:'Who pays, for what, and how often.' },{ step:'02 BUILD', title:'The first version', body:'Web and mobile, payments, admin.' },{ step:'03 SHIP', title:'First customers', body:'Measure, fix, repeat.' },{ step:'04 GROW', title:'Into a product', body:'Project, then reusable solution, then product.' }] }
];
class Component extends DCLogic {
  state = { v: 'a', assembled:false, pct:0, done:false };
  componentDidMount(){
    window.__hero = this;
    this.revealEngine();
    this.loaderAndTransitions();
    this.extras();
    if (!window.__heroDog) window.__heroDog = setInterval(() => { const h = window.__hero; if (h) h.tick(); }, 150);
  }
  loaderAndTransitions(){
    const L = document.querySelector('[data-loader]'); if (!L) { window.__loaderDone = true; return; }
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pills = Array.from(L.querySelectorAll('[data-lp]')), cnt = L.querySelector('[data-lc]');
    const lift = () => {
      L.style.transition = 'transform 1s cubic-bezier(.76,0,.24,1), border-radius 1s cubic-bezier(.76,0,.24,1)';
      L.style.borderRadius = '0 0 50% 50% / 0 0 30% 30%'; L.style.transform = 'translateY(-110%)';
      setTimeout(() => { window.__loaderDone = true; }, 350);
      setTimeout(() => { L.style.visibility = 'hidden'; }, 1100);
    };
    if (window.__loaderDone || reduce) { window.__loaderDone = true; L.style.visibility = 'hidden'; }
    else {
      pills.forEach((p,i) => setTimeout(() => { p.style.transition = 'transform 1s cubic-bezier(.34,1.5,.64,1), opacity .3s'; p.style.opacity = '1'; p.style.transform = 'translateY(0) rotate(' + [-4,3,-2][i] + 'deg)'; }, 150 + i*170));
      const t0 = Date.now(); let seen = false; try { seen = !!localStorage.getItem('df-seen'); localStorage.setItem('df-seen', '1'); } catch(e){}
      const dur = seen ? 550 : 1500;
      const iv = setInterval(() => { const k = Math.min(1, (Date.now() - t0)/dur); if (cnt) cnt.textContent = String(Math.round((1 - Math.pow(1 - k, 3))*100)).padStart(3,'0'); if (k >= 1) { clearInterval(iv); const go = () => lift(); (document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1500))]) : Promise.resolve()).then(() => setTimeout(go, 150)); } }, 30);
    }
    if (window.__navHook) document.removeEventListener('click', window.__navHook, true);
    window.__navHook = e => {
      const a = e.target.closest && e.target.closest('a[href]'); if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey) return;
      const href = a.getAttribute('href'); if (!href || href.startsWith('#') || /^https?:/.test(href)) return;
      e.preventDefault();
      pills.forEach(p => { p.style.transition = 'none'; p.style.opacity = '1'; p.style.transform = 'none'; });
      if (cnt) cnt.textContent = '→';
      L.style.transition = 'none'; L.style.visibility = 'visible'; L.style.borderRadius = '0 0 0 0'; L.style.transform = 'translateY(110%)';
      void L.offsetHeight;
      L.style.transition = 'transform .8s cubic-bezier(.76,0,.24,1)'; L.style.transform = 'translateY(0)';
      setTimeout(() => { location.href = a.href; }, 820);
    };
    document.addEventListener('click', window.__navHook, true);
    const onShow = ev => { if (ev.persisted) { L.style.transition = 'none'; L.style.visibility = 'hidden'; } };
    window.addEventListener('pageshow', onShow);
  }
  extras(){
    if (window.__dfExtras) window.__dfExtras();
    const offs = []; window.__dfExtras = () => offs.forEach(f => f());
    const on = (t, e, f, o) => { t.addEventListener(e, f, o); offs.push(() => t.removeEventListener(e, f, o)); };
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches, fine = matchMedia('(pointer: fine)').matches;
    let last = {};
    window.__sfx = (kind, v = 1) => {
      const ac = this._ac; if (!ac || !this.state.sound) return;
      const n = ac.currentTime, gap = { pop:.05, tick:.06, swish:.2 }[kind] || .05;
      if (last[kind] && n - last[kind] < gap) return; last[kind] = n;
      const g = ac.createGain(); g.connect(this._out);
      if (kind === 'swish') {
        const src = ac.createBufferSource(), f = ac.createBiquadFilter(); src.buffer = this._noise; f.type = 'bandpass'; f.Q.value = 1.2;
        f.frequency.setValueAtTime(380, n); f.frequency.exponentialRampToValueAtTime(2600, n + .32);
        g.gain.setValueAtTime(0, n); g.gain.linearRampToValueAtTime(.16, n + .08); g.gain.exponentialRampToValueAtTime(.001, n + .42);
        src.connect(f); f.connect(g); src.start(n); src.stop(n + .45); return;
      }
      const o = ac.createOscillator();
      if (kind === 'pop') { o.type = 'sine'; o.frequency.setValueAtTime(150 + Math.random()*140, n); o.frequency.exponentialRampToValueAtTime(70, n + .14); g.gain.setValueAtTime(.22*v, n); g.gain.exponentialRampToValueAtTime(.001, n + .16); }
      else { o.type = 'triangle'; o.frequency.setValueAtTime(1500, n); g.gain.setValueAtTime(.035, n); g.gain.exponentialRampToValueAtTime(.001, n + .04); }
      o.connect(g); o.start(n); o.stop(n + .2);
    };
    on(document, 'pointerover', e => { const t = e.target.closest && e.target.closest('a,button,[data-blk],[data-rv="pill"]'); if (t && !t.contains(e.relatedTarget)) window.__sfx('tick'); });
    try { if (localStorage.getItem('df-sound') === '1') { const arm = () => { document.removeEventListener('pointerdown', arm); if (!this.state.sound) this.setSound(true); }; document.addEventListener('pointerdown', arm); offs.push(() => document.removeEventListener('pointerdown', arm)); } } catch(e){}
    const endY = () => { const c = document.querySelector('[data-v="c"]'); return c ? c.getBoundingClientRect().top + scrollY + c.offsetHeight - innerHeight + 2 : 0; };
    let skipOn = null, skipEl = null;
    const skipIv = setInterval(() => {
      const skip = document.querySelector('[data-skip]'); if (!skip) return;
      const v = scrollY < endY() - innerHeight*.5; if (v === skipOn && skip === skipEl) return; skipOn = v; skipEl = skip;
      skip.style.opacity = v ? '.6' : '0'; skip.style.transform = v ? 'none' : 'translateY(-12px)'; skip.style.pointerEvents = v ? 'auto' : 'none';
    }, 120); offs.push(() => clearInterval(skipIv));
    this._skip = () => {
      const L = document.querySelector('[data-loader]'), y = endY(), de = document.documentElement;
      const jump = () => { de.style.scrollBehavior = 'auto'; scrollTo(0, y); de.style.scrollBehavior = ''; };
      if (!L || reduce) return jump();
      window.__sfx('swish');
      L.style.transition = 'none'; L.style.visibility = 'visible'; L.style.borderRadius = '0'; L.style.transform = 'translateY(110%)'; void L.offsetHeight;
      L.style.transition = 'transform .6s cubic-bezier(.76,0,.24,1)'; L.style.transform = 'translateY(0)';
      setTimeout(() => { jump(); L.style.transition = 'transform .8s cubic-bezier(.76,0,.24,1), border-radius .8s cubic-bezier(.76,0,.24,1)'; L.style.borderRadius = '0 0 50% 50% / 0 0 30% 30%'; L.style.transform = 'translateY(-110%)'; setTimeout(() => { L.style.visibility = 'hidden'; }, 850); }, 650);
    };
    const barIv = setInterval(() => { const t = performance.now(); document.querySelectorAll('[data-bar]').forEach((b,i) => { b.style.height = this.state.sound ? (3 + Math.abs(Math.sin(t/(170 + i*70) + i))*9).toFixed(1) + 'px' : '3px'; }); }, 50); offs.push(() => clearInterval(barIv));
    if (!fine || reduce) return;
    document.documentElement.classList.add('df-cur'); offs.push(() => document.documentElement.classList.remove('df-cur'));
    const mk = css => { const d = document.createElement('div'); Object.assign(d.style, { position:'fixed', left:'0', top:'0', pointerEvents:'none', borderRadius:'999px' }, css); document.body.appendChild(d); offs.push(() => d.remove()); return d; };
    const ring = mk({ width:'40px', height:'40px', marginLeft:'-20px', marginTop:'-20px', border:'1.5px solid #F5F1E8', mixBlendMode:'difference', zIndex:'600', display:'grid', placeItems:'center', transition:'width .35s cubic-bezier(.34,1.5,.64,1), height .35s cubic-bezier(.34,1.5,.64,1), margin .35s cubic-bezier(.34,1.5,.64,1), background .25s, border-color .25s' });
    const lab = document.createElement('span'); Object.assign(lab.style, { fontFamily:"'IBM Plex Mono',monospace", fontSize:'11px', fontWeight:'600', letterSpacing:'.12em', color:'#06382E', opacity:'0', transition:'opacity .2s' }); ring.appendChild(lab);
    const dot = mk({ width:'6px', height:'6px', marginLeft:'-3px', marginTop:'-3px', background:'#F5F1E8', mixBlendMode:'difference', zIndex:'601' });
    let mx = -100, my = -100, rx = mx, ry = my, mode = '', down = false;
    const setMode = m => { if (m === mode) return; mode = m; const s = m === 'label' ? 84 : m === 'link' ? 64 : 40;
      Object.assign(ring.style, { width:s + 'px', height:s + 'px', marginLeft:-s/2 + 'px', marginTop:-s/2 + 'px', background: m === 'label' ? '#D4A637' : 'transparent', borderColor: m === 'label' ? '#D4A637' : '#F5F1E8', mixBlendMode: m === 'label' ? 'normal' : 'difference' });
      lab.style.opacity = m === 'label' ? '1' : '0'; dot.style.opacity = m === 'label' ? '0' : '1'; };
    on(window, 'pointermove', e => { mx = e.clientX; my = e.clientY; const t = e.target && e.target.closest ? e.target : null;
      const blk = t && t.closest('[data-blk]'), lk = t && t.closest('a,button,input,[data-rv="pill"]');
      if (blk) { lab.textContent = down ? 'WHEE' : 'THROW'; setMode('label'); } else if (lk) setMode('link'); else setMode(''); }, { passive:true });
    on(window, 'pointerdown', () => { down = true; if (mode === 'label') lab.textContent = 'WHEE'; });
    on(window, 'pointerup', () => { down = false; if (mode === 'label') lab.textContent = 'THROW'; });
    on(document, 'pointerleave', () => { mx = my = -100; });
    let alive = true; offs.push(() => { alive = false; });
    const loop = () => { if (!alive) return; rx += (mx - rx)*.2; ry += (my - ry)*.2; ring.style.transform = 'translate(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px)' + (down ? ' scale(.85)' : ''); dot.style.transform = 'translate(' + mx + 'px,' + my + 'px)'; requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
  setSound(on){
    if (on && !this._ac) { const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      const ac = new AC(), out = ac.createGain(); out.gain.value = .9; out.connect(ac.destination);
      const buf = ac.createBuffer(1, ac.sampleRate*.5, ac.sampleRate), d = buf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random()*2 - 1;
      this._ac = ac; this._out = out; this._noise = buf; }
    if (this._ac && this._ac.state === 'suspended') this._ac.resume();
    this.setState({ sound:on }); try { localStorage.setItem('df-sound', on ? '1' : '0'); } catch(e){}
    if (on) setTimeout(() => window.__sfx && window.__sfx('pop', .8), 30);
  }
  revealEngine(){
    if (window.__rvIv) clearInterval(window.__rvIv);
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const INIT = {
      rise: () => ({ opacity:'0', transform:'translateY(70px) skewY(5deg)' }),
      up: () => ({ opacity:'0', transform:'translateY(50px)' }),
      pill: (el,i) => ({ opacity:'0', transform:'translateX(' + (i % 2 ? 34 : -34) + 'vw) rotate(' + (i % 2 ? 7 : -7) + 'deg)' }),
      deal: (el,i) => ({ opacity:'0', transform:'translateY(160px) rotate(' + ((i - 1)*-14) + 'deg) scale(.88)' }),
      mask: () => ({ clipPath:'inset(100% 0 0 0 round 32px)' })
    };
    const DONE = { rise:{ opacity:'1', transform:'none' }, up:{ opacity:'1', transform:'none' }, pill:{ opacity:'1', transform:'none' }, deal:{ opacity:'1', transform:'none' }, mask:{ clipPath:'inset(0% 0 0 0 round 0px)' } };
    const TR = { rise:'opacity 1s ease, transform 1.2s cubic-bezier(.16,1,.3,1)', up:'opacity .8s ease, transform 1s cubic-bezier(.16,1,.3,1)', pill:'opacity .5s ease, transform 1.1s cubic-bezier(.34,1.45,.64,1)', deal:'opacity .5s ease, transform 1.2s cubic-bezier(.34,1.4,.64,1)', mask:'clip-path 1.4s cubic-bezier(.76,0,.24,1)' };
    window.__rvIv = setInterval(() => {
      const vh = innerHeight;
      document.querySelectorAll('[data-rv]').forEach(el => {
        const t = el.dataset.rv; if (el.dataset.rvS === '2') return;
        const i = Array.prototype.indexOf.call(el.parentElement.children, el);
        if (reduce) { el.dataset.rvS = '2'; return; }
        if (!el.dataset.rvS) { Object.assign(el.style, INIT[t](el, i)); el.dataset.rvS = '1'; return; }
        const r = el.getBoundingClientRect();
        if (r.top < vh*.9 && r.bottom > 0) { el.style.transition = TR[t]; el.style.transitionDelay = (Math.min(i, 8)*(t === 'pill' ? 70 : 120)) + 'ms'; Object.assign(el.style, DONE[t]); el.dataset.rvS = '2'; }
      });
      const w = document.querySelector('[data-wipe]'), wi = document.querySelector('[data-wipe-in]');
      if (w && wi) { const r = w.getBoundingClientRect(), k = clamp((vh*.9 - r.top)/(vh*.9)); const rad = (k*100).toFixed(1); wi.style.transform = 'scaleY(' + (1 - k*.92).toFixed(4) + ')'; wi.style.borderRadius = '0 0 50% 50% / 0 0 ' + rad + '% ' + rad + '%'; }
    }, 30);
  }
  get _offs(){ return window.__heroOffs || (window.__heroOffs = []); }
  set _offs(v){ window.__heroOffs = v; }
  tick(){
      const els = Array.from(document.querySelectorAll('[data-v]'));
      const act = window.__heroActive || [];
      const same = els.length === act.length && els.every((e,i) => e === act[i]);
      if (same || !els.length || els.some(e => e.clientWidth === 0 || e.clientHeight === 0) || !window.Matter || !window.__loaderDone) return;
      this.teardown(); window.__heroActive = els;
      els.forEach(el => { const v = el.dataset.v; try { v === 'a' ? this.setupA() : v === 'b' ? this.setupB() : this.setupC(); } catch(e) { console.error('setup ' + v + ': ' + e.message); } });
  }
  componentWillUnmount(){ if (window.__rvIv) { clearInterval(window.__rvIv); window.__rvIv = null; } if (window.__hero === this) { this.teardown(); window.__heroActive = null; } }
  teardown(){ (this._offs || []).forEach(f => { try { f(); } catch(e){} }); this._offs = []; this._assemble = null; this._reset = null; }
  on(t, ev, fn, o){ t.addEventListener(ev, fn, o); this._offs.push(() => t.removeEventListener(ev, fn, o)); }
  every(fn){ let alive = true, lr = 0; const run = () => { if (!alive) return; const n = performance.now(); if (n - lr > 12) { lr = n; fn(n); } }; const r = () => { if (!alive) return; run(); requestAnimationFrame(r); }; const iv = setInterval(run, 16); requestAnimationFrame(r); const stop = () => { alive = false; clearInterval(iv); }; this._offs.push(stop); return stop; }
  setup(){ const v = this.state.v; let n = 0; const go = () => { if (this.state.v !== v) return; const rt = document.querySelector('[data-v="' + v + '"]'); if (rt && rt.clientWidth > 0 && rt.clientHeight > 0 && (v !== 'a' || window.Matter)) { try { v === 'a' ? this.setupA() : v === 'b' ? this.setupB() : this.setupC(); } catch(e) { console.error('setup ' + v + ': ' + e.message); } } else { n++; const id = setTimeout(go, n < 40 ? 50 : 250); this._offs.push(() => clearTimeout(id)); } }; go(); }

  setupA(){
    let tries = 0;
    const wait = () => { if (window.Matter && document.querySelector('[data-v="a"]') && document.querySelector('[data-v="a"]').clientWidth > 0) { try { go(); } catch(e) { console.error('setupA: ' + e.message + ' ' + (e.stack||'').split('\n')[1]); } } else if (tries++ < 80) { const id = setTimeout(wait, 100); this._offs.push(() => clearTimeout(id)); } };
    const go = () => {
      const M = window.Matter, root = document.querySelector('[data-v="a"]');
      const W = root.clientWidth, H = root.clientHeight;
      const engine = M.Engine.create(); engine.gravity.y = 1.15;
      const wall = (x,y,w,h) => M.Bodies.rectangle(x,y,w,h,{ isStatic:true });
      M.Composite.add(engine.world, [wall(W/2, H+60, W*4, 120), wall(-60, H/2-1500, 120, H+3000), wall(W+60, H/2-1500, 120, H+3000)]);
      const els = Array.from(root.querySelectorAll('[data-blk]'));
      const bodies = els.map((el,i) => {
        const w = el.offsetWidth, h = el.offsetHeight;
        const b = M.Bodies.rectangle(W*(.18 + .64*Math.random()), -h - i*95, w, h, { chamfer:{ radius: Math.max(2, Math.min(h/2, w/2) - 2) }, restitution:.3, friction:.35, frictionAir:.012, angle:(Math.random()-.5)*.9 });
        b._w = w; b._h = h; b._k = el.dataset.blk; return b;
      });
      M.Composite.add(engine.world, bodies);
      M.Events.on(engine, 'collisionStart', ev => { if (!window.__sfx) return; let mx = 0; ev.pairs.forEach(p => { const v = Math.hypot(p.bodyA.velocity.x - p.bodyB.velocity.x, p.bodyA.velocity.y - p.bodyB.velocity.y); if (v > mx) mx = v; }); if (mx > 2.5) window.__sfx('pop', Math.min(1, mx/14)); });
      let touched = false, drag = null;
      root.style.touchAction = 'pan-y';
      els.forEach(el => { el.style.touchAction = 'none'; });
      const pt = e => { const r = root.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
      const down = e => {
        const el = e.target.closest && e.target.closest('[data-blk]'); if (!el) return;
        const b = bodies[els.indexOf(el)]; if (!b) return;
        e.preventDefault(); touched = true;
        if (targets && targets.has(b)) { targets.delete(b); M.Body.setStatic(b, false); if (this.state.assembled) this.setState({ assembled:false }); }
        const p = pt(e), c = M.Constraint.create({ pointA:{ x:p.x, y:p.y }, bodyB:b, pointB:{ x:p.x - b.position.x, y:p.y - b.position.y }, stiffness:.2, damping:.1, length:0 });
        M.Composite.add(engine.world, c); drag = { c, id:e.pointerId };
        try { el.setPointerCapture(e.pointerId); } catch(_) {}
      };
      const move = e => { if (!drag || e.pointerId !== drag.id) return; const p = pt(e); drag.c.pointA.x = p.x; drag.c.pointA.y = p.y; };
      const up = e => { if (!drag || (e.pointerId !== undefined && e.pointerId !== drag.id)) return; M.Composite.remove(engine.world, drag.c); drag = null; };
      this.on(root, 'pointerdown', down); this.on(window, 'pointermove', move); this.on(window, 'pointerup', up); this.on(window, 'pointercancel', up);
      let targets = null;
      const layout = () => {
        const maxW = W*.9, gap = Math.max(10, W*.012), rows = [];
        const flow = (list, g) => { const lines = [[]]; let lw = 0; list.forEach(b => { if (lw + b._w > maxW && lines[lines.length-1].length) { lines.push([]); lw = 0; } lines[lines.length-1].push(b); lw += b._w + g; }); return lines; };
        const words = bodies.filter(b => b._k === 'w'), tags = bodies.filter(b => b._k === 't');
        const wl = flow(words, gap), tl = flow(tags, 10);
        const hW = wl.reduce((s,l) => s + Math.max(...l.map(b => b._h)) + gap*.6, 0), hT = tl.reduce((s,l) => s + Math.max(...l.map(b => b._h)) + 10, 0);
        let y = Math.max(80, (H - hW - hT - 36)/2 - 10); const t = new Map();
        const place = (lines, g, vg) => lines.forEach(l => { const lh = Math.max(...l.map(b => b._h)), tw = l.reduce((s,b) => s + b._w, 0) + g*(l.length-1); let x = (W - tw)/2; l.forEach(b => { t.set(b, { x: x + b._w/2, y: y + lh/2 }); x += b._w + g; }); y += lh + vg; });
        place(wl, gap, gap*.6); y += 26; place(tl, 10, 10); return t;
      };
      this._assemble = on => {
        if (on) { if (drag) { M.Composite.remove(engine.world, drag.c); drag = null; } targets = layout(); bodies.forEach(b => M.Body.setStatic(b, true)); }
        else { targets = null; bodies.forEach(b => { M.Body.setStatic(b, false); M.Body.setVelocity(b, { x:(Math.random()-.5)*16, y:-4 - Math.random()*14 }); M.Body.setAngularVelocity(b, (Math.random()-.5)*.35); }); }
      };
      const auto = setTimeout(() => { if (!touched && !this.state.assembled) { this.setState({ assembled:true }); this._assemble(true); } }, 3400);
      let raf = 0, last = performance.now();
      const loop = now => {
        if (root.isConnected && root.clientWidth > 0 && (root.clientWidth !== W || Math.abs(root.clientHeight - H) > 140)) { stopA(); onResize(); return; }
        if (!root.isConnected) { stopA(); return; }
        if (!els[0].isConnected) { const f = Array.from(root.querySelectorAll('[data-blk]')); if (f.length === els.length) f.forEach((e,i) => els[i] = e); }
        const el = Math.min(400, now - last); last = now; const steps = Math.max(1, Math.round(el/16)); const lf = 1 - Math.pow(.87, steps);
        if (targets) bodies.forEach(b => { const tg = targets.get(b); if (!tg) return; M.Body.setPosition(b, { x: b.position.x + (tg.x - b.position.x)*lf, y: b.position.y + (tg.y - b.position.y)*lf }); M.Body.setAngle(b, b.angle*(1 - lf)); });
        for (let k = 0; k < steps; k++) M.Engine.update(engine, 16);
        for (let i = 0; i < els.length; i++) { const b = bodies[i]; els[i].style.transform = 'translate(' + (b.position.x - b._w/2).toFixed(1) + 'px,' + (b.position.y - b._h/2).toFixed(1) + 'px) rotate(' + b.angle.toFixed(4) + 'rad)'; }
      };
      const stopA = this.every(loop);
      let rz = 0;
      const onResize = () => { if (root.clientWidth === W && Math.abs(root.clientHeight - H) <= 140) return; clearTimeout(rz); rz = setTimeout(() => { this.teardown(); window.__heroActive = null; this.setState({ assembled:false }); }, 250); };
      this.on(window, 'resize', onResize);
      this._offs.push(() => {
        clearTimeout(auto); clearTimeout(rz);
        M.Engine.clear(engine); M.World.clear(engine.world, false);
      });
    };
    wait();
  }

  setupB(){
    const root = document.querySelector('[data-v="b"]'); if (!root) return;
    const cv = root.querySelector('[data-cv]'), ctx = cv.getContext('2d');
    let W, H, dpr, S, P, fix, baseY, xs;
    const size = () => {
      dpr = Math.min(2, devicePixelRatio || 1); W = root.clientWidth; H = root.clientHeight;
      cv.width = W*dpr; cv.height = H*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
      S = W < 700 ? 30 : 48; P = W < 700 ? 60 : 96;
      fix = new Float32Array(S*P); baseY = []; xs = [];
      const y0 = H*.14, y1 = H*.56;
      for (let i = 0; i < S; i++) baseY.push(y0 + (y1 - y0)*i/(S-1));
      for (let j = 0; j < P; j++) xs.push(-10 + (W + 20)*j/(P-1));
    };
    size();
    let t = 0, done = false, lastPct = -1, lastSet = 0;
    const amp = () => Math.min(H*.2, 170);
    const pos = (i, j, out) => {
      const f = fix[i*P + j], k = (1 - f)*(1 - f), env = .3 + .7*Math.pow(Math.sin(Math.PI*j/(P-1)), .5), A = amp()*env;
      out.x = xs[j] + k*22*Math.sin(j*.5 + i*3.1 + t*.9);
      out.y = baseY[i] + k*A*(.6*Math.sin(j*.19 + i*2.1 + t*.7) + .8*Math.sin(j*.071 - i*1.3 + t*.4) + .25*Math.sin(j*.43 + i*.7 - t*1.2));
      return out;
    };
    const tmp = { x:0, y:0 };
    const comb = (cx, cy, R, s) => {
      for (let i = 0; i < S; i++) for (let j = 0; j < P; j++) {
        pos(i, j, tmp); const d = Math.hypot(tmp.x - cx, tmp.y - cy);
        if (d < R) { const n = i*P + j; fix[n] += (1 - fix[n])*s*(1 - d/R); }
      }
    };
    let px = null, py = null;
    const onMove = e => {
      const r = root.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (px === null) { px = x; py = y; }
      const dist = Math.hypot(x - px, y - py), steps = Math.max(1, Math.ceil(dist/18));
      for (let s = 1; s <= steps; s++) comb(px + (x - px)*s/steps, py + (y - py)*s/steps, W < 700 ? 70 : 105, .45);
      px = x; py = y;
    };
    const onLeave = () => { px = null; };
    this.on(root, 'pointermove', onMove); this.on(root, 'pointerleave', onLeave);
    this._reset = () => { fix.fill(0); done = false; t = 0; this.setState({ done:false, pct:0 }); };
    let raf = 0, last = performance.now();
    const loop = now => {
      if (root.clientWidth === 0 || root.clientHeight === 0) { last = now; return; }
      if (root.clientWidth !== W || root.clientHeight !== H) { const f1 = done; size(); if (f1) fix.fill(1); }
      const dt = Math.min(.05, (now - last)/1000); last = now; t += dt;
      if (t < 2.6 && !done) { const k = t/2.6; comb(W*(.04 + .34*k), H*(.35 + .2*Math.sin(k*Math.PI*3)), 60, .5); }
      let sum = 0; for (let n = 0; n < fix.length; n++) sum += fix[n];
      const pct = Math.round(100*sum/fix.length);
      if (!done && pct >= 55) { done = true; this.setState({ done:true }); }
      if (done) for (let n = 0; n < fix.length; n++) fix[n] += (1 - fix[n])*.045;
      if (pct !== lastPct && now - lastSet > 120) { lastPct = pct; lastSet = now; this.setState({ pct }); }
      ctx.fillStyle = '#06382E'; ctx.fillRect(0, 0, W, H);
      ctx.lineCap = 'round';
      const a = { x:0, y:0 }, b = { x:0, y:0 };
      for (let i = 0; i < S; i++) {
        pos(i, 0, a);
        for (let j = 1; j < P; j++) {
          pos(i, j, b); const f = (fix[i*P + j - 1] + fix[i*P + j])/2;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          if (f > .92) { ctx.strokeStyle = '#D4A637'; ctx.lineWidth = 2; }
          else { ctx.strokeStyle = 'rgba(245,241,232,' + (.22 + .45*f).toFixed(3) + ')'; ctx.lineWidth = 1.2; }
          ctx.stroke(); a.x = b.x; a.y = b.y;
        }
      }
    };
    this.every(loop);
    this.on(window, 'resize', () => { size(); if (done) fix.fill(1); });
  }

  setupC(){
    const root = document.querySelector('[data-v="c"]'); if (!root) return;
    const q = s => root.querySelector(s), scenes = Array.from(root.querySelectorAll('[data-scene]'));
    const zh = q('[data-zh]'), oo = q('[data-o]'), lbT = q('[data-lb="top"]'), lbB = q('[data-lb="bot"]'), sl = q('[data-sl]'), tc = q('[data-tc]'), cue = q('[data-cue]'), rise = q('[data-rise]');
    const labels = ['SCENE 01 · THE PROBLEM','SCENE 02 · THE PROBLEM','SCENE 03 · THE PROBLEM','SCENE 04 · THE PROBLEM','SCENE 05 · THE FIX','SCENE 06 · D’FOUNDRY'];
    let raf = 0, cur = -1;
    const track = q('[data-track]'), ez = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
    const loop = () => {
      const r = root.getBoundingClientRect(), vh = innerHeight, p = clamp(-r.top/(r.height - vh));
      const idx = p < .4 ? Math.min(3, Math.floor(p/.1)) : p < .86 ? 4 : 5;
      if (idx !== cur) { if (cur !== -1 && window.__sfx) window.__sfx('swish'); cur = idx; track.style.visibility = idx < 4 ? 'visible' : 'hidden'; scenes.forEach((s,i) => { if (i > 3) s.style.visibility = i === idx ? 'visible' : 'hidden'; }); sl.textContent = labels[idx]; const lb = idx < 4 ? '9vh' : idx === 4 ? '5vh' : '0vh'; lbT.style.height = lb; lbB.style.height = lb; }
      if (idx < 4) {
        const s = Math.min(p/.1, 3), si = Math.floor(s), g = si < 3 ? ez(clamp((s - si - .6)/.4)) : 0;
        const pos = si + g, zo = 1 - .22*Math.sin(Math.PI*g);
        track.style.transformOrigin = (pos*100 + 50).toFixed(3) + 'vw 50%';
        track.style.transform = 'translate3d(' + (-pos*100).toFixed(3) + 'vw,0,0) scale(' + zo.toFixed(4) + ') skewX(' + (Math.sin(Math.PI*g)*-3).toFixed(2) + 'deg)';
        track.style.borderRadius = '0'; scenes.slice(0,4).forEach(sc => { sc.style.borderRadius = (Math.sin(Math.PI*g)*40).toFixed(1) + 'px'; });
      }
      if (idx < 4) for (let idx = 0; idx < 4; idx++) { const k = clamp((p - idx*.1)/.1), el = scenes[idx].querySelector('[data-push]'); if (el) el.style.transform = 'scale(' + (1.3 - .3*ez(k)).toFixed(4) + ')';
        const sc = scenes[idx];
        if (idx === 0) sc.querySelectorAll('[data-l]').forEach((l,i) => { const f = 1 - clamp(k*1.7); l.style.transform = 'translate(' + (Math.sin(i*1.3)*50*f).toFixed(1) + 'px,' + (Math.cos(i*1.9)*110*f).toFixed(1) + 'px) rotate(' + (Math.sin(i*2.3)*34*f).toFixed(1) + 'deg)'; });
        if (idx === 1) sc.querySelectorAll('[data-row]').forEach((r,i) => { const f = 1 - clamp(k*3 - i*.55); r.style.transform = 'translateX(' + ((i % 2 ? 1 : -1)*f*70).toFixed(2) + 'vw)'; });
        if (idx === 2) { const f = clamp(k*1.4); const l = sc.querySelector('[data-split="l"]'), rr = sc.querySelector('[data-split="r"]'); if (l) l.style.transform = 'translateX(' + (-f*9).toFixed(2) + 'vw)'; if (rr) rr.style.transform = 'translateX(' + (f*9).toFixed(2) + 'vw)'; }
        if (idx === 3) { const st = sc.querySelector('[data-strike]'); if (st) st.style.transform = 'rotate(-4deg) scaleX(' + clamp(k*2.2 - .25).toFixed(3) + ')'; }
      }
      cue.style.opacity = p < .03 ? '1' : '0';
      const secs = p*48, ss = Math.floor(secs), ff = Math.floor((secs - ss)*24);
      tc.textContent = '00:00:' + String(ss).padStart(2,'0') + ':' + String(ff).padStart(2,'0');
      const k = clamp((p - .56)/.3);
      if (k <= 0) {
        zh.style.transform = 'none';
        const hr = zh.getBoundingClientRect(), or = oo.getBoundingClientRect();
        zh.style.transformOrigin = (or.left - hr.left + or.width*.12).toFixed(1) + 'px ' + (or.top - hr.top + or.height*.6).toFixed(1) + 'px';
      } else zh.style.transform = 'scale(' + (1 + Math.pow(k, 3.2)*160).toFixed(3) + ')';
      const rk = clamp((p - .86)/.08);
      rise.style.opacity = rk.toFixed(3); rise.style.transform = 'translateY(' + ((1 - rk)*60).toFixed(1) + 'px)';
    };
    this.every(loop);
  }

  renderVals(){
    window.__hero = this;
    const sfxVals = { soundLabel: this.state.sound ? 'SOUND ON' : 'SOUND OFF', toggleSound: () => this.setSound(!this.state.sound), skipIntro: () => this._skip && this._skip() };
    const s = this.state;
    const T = [['a','2a Pieces'],['b','2b Untangle'],['c','2c Title sequence']];
    return {
      ...sfxVals,
      tabs: T.map(([k,label]) => ({ label, bg: s.v === k ? '#D4A637' : 'transparent', ink: s.v === k ? '#06382E' : '#F5F1E8', go: () => { if (s.v !== k) { try { localStorage.setItem('dfd-hero', k); } catch(e){} this.setState({ v:k, assembled:false, pct:0, done:false }); } } })),
      isA: s.v === 'a', isB: s.v === 'b', isC: s.v === 'c',
      assembleLabel: s.assembled ? 'Break it up' : 'Put it together',
      toggleAssemble: () => { const n = !this.state.assembled; this.setState({ assembled:n }); if (this._assemble) this._assemble(n); },
      pct: s.pct, aOp: s.done ? 0 : 1, bOp: s.done ? 1 : 0, aY: s.done ? '-30px' : '0px', bY: s.done ? '0px' : '30px',
      hint: s.done ? 'THAT’S THE JOB. WE DO IT IN SOFTWARE.' : 'DRAG ACROSS THE LINES TO COMB THEM STRAIGHT',
      retangle: () => { if (this._reset) this._reset(); },
      problems: PROBLEMS.map((x,i) => { const on = i === (s.p || 0); return { n:'0' + (i+1), text:x.text, bg: on ? '#D4A637' : 'transparent', ink: on ? '#06382E' : '#F5F1E8', line: on ? '#D4A637' : '#28705A', mark: on ? '●' : '○', pick: () => this.setState({ p:i }) }; }),
      plan: PROBLEMS[s.p || 0].plan,
      services: ['Custom software development','Web development and web applications','Business application development','System integration','Automation and integration work','Digital solution development','QADPAY: D’Matek-owned fintech venture'].map((name,i) => ({ name, n:String(i+1).padStart(2,'0') })),
      stages: [
        { num:'1', n:'YOUR PROBLEM', title:'Built around your problem', body:'Designed with the people who live with it every day.' },
        { num:'2', n:'PROVEN FOUNDATIONS', title:'Started on tested ground', body:'Your project begins on components we have already tested, so it moves faster and breaks less.' },
        { num:'3', n:'YOURS TO OWN', title:'Yours to own', body:'What we build for you is yours, and we maintain it for as long as you need.' }
      ],
      dropletFeats: [
        { n:'01', title:'Reorder in one tap', body:'Spots when a customer is running low from their order history, and offers their usual.' },
        { n:'02', title:'Subscriptions', body:'Scheduled deliveries that keep coming without a new order.' },
        { n:'03', title:'Recycling for points', body:'Customers book a pickup for their empties by material and earn points for it.' }
      ],
      cases: [
        { client:'Omatek', body:'Website revamp, with company email on D’Matek Cloud.' },
        { client:'Valour and Valiant', body:'New website, with business email on D’Matek Cloud.' }
      ],
      sisters: [{ verb:'RUN IT', name:'D’Matek Cloud', href:'DMatek%20Cloud%20Home%20v3.dc.html' }, { verb:'CONNECT IT', name:'D’Matek Infrastructure', href:'DMatek%20Infrastructure%20Hero.dc.html' }],
      notSent: !s.sent, sent: !!s.sent, send: () => this.setState({ sent:true })
    };
  }
}