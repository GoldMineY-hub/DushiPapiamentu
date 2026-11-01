/* Dushi Papiamentu: voortgang in de cursus.
   Alles staat alleen in de browser van de bezoeker (localStorage), er gaat niets naar een server.
   Opslag: dp_progress = {"done":[1,2],"q":{"2":80},"last":3} */
(function () {
  var KEY = 'dp_progress', TOTAL = 12;
  var SLUGS = ['', 'lesson-1-bon-bini', 'lesson-2-numbernan-kolornan', 'lesson-3-na-playa', 'lesson-4-kuminda-dushi',
    'lesson-5-famia', 'lesson-6-den-siudat', 'lesson-7-tempo-liber', 'lesson-8-trabou', 'lesson-9-salu',
    'lesson-10-kultura-di-korsou', 'lesson-11-expresashonnan', 'lesson-12-konversashon-final'];

  function valid(n) { n = parseInt(n, 10); return n >= 1 && n <= TOTAL ? n : 0; }

  function load() {
    var p = { done: [], q: {}, last: 0 };
    try {
      var r = JSON.parse(localStorage.getItem(KEY) || '{}');
      if (r && Array.isArray(r.done)) p.done = r.done.map(valid).filter(Boolean);
      if (r && r.q && typeof r.q === 'object') {
        for (var k in r.q) { var n = valid(k), s = parseInt(r.q[k], 10); if (n && s >= 0 && s <= 100) p.q[n] = s; }
      }
      p.last = valid(r && r.last);
    } catch (e) {}
    return p;
  }
  function save(p) {
    p.done = p.done.filter(function (n, i, a) { return a.indexOf(n) === i; }).sort(function (a, b) { return a - b; });
    try { localStorage.setItem(KEY, JSON.stringify(p)); return true; } catch (e) { return false; }
  }
  function nextLesson(p) {
    /* Eerst de les waar je mee bezig was, dan de eerstvolgende open les daarna, anders de eerste open les. */
    if (p.last && p.done.indexOf(p.last) < 0) return p.last;
    for (var j = (p.last || 0) + 1; j <= TOTAL; j++) if (p.done.indexOf(j) < 0) return j;
    for (var i = 1; i <= TOTAL; i++) if (p.done.indexOf(i) < 0) return i;
    return 0;
  }
  function shareUrl(p) {
    return 'https://dushipapiamentu.nl/?voortgang=' + p.done.join('.') + '#lessen';
  }

  /* ---------- Stijl ---------- */
  var css = '.dpv{background:#fff;border:1px solid #E2E8F0;border-radius:16px;padding:18px 20px;margin:0 0 18px;font-family:inherit;color:#1A2332}' +
    '.dpv-top{display:flex;justify-content:space-between;align-items:baseline;gap:10px;flex-wrap:wrap;margin-bottom:10px}' +
    '.dpv-t{font-weight:700;font-size:15px}.dpv-n{font-size:13px;color:#5C6B7A}' +
    '.dpv-bar{height:10px;background:#E6F1FB;border-radius:99px;overflow:hidden}' +
    '.dpv-fill{height:100%;background:linear-gradient(90deg,#0F6E56,#0D9488);border-radius:99px;transition:width .4s}' +
    '.dpv-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:14px}' +
    '.dpv-go{display:inline-block;background:#0077A8;color:#fff!important;text-decoration:none;font-weight:700;font-size:14px;padding:11px 20px;border-radius:12px}' +
    '.dpv-sh{background:none;border:none;color:#0077A8;font-size:13px;font-weight:600;cursor:pointer;padding:6px 2px;text-decoration:underline;font-family:inherit}' +
    '.dpv-msg{font-size:12px;color:#0F6E56;font-weight:600}' +
    '.dpv-cpl{margin-top:16px;font-size:13px;color:rgba(255,255,255,.85)}.dpv-cpl .dpv-sh{font-size:13px;color:#7DD3FC}.dpv-cpl .dpv-msg{color:#A7F3D0}' +
    '.dpv-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#0F6E56;color:#fff;padding:12px 18px;border-radius:12px;font-size:14px;font-weight:600;z-index:9999;box-shadow:0 6px 24px rgba(0,0,0,.18);max-width:calc(100% - 32px);text-align:center}';
  function addCss() { var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s); }

  function toast(t) {
    var d = document.createElement('div'); d.className = 'dpv-toast'; d.setAttribute('role', 'status'); d.textContent = t;
    document.body.appendChild(d); setTimeout(function () { if (d.parentNode) d.parentNode.removeChild(d); }, 4500);
  }

  function shareButton(p, msgEl) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'dpv-sh';
    b.textContent = 'Verder op een ander apparaat? Deel je voortgangslink';
    b.onclick = function () {
      var url = shareUrl(load());
      var done = function () { if (msgEl) msgEl.textContent = 'Link gekopieerd. Open hem op je telefoon of laptop.'; };
      if (navigator.share) {
        navigator.share({ title: 'Mijn voortgang Dushi Papiamentu', text: 'Mijn voortgang in de Papiamentu cursus:', url: url }).catch(function () {});
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(done, function () { window.prompt('Kopieer deze link:', url); });
      } else { window.prompt('Kopieer deze link:', url); }
    };
    return b;
  }

  /* ---------- Voortgangslink ontvangen ---------- */
  function importFromUrl() {
    var m = location.search.match(/[?&]voortgang=([0-9.]*)/);
    if (!m) return;
    var p = load(), before = p.done.length;
    m[1].split('.').map(valid).filter(Boolean).forEach(function (n) { if (p.done.indexOf(n) < 0) p.done.push(n); });
    var ok = save(p);
    try { history.replaceState(null, '', location.pathname + location.hash); } catch (e) {}
    var added = p.done.length - before;
    if (!ok) toast('Je browser staat opslaan niet toe, dus je voortgang kon niet worden bewaard.');
    else if (added > 0) toast('Voortgang overgezet: ' + p.done.length + ' van ' + TOTAL + ' lessen klaar.');
    else toast('Je voortgang was al bijgewerkt.');
  }

  /* ---------- Lespagina ---------- */
  function lessonPage(n) {
    var p = load(); p.last = n; save(p);

    function markDone() {
      var p = load();
      if (p.done.indexOf(n) < 0) { p.done.push(n); save(p); }
      updateCpl();
    }
    if (typeof window.rq === 'function') {
      var orig = window.rq;
      window.rq = function () {
        var r = orig.apply(this, arguments);
        try {
          if (window.Q && window.qi >= window.Q.length && window.Q.length) {
            var pct = Math.round(window.qs / window.Q.length * 100), p = load();
            if (!(p.q[n] >= pct)) p.q[n] = pct;
            save(p); markDone();
          }
        } catch (e) {}
        return r;
      };
    }
    if (typeof window.chkF === 'function') {
      var origF = window.chkF;
      window.chkF = function () { var r = origF.apply(this, arguments); markDone(); return r; };
    }

    var box = null;
    function updateCpl() {
      var cpl = document.querySelector('.cpl'); if (!cpl) return;
      var p = load(); if (p.done.indexOf(n) < 0) return;
      if (!box) {
        box = document.createElement('div'); box.className = 'dpv-cpl';
        cpl.appendChild(box);
      }
      box.innerHTML = '';
      var t = document.createElement('div');
      t.textContent = 'Opgeslagen: je hebt nu ' + p.done.length + ' van ' + TOTAL + ' lessen klaar.';
      var msg = document.createElement('div'); msg.className = 'dpv-msg';
      box.appendChild(t); box.appendChild(shareButton(p, msg)); box.appendChild(msg);
    }
    updateCpl();
  }

  /* ---------- Homepage ---------- */
  function homePage() {
    var p = load();
    var items = document.querySelectorAll('#lessen .lesson-item');
    for (var i = 0; i < items.length; i++) {
      var a = items[i].querySelector('a'), num = items[i].querySelector('.li-num');
      if (!a || !num) continue;
      var mm = (a.getAttribute('href') || '').match(/lesson-(\d+)-/); if (!mm) continue;
      var n = valid(mm[1]);
      if (p.done.indexOf(n) >= 0) {
        num.className = 'li-num done'; num.textContent = '✓';
        num.setAttribute('aria-label', 'Les ' + n + ' afgerond');
      } else { num.className = 'li-num next'; num.textContent = n; num.removeAttribute('aria-label'); }
    }
    if (!p.done.length && !p.last) return;

    var nx = nextLesson(p), cnt = p.done.length;
    var target = nx ? nx : 12;
    var box = document.createElement('div'); box.className = 'dpv';
    var top = document.createElement('div'); top.className = 'dpv-top';
    var tt = document.createElement('div'); tt.className = 'dpv-t';
    tt.textContent = cnt >= TOTAL ? 'Pabien! Je hebt alle lessen afgerond' : 'Jouw voortgang';
    var tn = document.createElement('div'); tn.className = 'dpv-n'; tn.textContent = cnt + ' van ' + TOTAL + ' lessen klaar';
    top.appendChild(tt); top.appendChild(tn);
    var bar = document.createElement('div'); bar.className = 'dpv-bar';
    bar.setAttribute('role', 'progressbar'); bar.setAttribute('aria-valuemin', '0');
    bar.setAttribute('aria-valuemax', String(TOTAL)); bar.setAttribute('aria-valuenow', String(cnt));
    var fill = document.createElement('div'); fill.className = 'dpv-fill'; fill.style.width = Math.round(cnt / TOTAL * 100) + '%';
    bar.appendChild(fill);
    var row = document.createElement('div'); row.className = 'dpv-row';
    var go = document.createElement('a'); go.className = 'dpv-go'; go.href = 'lessen/' + SLUGS[target];
    go.textContent = nx ? 'Verder met Les ' + nx + ' →' : 'Bekijk Les 12 en je certificaat →';
    row.appendChild(go);
    var msg = document.createElement('div'); msg.className = 'dpv-msg';
    if (cnt) row.appendChild(shareButton(p, msg));
    box.appendChild(top); box.appendChild(bar); box.appendChild(row); box.appendChild(msg);

    var track = document.querySelector('#lessen .lessons-track');
    if (track && track.parentNode) track.parentNode.insertBefore(box, track);

    var hero = document.querySelector('.hero-cta');
    if (hero && nx) { hero.textContent = 'Verder met Les ' + nx; hero.setAttribute('href', 'lessen/' + SLUGS[nx]); }
  }

  function init() {
    addCss();
    importFromUrl();
    var m = location.pathname.match(/\/lessen\/lesson-(\d+)-/);
    if (m && valid(m[1])) lessonPage(valid(m[1]));
    else if (document.getElementById('lessen')) homePage();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
