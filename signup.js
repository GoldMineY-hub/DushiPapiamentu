/* Dushi Papiamentu: aanmeldboxen in blogartikelen (halverwege en onderaan) */
(function () {
  var ENDPOINT = 'https://dushi-papiamentu-cert.sahadataly.workers.dev';
  var LEZERS = 490; /* LEZERS: wordt dagelijks bijgewerkt */
  var PRIV = 'Gratis. Afmelden kan altijd. Lees onze <a href="/privacy">privacyverklaring</a>.';

  function done() {
    try { return localStorage.getItem('dp_signed_up') === '1'; } catch (e) { return false; }
  }

  /* A/B-test aanmeldblokken in blogs: a = oude tekst (eilandtip), b = cursus (zoals de homepage). Vaste keuze per bezoeker. */
  function abVariant() {
    var v = '';
    try { v = localStorage.getItem('dp_ab_blok') || ''; } catch (e) {}
    if (v !== 'a' && v !== 'b') { v = Math.random() < 0.5 ? 'a' : 'b'; try { localStorage.setItem('dp_ab_blok', v); } catch (e) {} }
    return v;
  }

  function box(kind) {
    var d = document.createElement('div');
    d.className = 'dsu dsu-' + kind;
    var ov = document.querySelector('[data-dsu-title]');
    var om = document.querySelector('[data-dsu-mid-title]');
    var testbaar = kind !== 'les' && !(om && kind === 'mid') && !(ov && !ov.hasAttribute('data-dsu-ab'));
    var ab = testbaar ? abVariant() : '';
    var nieuw = ab === 'b';
    if (kind === 'les') {
      d.className = 'dsu dsu-end dsu-les';
      d.innerHTML =
        '<div class="dsu-k">Bon trabou!</div>' +
        '<p class="dsu-t">Goed bezig! Blijf oefenen met elke dinsdagavond een eilandtip</p>' +
        '<p class="dsu-s">Zo blijft wat je leert hangen, ook tussen de lessen door:</p>' +
        '<ul><li>Elke dinsdagavond een echte eilandtip van Riley en Mirjela</li>' +
        '<li>Gratis woordenlijst met 250+ woorden en uitspraak</li>' +
        '<li>Uitspraak die je als Nederlander gewoon kunt voorlezen</li></ul>';
    } else if (nieuw && kind === 'mid') {
      var ow = document.querySelector('[data-dsu-onderwerp]');
      var w = ow ? ow.getAttribute('data-dsu-onderwerp') : '';
      d.innerHTML = w ?
        '<p class="dsu-t">&#127891; Nu weet je wat <em>' + w + '</em> betekent. Leer de rest in 12 gratis lessen</p>' +
        '<p class="dsu-s">Van twee locals van K&ograve;rsou. Je begint meteen met les 1, en krijgt er de woordenlijst en elke dinsdag een eilandtip bij.</p>' :
        '<p class="dsu-t">&#127891; Leer echt Papiamentu: start de gratis cursus</p>' +
        '<p class="dsu-s">12 korte lessen van twee locals van K&ograve;rsou. Je begint meteen met les 1, en krijgt er de woordenlijst en elke dinsdag een eilandtip bij.</p>';
    } else if (nieuw) {
      d.innerHTML =
        '<div class="dsu-k">Bon bini!</div>' +
        '<p class="dsu-t">Start vandaag nog, het is 100% gratis</p>' +
        '<p class="dsu-s">Vond je dit nuttig? Leer dan echt Papiamentu, in 12 korte lessen:</p>' +
        '<ul><li>Je begint meteen met les 1, zonder account</li>' +
        '<li>Gratis woordenlijst met 250+ woorden en uitspraak</li>' +
        '<li>Elke dinsdagavond een eilandtip van Riley en Mirjela</li></ul>';
    } else if (kind === 'mid') {
      d.innerHTML =
        '<p class="dsu-t">&#127965;&#65039; Elke dinsdagavond een eilandtip in je inbox?</p>' +
        '<p class="dsu-s">Taal, cultuur en tips van Riley en Mirjela, van K&ograve;rsou. Plus direct onze gratis woordenlijst.</p>';
    } else {
      d.innerHTML =
        '<div class="dsu-k">Bon bini!</div>' +
        '<p class="dsu-t">Leer Papiamentu met elke dinsdagavond een eilandtip</p>' +
        '<p class="dsu-s">Vond je dit artikel nuttig? Dan vind je dit ook leuk:</p>' +
        '<ul><li>Elke dinsdagavond een echte eilandtip van Riley en Mirjela</li>' +
        '<li>Gratis woordenlijst met 250+ woorden en uitspraak</li>' +
        '<li>Uitspraak die je als Nederlander gewoon kunt voorlezen</li></ul>';
    }
    if (!nieuw && kind !== 'les') {
      if (om && kind === 'mid') {
        d.querySelector('.dsu-t').innerHTML = om.getAttribute('data-dsu-mid-title');
        if (om.getAttribute('data-dsu-mid-sub')) d.querySelector('.dsu-s').innerHTML = om.getAttribute('data-dsu-mid-sub');
      } else if (ov) {
        d.querySelector('.dsu-t').innerHTML = ov.getAttribute('data-dsu-title');
        if (ov.getAttribute('data-dsu-sub')) d.querySelector('.dsu-s').innerHTML = ov.getAttribute('data-dsu-sub');
      }
    }
    if (nieuw) d.className += ' dsu-cursus';
    if (ab) d.setAttribute('data-ab', ab);
    d.innerHTML +=
      '<p class="dsu-n">&#127796; Al ruim <b>' + LEZERS + '</b> mensen krijgen onze eilandtips</p>' +
      '<form class="dsu-f" novalidate>' +
      '<input type="email" name="email" placeholder="Je e-mailadres" autocomplete="email" aria-label="E-mailadres" required>' +
      '<button type="submit">' + (nieuw ? 'Start gratis' : (kind === 'mid' ? 'Aanmelden' : 'Ja, stuur me de tips')) + '</button>' +
      '</form><div class="dsu-m" role="status"></div><p class="dsu-p">' + PRIV + '</p>' +
      (location.pathname.indexOf('/eilandtips') === 0 ? '' : '<p class="dsu-p dsu-vb">Benieuwd hoe een eilandtip eruitziet? <a href="/eilandtips/bij-antillianen-thuis">Lees een voorbeeld</a></p>');
    d.querySelector('form').addEventListener('submit', submit);
    return d;
  }


  function okAll() {
    var all = document.querySelectorAll('.dsu');
    for (var i = 0; i < all.length; i++) {
      all[i].classList.add('dsu-ok');
      all[i].querySelector('.dsu-m').textContent = 'Masha danki! Kijk in je inbox: je welkomstmail met de woordenlijst komt eraan.';
      var p = all[i].querySelector('.dsu-p'); if (p) p.style.display = 'none';
    }
  }

  function blokVan(f) {
    var c = (f.parentNode && f.parentNode.className) || '';
    if (c.indexOf('dsu-sheet') > -1) return 'menu';
    var ab = (f.parentNode && f.parentNode.getAttribute && f.parentNode.getAttribute('data-ab')) || '';
    var b = c.indexOf('dsu-les') > -1 ? 'les' : (c.indexOf('dsu-mid') > -1 ? 'mid' : 'eind');
    return ab ? b + '-' + ab : b;
  }

  /* Na het aanmelden: één optionele vraag. Het antwoord komt als EILAND bij het contact in Brevo. */
  var EIL = [['Curacao', 'Cura&ccedil;ao'], ['Aruba', 'Aruba'], ['Bonaire', 'Bonaire'], ['Geen plannen', 'Nog geen plannen']];
  function eilandVraag(boxEl, email) {
    if (!boxEl || boxEl.querySelector('.dsu-eil')) return;
    var donker = boxEl.className.indexOf('dsu-mid') === -1;
    var w = document.createElement('div');
    w.className = 'dsu-eil';
    w.style.cssText = 'margin-top:14px';
    var kn = 'display:inline-block;margin:4px;padding:10px 14px;border-radius:100px;font:700 14px/1 inherit;cursor:pointer;' +
      (donker ? 'background:rgba(255,255,255,.1);color:#fff;border:1px solid rgba(255,255,255,.35)' : 'background:#fff;color:#005A7D;border:1px solid #B5D4F4');
    var h = '<p style="font-size:15px;font-weight:700;margin:0 0 8px;' + (donker ? 'color:#fff' : 'color:#1A2332') + '">Nog &eacute;&eacute;n klik (mag je overslaan): naar welk eiland ga jij?</p><div>';
    for (var i = 0; i < EIL.length; i++) h += '<button type="button" data-e="' + EIL[i][0] + '" style="' + kn + '">' + EIL[i][1] + '</button>';
    w.innerHTML = h + '</div>';
    w.addEventListener('click', function (ev) {
      var b = ev.target.closest ? ev.target.closest('button[data-e]') : null;
      if (!b) return;
      try {
        fetch(ENDPOINT, { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, source: 'eiland', eiland: b.getAttribute('data-e') }) });
      } catch (e) {}
      w.innerHTML = '<p style="font-size:14px;margin:0;' + (donker ? 'color:rgba(255,255,255,.9)' : 'color:#005A7D') + '">Top, dank je! Dan houden we daar rekening mee in je eilandtips.</p>';
    });
    boxEl.appendChild(w);
  }

  /* Blog (mid/eind/menu): net als de homepage na aanmelden door naar les 1 */
  function naarLes(f) {
    if (!f.parentNode || f.parentNode.className.indexOf('dsu-cursus') === -1) return false;
    var m = f.parentNode.querySelector('.dsu-m');
    if (m) m.innerHTML = 'Masha danki! Je woordenlijst komt naar je inbox. <a href="/lessen/lesson-1-bon-bini">Les 1 wordt geopend&hellip;</a>';
    setTimeout(function () { location.href = '/lessen/lesson-1-bon-bini'; }, 1800);
    return true;
  }

  function submit(ev) {
    ev.preventDefault();
    var f = ev.target, b = f.querySelector('button'), m = f.parentNode.querySelector('.dsu-m');
    var email = f.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { m.textContent = 'Vul een geldig e-mailadres in.'; return; }
    b.disabled = true; m.textContent = 'Even geduld...';
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ naam: '', email: email, source: 'signup', page: location.pathname, blok: blokVan(f) })
    }).then(function (r) { return r.json(); }).then(function (data) {
      if (data && data.ok === false) {
        b.disabled = false;
        m.textContent = data.error || 'Dat lukte even niet. Probeer het zo nog eens.';
        return;
      }
      try { localStorage.setItem('dp_signed_up', '1'); } catch (e) {}
      okAll();
      if (naarLes(f)) return;
      eilandVraag(f.parentNode, email);
    }).catch(function () {
      // Zelfde gedrag als het formulier op de homepage: antwoord niet leesbaar, aanmelding is meestal wel verstuurd
      okAll();
      if (naarLes(f)) return;
      eilandVraag(f.parentNode, email);
    });
  }


  /* Deelknoppen onder blogartikelen: gewone links, geen externe scripts of cookies */
  function share() {
    if (document.querySelector('[data-dsu]')) return;
    var art = document.querySelector('article');
    if (!art || document.querySelector('.ldl-sh')) return;
    var canon = document.querySelector('link[rel=canonical]');
    var url = canon ? canon.href : location.href.split('#')[0];
    var h1 = document.querySelector('h1');
    var title = h1 ? h1.textContent.trim() : document.title;
    var img = art.querySelector('img[src*="/images/"]');
    var og = document.querySelector('meta[property="og:image"]');
    var media = img ? img.src : (og ? og.content : '');
    var e = encodeURIComponent;
    var ic = {
      wa: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2-.2-.2-.5-.3z"/></svg>',
      fb: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M14 8V6c0-.9.6-1 1-1h2.5V1.1L14 1C10.4 1 9.6 3.7 9.6 5.4V8H7v4h2.6v11H14V12h3.1l.4-4H14z"/></svg>',
      pi: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 1a11 11 0 0 0-4 21.2c-.1-.9-.2-2.3 0-3.3l1.4-5.8s-.4-.7-.4-1.7c0-1.6 1-2.8 2.1-2.8 1 0 1.5.8 1.5 1.7 0 1-.7 2.5-1 3.9-.3 1.2.6 2.1 1.7 2.1 2.1 0 3.7-2.2 3.7-5.4 0-2.8-2-4.8-4.9-4.8-3.3 0-5.3 2.5-5.3 5.1 0 1 .4 2.1.9 2.7.1.1.1.2.1.3l-.3 1.4c-.1.2-.2.3-.4.2-1.5-.7-2.4-2.9-2.4-4.6 0-3.8 2.7-7.2 7.9-7.2 4.1 0 7.3 2.9 7.3 6.9 0 4.1-2.6 7.4-6.2 7.4-1.2 0-2.4-.6-2.7-1.4l-.8 2.8c-.3 1-1 2.3-1.5 3.1A11 11 0 1 0 12 1z"/></svg>',
      cp: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>'
    };
    var d = document.createElement('div');
    d.className = 'ldl-sh';
    d.innerHTML = '<p class="ldl-sh-t">Ken je iemand die dit leuk vindt? Deel het artikel</p><div class="ldl-sh-b">' +
      '<a class="ldl-wa" target="_blank" rel="noopener" href="https://wa.me/?text=' + e(title + ' ' + url) + '">' + ic.wa + 'WhatsApp</a>' +
      '<a class="ldl-fb" target="_blank" rel="noopener" href="https://www.facebook.com/sharer/sharer.php?u=' + e(url) + '">' + ic.fb + 'Facebook</a>' +
      '<a class="ldl-pi" target="_blank" rel="noopener" href="https://pinterest.com/pin/create/button/?url=' + e(url) + (media ? '&media=' + e(media) : '') + '&description=' + e(title) + '">' + ic.pi + 'Pinterest</a>' +
      '<button type="button" class="ldl-cp">' + ic.cp + '<span>Link kopi&euml;ren</span></button></div>';
    d.querySelector('.ldl-cp').addEventListener('click', function () {
      var s = this.querySelector('span');
      function ok() { s.textContent = 'Gekopieerd!'; setTimeout(function () { s.innerHTML = 'Link kopi&euml;ren'; }, 2000); }
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(ok, function () { prompt('Kopieer de link:', url); });
      else prompt('Kopieer de link:', url);
    });
    var back = null, links = art.querySelectorAll('a[href="/blog/"]');
    for (var i = 0; i < links.length; i++) { if (/Terug/.test(links[i].textContent)) { back = links[i].parentNode; break; } }
    if (back && back.parentNode) back.parentNode.insertBefore(d, back); else art.appendChild(d);
  }

  /* Mobiel: "Start gratis" in het menu van een blog opent eerst een kleine tussenstap */
  var LES1 = '/lessen/lesson-1-bon-bini';
  function openSheet() {
    var bg = document.getElementById('dsu-sh-bg');
    if (bg) { bg.style.display = 'block'; document.getElementById('dsu-sh').style.display = 'block'; return; }
    var st = document.createElement('style');
    st.textContent = '#dsu-sh-bg{position:fixed;inset:0;background:rgba(15,23,42,.55);z-index:300}' +
      '#dsu-sh{position:fixed;left:0;right:0;bottom:0;z-index:301;margin:0;border-radius:20px 20px 0 0;padding:10px 20px 24px;background:#fff;border:0;box-shadow:0 -8px 30px rgba(0,0,0,.2);max-height:90vh;overflow:auto}' +
      '#dsu-sh .dsu-h{width:40px;height:4px;border-radius:4px;background:#CBD5E1;margin:0 auto 14px}' +
      '#dsu-sh .dsu-x{position:absolute;right:14px;top:12px;width:32px;height:32px;border-radius:50%;border:0;background:#F1F5F9;font-size:20px;line-height:1;color:#5C6B7A;cursor:pointer}' +
      '#dsu-sh .dsu-k2{display:inline-block;background:#FDF3E3;color:#B45309;font-size:11px;font-weight:700;letter-spacing:1.5px;border-radius:100px;padding:4px 12px;margin-bottom:10px}' +
      '#dsu-sh .dsu-t{font-family:"Playfair Display",Georgia,serif;font-size:22px;font-weight:700;color:#1A2332;line-height:1.25;margin:0 0 6px}' +
      '#dsu-sh .dsu-s{font-size:14px;color:#5C6B7A;line-height:1.5;margin:0 0 14px}' +
      '#dsu-sh .dsu-or{display:flex;align-items:center;gap:10px;color:#94A3B8;font-size:12px;margin:14px 0 12px}' +
      '#dsu-sh .dsu-or:before,#dsu-sh .dsu-or:after{content:"";flex:1;height:1px;background:#E2E8F0}' +
      '#dsu-sh .dsu-f button{background:#F4A236;color:#1A2332}' +
      '#dsu-sh .dsu-l1{display:block;text-align:center;border:2px solid #0077A8;color:#0077A8;border-radius:10px;padding:12px;font-size:15px;font-weight:700;text-decoration:none}';
    document.head.appendChild(st);
    bg = document.createElement('div'); bg.id = 'dsu-sh-bg';
    var d = document.createElement('div');
    d.id = 'dsu-sh'; d.className = 'dsu dsu-mid dsu-sheet dsu-cursus';
    d.setAttribute('role', 'dialog'); d.setAttribute('aria-modal', 'true'); d.setAttribute('aria-label', 'Gratis beginnen');
    d.innerHTML = '<div class="dsu-h"></div><button type="button" class="dsu-x" aria-label="Sluiten">&times;</button>' +
      '<div class="dsu-k2">GRATIS</div><p class="dsu-t">Begin met je gratis woordenlijst</p>' +
      '<p class="dsu-s">250+ woorden en zinnen met uitspraak, direct in je inbox. Plus elke dinsdagavond een eilandtip van Riley en Mirjela.</p>' +
      '<form class="dsu-f" novalidate><input type="email" name="email" placeholder="Je e-mailadres" autocomplete="email" aria-label="E-mailadres" required>' +
      '<button type="submit">Stuur me de woordenlijst</button></form><div class="dsu-m" role="status"></div><p class="dsu-p">' + PRIV + '</p>' +
      '<p class="dsu-p dsu-vb">Benieuwd hoe een eilandtip eruitziet? <a href="/eilandtips/bij-antillianen-thuis">Lees een voorbeeld</a></p>' +
      '<div class="dsu-or">of</div><a class="dsu-l1" href="' + LES1 + '">Liever meteen beginnen &rarr; naar les 1</a>';
    d.querySelector('form').addEventListener('submit', submit);
    function close() { bg.style.display = 'none'; d.style.display = 'none'; }
    bg.addEventListener('click', close);
    d.querySelector('.dsu-x').addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    document.body.appendChild(bg); document.body.appendChild(d);
  }
  function sheetHook() {
    if (location.pathname.indexOf('/blog/') !== 0) return;
    var cta = document.querySelector('.dpn-cta');
    if (!cta) return;
    cta.addEventListener('click', function (e) {
      if (done() || !window.matchMedia || !window.matchMedia('(max-width: 600px)').matches) return;
      e.preventDefault(); openSheet();
    });
  }

  function init() {
    sheetHook();
    share();
    if (done()) return;
    var slots = document.querySelectorAll('[data-dsu]');
    if (slots.length) { for (var s = 0; s < slots.length; s++) { var bx = box(slots[s].getAttribute('data-dsu') || 'end'), sub = slots[s].getAttribute('data-sub'), se = bx.querySelector('.dsu-s'); if (sub && se) se.textContent = sub; slots[s].appendChild(bx); } return; }
    var lesMain = document.querySelector('.ly > main');
    if (lesMain) { lesMain.appendChild(box('les')); return; }
    var art = document.querySelector('article');
    if (!art) return;
    var back = null, links = art.querySelectorAll('a[href="/blog/"]');
    for (var i = 0; i < links.length; i++) { if (/Terug/.test(links[i].textContent)) { back = links[i].parentNode; break; } }

    // Halverwege: voor de 3e tussenkop (of 2e als er weinig zijn)
    var heads = art.querySelectorAll('h2');
    if (heads.length < 3) heads = art.querySelectorAll('h3');
    var anchor = heads.length >= 3 ? heads[2] : (heads.length === 2 ? heads[1] : null);
    var midId = art.getAttribute('data-dsu-mid');
    if (midId && document.getElementById(midId)) anchor = document.getElementById(midId);
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(box('mid'), anchor);

    // Onderaan: boven de knop "Terug naar alle artikelen"
    var sh = art.querySelector('.ldl-sh');
    if (sh) sh.parentNode.insertBefore(box('end'), sh);
    else if (back && back.parentNode) back.parentNode.insertBefore(box('end'), back);
    else art.appendChild(box('end'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
