class Component extends DCLogic {
  componentDidMount(){
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const C = document.querySelector('[data-curtain]');
    const lift = () => { if (!C) return; C.style.transition = 'transform 1s cubic-bezier(.76,0,.24,1), border-radius 1s cubic-bezier(.76,0,.24,1)'; C.style.borderRadius = '0 0 50% 50% / 0 0 30% 30%'; C.style.transform = 'translateY(-110%)'; setTimeout(() => { C.style.visibility = 'hidden'; }, 1050); };
    if (reduce && C) C.style.visibility = 'hidden'; else setTimeout(lift, 450);
    this._nav = e => {
      const a = e.target.closest && e.target.closest('a[href]'); if (!a || a.target === '_blank' || e.metaKey || e.ctrlKey || !C) return;
      const h = a.getAttribute('href'); if (!h || h.startsWith('#') || /^https?:/.test(h)) return;
      e.preventDefault(); C.style.transition = 'none'; C.style.visibility = 'visible'; C.style.borderRadius = '0'; C.style.transform = 'translateY(110%)'; void C.offsetHeight;
      C.style.transition = 'transform .8s cubic-bezier(.76,0,.24,1)'; C.style.transform = 'translateY(0)'; setTimeout(() => { location.href = a.href; }, 820);
    };
    document.addEventListener('click', this._nav, true);
    const INIT = { '1':{ opacity:'0', transform:'translateY(60px) skewY(4deg)' }, mask:{ clipPath:'inset(100% 0 0 0 round 24px)' }, deal:{ opacity:'0', transform:'translateY(140px) rotate(-8deg) scale(.9)' } };
    const TR = { '1':'opacity 1s ease, transform 1.2s cubic-bezier(.16,1,.3,1)', mask:'clip-path 1.4s cubic-bezier(.76,0,.24,1)', deal:'opacity .5s ease, transform 1.2s cubic-bezier(.34,1.4,.64,1)' };
    const DONE = { '1':{ opacity:'1', transform:'none' }, mask:{ clipPath:'inset(0% 0 0 0 round 20px)' }, deal:{ opacity:'1', transform:'none' } };
    this._iv = setInterval(() => {
      if (reduce) return;
      document.querySelectorAll('[data-in]').forEach(el => {
        const t = el.dataset.in; if (el.dataset.s === '2') return;
        const i = Array.prototype.indexOf.call(el.parentElement.children, el);
        if (!el.dataset.s) { Object.assign(el.style, INIT[t]); el.dataset.s = '1'; return; }
        const r = el.getBoundingClientRect();
        if (r.top < innerHeight*.9 && r.bottom > 0) { el.style.transition = TR[t]; el.style.transitionDelay = Math.min(i, 6)*100 + 'ms'; Object.assign(el.style, DONE[t]); el.dataset.s = '2'; }
      });
    }, 40);
  }
  componentWillUnmount(){ clearInterval(this._iv); document.removeEventListener('click', this._nav, true); }
  renderVals(){ return {}; }
}