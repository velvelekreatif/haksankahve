/* Haksan · numune / teklif formu → firmanın e-postasına gider (FormSubmit). */
(() => {
  const f = document.getElementById('talep'); if (!f) return;
  const EPOSTA = f.dataset.eposta, EN = document.documentElement.lang === 'en';
  const S = { talep: [], urun: [], isletme: '' };
  const $ = s => f.querySelector(s), $$ = s => [...f.querySelectorAll(s)];
  const v = id => (($('#' + id) || {}).value || '').trim();
  $$('[data-sec]').forEach(grup => {
    const ad = grup.dataset.sec, coklu = grup.hasAttribute('data-coklu');
    grup.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
      const d = b.textContent.trim();
      if (coklu) { const i = S[ad].indexOf(d); i < 0 ? S[ad].push(d) : S[ad].splice(i, 1); b.setAttribute('aria-pressed', i < 0); }
      else { S[ad] = d; grup.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b)); }
      ozet();
    }));
  });
  // Bağlantıdan gelen ön seçim: ?talep=numune / ?urun=turk-kahvesi
  const q = new URLSearchParams(location.search);
  const on = (ad, anahtar) => { const b = f.querySelector(`[data-sec="${ad}"] [data-k="${anahtar}"]`); if (b) b.click(); };
  if (q.get('talep')) on('talep', q.get('talep')); if (q.get('urun')) on('urun', q.get('urun'));
  if (q.get('miktar') && $('#miktar')) $('#miktar').value = q.get('miktar'); if (q.get('not') && $('#not')) $('#not').value = q.get('not');
  f.addEventListener('input', ozet);
  function ozet() {
    const L = [];
    if (S.talep.length) L.push((EN ? 'Request: ' : 'Talep: ') + S.talep.join(', '));
    if (S.urun.length) L.push((EN ? 'Interest: ' : 'İlgi: ') + S.urun.join(', '));
    if (S.isletme) L.push((EN ? 'Business: ' : 'İşletme: ') + S.isletme);
    if (v('miktar')) L.push((EN ? 'Monthly volume: ' : 'Aylık miktar: ') + v('miktar'));
    if (v('ad')) L.push(v('ad') + (v('firma') ? ' · ' + v('firma') : ''));
    const u = document.getElementById('ozet-liste');
    u.innerHTML = ''; (L.length ? L : [EN ? 'Your choices will appear here.' : 'Seçimleriniz burada görünecek.']).forEach(t => { const li = document.createElement('li'); li.textContent = t; u.appendChild(li); });
  }
  ozet();
  f.addEventListener('submit', e => {
    e.preventDefault();
    const h = document.getElementById('hata'); h.textContent = '';
    if (!S.talep.length) { h.textContent = EN ? 'Please choose what you need.' : 'Lütfen ne istediğini seç.'; return; }
    if (!v('ad') || !v('telefon') || !/^\S+@\S+\.\S+$/.test(v('eposta'))) { h.textContent = EN ? 'Name, phone and a valid e-mail are required.' : 'Ad, telefon ve geçerli bir e-posta gerekli.'; return; }
    if (!$('#kvkk').checked) { h.textContent = EN ? 'Please accept the privacy notice.' : 'Lütfen aydınlatma metnini onayla.'; return; }
    const gf = document.createElement('form'); gf.method = 'POST'; gf.action = 'https://formsubmit.co/' + EPOSTA; gf.hidden = true;
    const ek = (n, d) => { const i = document.createElement('input'); i.type = 'hidden'; i.name = n; i.value = d; gf.appendChild(i); };
    ek('_subject', (EN ? 'Website request: ' : 'Siteden talep: ') + S.talep.join(', ') + ' · ' + v('ad'));
    ek('_template', 'table'); ek('_captcha', 'false');
    ek('_next', new URL(EN ? '/en/thank-you/' : '/tesekkurler/', location.href).href);
    ek('Talep', S.talep.join(', ')); ek('Ürün ilgisi', S.urun.join(', ')); ek('İşletme türü', S.isletme);
    ek('Aylık miktar', v('miktar')); ek('Ad soyad', v('ad')); ek('Firma', v('firma')); ek('Şehir', v('sehir'));
    ek('Telefon', v('telefon')); ek('E-posta', v('eposta')); ek('_replyto', v('eposta')); ek('Not', v('not')); ek('Dil', EN ? 'EN' : 'TR');
    document.body.appendChild(gf); gf.submit();
  });
})();
