/* Dushi Papiamentu: aanmeldboxen in blogartikelen (halverwege en onderaan) */
(function () {
  var ENDPOINT = 'https://dushi-papiamentu-cert.sahadataly.workers.dev';
  var LEZERS = 380; /* LEZERS: wordt dagelijks bijgewerkt */
  var PRIV = 'Gratis. Afmelden kan altijd. Lees onze <a href="/privacy">privacyverklaring</a>.';

  function done() {
    try { return localStorage.getItem('dp_signed_up') === '1'; } catch (e) { return false; }
  }

  function box(kind) {
    var d = document.createElement('div');
    d.className = 'dsu dsu-' + kind;
    if (kind === 'mid') {
      d.innerHTML =
        '<p class="dsu-t">&#127965;&#65039; Elke week een eilandtip in je inbox?</p>' +
        '<p class="dsu-s">Taal, cultuur en tips van native speakers van K&ograve;rsou. Plus direct onze gratis woordenlijst.</p>';
    } else if (kind === 'les') {
      d.className = 'dsu dsu-end dsu-les';
      d.innerHTML =
        '<div class="dsu-k">Bon trabou!</div>' +
        '<p class="dsu-t">Goed bezig! Blijf oefenen met een eilandtip per week</p>' +
        '<p class="dsu-s">Zo blijft wat je leert hangen, ook tussen de lessen door:</p>' +
        '<ul><li>Elke week een echte eilandtip van native speakers</li>' +
        '<li>Gratis woordenlijst met 100 woorden en uitspraak</li>' +
        '<li>Uitspraak die je als Nederlander gewoon kunt voorlezen</li></ul>';
    } else {
      d.innerHTML =
        '<div class="dsu-k">Bon bini!</div>' +
        '<p class="dsu-t">Leer Papiamentu met een eilandtip per week</p>' +
        '<p class="dsu-s">Vond je dit artikel nuttig? Dan vind je dit ook leuk:</p>' +
        '<ul><li>Elke week een echte eilandtip van native speakers</li>' +
        '<li>Gratis woordenlijst met 100 woorden en uitspraak</li>' +
        '<li>Uitspraak die je als Nederlander gewoon kunt voorlezen</li></ul>';
    }
    d.innerHTML +=
      '<p class="dsu-n">&#127796; Al ruim <b>' + LEZERS + '</b> mensen krijgen onze eilandtips</p>' +
      '<form class="dsu-f" novalidate>' +
      '<input type="email" name="email" placeholder="Je e-mailadres" autocomplete="email" aria-label="E-mailadres" required>' +
      '<button type="submit">' + (kind === 'mid' ? 'Aanmelden' : 'Ja, stuur me de tips') + '</button>' +
      '</form><div class="dsu-m" role="status"></div><p class="dsu-p">' + PRIV + '</p>';
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

  function submit(ev) {
    ev.preventDefault();
    var f = ev.target, b = f.querySelector('button'), m = f.parentNode.querySelector('.dsu-m');
    var email = f.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { m.textContent = 'Vul een geldig e-mailadres in.'; return; }
    b.disabled = true; m.textContent = 'Even geduld...';
    fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ naam: '', email: email, source: 'signup' })
    }).then(function (r) { return r.json(); }).then(function (data) {
      if (data && data.ok === false) {
        b.disabled = false;
        m.textContent = data.error || 'Dat lukte even niet. Probeer het zo nog eens.';
        return;
      }
      try { localStorage.setItem('dp_signed_up', '1'); } catch (e) {}
      okAll();
    }).catch(function () {
      // Zelfde gedrag als het formulier op de homepage: antwoord niet leesbaar, aanmelding is meestal wel verstuurd
      okAll();
    });
  }


  /* Deelknoppen onder blogartikelen: gewone links, geen externe scripts of cookies */
  function share() {
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

  function init() {
    share();
    if (done()) return;
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
