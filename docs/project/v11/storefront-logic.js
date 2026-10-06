<script type="text/x-dc" data-dc-script data-props="{&quot;startView&quot;:{&quot;editor&quot;:&quot;enum&quot;,&quot;options&quot;:[&quot;Source&quot;,&quot;Emporium&quot;,&quot;Provision&quot;],&quot;default&quot;:&quot;Source&quot;,&quot;tsType&quot;:&quot;'Source' | 'Emporium' | 'Provision'&quot;},&quot;transition&quot;:{&quot;editor&quot;:&quot;boolean&quot;,&quot;default&quot;:true,&quot;tsType&quot;:&quot;boolean&quot;,&quot;section&quot;:&quot;Behaviour&quot;},&quot;adire&quot;:{&quot;editor&quot;:&quot;boolean&quot;,&quot;default&quot;:true,&quot;tsType&quot;:&quot;boolean&quot;,&quot;section&quot;:&quot;Pattern&quot;}}">
const cl = (v,a=0,b=1) => Math.max(a, Math.min(b, v));
const nItems = n => n + (n === 1 ? ' item' : ' items');
const fmt = n => '₦' + Math.round(n).toLocaleString('en-NG');
const PILOT = 'Available as a pilot. We’re rolling this out with a small number of early customers. If it fits what you need, talk to us about joining the pilot.';
const K = {
  home:{ name:'Home', short:'home', shop:'emporium', ph:'Drop a photo: living room', items:[['Mesh Wi-Fi, 3-pack','Covers a 3–4 bed home',265000,22,28],['55″ 4K smart TV','Wall-mounted',690000,56,40],['Soundbar with sub','Under the TV',210000,58,68],['3.5kVA inverter','Keeps it all on through outages',1150000,86,74]] },
  gate:{ name:'Front gate', short:'front gate', shop:'emporium', ph:'Drop a photo: front gate and driveway', items:[['4-camera CCTV kit','Night vision, phone viewing',480000,18,22],['Video doorbell','See who’s at the gate',120000,62,46],['Smart gate lock','Open from your phone',210000,70,58],['Floodlight camera','Lights up the driveway',150000,40,18]] },
  weekend:{ name:'Weekend', short:'weekend', shop:'emporium', chooser:true },
  away:{ name:'Weekend away', short:'weekend away', shop:'emporium', ph:'Drop a photo: road trip or beach bag', items:[['Action camera','4K, waterproof',380000,30,40],['20,000mAh power bank','Charges a phone 4 times',45000,56,62],['Noise-cancelling earbuds','For the drive',150000,70,34],['Portable speaker','Beach-proof',95000,44,76]] },
  weekendIn:{ name:'Weekend at home', short:'weekend in', shop:'emporium', ph:'Drop a photo: sofa, console and snacks', items:[['Game console','Two controllers',720000,50,62],['Wireless earbuds','Movies without waking anyone',150000,28,44],['Mesh Wi-Fi, 2-pack','No buffering upstairs',185000,78,24],['Streaming stick','Every app on the old TV',55000,62,38]] },
  hostel:{ name:'Student hostel', short:'hostel', shop:'emporium', ph:'Drop a photo: student room', items:[['Room router','Share with roommates',65000,76,20],['Study laptop','Light, all-day battery',520000,40,58],['Power bank','Through the outages',45000,58,70],['Earbuds','For lectures and calls',80000,24,40]] },
  office:{ name:'Office', short:'office', shop:'provision', ph:'Drop a photo: small office desks', items:[['Business laptop','16GB',1120000,40,56],['Laser printer','Duplex, network',310000,78,50],['Ceiling access point','One per 25 people',145000,52,10],['1.5kVA UPS','Saves work when power drops',180000,20,78]] },
  classroom:{ name:'Classroom', short:'classroom', shop:'provision', ph:'Drop a photo: classroom with a board', items:[['Short-throw projector','Bright enough for daytime',540000,50,16],['Student laptop','Ruggedised, per seat',520000,34,70],['Classroom Wi-Fi','Handles 40 devices',145000,84,14],['Speaker system','Clear to the back row',260000,14,30]] },
  clinic:{ name:'Clinic', short:'clinic', shop:'provision', ph:'Drop a photo: clinic reception', items:[['Reception PC','Records and billing',650000,40,52],['Receipt printer','For payments',110000,58,58],['Backup inverter','Keeps fridges and PCs on',1150000,86,70],['Wi-Fi access point','Staff and patient networks',145000,50,10]] },
  restaurant:{ name:'Restaurant', short:'restaurant', shop:'provision', ph:'Drop a photo: restaurant counter', items:[['POS terminal','Card, transfer, USSD',380000,34,56],['Menu screen','Update prices in seconds',420000,66,22],['Guest Wi-Fi','Separate from the till',145000,86,12],['Kitchen printer','Orders straight to the pass',140000,16,40]] },
  lobby:{ name:'Hotel lobby', short:'lobby', shop:'provision', ph:'Drop a photo: hotel lobby and front desk', items:[['55″ signage screen','Welcome and events',820000,70,30],['Guest Wi-Fi access point','Login page with your logo',145000,44,10],['Dome camera','Covers the desk and door',95000,16,14],['Check-in PC','Runs your hotel software',650000,40,60]] },
  hall:{ name:'Event hall', short:'event hall', shop:'provision', ph:'Drop a photo: event hall with stage', items:[['PA system','Up to 500 guests',1250000,20,50],['LED screen wall','Quoted to your stage',0,50,30],['Wireless mics, 4-pack','Two handheld, two lapel',320000,60,62],['Projector','For side screens',540000,84,20]] },
  building:{ name:'Whole building', short:'building', shop:'provision', ph:'Drop a photo: office building exterior', items:[['Server rack, fitted','Wired and labelled',1900000,20,60],['Core network switch','48 ports, managed',680000,24,40],['Solar and battery','Sized to your load',3400000,70,12],['Building CCTV + NVR','16 cameras',520000,84,64]] }
};
const HERO = [['home.','home','Photo: mesh Wi-Fi in a living room','Photo: smart TV'],['front gate.','gate','Photo: CCTV at a gate','Photo: video doorbell'],['weekend.','weekend','Photo: action camera','Photo: earbuds'],['office.','office','Photo: laptops on desks','Photo: printer'],['classroom.','classroom','Photo: projector','Photo: student laptops'],['clinic.','clinic','Photo: reception PC','Photo: backup power'],['restaurant.','restaurant','Photo: POS terminal','Photo: menu screen'],['hotel lobby.','lobby','Photo: signage screen','Photo: guest Wi-Fi'],['event hall.','hall','Photo: PA system','Photo: wireless mics'],['student hostel.','hostel','Photo: room router','Photo: study laptop'],['whole building.','building','Photo: server rack','Photo: solar + battery']];
const TINTS = [['#EFEADC','#DCE5D6'],['#E8E2D0','#EDE6CF'],['#E4DECC','#E3EAD9']];
const TOUR = ['home','gate','weekend','office','classroom','clinic','restaurant','lobby','hall','hostel','building'];
const ETABS = [['Laptops','Laptops'],['Phones','Phones'],['Networking','Wi-Fi'],['TV & Audio','TV & Audio'],['Power','Power'],['Security','Security']];
const EMP = {
  Laptops:[['APPLE','MacBook Air 13″','M-series · 16GB · 256GB',1650000],['LENOVO','IdeaPad Slim 5','Ryzen 5 · 16GB · 512GB',720000],['DELL','XPS 14','Core Ultra 7 · OLED',1480000],['HP','OMEN 16','RTX 4060 · 165Hz',1390000],['ASUS','Vivobook 15','Core i5 · 8GB · 512GB',560000],['APPLE','MacBook Pro 14″','M-series Pro · 18GB',2950000]],
  Phones:[['SAMSUNG','Galaxy S-series','256GB',1350000],['APPLE','iPhone','128GB',1420000],['SAMSUNG','Galaxy A-series','128GB',385000],['SAMSUNG','Galaxy Tab S9','Wi-Fi · 128GB',640000],['TECNO','Camon series','256GB · dual SIM',290000],['INFINIX','Note series','256GB · fast charge',245000]],
  Networking:[['TP-LINK','Deco X55 Mesh (3-pack)','Wi-Fi 6 · 3–4 bed home',265000],['TP-LINK','Archer AX55','Wi-Fi 6 router',95000],['TP-LINK','Deco X20 (2-pack)','Wi-Fi 6 · apartment',148000],['TP-LINK','Omada EAP610','Ceiling access point',120000],['TP-LINK','Deco BE65 (2-pack)','Wi-Fi 7 · large home',420000],['TP-LINK','RE705X extender','Wi-Fi 6 · one room',68000]],
  'TV & Audio':[['SAMSUNG','65″ Neo QLED 4K','Mini LED · 120Hz',1250000],['SAMSUNG','55″ Crystal UHD','4K · Smart TV',520000],['SAMSUNG','Q-series Soundbar','5.1.2 · Atmos',480000],['SAMSUNG','The Freestyle','Portable projector',690000],['LG','65″ OLED evo','4K · 120Hz',2150000],['JBL','Bar 500','5.1 soundbar',520000]],
  Power:[['HOME POWER','3.5kVA inverter + battery','Home backup',1150000],['HOME POWER','1.5kVA UPS','Desk and router backup',180000],['HOME POWER','Solar panel set','Sized to your load',950000],['HOME POWER','20,000mAh power bank','Phone and laptop',45000],['HOME POWER','5kVA inverter + lithium battery','Whole-home backup',2450000],['HOME POWER','Portable power station','1kWh · outages and trips',690000]],
  Security:[['HIKVISION','4-camera ColorVu kit','Night colour · phone viewing',480000],['SECURITY','Video doorbell','See who’s at the gate',120000],['SECURITY','Smart gate lock','Open from your phone',210000],['SECURITY','Floodlight camera','Driveway coverage',150000],['HIKVISION','8-camera NVR kit','Night colour · 2TB',890000],['SECURITY','Indoor Wi-Fi camera','Two-way talk',45000]]
};
const PTABS = ['Networking','Computing','Security','Displays'];
const PROV = {
  Networking:[['TP-LINK','Omada 28-port PoE+ switch','TL-SG3428MP',572000],['TP-LINK','Omada Wi-Fi 6 ceiling AP','EAP670',196000],['TP-LINK','Omada gateway','ER7206',210000],['TP-LINK','Omada controller','OC300',145000],['TP-LINK','Omada outdoor AP','EAP610-Outdoor',165000],['TP-LINK','Omada 8-port PoE switch','SG2210MP',145000]],
  Computing:[['DELL','Latitude 5550','Core Ultra 5 · 16GB',1090000],['LENOVO','ThinkCentre M70q','Tiny desktop',640000],['APPLE','MacBook Air for teams','MDM enrolled',1520000],['HP','EliteBook 840','Core Ultra 7',1260000],['DELL','OptiPlex Micro','Core i5 · 16GB',720000],['LENOVO','ThinkPad E14','Core i5 · 16GB',980000]],
  Security:[['HIKVISION','16-channel NVR','DS-7616NI',352000],['HIKVISION','ColorVu turret camera','4MP',78000],['HIKVISION','Access control terminal','Face + card',295000],['HIKVISION','PTZ camera','25× zoom',640000],['HIKVISION','Dome camera','4MP · indoor',65000],['HIKVISION','Video intercom kit','Door station + monitor',310000]],
  Displays:[['SAMSUNG','55″ QBC signage','16/7',835000],['SAMSUNG','Flip interactive board','65″',2400000],['SAMSUNG','Smart Monitor M8','32″',520000],['SAMSUNG','Video wall panel','55″ · 1.7mm bezel',1950000],['SAMSUNG','43″ QBC signage','16/7',540000],['LG','Meeting room display','75″ 4K',1850000]]
};
const MAP = { Source:'source', Emporium:'emporium', Provision:'provision' };
const LABEL = { emporium:Object.fromEntries(ETABS), provision:{ Networking:'Networking', Computing:'Computing', Security:'Security', Displays:'Displays' } };
const KITFOR = { emporium:{ Laptops:'hostel', Phones:'away', Networking:'home', 'TV & Audio':'home', Power:'home', Security:'gate' }, provision:{ Networking:'office', Computing:'office', Security:'building', Displays:'lobby' } };
const CDESC = { emporium:{ Laptops:'Laptops for work, study and home. Genuine and warranty-backed, with free set-up and data transfer.', Phones:'Phones and tablets, with free set-up and data transfer from your old phone.', Networking:'Mesh Wi-Fi, routers and extenders so every room gets signal.', 'TV & Audio':'TVs, soundbars and projectors. Wall mounting is free on TVs.', Power:'Inverters, batteries, UPS and power banks that keep things on through outages.', Security:'Cameras, doorbells and smart locks for your gate and your home.' },
  provision:{ Networking:'Access points, switches and gateways for the whole building, specified to the site.', Computing:'Laptops and desktops for teams, with volume pricing on larger orders.', Security:'NVRs, cameras, intercoms and access control for sites and estates.', Displays:'Signage, interactive boards and meeting-room displays.' } };
