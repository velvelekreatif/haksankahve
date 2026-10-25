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
/* Menü: ana sayfada kaydırınca dolar */
(() => {
  const u = document.querySelector('.anasayfa .ust'); if (!u) return;
  const f = () => u.classList.toggle('dolu', scrollY > 40); addEventListener('scroll', f, { passive: true }); f();
})();
/* Arka plan videoları: görünürken oynar, görünmezken durur */
(() => {
  const az = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting && !az) { v.play().catch(() => {}); } else v.pause(); }), { threshold: .05 });
  document.querySelectorAll('.arka video').forEach(v => { v.muted = true; v.setAttribute('autoplay', ''); io.observe(v); });
})();
/* Çiftlikten bardağa: kaydırma ilerlemesine göre görüntü, tane rengi ve zincir */
(() => {
  const iz = document.querySelector('.halka-izgara'); if (!iz) return;
  const az = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const L = [...iz.querySelectorAll('.halka-adimlar li')], n = L.length, M = [...iz.querySelectorAll('.halka-medya .m')];
  const durum = JSON.parse(iz.dataset.durum || '[]');
  const kiraz = iz.querySelector('.kiraz'), taneG = iz.querySelector('.tane-g'), renk = iz.querySelector('.tane-renk'), tane = iz.querySelector('.tane-k');
  const isaret = iz.querySelector('.serit em'), no = iz.querySelector('.halka-rozet .no'), ad = iz.querySelector('.halka-rozet b'), zin = [...iz.querySelectorAll('.zincir li')];
  // aşama: 0 kiraz, 1 kurutma, 2-6 yeşil, 7 kavrum, 8 onay, 9 paket, 10 bardak
  const R = ['#8E9970', '#A3A574', '#8E9970', '#8E9970', '#8E9970', '#8E9970', '#93986F', '#8A5530', '#6A3F23', '#4E2E1B', '#3A2216'];
  const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
  const karis = (a, b, t) => { const x = hex(a), y = hex(b); return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(',')})`; };
  const sinir = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  let son = -1, bekle = false;
  const sahneyi = k => M.forEach((m, j) => { const on = j === k; m.classList.toggle('on', on); const v = m.querySelector('video');
    if (v) { if (on) { if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); } if (!az) v.play().catch(() => {}); } else v.pause(); }
    if (j === k + 1) { const nv = M[j].querySelector('video'); if (nv && nv.preload === 'none') { nv.preload = 'auto'; nv.load(); } } });
  function guncelle() {
    bekle = false;
    const vc = innerHeight * .55, C = L.map(li => { const r = li.getBoundingClientRect(); return r.top + r.height / 2; });
    let t;
    if (vc <= C[0]) t = 0; else if (vc >= C[n - 1]) t = n - 1;
    else { let i = 0; while (i < n - 2 && vc > C[i + 1]) i++; t = i + sinir((vc - C[i]) / (C[i + 1] - C[i])); }
    const k = Math.round(t);
    kiraz.style.opacity = 1 - sinir(t * 1.4); taneG.style.opacity = sinir(t * 1.4);
    const i = Math.min(R.length - 2, Math.floor(t)); renk.setAttribute('fill', karis(R[i], R[i + 1], t - i));
    tane.style.setProperty('--don', (-18 + t * 4) + 'deg');
    isaret.style.left = (sinir((t - 6) / (n - 1 - 6)) * 100) + '%';
    if (k !== son) {
      son = k; no.textContent = String(k + 1).padStart(2, '0'); ad.textContent = durum[k] || '';
      zin.forEach((z, j) => z.classList.toggle('on', j <= k)); L.forEach((li, j) => li.classList.toggle('etkin', j === k)); sahneyi(k);
    }
  }
  const iste = () => { if (!bekle) { bekle = true; requestAnimationFrame(guncelle); } };
  addEventListener('scroll', iste, { passive: true }); addEventListener('resize', iste); guncelle();
})();
/* Fason planlayıcı: seçimler → özet → form ya da WhatsApp */
(() => {
  const P = document.querySelector('.planlayici'); if (!P) return;
  const S = {}, ul = P.querySelector('.pl-ozet ul'), fa = P.querySelector('[data-pl-form]'), wa = P.querySelector('[data-pl-wa]');
  const gruplar = [...P.querySelectorAll('[data-pl]')];
  gruplar.forEach(g => g.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
    const ayni = S[g.dataset.pl] && S[g.dataset.pl].k === b.dataset.k;
    g.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', 'false'));
    if (ayni) delete S[g.dataset.pl]; else { S[g.dataset.pl] = { k: b.dataset.k, a: b.textContent.trim() }; b.setAttribute('aria-pressed', 'true'); }
    ciz();
  })));
  function ciz() {
    ul.innerHTML = '';
    const satir = [];
    gruplar.forEach(g => { const s = S[g.dataset.pl]; if (!s) return; const bas = g.previousElementSibling.textContent.trim(); satir.push(bas + ': ' + s.a);
      const li = document.createElement('li'), b = document.createElement('b'); b.textContent = bas; li.append(b, document.createTextNode(s.a)); ul.appendChild(li); });
    if (!satir.length) { const li = document.createElement('li'); li.textContent = P.dataset.bos; ul.appendChild(li); }
    const q = new URLSearchParams({ talep: 'fason' }); if (S.urun) q.set('urun', S.urun.k); if (S.miktar) q.set('miktar', S.miktar.a); if (satir.length) q.set('not', satir.join('\n'));
    fa.href = P.dataset.form + '?' + q.toString();
    if (wa) wa.href = 'https://wa.me/' + P.dataset.wa + '?text=' + encodeURIComponent(P.dataset.waBas + (satir.length ? '\n\n' + satir.join('\n') : ''));
  }
  ciz();
})();

/* Sahadan videoları: görünürken oynat */
(() => {
  const az = matchMedia('(prefers-reduced-motion: reduce)').matches; if (az) return;
  const io = new IntersectionObserver(es => es.forEach(e => { const v = e.target; if (e.isIntersecting) { if (v.preload !== 'auto') { v.preload = 'auto'; v.load(); } v.play().catch(() => {}); } else v.pause(); }), { threshold: .2 });
  document.querySelectorAll('.saha video, .hk-video video, .ziyaret video').forEach(v => { v.muted = true; io.observe(v); });
})();

/* Üretim · fason hizmet kartları: tıklanınca ayrıntı paneli */
(function(){
  var b=document.querySelector('.hz-b'); if(!b) return;
  document.documentElement.classList.add('hz-js');
  var kartlar=[].slice.call(b.querySelectorAll('.hz-k')), paneller=[].slice.call(b.querySelectorAll('.hz-p'));
  function ac(id,kaydir){
    var p=document.getElementById(id); if(!p) return;
    paneller.forEach(function(x){x.classList.toggle('acik',x===p); var v=x.querySelector('video'); if(v&&x!==p) v.pause();});
    kartlar.forEach(function(k){var a=k.getAttribute('data-hz')===id; k.classList.toggle('secili',a); k.setAttribute('aria-expanded',a?'true':'false');});
    var v=p.querySelector('video'); if(v){v.preload='auto'; var s=v.play(); if(s&&s.catch) s.catch(function(){});}
    if(kaydir) p.scrollIntoView({behavior:'smooth',block:'start'});
    if(history.replaceState) history.replaceState(null,'','#'+id);
  }
  kartlar.forEach(function(k){k.setAttribute('aria-expanded','false'); k.addEventListener('click',function(ev){ev.preventDefault(); ac(k.getAttribute('data-hz'),true);});});
  [].forEach.call(b.querySelectorAll('.hz-geri'),function(a){a.addEventListener('click',function(ev){ev.preventDefault(); b.scrollIntoView({behavior:'smooth',block:'start'});});});
  var h=location.hash.slice(1); if(h.indexOf('ur-')===0) setTimeout(function(){ac(h,true);},60);
})();
