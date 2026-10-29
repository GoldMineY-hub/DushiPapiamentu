/* Dushi Papiamentu: aanmeldboxen in blogartikelen (halverwege en onderaan) */
(function () {
  var ENDPOINT = 'https://dushi-papiamentu-cert.sahadataly.workers.dev';
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

  function init() {
    var art = document.querySelector('article');
    if (!art || done()) return;
    var back = null, links = art.querySelectorAll('a[href="/blog/"]');
    for (var i = 0; i < links.length; i++) { if (/Terug/.test(links[i].textContent)) { back = links[i].parentNode; break; } }

    // Halverwege: voor de 3e tussenkop (of 2e als er weinig zijn)
    var heads = art.querySelectorAll('h2');
    if (heads.length < 3) heads = art.querySelectorAll('h3');
    var anchor = heads.length >= 3 ? heads[2] : (heads.length === 2 ? heads[1] : null);
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(box('mid'), anchor);

    // Onderaan: boven de knop "Terug naar alle artikelen"
    if (back && back.parentNode) back.parentNode.insertBefore(box('end'), back);
    else art.appendChild(box('end'));
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
