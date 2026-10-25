/* Haksan · köz parçacıkları, menü, belirme */
document.documentElement.classList.add('js');
(() => {
  const azHareket = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Menü
  const ac = document.querySelector('.menu-ac'), menu = document.querySelector('.menu');
  if (ac && menu) {
    ac.addEventListener('click', () => { const a = menu.classList.toggle('acik'); ac.setAttribute('aria-expanded', a); });
    menu.querySelectorAll('a').forEach(x => x.addEventListener('click', () => { menu.classList.remove('acik'); ac.setAttribute('aria-expanded', 'false'); }));
  }
  // Belirme
  const bel = [...document.querySelectorAll('.bel')];
  if ('IntersectionObserver' in window && !azHareket) {
    bel.forEach(b => { if (b.getBoundingClientRect().top > innerHeight * .9) b.classList.add('gizli'); });
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.remove('gizli'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
    bel.forEach(b => io.observe(b));
  }
  // Köz: kahramanda yükselen kıvılcımlar
  function koz(cv, opt) {
    const g = cv.getContext('2d'); let W = 0, H = 0, d = Math.min(2, devicePixelRatio || 1); const P = [];
    const boyut = () => { const r = cv.getBoundingClientRect(); W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; g.setTransform(d, 0, 0, d, 0, 0); };
    boyut(); addEventListener('resize', boyut);
    const yeni = (ilk) => ({ x: Math.random() * W, y: ilk ? Math.random() * H : H + 10, r: .6 + Math.random() * (opt.buyuk || 2.2), vy: .25 + Math.random() * (opt.hiz || 1.1), vx: (Math.random() - .5) * .3, s: Math.random() * 6.28, o: .4 + Math.random() * .6, h: 18 + Math.random() * 22 });
    for (let i = 0; i < opt.n; i++) P.push(yeni(true));
    let gor = true; new IntersectionObserver(e => gor = e[0].isIntersecting).observe(cv);
    const ciz = (t) => {
      if (gor) {
        g.clearRect(0, 0, W, H);
        if (opt.alev) { const gr = g.createRadialGradient(W / 2, H * 1.05, 0, W / 2, H * 1.05, H * .9); gr.addColorStop(0, `rgba(255,150,60,${.5 + .08 * Math.sin(t / 300)})`); gr.addColorStop(.35, 'rgba(200,70,20,.25)'); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
        g.globalCompositeOperation = 'lighter';
        for (const p of P) {
          p.y -= p.vy; p.s += .02; p.x += p.vx + Math.sin(p.s) * .35;
          const omur = Math.max(0, Math.min(1, p.y / H));
          if (p.y < -10) Object.assign(p, yeni(false));
          const a = p.o * (0.25 + omur * .75) * (0.75 + .25 * Math.sin(t / 120 + p.s * 3));
          const gr = g.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
          gr.addColorStop(0, `hsla(${p.h + 10},100%,72%,${a})`); gr.addColorStop(.35, `hsla(${p.h},100%,55%,${a * .55})`); gr.addColorStop(1, 'hsla(20,100%,40%,0)');
          g.fillStyle = gr; g.beginPath(); g.arc(p.x, p.y, p.r * 4, 0, 6.283); g.fill();
        }
        g.globalCompositeOperation = 'source-over';
      }
      if (!azHareket) requestAnimationFrame(ciz);
    };
    requestAnimationFrame(ciz);
  }
  document.querySelectorAll('canvas[data-koz]').forEach(cv => koz(cv, { n: +cv.dataset.koz || 70, alev: cv.hasAttribute('data-alev'), buyuk: +cv.dataset.buyuk || 2.2, hiz: +cv.dataset.hiz || 1.1 }));
})();