const PRODUCTS = [];
[['emporium', EMP, 'H'], ['provision', PROV, 'B']].forEach(([store, SRC, L]) => Object.keys(SRC).forEach(cat => SRC[cat].forEach((d, i) => {
  const [brand, name, spec, price] = d, emp = store === 'emporium';
  PRODUCTS.push({ id:(emp ? 'e' : 'p') + '-' + cat.replace(/\W/g,'').toLowerCase() + '-' + i, key:(emp ? 'e-' : 'p-') + cat + '-' + i, store, cat, brand, name, spec, price, i,
    free: emp && (cat === 'Laptops' || cat === 'Phones' || (cat === 'TV & Audio' && i < 2)),
    img: emp ? 'v5-deal-H-' + cat.replace(/\W/g,'') + '-' + i : 'v5-deal-B-' + cat + '-' + i });
})));
const BUCKETS = [['Under ₦250k',0,250000],['₦250k – ₦750k',250000,750000],['₦750k – ₦1.5m',750000,1500000],['Over ₦1.5m',1500000,1e12]];

class Component extends DCLogic {
  state = { cartTab:'cart', orders:[], quotesSent:[], savedKits:[], signedIn:false, acctTab:'orders', helpTopic:'delivery', legalTopic:'terms', trackRef:'', trackQ:null, bizApplied:false, surveyRef:'', catsStore:null, reviews:{}, rv:5, rvTitle:'', rvText:'', rvName:'', fStore:null, fCat:null, cat:null, pid:null, q:'', qInput:'', fBrand:{}, fPrice:null, fFree:false, sort:'featured', gi:0, pq:1, view:null, i:0, open:null, sel:{}, focus:null, cart:[], quote:[], basket:null, flow:null, step:0, pay:'card', qty:{}, eTab:'Laptops', pTab:'Networking', search:false, toast:'', toastTo:null, narrow:false, ref:'', note:'' };
  seamRef = React.createRef();
  view(){ return this.state.view ?? (MAP[this.props.startView] || 'source'); }
  componentDidMount(){
    const h = (location.hash || '').toLowerCase();
    if (h.startsWith('#/emporium')) this.setState({ view:'emporium' }); else if (h.startsWith('#/provision')) this.setState({ view:'provision' }); else if (h.length > 2) this.setState({ view:'notfound' });
    this._r = () => this.setState({ narrow: innerWidth < 1060 }); this._r(); addEventListener('resize', this._r);
    this.iv = setInterval(() => { if (!this.state.open && this.view() === 'source') this.setState(s => ({ i:(s.i + 1) % HERO.length })); }, 2300);
    this.mv = e => { if (this.view() !== 'source' || this.state.narrow) return; const hh = document.querySelector('[data-hero]'); if (!hh) return; const r = hh.getBoundingClientRect(); if (e.clientY > r.bottom || e.clientY < r.top) return; const x = (e.clientX - r.left)/r.width - .5, y = (e.clientY - r.top)/r.height - .5;
      const a = document.querySelector('[data-card="1"]'), b = document.querySelector('[data-card="2"]');
      if (a) a.style.transform = 'translate(' + (x*-34).toFixed(1) + 'px,' + (y*-26).toFixed(1) + 'px) rotate(' + (5 + x*7).toFixed(2) + 'deg)';
      if (b) b.style.transform = 'translate(' + (x*24).toFixed(1) + 'px,' + (y*20).toFixed(1) + 'px) rotate(' + (-6 - x*6).toFixed(2) + 'deg)'; };
    addEventListener('pointermove', this.mv, { passive:true });
    this.rpD = e => { const ln = e.target.closest && e.target.closest('[data-line]'); if (!ln || e.pointerType === 'touch') return; this._rp = { ln, x:e.clientX, s:ln.scrollLeft, m:false }; };
    this.rpM = e => { const d = this._rp; if (!d) return; const dx = e.clientX - d.x; if (Math.abs(dx) > 6) d.m = true; d.ln.scrollLeft = d.s - dx; };
    this.rpU = () => { const d = this._rp; this._rp = null; if (d && d.m) { this._noClick = true; setTimeout(() => { this._noClick = false; }, 60); } };
    addEventListener('pointerdown', this.rpD); addEventListener('pointermove', this.rpM, { passive:true }); addEventListener('pointerup', this.rpU);
    this.esc = e => { if (e.key !== 'Escape') return; if (this._ent) this.finish(); else if (this.state.flow) this.closeFlow(); else if (this.state.basket) this.setState({ basket:null }); else this.close(); };
    addEventListener('keydown', this.esc);
  }
  componentWillUnmount(){ clearInterval(this.iv); clearTimeout(this._t); removeEventListener('resize', this._r); removeEventListener('keydown', this.esc); removeEventListener('pointermove', this.mv); removeEventListener('pointerdown', this.rpD); removeEventListener('pointermove', this.rpM); removeEventListener('pointerup', this.rpU); document.documentElement.style.overflow = ''; this.finish(); }
  lock(on){ document.documentElement.style.overflow = on ? 'hidden' : ''; }
  say(m, to){ this.setState({ toast:m, toastTo:to }); clearTimeout(this._t); this._t = setTimeout(() => this.setState({ toast:'' }), 2600); }
  openKit(k){ const P = K[k]; const sel = {}; (P.items || []).forEach((_,i) => sel[i] = true); this.setState({ open:k, sel, focus:null }); this.lock(true); }
  close(){ this.setState({ open:null }); this.lock(false); }
  scrollId(id){ setTimeout(() => { const d = document.getElementById(id); if (d) scrollTo({ top:d.getBoundingClientRect().top + scrollY - 76, behavior:'smooth' }); }, 60); }
  add(list, key, name, price, n){
    this.setState(s => { const arr = s[list].map(x => ({ ...x })); const f = arr.find(x => x.key === key); if (f) f.qty += n; else arr.push({ key, name, price, qty:n }); return { [list]:arr }; });
  }
  bump(list, key, d){ this.setState(s => ({ [list]: s[list].map(x => x.key === key ? { ...x, qty:x.qty + d } : x).filter(x => x.qty > 0) })); }
  startFlow(flow, note){ this.setState({ flow, step:0, note: note || '', basket:null, open:null, ref:'' }); this.lock(true); }
  closeFlow(){ this.setState({ flow:null, step:0 }); this.lock(false); }
  done(){ this.setState(s => ({ step: s.step + 1, ref:'DS-' + Math.random().toString(36).slice(2,8).toUpperCase() })); }
  go(target, srcEl){
    const cur = this.view(); if (target === cur) { scrollTo({ top:0, behavior:'smooth' }); return; } if (this._ent) return;
    const apply = () => { this.setState({ view:target, open:null, basket:null, search:false }); this.lock(false); try { history.replaceState(null, '', target === 'source' ? location.pathname + location.search : '#/' + target); } catch(e){} scrollTo(0,0); };
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || this.props.transition === false || !document.body.animate) { apply(); return; }
    const key = 'ds7-seen-' + target; let seen = false; try { seen = sessionStorage.getItem(key) === '1'; sessionStorage.setItem(key, '1'); } catch(e){}
    const full = !seen;
    const kind = target === 'emporium' ? 'e' : target === 'provision' ? 'p' : 'h';
    const W = {
      e:{ bg:'#0A0A0A', ink:'#F2F2F2', acc:'#A6F000', font:"'Manrope',sans-serif", name:'EMPORIUM', kick:'D’EMPORIUM · FOR HOME', line:'DOORS OPEN · DELIVERED NATIONWIDE' },
      p:{ bg:'#06382E', ink:'#F5F1E8', acc:'#D4A637', font:"'Manrope',sans-serif", name:'Provision', kick:'D’PROVISION · FOR BUSINESS', line:'Welcome in. Let’s equip the building.' },
      h:{ bg:'#F5F1E8', ink:'#06382E', acc:'#06382E', font:"'Manrope',sans-serif", name:'D’Source', kick:'COMMERCE BY D’MATEK', line:'Back to the front.' }
    }[kind];
    const T = full ? { grow:750, hold:1250, out:900, stag:45 } : { grow:420, hold:380, out:560, stag:0 };
    const vw = innerWidth, vh = innerHeight;
    const src = srcEl && srcEl.getBoundingClientRect ? srcEl.getBoundingClientRect() : { left:vw/2 - 40, top:vh/2 - 40, width:80, height:80 };
    const mk = css => { const d = document.createElement('div'); Object.assign(d.style, css); return d; };
    const root = mk({ position:'fixed', inset:'0', zIndex:'9999', cursor:'pointer' });
    const leaf = { position:'absolute', top:'0', bottom:'0', width:'50.5%', background:W.bg, overflow:'hidden' };
    const L = mk({ ...leaf, left:'0' }), Rr = mk({ ...leaf, right:'0' });
    const seam = mk({ position:'absolute', top:'0', bottom:'0', left:'50%', width:'2px', marginLeft:'-1px', background:W.acc, transform:'scaleY(0)' });
    const plate = mk({ position:'absolute', left:src.left + 'px', top:src.top + 'px', width:src.width + 'px', height:src.height + 'px', background:W.bg, borderRadius: kind === 'p' ? '40px' : '0px' });
    const txt = mk({ position:'absolute', inset:'0', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'18px', color:W.ink, textAlign:'center', padding:'24px', opacity:'0' });
    const k = mk({ fontFamily:"'IBM Plex Mono',monospace", fontSize:'12px', letterSpacing:'.22em', color:W.acc }); k.textContent = W.kick;
    const nm = mk({ fontFamily:W.font, fontWeight:'800', fontSize:'clamp(56px,13vw,210px)', lineHeight:'.88', letterSpacing: kind === 'e' ? '-.04em' : '-.045em' });
    const letters = [...W.name].map(ch => { const s = document.createElement('span'); s.textContent = ch === ' ' ? '\u00A0' : ch; s.style.display = 'inline-block'; nm.appendChild(s); return s; });
    const ln = mk({ fontFamily: kind === 'e' ? "'IBM Plex Mono',monospace" : "'Manrope',sans-serif", fontSize: kind === 'e' ? '12px' : '17px', fontWeight:'600', letterSpacing: kind === 'e' ? '.2em' : '0', opacity:'.8' }); ln.textContent = W.line;
    const bar = mk({ width:'min(320px,60vw)', height:'2px', background:'rgba(128,128,128,.25)', position:'relative', overflow:'hidden', borderRadius:'2px' });
    const fill = mk({ position:'absolute', inset:'0', background:W.acc, transform:'scaleX(0)', transformOrigin:'left' }); bar.appendChild(fill);
    const skip = mk({ position:'absolute', left:'50%', bottom:'22px', transform:'translateX(-50%)', fontFamily:"'IBM Plex Mono',monospace", fontSize:'11px', letterSpacing:'.16em', color:W.ink, opacity:'.5' }); skip.textContent = 'TAP TO SKIP';
    txt.append(k, nm, ln, bar);
    root.append(plate); document.body.appendChild(root);
    const ent = this._ent = { root, apply, applied:false, timers:[] };
    root.addEventListener('click', () => this.finish());
    const ease = 'cubic-bezier(.76,0,.24,1)';
    const grow = plate.animate([{ left:src.left + 'px', top:src.top + 'px', width:src.width + 'px', height:src.height + 'px', borderRadius: kind === 'p' ? '40px' : '0px' }, { left:'0px', top:'0px', width:vw + 'px', height:vh + 'px', borderRadius:'0px' }], { duration:T.grow, easing:ease, fill:'forwards' });
    grow.onfinish = () => {
      if (this._ent !== ent) return;
      root.append(L, Rr, seam, txt, skip); plate.remove();
      txt.animate([{ opacity:0 }, { opacity:1 }], { duration:220, fill:'forwards' });
      letters.forEach((s, i) => s.animate([{ transform:'translateY(40%) rotate(4deg)', opacity:0 }, { transform:'none', opacity:1 }], { duration: full ? 600 : 300, delay:40 + i*T.stag, easing:'cubic-bezier(.2,.7,.2,1)', fill:'both' }));
      fill.animate([{ transform:'scaleX(0)' }, { transform:'scaleX(1)' }], { duration: full ? 900 : 360, delay: full ? 200 : 0, easing:'cubic-bezier(.6,0,.2,1)', fill:'forwards' });
      ent.timers.push(setTimeout(() => {
        if (this._ent !== ent) return;
        ent.applied = true; apply();
        txt.animate([{ opacity:1, transform:'scale(1)' }, { opacity:0, transform:'scale(1.08)' }], { duration:340, easing:'ease-in', fill:'forwards' });
        skip.remove();
        let out;
        if (kind === 'e') {
          seam.animate([{ transform:'scaleY(0)' }, { transform:'scaleY(1)' }], { duration:240, delay:100, easing:'ease-out', fill:'forwards' });
          L.animate([{ transform:'translateX(0)' }, { transform:'translateX(-101%)' }], { duration:T.out, delay:340, easing:ease, fill:'forwards' });
          out = Rr.animate([{ transform:'translateX(0)' }, { transform:'translateX(101%)' }], { duration:T.out, delay:340, easing:ease, fill:'forwards' });
          seam.animate([{ opacity:1 }, { opacity:0 }], { duration:200, delay:340, fill:'forwards' });
        } else if (kind === 'p') {
          [L, Rr].forEach(x => { x.style.width = '100%'; x.style.left = '0'; x.style.right = 'auto'; }); Rr.style.display = 'none';
          out = L.animate([{ clipPath:'circle(150% at 50% 50%)' }, { clipPath:'circle(0% at 50% 50%)' }], { duration:T.out + 100, delay:300, easing:ease, fill:'forwards' });
        } else {
          Rr.style.display = 'none'; L.style.width = '100%';
          out = L.animate([{ opacity:1 }, { opacity:0 }], { duration:T.out - 300, delay:260, easing:'ease', fill:'forwards' });
        }
        out.onfinish = () => { if (this._ent === ent) this._ent = null; root.remove(); };
      }, T.hold));
    };
  }
  finish(){ const e = this._ent; if (!e) return; this._ent = null; e.timers.forEach(clearTimeout); if (!e.applied) { e.applied = true; e.apply(); } e.root.remove(); }
  openCat(store, key){ this.close(); this.setState({ view:'category', cat:{ store, key }, fBrand:{}, fPrice:null, fFree:false, sort:'featured', basket:null, search:false }); scrollTo(0,0); }
  openP(id, ev){
    this._flip = null;
    try { const art = ev && ev.currentTarget && ev.currentTarget.closest && ev.currentTarget.closest('article'); const im = art && art.querySelector('[data-pimg]');
      if (im && !matchMedia('(prefers-reduced-motion: reduce)').matches) { const sl = im.querySelector('image-slot'); let src = ''; try { const i2 = (sl && sl.shadowRoot && sl.shadowRoot.querySelector('img')) || (sl && sl.querySelector('img')); src = i2 ? i2.currentSrc || i2.src : ''; } catch(e){} this._flip = { r:im.getBoundingClientRect(), rad:getComputedStyle(im).borderRadius, src }; } } catch(e){}
    this.close(); this.setState({ view:'product', pid:id, gi:0, pq:1, basket:null, search:false }); scrollTo(0,0); }
  page(p, extra){ this.close(); this.setState({ view:p, basket:null, search:false, flow:null, ...(extra || {}) }); this.lock(false); scrollTo(0,0); }
  openCats(st2){ this.close(); this.setState({ view:'categories', catsStore:st2 || null, basket:null, search:false }); scrollTo(0,0); }
  openAll(st2){ this.close(); this.setState({ view:'search', q:'', qInput:'', fBrand:{}, fPrice:null, fFree:false, fStore:st2 || null, fCat:null, sort:'featured', search:false, basket:null }); scrollTo(0,0); }
  doSearch(q){ const qq = (q ?? this.state.qInput).trim(); if (!qq) return; this.close(); this.setState({ view:'search', q:qq, qInput:qq, fBrand:{}, fPrice:null, fFree:false, fStore:null, fCat:null, sort:'featured', search:false, basket:null }); scrollTo(0,0); }
  componentDidUpdate(pp, ps){
    if (this.state.open && this.state.open !== ps.open) this.kitIn();
    if (this._flip && this.state.view === 'product') this.flipIn();
    else if (this.state.view === 'product' && ps.view !== 'product' || (this.state.view === 'product' && ps.pid !== this.state.pid && !this._flip)) { const m = document.querySelector('[data-screen-label="Product"]'); if (m && m.animate) m.animate([{ opacity:0, transform:'translateY(14px)' }, { opacity:1, transform:'none' }], { duration:400, easing:'cubic-bezier(.2,.8,.2,1)' }); }
  }
  kitIn(){
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    requestAnimationFrame(() => {
      const room = document.querySelector('[data-kitroom]'); if (!room || !room.animate) return;
      room.animate([{ transform:'scale(1.22)', filter:'blur(3px) saturate(.8)' }, { transform:'scale(1)', filter:'none' }], { duration:1100, easing:'cubic-bezier(.2,.8,.2,1)' });
      const pins = Array.from(document.querySelectorAll('[data-kitpin]'));
      pins.forEach((p, i) => p.animate([{ transform:'translateY(-70px) scale(.3)', opacity:0 }, { transform:'translateY(6px) scale(1.12)', opacity:1, offset:.65 }, { transform:'none', opacity:1 }], { duration:640, delay:420 + i*150, easing:'cubic-bezier(.34,1.4,.64,1)', fill:'backwards' }));
      Array.from(document.querySelectorAll('[data-kitrow]')).forEach((r, i) => r.animate([{ transform:'translateX(28px)', opacity:0 }, { transform:'none', opacity:1 }], { duration:520, delay:260 + i*90, easing:'cubic-bezier(.2,.8,.2,1)', fill:'backwards' }));
      const el = document.querySelector('[data-kittotal]'); if (!el) return;
      const target = parseInt((el.textContent || '').replace(/\D/g, ''), 10) || 0; const final = el.textContent;
      el.textContent = fmt(0);
      const start = performance.now() + 420 + pins.length*150, dur = 900;
      const tick = now => { if (!document.body.contains(el)) return; const k = Math.max(0, Math.min(1, (now - start)/dur)), e2 = 1 - Math.pow(1 - k, 3);
        el.textContent = k >= 1 ? final : fmt(target*e2); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
  }
  flipIn(){
    const f = this._flip; this._flip = null;
    requestAnimationFrame(() => {
      const dst = document.querySelector('[data-pdpimg]'); if (!dst || !document.body.animate) return;
      const r2 = dst.getBoundingClientRect(), rad2 = getComputedStyle(dst).borderRadius;
      const ov = document.createElement('div');
      Object.assign(ov.style, { position:'fixed', left:f.r.left + 'px', top:f.r.top + 'px', width:f.r.width + 'px', height:f.r.height + 'px', borderRadius:f.rad, background: f.src ? '#F6F4EF url("' + f.src + '") center/cover no-repeat' : '#F6F4EF', zIndex:'500', boxShadow:'0 30px 70px rgba(6,56,46,.22)', pointerEvents:'none' });
      document.body.appendChild(ov); dst.style.opacity = '0';
      const rest = Array.from(document.querySelectorAll('[data-screen-label="Product"] > section'));
      rest.forEach((s2, i) => s2.animate([{ opacity:0, transform:'translateY(24px)' }, { opacity:1, transform:'none' }], { duration:520, delay:220 + i*80, easing:'cubic-bezier(.2,.8,.2,1)', fill:'backwards' }));
      const a = ov.animate([{ left:f.r.left + 'px', top:f.r.top + 'px', width:f.r.width + 'px', height:f.r.height + 'px', borderRadius:f.rad }, { left:r2.left + 'px', top:r2.top + 'px', width:r2.width + 'px', height:r2.height + 'px', borderRadius:rad2 }], { duration:680, easing:'cubic-bezier(.2,.8,.2,1)', fill:'forwards' });
      a.onfinish = () => { dst.style.opacity = ''; ov.animate([{ opacity:1 }, { opacity:0 }], { duration:220, fill:'forwards' }).onfinish = () => ov.remove(); };
    });
  }
  card(p){ const emp = p.store === 'emporium'; return { name:p.name, brand:p.brand, spec:p.spec, free:p.free, priceF:fmt(p.price), sub: emp ? 'Delivered nationwide' : 'Per unit ex. VAT · volume pricing', store: emp ? 'D’EMPORIUM' : 'D’PROVISION', tagBg: emp ? '#0C1411' : '#06382E', tagInk: emp ? '#A6F000' : '#D4A637', rad: emp ? '6px' : '20px', imgRad: emp ? '3px' : '14px', img:p.img, cta: emp ? 'Add to cart' : 'Add to quote', btnBg: emp ? '#A6F000' : '#06382E', btnInk: emp ? '#0C1411' : '#F5F1E8', btnRad: emp ? '4px' : '999px',
    add:() => { this.add(emp ? 'cart' : 'quote', p.key, p.name, p.price, 1); this.say(p.name + ' added to ' + (emp ? 'cart' : 'quote'), emp ? 'cart' : 'quote'); }, view:ev => this.openP(p.id, ev) }; }
  smApply(p, anim){
    const q = n => document.querySelector('[data-sm="' + n + '"]');
    const sc = q('scene'), eo = q('eo'), po = q('po'), pk = q('puck'), eh = q('eh'), ph = q('ph'); if (!sc || !pk) return;
    [sc, eo, po, pk, eh, ph].forEach(el => { if (el) el.style.transition = anim ? 'all .6s cubic-bezier(.2,.7,.2,1)' : 'none'; });
    const a = Math.abs(p);
    sc.style.transform = 'perspective(1200px) translateX(' + (-p*10).toFixed(2) + '%) rotateX(' + (a*14).toFixed(2) + 'deg) scale(' + (1 + a*.35).toFixed(3) + ')';
    eo.style.opacity = cl(-p).toFixed(3); po.style.opacity = cl(p).toFixed(3);
    const w = this.seamRef.current ? this.seamRef.current.offsetWidth : 1000, dist = Math.min(w*.28, 300);
    pk.style.transform = 'translateX(' + (p*dist).toFixed(1) + 'px) scale(' + (1 + Math.abs(p)*.12).toFixed(3) + ')';
    pk.textContent = Math.abs(p) >= 1 ? 'LET GO' : 'SWIPE';
    pk.style.background = p <= -1 ? '#A6F000' : p >= 1 ? '#D4A637' : '#F4F2EE';
    if (eh) { eh.style.transform = 'scale(' + (1 + Math.max(0, -p)*.12).toFixed(3) + ')'; eh.style.opacity = (1 - Math.max(0, p)*.85).toFixed(3); }
    if (ph) { ph.style.transform = 'scale(' + (1 + Math.max(0, p)*.12).toFixed(3) + ')'; ph.style.opacity = (1 - Math.max(0, -p)*.85).toFixed(3); }
  }
  smOpen(home){ const pk = document.querySelector('[data-sm="puck"]'); this.smApply(home ? -1 : 1, true); setTimeout(() => this.go(home ? 'emporium' : 'provision', pk), 420); }
  renderVals(){
    const PAGEV = ['cart','track','account','help','legal','about','oibPage','survey','notfound'];
    const s = this.state, v = this.view(), isPage = PAGEV.includes(v), isList = v === 'category' || v === 'search', isProd = v === 'product', isCats = v === 'categories';
    const PR = isProd ? PRODUCTS.find(x => x.id === s.pid) : null;
    const ctxStore = isProd && PR ? PR.store : v === 'category' && s.cat ? s.cat.store : v === 'search' ? s.fStore : isCats ? s.catsStore : (v === 'oibPage' || v === 'survey') ? 'provision' : null;
    const isE = v === 'emporium', isP = v === 'provision', isS = v === 'source';
    const gv = t => ev => { const el = ev && ev.currentTarget; this.close(); this.go(t, el); };
    const h = HERO[s.i];
    const P = s.open ? K[s.open] : null, items = P && P.items ? P.items : [];
    const chosen = items.map((x,i) => [x,i]).filter(([,i]) => s.sel[i]), total = chosen.reduce((a,[x]) => a + x[2], 0), f = s.focus != null ? items[s.focus] : null;
    const toggle = i => this.setState(st => ({ sel:{ ...st.sel, [i]:!st.sel[i] } }));
    const kitBiz = P && P.shop === 'provision';
    const addKit = () => { chosen.forEach(([x,i]) => this.add(kitBiz ? 'quote' : 'cart', s.open + '-' + i, x[0], x[2], 1)); };
    const cartTotal = s.cart.reduce((a,x) => a + x.price*x.qty, 0), quoteTotal = s.quote.reduce((a,x) => a + x.price*x.qty, 0);
    const cartN = s.cart.reduce((a,x) => a + x.qty, 0), quoteN = s.quote.reduce((a,x) => a + x.qty, 0);
    const chrome = (isList || isProd || isCats || isPage) ? { pageBg:'#FFFFFF', pageInk:'#06382E', hdrBg:'rgba(255,255,255,.94)', hdrSolid:'#FFFFFF', hdrInk:'#06382E', hdrLine:'#EEEAE2', subBrand: ctxStore === 'emporium' ? 'D’EMPORIUM' : ctxStore === 'provision' ? 'D’PROVISION' : '', subBg: ctxStore === 'emporium' ? '#0C1411' : '#06382E', subInk: ctxStore === 'emporium' ? '#A6F000' : '#D4A637' } : isE ? { pageBg:'#0C1411', pageInk:'#F2F2EC', hdrBg:'rgba(12,20,17,.92)', hdrSolid:'#0C1411', hdrInk:'#F2F2EC', hdrLine:'#22322B', subBrand:'D’EMPORIUM', subBg:'#A6F000', subInk:'#0C1411' }
      : isP ? { pageBg:'#F5F1E8', pageInk:'#06382E', hdrBg:'rgba(245,241,232,.92)', hdrSolid:'#F5F1E8', hdrInk:'#06382E', hdrLine:'rgba(6,56,46,.14)', subBrand:'D’PROVISION', subBg:'#06382E', subInk:'#D4A637' }
      : { pageBg:'#F5F1E8', pageInk:'#06382E', hdrBg:'rgba(245,241,232,.92)', hdrSolid:'#F5F1E8', hdrInk:'#06382E', hdrLine:'rgba(6,56,46,.14)', subBrand:'', subBg:'', subInk:'' };
    const nav = ctxStore === 'emporium' ? ETABS.map(([key,label]) => ({ label, go:() => this.openCat('emporium', key) }))
      : ctxStore === 'provision' ? PTABS.map(key => ({ label:key, go:() => this.openCat('provision', key) }))
      : isE ? ETABS.map(([key,label]) => ({ label, go:() => this.openCat('emporium', key) })).concat([{ label:'Kits', go:() => this.scrollId('e-kits') }])
      : isP ? [['Ways to order','p-ways'],['Office in a Box','oib'],['Kits by place','p-kits'],['Catalogue','p-cat']].map(([label,id]) => ({ label, go:() => this.scrollId(id) }))
      : [{ label:'D’Emporium · Home', go:gv('emporium') }, { label:'D’Provision · Business', go:gv('provision') }, { label:'Build a kit', go:() => this.openKit(h[1] === 'weekend' ? 'weekend' : h[1]) }, { label:'Office in a Box', go:() => { this.go('provision'); setTimeout(() => this.scrollId('oib'), 1100); } }];
    const waLines = s.cart.map(x => '• ' + x.qty + ' × ' + x.name + ' (' + fmt(x.price*x.qty) + ')').join('\n');
    const waText = 'Hello D’Emporium, I’d like to order:\n' + (waLines || '• [ your items ]') + '\nTotal: ' + fmt(cartTotal) + '\nDeliver to: [ your area ]';
    const fl = s.flow, st = s.step;
    const FL = {
      checkout:{ kick:'D’EMPORIUM · CHECKOUT', title: st === 2 ? 'Order placed' : st === 1 ? 'Payment' : 'Delivery details', steps:['DELIVERY','PAYMENT','DONE'] },
      whatsapp:{ kick:'D’EMPORIUM · WHATSAPP', title:'Order on WhatsApp' },
      enquiry:{ kick: isP ? 'D’PROVISION · ENQUIRY' : 'D’SOURCE · ENQUIRY', title: st ? 'Thank you' : 'Send an enquiry' },
      quote:{ kick:'D’PROVISION · QUOTE', title: st ? 'Quote requested' : 'Request a quote' },
      review:{ kick:'D’SOURCE · REVIEW', title: st ? 'Thank you' : 'Write a review' },
      account:{ kick:'D’PROVISION · ACCOUNT', title: st === 2 ? 'Order placed' : st === 1 ? 'Order on invoice' : 'Sign in to your account', steps:['SIGN IN','CONFIRM','DONE'] }
    }[fl] || { kick:'', title:'' };
    const isDone = (fl === 'checkout' && st === 2) || (fl === 'account' && st === 2) || ((fl === 'enquiry' || fl === 'quote' || fl === 'review') && st === 1);
    const doneCopy = { checkout:['Thank you. We’ve got your order.','We’ll call to confirm delivery and installation.'], account:['Order placed on account.','Your 30-day invoice goes to your accounts contact.'], enquiry:['Thank you. We’ve got it.','Someone will read this properly and come back to you.'], review:['Thank you for the review.','It appears once we’ve checked it’s from a verified D’Source purchase.'], quote:['Quote request sent.','We’ll come back with a quote within 4 working hours.'] }[fl] || ['',''];
    let primaryLabel = '', flowPrimary = null, primaryHref = '#', primaryTarget = '_self', backLabel = 'Back';
    if (isDone) { primaryLabel = ''; backLabel = 'Close'; }
    else if (fl === 'checkout' && st === 0) { primaryLabel = 'Continue to payment →'; flowPrimary = e => { e.preventDefault(); this.setState({ step:1 }); }; backLabel = 'Cancel'; }
    else if (fl === 'checkout' && st === 1) { primaryLabel = 'Place order · ' + fmt(cartTotal); flowPrimary = e => { e.preventDefault(); const ref = 'DS-' + Math.random().toString(36).slice(2,8).toUpperCase(); this.setState(x => ({ step:2, ref, orders:[{ ref, kind:'Home order', items:x.cart, total:cartTotal, date:new Date().toLocaleDateString('en-NG', { day:'numeric', month:'short', year:'numeric' }), stage:1 }].concat(x.orders), cart:[] })); }; }
    else if (fl === 'whatsapp') { primaryLabel = 'Open WhatsApp →'; primaryHref = 'https://wa.me/?text=' + encodeURIComponent(waText); primaryTarget = '_blank'; flowPrimary = null; backLabel = 'Cancel'; }
    else if (fl === 'enquiry') { primaryLabel = 'Send enquiry →'; flowPrimary = e => { e.preventDefault(); this.done(); }; backLabel = 'Cancel'; }
    else if (fl === 'quote') { primaryLabel = 'Request quote →'; flowPrimary = e => { e.preventDefault(); const ref = 'DQ-' + Math.random().toString(36).slice(2,8).toUpperCase(); this.setState(x => ({ step:1, ref, quotesSent:[{ ref, items:x.quote, total:quoteTotal, date:new Date().toLocaleDateString('en-NG', { day:'numeric', month:'short', year:'numeric' }) }].concat(x.quotesSent), quote:[] })); }; backLabel = 'Cancel'; }
    else if (fl === 'review') { primaryLabel = 'Submit review →'; backLabel = 'Cancel'; flowPrimary = e => { e.preventDefault(); if (!s.rvText.trim()) { this.say('Add a few words about it first'); return; } const pid = s.pid; this.setState(x => ({ reviews:{ ...x.reviews, [pid]:[{ stars:x.rv, title:x.rvTitle || 'Review', text:x.rvText, name:x.rvName || 'D’Source customer' }].concat(x.reviews[pid] || []) }, step:1 })); }; }
    else if (fl === 'account' && st === 0) { primaryLabel = 'Sign in →'; flowPrimary = e => { e.preventDefault(); this.setState({ step:1 }); }; backLabel = 'Cancel'; }
    else if (fl === 'account' && st === 1) { primaryLabel = 'Place order on account →'; flowPrimary = e => { e.preventDefault(); const ref = 'DS-' + Math.random().toString(36).slice(2,8).toUpperCase(); this.setState(x => ({ step:2, ref, orders:[{ ref, kind:'Business order · 30-day invoice', items:x.quote, total:quoteTotal, date:new Date().toLocaleDateString('en-NG', { day:'numeric', month:'short', year:'numeric' }), stage:1 }].concat(x.orders), quote:[] })); }; }
    const flowBack = () => { if (isDone || st === 0 || fl === 'whatsapp' || fl === 'enquiry' || fl === 'quote' || fl === 'review') this.closeFlow(); else this.setState({ step:st - 1 }); };
    const basket = s.basket, bCart = basket === 'cart';
    const bList = bCart ? s.cart : s.quote, bKey = bCart ? 'cart' : 'quote';
    const act = (label, sub, go, primary) => ({ label, sub, go, bg: primary ? '#06382E' : 'transparent', ink: primary ? '#F5F1E8' : '#06382E', border: primary ? '0' : '1px solid rgba(6,56,46,.25)' });
    const actsFor = bc => bc
      ? [act('Check out', 'Delivery details and payment', () => s.cart.length ? this.startFlow('checkout') : this.say('Your cart is empty'), true), act('Order on WhatsApp', 'Send your cart as a message', () => this.startFlow('whatsapp')), act('Send an enquiry', 'Ask before you buy', () => this.startFlow('enquiry', s.cart.length ? 'About: ' + s.cart.map(x => x.name).join(', ') : ''))]
      : [act('Request a quote', 'Back within 4 working hours', () => this.startFlow('quote'), true), act('Order on account', 'Approved accounts, 30-day invoice', () => s.quote.length ? this.startFlow('account') : this.say('Your quote list is empty')), act('Describe what you need', 'No list? Tell us the place', () => this.startFlow('quote', 'We need equipment for: '))];
    const bActions = actsFor(bCart);
    const kitE = (kk, bg, ink) => { const p = K[kk], its = kk === 'weekend' ? K.away.items : p.items, tot = its.reduce((a,x) => a + x[2], 0); return { name:p.name, items:its.map(x => x[0]).slice(0,3).join(' · ').toUpperCase(), price: kk === 'weekend' ? 'Away or at home' : 'Kit ' + fmt(tot), bg, ink, open:() => this.openKit(kk) }; };
    const pq = key => s.qty[key] || 1;
    return {
      ...chrome, hasSub:false, wide:!s.narrow, narrow:s.narrow, adire:this.props.adire ?? true,
      storeOpts:[['emporium','For Home'],['provision','For Business']].map(([k2,l]) => ({ label:l, pick:gv(k2), bg: k2 === v ? (k2 === 'emporium' ? '#A6F000' : '#D4A637') : 'transparent', ink: k2 === v ? (k2 === 'emporium' ? '#0C1411' : '#06382E') : '#F5F1E8' })),
      goSource:gv('source'), goEmporium:gv('emporium'), goProvision:gv('provision'), nav,
      toggleSearch:() => this.setState(x => ({ search:!x.search })), searchOpen:s.search,
      popular:['MacBook Air','Mesh','Camera','Omada','Signage'].map(x => ({ t:x, go:() => this.doSearch(x) })),
      qInput:s.qInput, qChange:e => this.setState({ qInput:e.target.value }), qKey:e => { if (e.key === 'Enter') this.doSearch(); }, runSearch:() => this.doSearch(),
      cartCount:cartN, quoteCount:quoteN,
      cartBtnBg: isE ? '#A6F000' : 'transparent', cartBtnInk: isE ? '#0C1411' : 'inherit', quoteBtnBg: isP ? '#D4A637' : 'transparent', quoteBtnInk: isP ? '#06382E' : 'inherit',
      openCart:() => this.setState({ basket:'cart' }), openQuote:() => this.setState({ basket:'quote' }),
      isSource:isS, isEmporium:isE, isProvision:isP,
      word: React.createElement('span', { key:h[0], style:{ display:'inline-block', animation:'dsUp .6s cubic-bezier(.2,.7,.2,1) both' } }, h[0]),
      openCurrent:() => this.openKit(h[1]),
      c1:h[2], c2:h[3], tintA:TINTS[s.i % 3][0], tintB:TINTS[s.i % 3][1], slotA:'v5-hero-a-' + h[1], slotB:'v5-hero-b-' + h[1],
      rope: TOUR.map((kk,i) => { const p = K[kk], its = kk === 'weekend' ? K.away.items : p.items, tot = its.reduce((a,x) => a + x[2], 0), bz = p.shop === 'provision';
        return { name:p.name, store: bz ? 'D’PROVISION' : 'D’EMPORIUM', pin: bz ? '#D4A637' : '#A6F000', cardRad: bz ? '22px' : '4px', imgRad: bz ? '16px' : '2px',
          priceLine: kk === 'weekend' ? 'Away or at home' : bz ? 'Kit from ' + fmt(tot) + ' · quote' : 'Kit ' + fmt(tot),
          tilt:(i % 2 ? 2.5 : -2.5) + 'deg', drop:(18 + (i*13) % 40) + 'px', slot:'ds-place-' + kk, ph:'Photo: ' + p.name.toLowerCase(), open:() => { if (this._noClick) return; this.openKit(kk); } }; }),
      seamRef:this.seamRef,
      smDown: ev => { if (ev.button > 0) return; const r = ev.currentTarget.getBoundingClientRect(); this._sm = { x0:ev.clientX, left:r.left, w:r.width, moved:false, p:0 }; try { ev.currentTarget.setPointerCapture(ev.pointerId); } catch(e){} },
      smMove: ev => { const d = this._sm; if (!d) return; const dx = ev.clientX - d.x0; if (Math.abs(dx) > 6) d.moved = true; if (!d.moved) return; d.p = cl(dx/Math.min(d.w*.28, 300), -1.15, 1.15); this.smApply(d.p, false); },
      smUp: ev => { const d = this._sm; if (!d) return; this._sm = null;
        if (d.p <= -1) return this.go('emporium', document.querySelector('[data-sm="puck"]'));
        if (d.p >= 1) return this.go('provision', document.querySelector('[data-sm="puck"]'));
        if (!d.moved && ev.type === 'pointerup') return this.smOpen((ev.clientX - d.left) < d.w/2);
        this.smApply(0, true); },
      smKey: ev => { if (ev.key === 'ArrowLeft') this.smOpen(true); else if (ev.key === 'ArrowRight') this.smOpen(false); },
      lifecycle:[{ n:'01', t:'Buy', d:'Genuine, warranty-backed devices, delivered nationwide.' }, { n:'02', t:'Set up', d:'Installed by D’Matek engineers. Free on TVs, laptops, phones and Office in a Box.' }, { n:'03', t:'Repair', d:'We collect it from you, or you send it to us by courier.' }, { n:'04', t:'Refresh', d:'When it’s time, we replace it and move you across.' }],
      pilotNote:PILOT, pilotGo:() => this.startFlow('enquiry', 'I’d like to talk about joining the device care plan pilot.'),
      oibQuote:() => this.startFlow('quote', 'I’d like to talk about Office in a Box.'),
      surveyGo:() => this.startFlow('quote', 'I’d like to book a free site survey.'),
      pFacts:['Quotes within 4 working hours','Free site surveys','Volume pricing on larger orders','30-day invoice for approved accounts'],
      best: ['e-laptops-0','e-networking-0','e-tvaudio-1','p-networking-1'].map(id => this.card(PRODUCTS.find(x => x.id === id))),
      enquire:() => this.startFlow('enquiry'), quoteBlank:() => this.startFlow('quote'),
      eCats: ETABS.map(([key,label]) => ({ label, go:() => this.openCat('emporium', key) })),
      eTabs: ETABS.map(([key,label]) => ({ label, pick:() => this.setState({ eTab:key }), line: key === s.eTab ? '#A6F000' : 'transparent', op: key === s.eTab ? 1 : .6 })),
      eItems: PRODUCTS.filter(x => x.store === 'emporium' && x.cat === s.eTab).map(x => this.card(x)), eTabLabel:LABEL.emporium[s.eTab], eSeeAll:() => this.openCat('emporium', s.eTab),
      eKits:[kitE('home','#A6F000','#0C1411'), kitE('gate','#131D19','#F2F2EC'), kitE('weekend','#F2F2EC','#0C1411'), kitE('hostel','#1F7A5A','#F2F2EC')],
      eTrust:[{ t:'Genuine, warranty-backed', d:'Every device sourced properly.' }, { t:'Installed by our engineers', d:'Free set-up on TVs, laptops and phones. Other installs are a paid add-on.' }, { t:'Delivered nationwide', d:'[ DELIVERY TIMES AND FEES TO CONFIRM ]' }, { t:'Pay your way', d:'Card, bank transfer, USSD or pay on delivery. Or order on WhatsApp.' }],
      pWays:[{ n:'01', t:'Request a quote', d:'Tell us the site and what it needs. We come back with a quote within 4 working hours.', cta:'Request a quote →', go:() => this.startFlow('quote') }, { n:'02', t:'Build a quote list', d:'Add items and quantities from the catalogue, then send the list.', cta:'Open the catalogue →', go:() => this.scrollId('p-cat') }, { n:'03', t:'Order on account', d:'For approved business accounts. Order against a PO, pay on 30-day invoice.', cta:'Sign in →', go:() => this.startFlow('account') }],
      oibParts:['Devices','Office network','Internet with backup','Domain, email and files','Website','MFA and backup'],
      pKits:['office','lobby','classroom','clinic','restaurant','hall','building'].map(kk => { const p = K[kk], tot = p.items.reduce((a,x) => a + x[2], 0); return { name:p.name, items:p.items.map(x => x[0]).join(' · '), price:'From ' + fmt(tot), open:() => this.openKit(kk) }; }),
      pTabs: PTABS.map(t => ({ label:t, pick:() => this.setState({ pTab:t }), bg: t === s.pTab ? '#06382E' : 'transparent', ink: t === s.pTab ? '#F5F1E8' : '#06382E', border: t === s.pTab ? '#06382E' : 'rgba(6,56,46,.2)' })),
      pItems: (PROV[s.pTab] || []).map((d,i) => { const [brand,name,spec,price] = d, key = 'p-' + s.pTab + '-' + i, q = pq(key); return { brand, name, spec, priceF:fmt(price), qty:q, img:'v5-deal-B-' + s.pTab + '-' + i,
        inc:() => this.setState(x => ({ qty:{ ...x.qty, [key]:(x.qty[key] || 1) + 1 } })), dec:() => this.setState(x => ({ qty:{ ...x.qty, [key]:Math.max(1, (x.qty[key] || 1) - 1) } })),
        add:() => { this.add('quote', key, name, price, q); this.say(q + ' × ' + name + ' added to quote', 'quote'); }, view:() => this.openP('p-' + s.pTab.toLowerCase() + '-' + i) }; }), pTabLabel:s.pTab, pSeeAll:() => this.openCat('provision', s.pTab),
      footCols:[
        { t:'SHOP', l:[{ t:'All products', go:() => this.openAll() }, { t:'All categories', go:() => this.openCats() }, { t:'D’Emporium · Home', go:gv('emporium') }, { t:'D’Provision · Business', go:gv('provision') }, { t:'Office in a Box', go:() => this.page('oibPage') }] },
        { t:'BUSINESS', l:[{ t:'Request a quote', go:() => this.startFlow('quote') }, { t:'Book a free site survey', go:() => this.page('survey', { surveyRef:'' }) }, { t:'Order on account', go:() => this.startFlow('account') }, { t:'Apply for a business account', go:() => this.page('account', { acctTab:'biz' }) }] },
        { t:'HELP', l:[['delivery','Delivery'],['payment','Payment'],['install','Installation and set-up'],['returns','Returns'],['warranty','Warranty and repairs'],['contact','Contact us']].map(([id,l2]) => ({ t:l2, go:() => this.page('help', { helpTopic:id }) })).concat([{ t:'Track an order', go:() => this.page('track', { trackQ:null }) }]) },
        { t:'COMPANY', l:[{ t:'About D’Source', go:() => this.page('about') }, { t:'My account', go:() => this.page('account') }, { t:'Terms', go:() => this.page('legal', { legalTopic:'terms' }) }, { t:'Privacy', go:() => this.page('legal', { legalTopic:'privacy' }) }, { t:'Cookies', go:() => this.page('legal', { legalTopic:'cookies' }) }] }

      ],
      ...(() => {
        const out = {};
        const storeCrumb = st2 => ({ t: st2 === 'emporium' ? 'D’Emporium' : 'D’Provision', go:gv(st2) });
        if (isList) {
          let base = v === 'search' ? PRODUCTS.filter(x => { const hay = (x.name + ' ' + x.brand + ' ' + x.spec + ' ' + LABEL[x.store][x.cat]).toLowerCase(); return s.q.toLowerCase().split(/\s+/).every(w => hay.includes(w)); }) : PRODUCTS.filter(x => s.cat && x.store === s.cat.store && x.cat === s.cat.key);
          const scope = v === 'search';
          const storeN = st2 => base.filter(x => x.store === st2).length;
          if (scope && s.fStore) base = base.filter(x => x.store === s.fStore);
          const catKeys = [...new Set(base.map(x => x.store + '|' + x.cat))];
          if (scope && s.fCat) base = base.filter(x => x.store + '|' + x.cat === s.fCat);
          const brands = [...new Set(base.map(x => x.brand))];
          let res = base.filter(x => !Object.keys(s.fBrand).some(k => s.fBrand[k]) || s.fBrand[x.brand]);
          if (s.fPrice != null) { const [,lo,hi] = BUCKETS[s.fPrice]; res = res.filter(x => x.price >= lo && x.price < hi); }
          if (s.fFree) res = res.filter(x => x.free);
          if (s.sort === 'low') res = res.slice().sort((a,b) => a.price - b.price); else if (s.sort === 'high') res = res.slice().sort((a,b) => b.price - a.price);
          const cs = s.cat ? s.cat.store : null;
          Object.assign(out, {
            hasScope:scope,
            fStores:[['emporium','D’Emporium · Home'],['provision','D’Provision · Business']].map(([k2,l]) => ({ label:l, n:String(storeN(k2)), bg: s.fStore === k2 ? '#D4A637' : 'transparent', pick:() => this.setState(x => ({ fStore: x.fStore === k2 ? null : k2, fCat:null })) })),
            fCats: catKeys.map(ck => { const [st2,c2] = ck.split('|'); return { label:LABEL[st2][c2] + (s.fStore ? '' : st2 === 'provision' ? ' (business)' : ''), n:String(PRODUCTS.filter(x => x.store === st2 && x.cat === c2 && (!s.q || base.includes(x))).length), bg: s.fCat === ck ? '#D4A637' : 'transparent', pick:() => this.setState(x => ({ fCat: x.fCat === ck ? null : ck })) }; }),
            listLabel: v === 'search' ? (s.q ? 'Search results' : 'All products') : 'Category',
            crumbs: v === 'search' ? [{ t:'D’Source', go:gv('source') }] : [{ t:'D’Source', go:gv('source') }, storeCrumb(cs)],
            crumbLast: v === 'search' ? (s.q ? 'Search' : s.fStore === 'emporium' ? 'All home products' : s.fStore === 'provision' ? 'All business products' : 'All products') : LABEL[cs][s.cat.key],
            hasListTag: v === 'category', listTag: cs === 'emporium' ? 'D’EMPORIUM · FOR HOME' : 'D’PROVISION · FOR BUSINESS', listTagBg: cs === 'emporium' ? '#0C1411' : '#06382E', listTagInk: cs === 'emporium' ? '#A6F000' : '#D4A637',
            listTitle: v === 'search' ? (s.q ? '“' + s.q + '”' : s.fStore === 'emporium' ? 'All home products' : s.fStore === 'provision' ? 'All business products' : 'All products') : LABEL[cs][s.cat.key], listDesc: v === 'search' ? (s.q ? 'Results from D’Emporium and D’Provision.' : 'Everything in D’Emporium and D’Provision. Filter by store, category, brand and price.') : CDESC[cs][s.cat.key],
            hasSiblings: v === 'category', siblings: v === 'category' ? Object.keys(LABEL[cs]).map(k2 => { const on = k2 === s.cat.key; return { label:LABEL[cs][k2], go:() => this.openCat(cs, k2), bg: on ? '#06382E' : '#fff', ink: on ? '#F5F1E8' : '#06382E', border: on ? '#06382E' : '#E6E2D8' }; }) : [],
            fBrands: brands.map(b => ({ label:b, n:String(base.filter(x => x.brand === b).length), bg: s.fBrand[b] ? '#06382E' : 'transparent', tick: s.fBrand[b] ? '✓' : '', toggle:() => this.setState(x => ({ fBrand:{ ...x.fBrand, [b]:!x.fBrand[b] } })) })),
            fPrices: BUCKETS.map((bk,i) => ({ label:bk[0], bg: s.fPrice === i ? '#D4A637' : 'transparent', pick:() => this.setState(x => ({ fPrice: x.fPrice === i ? null : i })) })),
            fFreeToggle:() => this.setState(x => ({ fFree:!x.fFree })), fFreeBg: s.fFree ? '#06382E' : '#D9D4C8', fFreeX: s.fFree ? '19px' : '3px',
            fClear:() => this.setState({ fBrand:{}, fPrice:null, fFree:false }),
            sort:s.sort, sortChange:e => this.setState({ sort:e.target.value }),
            resultCount: res.length + (res.length === 1 ? ' product' : ' products'), noResults: !res.length, results: res.map(x => this.card(x))
          });
        }
        if (isProd && PR) {
          const emp = PR.store === 'emporium', kk = KITFOR[PR.store][PR.cat], kit = K[kk], n = s.pq;
          const addN = () => this.add(emp ? 'cart' : 'quote', PR.key, PR.name, PR.price, n);
          const thumbs = ['Front','Side','In use','Box'];
          const freeWhat = PR.cat === 'TV & Audio' ? ' (wall mounting)' : ' (set-up and data transfer)';
          const btn = (label, sub, go, primary) => ({ label, sub, go, rad: emp ? '4px' : '999px', bg: primary ? (emp ? '#A6F000' : '#06382E') : '#fff', ink: primary ? (emp ? '#0C1411' : '#F5F1E8') : '#06382E', border: primary ? '0' : '1px solid #E6E2D8' });
          Object.assign(out, {
            crumbs:[{ t:'D’Source', go:gv('source') }, storeCrumb(PR.store), { t:LABEL[PR.store][PR.cat], go:() => this.openCat(PR.store, PR.cat) }], crumbLast:PR.name,
            pr:{ name:PR.name, brand:PR.brand, spec:PR.spec, free:PR.free, priceF:fmt(PR.price), sub: emp ? 'Delivered nationwide · pay by card, transfer, USSD or on delivery' : 'Per unit ex. VAT · volume pricing on larger orders',
              store: emp ? 'D’EMPORIUM' : 'D’PROVISION', tagBg: emp ? '#0C1411' : '#06382E', tagInk: emp ? '#A6F000' : '#D4A637', galRad: emp ? '6px' : '28px', thumbRad: emp ? '3px' : '14px',
              mainImg: s.gi === 0 ? PR.img : PR.img + '-' + (s.gi + 1), mainPh: PR.name + ' · ' + thumbs[s.gi].toLowerCase(),
              thumbs: thumbs.map((l,i) => ({ label:l.toUpperCase(), border: i === s.gi ? '#06382E' : 'transparent', pick:() => this.setState({ gi:i }) })),
              desc: CDESC[PR.store][PR.cat] + ' ' + PR.name + ' by ' + PR.brand[0] + PR.brand.slice(1).toLowerCase() + ': ' + PR.spec.replace(/ · /g, ', ') + '.',
              kitName: kit.name.toLowerCase(), roomSlot:'ds-room-' + kk, roomPh: kit.ph || '', pins: kit.items.map((x,i) => ({ n:String(i + 1), name:x[0], priceF: x[2] ? fmt(x[2]) : 'Quoted', x:x[3] + '%', y:x[4] + '%' })), openKit:() => this.openKit(kk),
              btnRad: emp ? '4px' : '999px', btnBg: emp ? '#A6F000' : '#06382E', btnInk: emp ? '#0C1411' : '#F5F1E8',
              barLabel: emp ? 'Add to cart' : 'Add to quote', barGo:() => { addN(); this.say(n + ' × ' + PR.name + ' added', emp ? 'cart' : 'quote'); } },
            pqN:String(n), pqInc:() => this.setState(x => ({ pq:x.pq + 1 })), pqDec:() => this.setState(x => ({ pq:Math.max(1, x.pq - 1) })),
            pActions: emp ? [btn('Add to cart', 'Keep shopping', () => { addN(); this.say(n + ' × ' + PR.name + ' added to cart', 'cart'); }, true), btn('Buy now', 'Straight to checkout', () => { addN(); setTimeout(() => this.startFlow('checkout'), 30); }), btn('Order on WhatsApp', 'Send it as a message', () => { addN(); setTimeout(() => this.startFlow('whatsapp'), 30); }), btn('Ask a question', 'Before you buy', () => this.startFlow('enquiry', 'About: ' + PR.name))]
              : [btn('Add to quote list', 'Keep building', () => { addN(); this.say(n + ' × ' + PR.name + ' added to quote', 'quote'); }, true), btn('Request a quote', 'Back within 4 working hours', () => { addN(); setTimeout(() => this.startFlow('quote'), 30); }), btn('Order on account', 'Approved accounts, 30-day invoice', () => { addN(); setTimeout(() => this.startFlow('account'), 30); }), btn('Book a free site survey', 'We survey before we specify', () => this.startFlow('quote', 'Site survey for: ' + PR.name))],
            pInfo:[{ t:'Delivery', d:'Delivered nationwide. [ DELIVERY TIMES AND FEES TO CONFIRM ]' }, { t:'Installation', d: PR.free ? 'Free' + freeWhat + ', by D’Matek engineers.' : 'Installed by D’Matek engineers as a paid add-on.' }, { t:'Payment', d: emp ? 'Card (Paystack or Flutterwave), bank transfer, USSD or pay on delivery.' : 'Quote within 4 working hours. Approved accounts pay on 30-day invoice.' }, { t:'Warranty', d:'Genuine and warranty-backed. For repairs we collect it from you, or you send it by courier.' }],
            pSpecs:[{ k:'Brand', v:PR.brand }, { k:'Model', v:PR.name }, { k:'Specification', v:PR.spec.replace(/ · /g, ', ') }, { k:'Category', v:LABEL[PR.store][PR.cat] }, { k:'Set-up', v: PR.free ? 'Free' + freeWhat : 'Paid add-on' }, { k:'Pricing', v: emp ? 'Delivery fee shown at checkout' : 'Per unit ex. VAT · volume pricing' }],
            ...(() => { const rs = s.reviews[PR.id] || []; const avg = rs.length ? rs.reduce((a,r) => a + r.stars, 0) / rs.length : 0; const star = n2 => '★'.repeat(Math.round(n2)) + '☆'.repeat(5 - Math.round(n2));
              return { reviews: rs.map(r => ({ ...r, stars:star(r.stars) })), noReviews: !rs.length, revStars: rs.length ? star(avg) : '☆☆☆☆☆', revHead: rs.length ? avg.toFixed(1) + ' out of 5' : 'No reviews yet', revLine: rs.length ? rs.length + (rs.length === 1 ? ' review' : ' reviews') + ' (pending check)' : 'No reviews yet · write one',
                toReviews:() => this.scrollId('reviews'), writeReview:() => { this.setState({ rv:5, rvTitle:'', rvText:'', rvName:'' }); this.startFlow('review'); } }; })(),
            related: PRODUCTS.filter(x => x.store === PR.store && x.cat === PR.cat && x.id !== PR.id).slice(0,4).map(x => this.card(x))
          });
        }
        return out;
      })(),
      isCartPage: v === 'cart', isTrack: v === 'track', isAccount: v === 'account', isHelp: v === 'help', isLegal: v === 'legal', isAbout: v === 'about', isOib: v === 'oibPage', isSurvey: v === 'survey', isNotFound: v === 'notfound',
      openAccount:() => this.page('account'), acctLabel: s.signedIn ? 'Account ✓' : 'Account', openCartPage:() => this.page('cart', { cartTab: s.basket === 'quote' ? 'quote' : 'cart' }), openOib:() => this.page('oibPage'), openSurvey:() => this.page('survey', { surveyRef:'' }),
      ...(() => { const qc = s.cartTab === 'quote', list = qc ? s.quote : s.cart; const tab = (id, l2) => { const on = s.cartTab === id; return { label:l2, go:() => this.setState({ cartTab:id }), bg: on ? '#06382E' : '#fff', ink: on ? '#F5F1E8' : '#06382E', border: on ? '#06382E' : '#E6E2D8' }; };
        return { cpTabs:[tab('cart', 'Cart (' + cartN + ')'), tab('quote', 'Quote list (' + quoteN + ')')], cpEmpty:!list.length, cpEmptyTitle: qc ? 'Your quote list is empty.' : 'Your cart is empty.',
          cpItems: list.map(x => { const P2 = PRODUCTS.find(p => p.key === x.key); return { img: P2 ? P2.img : 'ds-cart-' + x.key, name:x.name, unitF: x.price ? fmt(x.price) : 'Quoted', qty:x.qty, lineF: x.price ? fmt(x.price*x.qty) : 'Quoted', inc:() => this.bump(qc ? 'quote' : 'cart', x.key, 1), dec:() => this.bump(qc ? 'quote' : 'cart', x.key, -1), remove:() => this.bump(qc ? 'quote' : 'cart', x.key, -x.qty) }; }),
          cpSum: qc ? [{ k:'Items', v:String(quoteN) }, { k:'VAT', v:'Added on the quote (7.5%)' }, { k:'Reply', v:'Within 4 working hours' }] : [{ k:'Items', v:String(cartN) }, { k:'Delivery', v:'Nationwide · [ FEE TO CONFIRM ]' }, { k:'Set-up', v:'Free on TVs, laptops and phones' }],
          cpTotalLabel: qc ? 'Estimate ex. VAT' : 'Subtotal', cpTotalF: fmt(qc ? quoteTotal : cartTotal), cpActions: actsFor(!qc) }; })(),
      ...(() => { const STEPS = [['Order received','We have your order.'],['Confirmed by phone','We call to confirm delivery and set-up.'],['Packed','Checked and packed.'],['Out for delivery','On its way to you.'],['Delivered','Signed for.'],['Installed','Set up by D’Matek engineers, where booked.']];
        const q = (s.trackQ || '').trim().toUpperCase(), o = q ? s.orders.find(x => x.ref === q) : null;
        return { trackRef:s.trackRef, trackCh:e => this.setState({ trackRef:e.target.value }), trackKey:e => { if (e.key === 'Enter') this.setState(x => ({ trackQ:x.trackRef })); }, trackGo:() => this.setState(x => ({ trackQ:x.trackRef })),
          hasRecent: s.orders.length > 0, recentOrders: s.orders.slice(0,4).map(x => ({ ref:x.ref, go:() => this.setState({ trackRef:x.ref, trackQ:x.ref }) })),
          trackFound:!!o, trackMissing: !!q && !o,
          tr: o ? { ref:o.ref, date:o.date, count:nItems(o.items.reduce((a,x) => a + x.qty, 0)), totalF:fmt(o.total), steps: STEPS.map(([l2,n2],i) => { const done = i < o.stage, cur = i === o.stage - 1; return { label:l2, note:n2, dot: done ? '#D4A637' : '#fff', ring: done ? '#D4A637' : '#D9D4C8', line: i === STEPS.length - 1 ? 'transparent' : (i < o.stage - 1 ? '#D4A637' : '#EEEAE2'), fw: cur ? 800 : 600, ink: done ? '#06382E' : '#9AA59F' }; }) } : { ref:'', date:'', count:'', totalF:'', steps:[] },
          hasTrack: s.flow === 'checkout' || (s.flow === 'account' && s.step === 2), trackLast:() => this.page('track', { trackRef:s.ref, trackQ:s.ref }) }; })(),
      ...(() => { const at = s.acctTab; const tabs = [['orders','Orders'],['quotes','Quotes'],['kits','Saved kits'],['reviews','Reviews'],['biz','Business account']];
        const allRev = Object.keys(s.reviews).flatMap(pid => (s.reviews[pid] || []).map(r => ({ pid, r })));
        return { signedIn:s.signedIn, signedOut:!s.signedIn, signIn:() => this.setState({ signedIn:true }), signOut:() => this.setState({ signedIn:false }),
          acctTabs: tabs.map(([id,l2]) => ({ label:l2, go:() => this.setState({ acctTab:id }), line: at === id ? '#D4A637' : 'transparent', bg: at === id ? '#F5F1E8' : 'transparent', fw: at === id ? 800 : 600 })),
          aOrders: at === 'orders', aQuotes: at === 'quotes', aKits: at === 'kits', aReviews: at === 'reviews', aBiz: at === 'biz',
          noOrders:!s.orders.length, myOrders: s.orders.map(o => ({ ref:o.ref, date:o.date, kind:o.kind, count:nItems(o.items.reduce((a,x) => a + x.qty, 0)), totalF:fmt(o.total), status:'Order received', track:() => this.page('track', { trackRef:o.ref, trackQ:o.ref }) })),
          noQuotes:!s.quotesSent.length, myQuotes: s.quotesSent.map(o => ({ ref:o.ref, date:o.date, count: o.items.length ? nItems(o.items.reduce((a,x) => a + x.qty, 0)) : 'Described in the request', totalF: o.total ? fmt(o.total) : '—' })),
          noKits:!s.savedKits.length, myKits: s.savedKits.map((k2,i) => ({ name:K[k2].name, count:nItems(K[k2].items.length), totalF:fmt(K[k2].items.reduce((a,x) => a + x[2], 0)), open:() => this.openKit(k2), remove:() => this.setState(x => ({ savedKits:x.savedKits.filter(y => y !== k2) })) })),
          noMyReviews:!allRev.length, myReviews: allRev.map(({ pid, r }) => { const P2 = PRODUCTS.find(p => p.id === pid); return { product: P2 ? P2.name : pid, stars:'★'.repeat(r.stars) + '☆'.repeat(5 - r.stars), text:r.text, open:() => this.openP(pid) }; }),
          bizApplied:s.bizApplied, bizForm:!s.bizApplied, bizApply:() => this.setState({ bizApplied:true }) }; })(),
      ...(() => { const HT = {
          delivery:{ title:'Delivery', paras:['We deliver anywhere in Nigeria.', 'After you order, we call to confirm the delivery date and any set-up you’ve booked.'], list:[{ k:'Where', v:'Nationwide' }, { k:'Times and fees', v:'[ DELIVERY TIMES AND FEES TO CONFIRM ]' }, { k:'Business orders', v:'Delivered to each of your sites, as set out in the quote.' }] },
          payment:{ title:'Payment', paras:['Pay the way that suits you.'], list:[{ k:'Card', v:'Paystack or Flutterwave' }, { k:'Bank transfer', v:'Details sent after you order' }, { k:'USSD', v:'From any bank on your phone' }, { k:'Pay on delivery', v:'Pay when it arrives. [ AREAS TO CONFIRM ]' }, { k:'Business invoice', v:'Approved business accounts pay on 30-day invoice.' }] },
          install:{ title:'Installation and set-up', paras:['Installed by D’Matek engineers, for home kits and business orders.'], list:[{ k:'Free', v:'TV wall mounting · laptop and phone set-up and data transfer · Office in a Box' }, { k:'Paid add-on', v:'Other installation, quoted before we start' }, { k:'Site surveys', v:'Free, before we specify anything' }] },
          returns:{ title:'Returns', paras:['[ RETURNS POLICY TO CONFIRM ]', 'If something isn’t right, contact us first and we’ll tell you what happens next.'] },
          warranty:{ title:'Warranty and repairs', paras:['Every device is genuine and warranty-backed.', 'For repairs, we collect it from you, or you send it to us by courier.', PILOT + ' (Device care plan)'] },
          biz:{ title:'Business accounts', paras:['Business accounts are approved after a check. Approved accounts order against a PO and pay on 30-day invoice.'], list:[{ k:'Quotes', v:'Within 4 working hours' }, { k:'Pricing', v:'Volume pricing on larger orders' }, { k:'Site surveys', v:'Free' }] },
          contact:{ title:'Contact us', paras:['Tell us in your own words. You don’t need to know which technology it needs.'], list:[{ k:'Phone', v:'[ PHONE TO BE ADDED ]' }, { k:'Email', v:'[ EMAIL TO BE ADDED ]' }, { k:'WhatsApp', v:'[ WHATSAPP NUMBER TO BE ADDED ]' }, { k:'Address', v:'[ ADDRESS TO BE ADDED ]' }] } };
        const ORDER = [['delivery','Delivery'],['payment','Payment'],['install','Installation and set-up'],['returns','Returns'],['warranty','Warranty and repairs'],['biz','Business accounts'],['contact','Contact us']];
        const h2 = HT[s.helpTopic] || HT.delivery; const c = (label, go, primary) => ({ label, go, bg: primary ? '#06382E' : '#fff', ink: primary ? '#F5F1E8' : '#06382E', border: primary ? '0' : '1px solid rgba(6,56,46,.25)' });
        const ctas = s.helpTopic === 'biz' ? [c('Apply for a business account', () => this.page('account', { acctTab:'biz' }), true), c('Request a quote', () => this.startFlow('quote'))] : s.helpTopic === 'warranty' ? [c('Book a repair collection', () => this.startFlow('enquiry', 'Repair — please collect my device: '), true), c('Join the care plan pilot', () => this.startFlow('enquiry', 'I’d like to talk about joining the device care plan pilot.'))] : [c('Send an enquiry', () => this.startFlow('enquiry'), true), c('Track an order', () => this.page('track', { trackQ:null }))];
        const LG = { terms:{ title:'Terms of sale', sections:['Who we are','Ordering and acceptance','Prices and payment','Delivery','Installation and set-up','Returns and refunds','Warranty and repairs','Business accounts and invoices','Liability','Governing law'] }, privacy:{ title:'Privacy policy', sections:['What we collect','How we use it','Who we share it with','How long we keep it','Your rights under the NDPA','Contacting our data protection officer'] }, cookies:{ title:'Cookie policy', sections:['What cookies are','Cookies we use','Managing cookies'] } };
        const lg = LG[s.legalTopic] || LG.terms;
        return { helpTabs: ORDER.map(([id,l2]) => ({ label:l2, go:() => this.setState({ helpTopic:id }), line: s.helpTopic === id ? '#D4A637' : 'transparent', bg: s.helpTopic === id ? '#F5F1E8' : 'transparent', fw: s.helpTopic === id ? 800 : 600 })),
          help:{ title:h2.title, paras:h2.paras, hasList:!!h2.list, list:h2.list || [], ctas },
          legalTabs: [['terms','Terms of sale'],['privacy','Privacy policy'],['cookies','Cookie policy']].map(([id,l2]) => ({ label:l2, go:() => this.setState({ legalTopic:id }), line: s.legalTopic === id ? '#D4A637' : 'transparent', bg: s.legalTopic === id ? '#F5F1E8' : 'transparent', fw: s.legalTopic === id ? 800 : 600 })),
          legal:{ title:lg.title, sections: lg.sections.map((h3,i) => ({ n:String(i + 1), h:h3 })) } }; })(),
      oibSteps:[['01','Understand'],['02','Simplify'],['03','Solve'],['04','Support']].map(([n,t2]) => ({ n, t:t2 })),
      surveyOpen:!s.surveyRef, surveyDone:!!s.surveyRef, surveyRef:s.surveyRef, surveySubmit:() => this.setState({ surveyRef:'SV-' + Math.random().toString(36).slice(2,8).toUpperCase() }),
      saveKitLabel: s.open && s.savedKits.includes(s.open) ? 'Saved to your account ✓' : 'Save kit to my account', saveKit:() => { if (!s.open || s.savedKits.includes(s.open)) return; this.setState(x => ({ savedKits:[s.open].concat(x.savedKits) })); this.say('Kit saved', null); },
      isList, isProduct: isProd && !!PR, isCats, openAll:() => this.openAll(), openCatsAll:() => this.openCats(),
      ...(isCats ? (() => { const grp = st2 => { const emp = st2 === 'emporium'; const keys = emp ? ETABS.map(x => x[0]) : PTABS; return { title: emp ? 'D’Emporium · For home' : 'D’Provision · For business', allLabel: emp ? 'All home products →' : 'All business products →', all:() => this.openAll(st2),
          tiles: keys.map(key => ({ label:LABEL[st2][key], desc:CDESC[st2][key], count:String(PRODUCTS.filter(x => x.store === st2 && x.cat === key).length) + ' products', img:'v7-cat-' + (emp ? 'e-' : 'p-') + key.replace(/\W/g,''), rad: emp ? '6px' : '22px', imgRad: emp ? '3px' : '16px', go:() => this.openCat(st2, key) })) }; };
        const cs = s.catsStore;
        return { catsGroups: cs ? [grp(cs)] : [grp('emporium'), grp('provision')], catsTitle: cs === 'emporium' ? 'Home categories' : cs === 'provision' ? 'Business categories' : 'All categories', catsDesc: cs ? 'Pick a category to see every product in it.' : 'Every category in D’Emporium and D’Provision.',
          crumbs: cs ? [{ t:'D’Source', go:gv('source') }, { t: cs === 'emporium' ? 'D’Emporium' : 'D’Provision', go:gv(cs) }] : [{ t:'D’Source', go:gv('source') }], crumbLast:'All categories' }; })() : {}), asidePos: s.narrow && innerWidth < 700 ? 'static' : 'sticky', asideMax: s.narrow && innerWidth < 700 ? 'none' : 'calc(100vh - 150px)',
      catBar: (() => { const sc = (ctxStore || (isE ? 'emporium' : isP ? 'provision' : null));
        const eC = ETABS.map(([key,label]) => ({ label, go:() => this.openCat('emporium', key), on: v === 'category' && s.cat && s.cat.store === 'emporium' && s.cat.key === key }));
        const pC = PTABS.map(key => ({ label:key, go:() => this.openCat('provision', key), on: v === 'category' && s.cat && s.cat.store === 'provision' && s.cat.key === key }));
        const oib = { label:'Office in a Box', go:() => { if (this.view() === 'provision') this.scrollId('oib'); else { this.go('provision'); setTimeout(() => this.scrollId('oib'), 1400); } } };
        if (sc === 'emporium') return [{ label:'All home products', go:() => this.openAll('emporium'), on: v === 'search' && !s.q && s.fStore === 'emporium', strong:true }].concat(eC, [{ label:'All categories', go:() => this.openCats('emporium'), on:isCats }]);
        if (sc === 'provision') return [{ label:'All business products', go:() => this.openAll('provision'), on: v === 'search' && !s.q && s.fStore === 'provision', strong:true }].concat(pC, [oib, { label:'All categories', go:() => this.openCats('provision'), on:isCats }]);
        return [{ label:'All products', go:() => this.openAll(), on: v === 'search' && !s.q && !s.fStore, strong:true }, { label:'HOME', go:gv('emporium'), tag:true }].concat(eC, [{ label:'BUSINESS', go:gv('provision'), tag:true }], pC, [{ label:'All categories', go:() => this.openCats(), on:isCats }]);
      })()
        .map(c => ({ label:c.label, go:c.go, bg: c.on ? 'rgba(212,166,55,.28)' : 'transparent', fw: c.strong || c.tag || c.on ? 800 : 600, ls: c.tag ? '.14em' : '0', op: c.tag ? .55 : c.on ? 1 : .82 })),
      fReview: s.flow === 'review' && s.step === 0,
      rvPick:[1,2,3,4,5].map(n2 => ({ label:n2 + ' stars', ink: n2 <= s.rv ? '#D4A637' : '#D9D4C8', pick:() => this.setState({ rv:n2 }) })),
      rvTitle:s.rvTitle, rvText:s.rvText, rvName:s.rvName, rvTitleCh:e => this.setState({ rvTitle:e.target.value }), rvTextCh:e => this.setState({ rvText:e.target.value }), rvNameCh:e => this.setState({ rvName:e.target.value }),
      catGroups:[{ tag:'D’EMPORIUM', title:'For home', tagBg:'#0C1411', tagInk:'#A6F000', tiles: ETABS.map(([key,label]) => ({ label, count:String(PRODUCTS.filter(x => x.store === 'emporium' && x.cat === key).length), img:'v7-cat-e-' + key.replace(/\W/g,''), rad:'6px', imgRad:'3px', go:() => this.openCat('emporium', key) })) },
        { tag:'D’PROVISION', title:'For business', tagBg:'#06382E', tagInk:'#D4A637', tiles: PTABS.map(key => ({ label:key, count:String(PRODUCTS.filter(x => x.store === 'provision' && x.cat === key).length), img:'v7-cat-p-' + key, rad:'20px', imgRad:'14px', go:() => this.openCat('provision', key) })) }],
      hasToast:!!s.toast, toast:s.toast, toastGo:() => this.setState({ basket:s.toastTo || 'cart', toast:'' }),
      isOpen:!!P, isChooser:!!(P && P.chooser), isKit:!!(P && !P.chooser),
      oName: P ? P.name.toLowerCase() + '.' : '', oShort: P ? P.short : '', oSlot: P ? 'ds-room-' + s.open : 'ds-room', oPh: P ? P.ph || '' : '',
      oStore: kitBiz ? 'D’PROVISION' : 'D’EMPORIUM', oTagBg: kitBiz ? '#06382E' : '#A6F000', oTagInk: kitBiz ? '#D4A637' : '#0C1411',
      close:() => this.close(), pickAway:() => this.openKit('away'), pickHome:() => this.openKit('weekendIn'),
      items: items.map((x,i) => ({ n:String(i + 1), name:x[0], note:x[1], priceF: x[2] ? fmt(x[2]) : 'Quoted', x:x[3] + '%', y:x[4] + '%', pinBg: s.sel[i] ? '#D4A637' : '#F5F1E8', boxBg: s.sel[i] ? '#06382E' : 'transparent', tick: s.sel[i] ? '✓' : '', focus:() => this.setState({ focus:i }), toggle:() => toggle(i) })),
      hasFocus:!!f, fName: f ? f[0] : '', fNote: f ? (f[2] ? fmt(f[2]) + ' · ' : '') + f[1] : '', fLabel: f && s.sel[s.focus] ? 'Remove from kit' : 'Add to kit', fToggle:() => toggle(s.focus),
      countLabel: chosen.length + ' of ' + items.length + ' in your kit', totalF:fmt(total),
      kitBtnBg: kitBiz ? '#D4A637' : '#A6F000', kitBtnInk: kitBiz ? '#06382E' : '#0C1411',
      kitPrimaryLabel: kitBiz ? 'Add ' + chosen.length + ' to quote list' : 'Add ' + chosen.length + ' to cart',
      kitPrimary:() => { if (!chosen.length) return; addKit(); this.close(); this.say(chosen.length + ' items added to ' + (kitBiz ? 'quote' : 'cart'), kitBiz ? 'quote' : 'cart'); },
      kitSecondaryLabel: kitBiz ? 'Request a quote for this kit →' : 'Check out now →',
      kitSecondary:() => { if (!chosen.length) return; addKit(); setTimeout(() => this.startFlow(kitBiz ? 'quote' : 'checkout', kitBiz ? 'Kit: ' + P.name : ''), 30); },
      basketOpen:!!basket, closeBasket:() => this.setState({ basket:null }),
      bLabel: bCart ? 'Cart' : 'Quote list', bStore: bCart ? 'D’EMPORIUM' : 'D’PROVISION', bTitle: bCart ? 'Your cart' : 'Your quote list',
      bEmpty: !bList.length, bEmptyText: bCart ? 'Your cart is empty. Add something from D’Emporium, or send an enquiry below.' : 'Your quote list is empty. Add items from the D’Provision catalogue, or describe what you need below.',
      bItems: bList.map(x => ({ name:x.name, priceF: x.price ? fmt(x.price) : 'Quoted', qty:x.qty, inc:() => this.bump(bKey, x.key, 1), dec:() => this.bump(bKey, x.key, -1) })),
      bTotalLabel: bCart ? 'Total' : 'Estimate ex. VAT', bTotalF: fmt(bCart ? cartTotal : quoteTotal), bActions,
      flowOpen:!!fl, flowKicker:FL.kick, flowTitle:FL.title, closeFlow:() => this.closeFlow(),
      hasSteps:!!FL.steps, steps:(FL.steps || []).map((l,i) => ({ label:l, bar: i <= st ? '#D4A637' : 'rgba(6,56,46,.15)', ink: i <= st ? '#06382E' : '#5E6E68' })),
      fCheckout0: fl === 'checkout' && st === 0, fCheckout1: fl === 'checkout' && st === 1, fWhatsapp: fl === 'whatsapp', fEnquiry: fl === 'enquiry' && st === 0, fQuote: fl === 'quote' && st === 0, fAccount0: fl === 'account' && st === 0, fAccount1: fl === 'account' && st === 1, fDone:isDone,
      payOpts:[['card','Card','Paystack or Flutterwave'],['transfer','Bank transfer','Details sent after you order'],['ussd','USSD','Pay from any bank on your phone'],['pod','Pay on delivery','Pay when it arrives']].map(([k2,t,d]) => ({ t, d, pick:() => this.setState({ pay:k2 }), border: s.pay === k2 ? '#06382E' : 'rgba(6,56,46,.15)', dot: s.pay === k2 ? '#D4A637' : 'transparent' })),
      waText, flowNote:s.note, applyAccount:() => this.startFlow('quote', 'We’d like to open a D’Provision business account.'),
      qHasItems: s.quote.length > 0, qLines: s.quote.map(x => ({ qty:x.qty, name:x.name, lineF: x.price ? fmt(x.price*x.qty) : 'Quoted' })), quoteTotalF:fmt(quoteTotal),
      doneTitle:doneCopy[0], doneBody:doneCopy[1], hasRef: isDone && !!s.ref && fl !== 'enquiry' && fl !== 'review', ref:s.ref,
      showSummary: !isDone && (fl === 'checkout' || fl === 'whatsapp'), sumLabel:'Cart total', sumF:fmt(cartTotal),
      hasPrimary: !isDone, primaryLabel, flowPrimary, primaryHref, primaryTarget, flowBack, backLabel
    };
  }
}
