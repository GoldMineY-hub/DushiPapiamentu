/* Dushi Papiamentu: live klok voor Curaçao, Aruba en Bonaire.
   De eilanden hebben het hele jaar AST (UTC-4), zonder zomertijd. Nederland: Europe/Amsterdam. */
(function () {
  var box = document.getElementById('tk'); if (!box) return;
  var LAT = parseFloat(box.getAttribute('data-lat')), LON = parseFloat(box.getAttribute('data-lon'));
  var NAAM = box.getAttribute('data-naam');
  var $ = function (id) { return document.getElementById(id); };
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* Tijd op het eiland: UTC min 4 uur */
  function eiland(now) { return new Date(now.getTime() - 4 * 3600000); } /* lees met getUTC* */
  /* Nederlandse tijd via Intl (houdt rekening met zomer- en wintertijd) */
  function nlDelen(now) {
    try {
      var f = new Intl.DateTimeFormat('nl-NL', { timeZone: 'Europe/Amsterdam', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, year: 'numeric', month: '2-digit', day: '2-digit' });
      var o = {}; f.formatToParts(now).forEach(function (p) { o[p.type] = p.value; });
      return { h: +o.hour % 24, m: +o.minute, s: +o.second, y: +o.year, mo: +o.month, d: +o.day };
    } catch (e) { var l = new Date(); return { h: l.getHours(), m: l.getMinutes(), s: l.getSeconds() }; }
  }
  function verschil(now) {
    var nl = nlDelen(now), e = eiland(now);
    var a = Date.UTC(nl.y, nl.mo - 1, nl.d, nl.h, nl.m), b = Date.UTC(e.getUTCFullYear(), e.getUTCMonth(), e.getUTCDate(), e.getUTCHours(), e.getUTCMinutes());
    return Math.round((a - b) / 3600000);
  }

  /* Zonsopkomst en -ondergang (NOAA-benadering), resultaat in eilandtijd (UTC-4) */
  function zon(date, rise) {
    var rad = Math.PI / 180, start = Date.UTC(date.getUTCFullYear(), 0, 0);
    var N = Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - start) / 86400000);
    var g = 2 * Math.PI / 365 * (N - 1);
    var eqt = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    var decl = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
    var ha = Math.acos(Math.cos(90.833 * rad) / (Math.cos(LAT * rad) * Math.cos(decl)) - Math.tan(LAT * rad) * Math.tan(decl)) / rad;
    var minUTC = 720 - 4 * (LON + (rise ? ha : -ha)) - eqt;
    var minLocal = (minUTC - 240 + 1440) % 1440;
    var mm = Math.round(minLocal) % 1440;
    return Math.floor(mm / 60) + ':' + pad(mm % 60);
  }

  function dagdeel(h) {
    if (h >= 6 && h < 12) return { groet: 'Bon dia', u: 'bon DIE-ja', nl: 'goedemorgen', deel: 'ochtend' };
    if (h >= 12 && h < 18) return { groet: 'Bon tardi', u: 'bon TAR-die', nl: 'goedemiddag', deel: 'middag' };
    return { groet: 'Bon nochi', u: 'bon NO-tsjie', nl: 'goedenavond', deel: h >= 18 ? 'avond' : 'nacht' };
  }
  function belAdvies(h) {
    if (h >= 23 || h < 7) return { k: 'rood', t: 'Liever niet bellen: het is nacht op ' + NAAM + '.' };
    if (h < 9) return { k: 'oranje', t: 'Nog vroeg op ' + NAAM + '. Wacht liever nog even met bellen.' };
    if (h >= 22) return { k: 'oranje', t: 'Het wordt laat op ' + NAAM + '. Na 23:00 bel je niet meer.' };
    return { k: 'groen', t: 'Goed moment om te bellen.' };
  }

  var DAGEN = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
  var MAAND = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
  var lastMin = -1;
  function tick() {
    var now = new Date(), e = eiland(now), nl = nlDelen(now);
    var h = e.getUTCHours(), m = e.getUTCMinutes(), s = e.getUTCSeconds();
    $('tk-tijd').textContent = pad(h) + ':' + pad(m);
    $('tk-sec').textContent = ':' + pad(s);
    $('tk-nl').textContent = pad(nl.h) + ':' + pad(nl.m);
    if (m !== lastMin) {
      lastMin = m;
      $('tk-datum').textContent = DAGEN[e.getUTCDay()] + ' ' + e.getUTCDate() + ' ' + MAAND[e.getUTCMonth()];
      var v = verschil(now);
      $('tk-verschil').textContent = v + ' uur';
      $('tk-seizoen').textContent = v === 6 ? 'verschil (NL zomertijd)' : 'verschil (NL wintertijd)';
      var dd = dagdeel(h);
      $('tk-groet').textContent = dd.groet + '!';
      $('tk-groet-u').textContent = dd.u;
      $('tk-groet-uitleg').textContent = 'Het is ' + dd.deel + ' op ' + NAAM + ', dus je zegt ' + dd.nl + ':';
      var b = belAdvies(h), el = $('tk-bel');
      el.textContent = b.t; el.className = 'tk-bel tk-' + b.k;
      $('tk-op').textContent = zon(e, true);
      $('tk-onder').textContent = zon(e, false);
      /* markeer de juiste kolom in de omrekentabel */
      var tab = document.querySelectorAll('[data-seizoen]');
      for (var i = 0; i < tab.length; i++) tab[i].classList.toggle('tk-nu', +tab[i].getAttribute('data-seizoen') === v);
    }
  }
  tick(); setInterval(tick, 1000);
})();
