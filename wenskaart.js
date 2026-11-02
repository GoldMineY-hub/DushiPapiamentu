/* Dushi Papiamentu: wenskaartjesmaker. Alles gebeurt in de browser, er gaat niets naar een server. */
(function () {
  var S = 1080;
  var WENSEN = [
    { p: 'Bon Pasku i Bon Aña!', n: 'Fijne feestdagen en een voorspoedig nieuwjaar!', u: 'bon PAS-koe ie bon A-nja' },
    { p: 'Bon Pasku!', n: 'Fijne kerst / fijne feestdagen!', u: 'bon PAS-koe' },
    { p: 'Felis Pasku!', n: 'Vrolijk kerstfeest!', u: 'FE-lies PAS-koe' },
    { p: 'Felis Aña Nobo!', n: 'Gelukkig nieuwjaar!', u: 'FE-lies A-nja NO-bo' },
    { p: 'Bon Aña!', n: 'Een voorspoedig nieuwjaar!', u: 'bon A-nja' },
    { p: 'Bon Pasku i un felis Aña Nobo!', n: 'Fijne feestdagen en een gelukkig nieuwjaar!', u: 'bon PAS-koe ie oen FE-lies A-nja NO-bo' },
    { p: 'Bon Pasku i un bon Aña Nobo!', n: 'Fijne feestdagen en een goed nieuwjaar!', u: 'bon PAS-koe ie oen bon A-nja NO-bo' },
    { p: 'Bon Pasku pa henter famia!', n: 'Fijne kerst voor de hele familie!', u: '' },
    { p: 'Mi ta deseá bo un felis Aña Nobo.', n: 'Ik wens je een gelukkig nieuwjaar.', u: 'mie ta de-se-JA bo oen FE-lies A-nja NO-bo' }
  ];
  var REGELS = [
    { p: '', n: '' },
    { p: 'Ku e aña nobo aki trese boso salú i felisidat.', n: 'Dat dit nieuwe jaar jullie gezondheid en geluk brengt.' },
    { p: 'Pa un aña nobo yen di salú, pas i felisidat.', n: 'Op een nieuw jaar vol gezondheid, vrede en geluk.' },
    { p: 'Mi ta deseá boso hopi salú i bendishon.', n: 'Ik wens jullie veel gezondheid en zegen.' },
    { p: 'Felis dianan di fiesta!', n: 'Fijne feestdagen!' },
    { p: 'Disfrutá di e dianan di fiesta ku henter famia.', n: 'Geniet van de feestdagen met de hele familie.' },
    { p: 'Mi ta deseá boso un Pasku yen di amor.', n: 'Ik wens jullie een kerst vol liefde.' },
    { p: 'Nos ta pensa riba boso, maske nos ta leu.', n: 'We denken aan jullie, ook al zijn we ver weg.' },
    { p: 'Hopi brasa for di Hulanda!', n: 'Veel knuffels uit Nederland!' },
    { p: 'Leu for di bista, serka di kurason.', n: 'Ver uit het zicht, dicht bij het hart.' },
    { p: 'Hopi brasa for di Kòrsou!', n: 'Veel knuffels van Curaçao!' },
    { p: 'Danki pa tur loke bo a hasi pa mi e aña aki.', n: 'Dank je voor alles wat je dit jaar voor me hebt gedaan.' },
    { p: 'Mi stimabu.', n: 'Ik hou van jou.' },
    { p: 'Mi ta stima boso.', n: 'Ik hou van jullie.' }
  ];
  var LANG = [
    { p: 'Ku e dianan di fiesta aki yena bo kas ku lus, pas i hopi amor. Masha danki pa tur e bunita momentonan di e aña aki. Nos ta deseá abo i bo famia un Felis Pasku i un Aña Nobo yen di bendishon, salú i prosperidat!',
      n: 'Mogen deze feestdagen jouw huis vullen met licht, vrede en heel veel liefde. Hartelijk dank voor alle mooie momenten van dit jaar. Wij wensen jou en je familie een vrolijk kerstfeest en een nieuwjaar vol zegeningen, gezondheid en voorspoed!' },
    { p: 'Deseando bo un Felis Pasku i un Aña Nobo ku ta trese hopi alegria, salú i éksito. Bon kambio di aña!',
      n: 'Ik wens je een vrolijk kerstfeest en een nieuwjaar dat veel vreugde, gezondheid en succes brengt. Fijne jaarwisseling!' }
  ];
  /* Ontwerpen. top = zone voor wens [y0,y1]; bot = y van de onderste regel(s); dark = lichte tekst */
  var D = [
    { id: 'avond', naam: 'Handelskade bij avond', img: 'avond', foto: 1, top: [40, 330], bot: 935, wish: '#FFF6E6', small: '#FFFFFF', brand: '#FFD84D', shade: [0.45, 0.55], panel: 'dark' },
    { id: 'brug-avond', naam: 'Pontjesbrug', img: 'brug-avond', foto: 1, top: [60, 330], bot: 915, wish: '#FFFFFF', small: '#FFFFFF', brand: '#FFD84D', shade: [0.45, 0.6], panel: 'dark' },
    { id: 'handelskade', naam: 'Handelskade', img: 'handelskade', foto: 1, top: [50, 420], bot: 915, wish: '#FFFFFF', small: '#FFFFFF', brand: '#FFFFFF', shade: [0.35, 0.5], panel: 'dark' },
    { id: 'strand', naam: 'Strand', img: 'strand', foto: 1, top: [70, 360], bot: 930, wish: '#FFFFFF', small: '#FFFFFF', brand: '#FFFFFF', shade: [0.3, 0.5], panel: 'dark' },
    { id: 'brug', naam: 'Pontjesbrug (getekend)', img: 'brug', top: [60, 400], bot: 985, wish: '#FFF6E6', small: '#FFF6E6', brand: '#FFD84D', shade: [0, 0], panel: 'dark' },
    { id: 'huisjes', naam: 'Willemstad-huisjes', img: 'huisjes', top: [60, 520], allTop: 1, wish: '#C93A55', small: '#5C6B7A', brand: 'pill', shade: [0, 0], panel: 'light', noShadow: 1 },
    { id: 'kadushi', naam: 'Kadushi met lichtjes', img: 'kadushi', top: [50, 290], bot: 950, wish: '#2F7D4F', small: '#3E2E1E', brand: '#5C4430', shade: [0, 0], panel: 'light', noShadow: 1 },
    { id: 'goud', naam: 'Goud en sterren', img: 'goud', top: [330, 840], allTop: 1, wish: 'gold', small: '#F4EAD0', brand: '#E2B045', shade: [0, 0], panel: 'dark', noShadow: 1 },
    { id: 'eigen', naam: 'Eigen foto', eigen: 1, foto: 1, top: [60, 360], bot: 930, wish: '#FFFFFF', small: '#FFFFFF', brand: '#FFFFFF', shade: [0.5, 0.6], panel: 'dark' }
  ];

  var $ = function (id) { return document.getElementById(id); };
  var cv = $('wk-canvas'); if (!cv) return;
  var cx = cv.getContext('2d');
  var st = { d: 0, w: 0, r: 1, l: 0, mode: 'kort', voor: '', van: '' };
  var imgs = {}, eigenImg = null;

  function loadImg(src) {
    return new Promise(function (res) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = function () { res(null); }; i.src = src; });
  }
  function getBg(d) {
    if (d.eigen) return Promise.resolve(eigenImg);
    if (imgs[d.img]) return Promise.resolve(imgs[d.img]);
    return loadImg('/images/wenskaart/' + d.img + '.jpg').then(function (i) { imgs[d.img] = i; return i; });
  }

  function font(style, weight, size, fam) { return style + ' ' + weight + ' ' + size + 'px ' + fam; }
  var SERIF = "'Playfair Display', Georgia, serif", SANS = "'DM Sans', Arial, sans-serif";

  function wrap(text, maxW) {
    var words = text.split(' '), lines = [], cur = '';
    for (var i = 0; i < words.length; i++) {
      var t = cur ? cur + ' ' + words[i] : words[i];
      if (cx.measureText(t).width > maxW && cur) { lines.push(cur); cur = words[i]; } else cur = t;
    }
    if (cur) lines.push(cur);
    return lines;
  }
  /* Zelfde aantal regels, maar zo gelijk mogelijk verdeeld (geen los woord op de laatste regel) */
  function wrapBal(text, maxW) {
    var base = wrap(text, maxW); if (base.length < 2) return base;
    var lo = maxW * 0.4, hi = maxW;
    for (var k = 0; k < 14; k++) { var mid = (lo + hi) / 2; if (wrap(text, mid).length > base.length) lo = mid; else hi = mid; }
    return wrap(text, hi + 1);
  }
  /* Kies grootste lettergrootte zodat blokken in hoogte passen */
  function fit(blocks, maxW, maxH) {
    for (var scale = 1; scale > 0.35; scale -= 0.04) {
      var total = 0, out = [];
      for (var b = 0; b < blocks.length; b++) {
        var bl = blocks[b]; if (!bl.text) continue;
        var size = Math.round(bl.size * scale);
        cx.font = font(bl.style, bl.weight, size, bl.fam);
        var lines = wrapBal(bl.text, maxW);
        var lh = size * bl.lh;
        var tooWide = lines.some(function (l) { return cx.measureText(l).width > maxW; });
        out.push({ bl: bl, size: size, lines: lines, lh: lh, gap: Math.round((bl.gap || 0) * scale) });
        total += lines.length * lh + Math.round((bl.gap || 0) * scale);
        if (tooWide) total = 1e9;
      }
      if (total <= maxH) return { items: out, h: total };
    }
    return { items: out, h: total };
  }
  function drawItems(f, y, color, d) {
    for (var i = 0; i < f.items.length; i++) {
      var it = f.items[i];
      y += it.gap;
      cx.font = font(it.bl.style, it.bl.weight, it.size, it.bl.fam);
      var col = it.bl.big ? color.wish : color.small;
      for (var k = 0; k < it.lines.length; k++) {
        var ly = y + it.lh * (k + 0.78);
        if (col === 'gold') {
          var g = cx.createLinearGradient(0, ly - it.size, 0, ly);
          g.addColorStop(0, '#FCE7A8'); g.addColorStop(0.55, '#E2B045'); g.addColorStop(1, '#C9963A');
          cx.fillStyle = g;
        } else cx.fillStyle = col;
        cx.fillText(it.lines[k], S / 2, ly);
      }
      y += it.lines.length * it.lh;
    }
    return y;
  }

  function render() {
    var d = D[st.d];
    return getBg(d).then(function (bg) {
      cx.clearRect(0, 0, S, S);
      cx.textAlign = 'center'; cx.textBaseline = 'alphabetic';
      if (bg) {
        var iw = bg.naturalWidth || bg.width, ih = bg.naturalHeight || bg.height, sc = Math.max(S / iw, S / ih);
        var w = iw * sc, h = ih * sc;
        cx.drawImage(bg, (S - w) / 2, (S - h) / 2, w, h);
      } else {
        var gg = cx.createLinearGradient(0, 0, 0, S); gg.addColorStop(0, '#0B2E6B'); gg.addColorStop(1, '#1A2332');
        cx.fillStyle = gg; cx.fillRect(0, 0, S, S);
      }
      if (d.shade[0]) { var t = cx.createLinearGradient(0, 0, 0, 560); t.addColorStop(0, 'rgba(0,0,0,' + d.shade[0] + ')'); t.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = t; cx.fillRect(0, 0, S, 560); }
      if (d.shade[1]) { var b = cx.createLinearGradient(0, 760, 0, S); b.addColorStop(0, 'rgba(0,0,0,0)'); b.addColorStop(1, 'rgba(0,0,0,' + d.shade[1] + ')'); cx.fillStyle = b; cx.fillRect(0, 760, S, 320); }

      var shadow = !d.noShadow;
      function sh(on) { cx.shadowColor = on ? 'rgba(0,0,0,0.55)' : 'transparent'; cx.shadowBlur = on ? 18 : 0; cx.shadowOffsetY = on ? 3 : 0; }
      var voor = st.voor ? 'Voor ' + st.voor : '', van = st.van ? 'Van ' + st.van : '';

      if (st.mode === 'lang') {
        var lt = LANG[st.l].p;
        var px = 80, pw = S - 160;
        cx.font = font('italic', 400, 40, SERIF);
        var f = fit([
          { text: voor, style: 'italic', weight: 400, size: 38, fam: SERIF, lh: 1.25, gap: 0 },
          { text: lt, style: 'italic', weight: 700, size: 50, fam: SERIF, lh: 1.32, gap: voor ? 22 : 0, big: 1 },
          { text: van, style: 'italic', weight: 400, size: 38, fam: SERIF, lh: 1.25, gap: 26 }
        ], pw - 100, 700);
        var ph = f.h + 110, py = Math.round((S - ph) / 2) - 20;
        sh(false);
        cx.fillStyle = d.panel === 'light' ? 'rgba(255,255,255,0.88)' : 'rgba(10,18,40,0.62)';
        roundRect(px, py, pw, ph, 34); cx.fill();
        drawItems(f, py + 55, { wish: d.panel === 'light' ? '#1A2332' : '#FFFFFF', small: d.panel === 'light' ? '#5C6B7A' : '#F4EAD0' }, d);
      } else {
        var wish = WENSEN[st.w].p, regel = st.mode === 'regel' ? REGELS[st.r].p : '';
        var top = [
          { text: voor, style: 'italic', weight: 400, size: 44, fam: SERIF, lh: 1.25, gap: 0 },
          { text: wish, style: 'italic', weight: 700, size: wish.length > 22 ? 104 : 124, fam: SERIF, lh: 1.08, gap: voor ? 16 : 0, big: 1 }
        ];
        if (d.allTop) {
          top.push({ text: regel, style: 'italic', weight: 400, size: 46, fam: SERIF, lh: 1.25, gap: 26 });
          top.push({ text: van, style: 'italic', weight: 400, size: 42, fam: SERIF, lh: 1.25, gap: 22 });
        }
        var ft = fit(top, 900, d.top[1] - d.top[0]);
        sh(shadow);
        var y0 = d.allTop ? d.top[0] + Math.round((d.top[1] - d.top[0] - ft.h) / 2) : d.top[0];
        drawItems(ft, y0, d, d);
        if (!d.allTop) {
          var bot = [
            { text: regel, style: 'italic', weight: 400, size: 44, fam: SERIF, lh: 1.25, gap: 0 },
            { text: van, style: 'italic', weight: 400, size: 40, fam: SERIF, lh: 1.25, gap: regel ? 12 : 0 }
          ];
          var fb = fit(bot, 900, 190);
          drawItems(fb, d.bot - fb.h + 30, d, d);
        }
      }
      // merk
      sh(false);
      cx.font = font('normal', 700, 24, SANS);
      if (cx.letterSpacing !== undefined) cx.letterSpacing = '3px';
      if (d.brand === 'pill') {
        var tw = cx.measureText('DUSHIPAPIAMENTU.NL').width + 48;
        cx.fillStyle = 'rgba(26,35,50,0.82)'; roundRect((S - tw) / 2, S - 76, tw, 46, 23); cx.fill();
        cx.fillStyle = '#FFFFFF'; cx.fillText('DUSHIPAPIAMENTU.NL', S / 2, S - 45);
      } else { cx.fillStyle = d.brand; cx.globalAlpha = 0.9; cx.fillText('DUSHIPAPIAMENTU.NL', S / 2, S - 34); cx.globalAlpha = 1; }
      if (cx.letterSpacing !== undefined) cx.letterSpacing = '0px';
      if (d.foto && !d.eigen) { cx.font = font('normal', 400, 16, SANS); cx.textAlign = 'right'; cx.fillStyle = 'rgba(255,255,255,0.75)'; cx.fillText('Foto: Unsplash', S - 22, S - 14); cx.textAlign = 'center'; }
      uitleg();
    });
  }
  function roundRect(x, y, w, h, r) {
    cx.beginPath(); cx.moveTo(x + r, y); cx.arcTo(x + w, y, x + w, y + h, r); cx.arcTo(x + w, y + h, x, y + h, r);
    cx.arcTo(x, y + h, x, y, r); cx.arcTo(x, y, x + w, y, r); cx.closePath();
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function uitleg() {
    var h = '';
    if (st.mode === 'lang') {
      h = '<p class="wk-u-p">' + esc(LANG[st.l].p) + '</p><p class="wk-u-n">' + esc(LANG[st.l].n) + '</p>';
    } else {
      var w = WENSEN[st.w];
      h = '<p class="wk-u-p">' + esc(w.p) + '</p>' + (w.u ? '<p class="wk-u-x">Uitspraak: <strong>' + esc(w.u) + '</strong></p>' : '') + '<p class="wk-u-n">' + esc(w.n) + '</p>';
      if (st.mode === 'regel' && st.r) h += '<p class="wk-u-p" style="margin-top:12px">' + esc(REGELS[st.r].p) + '</p><p class="wk-u-n">' + esc(REGELS[st.r].n) + '</p>';
    }
    $('wk-uitleg').innerHTML = h;
  }

  /* ---------- UI ---------- */
  function fillSelect(el, arr, withEmpty) {
    arr.forEach(function (o, i) {
      if (!o.p && !withEmpty) return;
      var op = document.createElement('option'); op.value = i;
      op.textContent = o.p ? o.p + '  (' + o.n + ')' : 'Geen regel';
      el.appendChild(op);
    });
  }
  fillSelect($('wk-wens'), WENSEN); fillSelect($('wk-regel'), REGELS, 1); fillSelect($('wk-lang'), LANG);
  $('wk-regel').value = 1;

  var grid = $('wk-ontwerpen');
  D.forEach(function (d, i) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'wk-t' + (i === 0 ? ' on' : '');
    b.setAttribute('aria-label', d.naam); b.title = d.naam;
    if (d.eigen) b.innerHTML = '<span class="wk-t-eigen">📷<br>Eigen foto</span>';
    else b.innerHTML = '<img src="/images/wenskaart/t-' + d.img + '.jpg" alt="" width="80" height="80" loading="lazy">';
    b.onclick = function () {
      if (d.eigen && !eigenImg) { $('wk-file').click(); return; }
      kies(i);
    };
    grid.appendChild(b);
  });
  function kies(i) {
    st.d = i;
    var ts = grid.querySelectorAll('.wk-t'); for (var k = 0; k < ts.length; k++) ts[k].classList.toggle('on', k === i);
    $('wk-eigen-opnieuw').style.display = D[i].eigen ? 'inline-block' : 'none';
    render();
  }
  $('wk-file').onchange = function () {
    var f = this.files && this.files[0]; if (!f) return;
    var url = URL.createObjectURL(f);
    loadImg(url).then(function (i) {
      if (!i) { alert('Deze foto kan niet worden geopend. Probeer een JPG of PNG.'); return; }
      eigenImg = i; kies(D.length - 1);
    });
    this.value = '';
  };
  $('wk-eigen-opnieuw').onclick = function () { $('wk-file').click(); };

  function setMode(m) {
    st.mode = m;
    var bs = document.querySelectorAll('.wk-m'); for (var i = 0; i < bs.length; i++) bs[i].classList.toggle('on', bs[i].getAttribute('data-m') === m);
    $('wk-rij-wens').style.display = m === 'lang' ? 'none' : '';
    $('wk-rij-regel').style.display = m === 'regel' ? '' : 'none';
    $('wk-rij-lang').style.display = m === 'lang' ? '' : 'none';
    render();
  }
  var ms = document.querySelectorAll('.wk-m'); for (var i = 0; i < ms.length; i++) ms[i].onclick = function () { setMode(this.getAttribute('data-m')); };
  $('wk-wens').onchange = function () { st.w = +this.value; render(); };
  $('wk-regel').onchange = function () { st.r = +this.value; render(); };
  $('wk-lang').onchange = function () { st.l = +this.value; render(); };
  var tmr;
  function onName() { st.voor = $('wk-voor').value.trim().slice(0, 40); st.van = $('wk-van').value.trim().slice(0, 40); clearTimeout(tmr); tmr = setTimeout(render, 120); }
  $('wk-voor').oninput = onName; $('wk-van').oninput = onName;

  function blob() { return new Promise(function (res) { cv.toBlob(function (b) { res(b); }, 'image/jpeg', 0.92); }); }
  function msg(t) { $('wk-msg').textContent = t; }
  $('wk-download').onclick = function () {
    render().then(blob).then(function (b) {
      var a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'bon-pasku-wenskaart.jpg';
      document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
      msg('Je kaartje is gedownload. Stuur het als foto via WhatsApp, of zet het op Facebook of Instagram.');
    });
  };
  $('wk-delen').onclick = function () {
    render().then(blob).then(function (b) {
      var file = new File([b], 'bon-pasku-wenskaart.jpg', { type: 'image/jpeg' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        navigator.share({ files: [file], title: 'Bon Pasku!', text: 'Gemaakt op dushipapiamentu.nl/wenskaart-bon-pasku' }).catch(function () {});
      } else {
        $('wk-download').click();
        msg('Delen gaat op deze computer niet direct. Je kaartje is gedownload: stuur het als foto via WhatsApp Web of je telefoon.');
      }
    });
  };

  var ready = document.fonts && document.fonts.load ? Promise.all([
    document.fonts.load("italic 700 60px 'Playfair Display'"), document.fonts.load("italic 400 40px 'Playfair Display'"), document.fonts.load("700 24px 'DM Sans'")
  ]).catch(function () {}) : Promise.resolve();
  ready.then(function () { setMode('kort'); });
  window.__wk = { st: st, render: render, D: D };
})();
