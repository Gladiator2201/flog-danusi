(function () {
  var photos = window.PHOTOS || [];
  var i = 0, timer = null, playing = false;
  var img = document.getElementById('slide');
  var cap = document.getElementById('capTitle');
  var link = document.getElementById('capLink');
  var cnt = document.getElementById('counter');
  var bar = document.querySelector('.progress > i');
  var strip = document.getElementById('strip');
  var music = document.getElementById('music');
  var intro = document.getElementById('intro');
  var gate = document.getElementById('gate');
  var prefix = window.ASSET_PREFIX || '';
  var slug = window.SLUG || '';

  function hideGate() {
    if (!gate) return;
    gate.hidden = true;
    if (gate.classList && gate.classList.add) gate.classList.add('is-off');
    else if ((' ' + gate.className + ' ').indexOf(' is-off ') < 0)
      gate.className += (gate.className ? ' ' : '') + 'is-off';
    gate.style.display = 'none';
    gate.setAttribute('aria-hidden', 'true');
  }

  function renderStrip() {
    if (!strip) return;
    var html = '';
    for (var idx = 0; idx < photos.length; idx++) {
      html += '<img data-i="' + idx + '" src="' + prefix + 'img/' + slug + '/thumbs/' + photos[idx].file + '" alt="">';
    }
    strip.innerHTML = html;
    strip.onclick = function (e) {
      var t = e.target;
      while (t && t !== strip && !(t.tagName && t.tagName.toLowerCase() === 'img')) t = t.parentNode;
      if (!t || t === strip) return;
      go(+t.getAttribute('data-i'));
    };
  }

  function show(n) {
    if (!photos.length || !img) return;
    i = ((n % photos.length) + photos.length) % photos.length;
    var p = photos[i];
    img.src = prefix + 'img/' + slug + '/' + p.file;
    img.alt = p.title || '';
    if (cap) cap.textContent = p.title || ('Zdjęcie ' + (i + 1));
    if (link) {
      link.href = p.url || 'https://dana3ma.flog.pl/';
      link.textContent = 'Zobacz na flogu \u2197';
    }
    if (cnt) cnt.textContent = (i + 1) + ' / ' + photos.length;
    if (bar) bar.style.width = ((i + 1) / photos.length * 100) + '%';
    if (!strip) return;
    var thumbs = strip.getElementsByTagName('img');
    for (var idx = 0; idx < thumbs.length; idx++) {
      if (idx === i) {
        thumbs[idx].className = 'on';
        try {
          if (thumbs[idx].scrollIntoView) thumbs[idx].scrollIntoView(false);
        } catch (e) {}
      } else {
        thumbs[idx].className = '';
      }
    }
  }

  function go(n) { show(n); }
  function next() { go(i + 1); }
  function prev() { go(i - 1); }

  function play() {
    playing = true;
    var bp = document.getElementById('btnPlay');
    if (bp) bp.textContent = '\u23F8 Pauza';
    clearInterval(timer);
    timer = setInterval(next, 4500);
  }

  function pause() {
    playing = false;
    var bp = document.getElementById('btnPlay');
    if (bp) bp.textContent = '\u25B6 Play';
    clearInterval(timer);
    timer = null;
  }

  function tryAudio() {
    // Never block the slideshow on audio / autoplay policies.
    try {
      if (music) {
        try { music.volume = 0.25; } catch (e1) {}
        var p1 = music.play();
        if (p1 && p1.catch) p1.catch(function () {});
      }
    } catch (e) {}
    try {
      if (intro) {
        try { intro.currentTime = 0; intro.volume = 1; } catch (e2) {}
        var p2 = intro.play();
        if (p2 && p2.catch) p2.catch(function () {});
      }
    } catch (e) {}
  }

  function startShow() {
    hideGate();
    play();
    tryAudio();
  }

  var btnPlay = document.getElementById('btnPlay');
  var btnPrev = document.getElementById('btnPrev');
  var btnNext = document.getElementById('btnNext');
  var btnStart = document.getElementById('startShow');

  if (btnPlay) btnPlay.onclick = function () { if (playing) pause(); else play(); };
  if (btnPrev) btnPrev.onclick = function () { prev(); if (playing) { pause(); play(); } };
  if (btnNext) btnNext.onclick = function () { next(); if (playing) { pause(); play(); } };
  if (btnStart) {
    btnStart.onclick = startShow;
    // Older TV remotes sometimes fire only touch/pointer oddly — also bind touchend once
    btnStart.ontouchend = function (e) {
      if (e && e.cancelable) e.preventDefault();
      startShow();
    };
  }

  document.addEventListener('keydown', function (e) {
    var key = e.key || e.keyCode;
    if (key === 'ArrowRight' || key === 39) next();
    if (key === 'ArrowLeft' || key === 37) prev();
    if (key === ' ' || key === 32) {
      if (e.preventDefault) e.preventDefault();
      if (playing) pause(); else play();
    }
    if (key === 'Enter' || key === 13) {
      if (gate && gate.style.display !== 'none' && !gate.className.match(/\bis-off\b/)) startShow();
    }
  });

  renderStrip();
  show(0);
})();
