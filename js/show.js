
(function(){
  const photos = window.PHOTOS || [];
  let i = 0, timer = null, playing = false;
  const img = document.getElementById('slide');
  const cap = document.getElementById('capTitle');
  const link = document.getElementById('capLink');
  const cnt = document.getElementById('counter');
  const bar = document.querySelector('.progress > i');
  const strip = document.getElementById('strip');
  const music = document.getElementById('music');
  const intro = document.getElementById('intro');
  const gate = document.getElementById('gate');

  function renderStrip(){
    strip.innerHTML = photos.map((p,idx)=>`<img data-i="${idx}" src="${window.ASSET_PREFIX||''}img/${window.SLUG}/thumbs/${p.file}" alt="">`).join('');
    strip.onclick = (e)=>{ const t=e.target.closest('img'); if(!t) return; go(+t.dataset.i); };
  }
  function show(n){
    if(!photos.length) return;
    i = (n+photos.length)%photos.length;
    const p = photos[i];
    img.src = (window.ASSET_PREFIX||'')+'img/'+window.SLUG+'/'+p.file;
    img.alt = p.title || '';
    cap.textContent = p.title || ('Zdjęcie '+(i+1));
    link.href = p.url || 'https://dana3ma.flog.pl/';
    link.textContent = 'Zobacz na flogu ↗';
    cnt.textContent = (i+1)+' / '+photos.length;
    bar.style.width = ((i+1)/photos.length*100)+'%';
    [...strip.querySelectorAll('img')].forEach((el,idx)=>{
      el.classList.toggle('on', idx===i);
      if(idx===i) el.scrollIntoView({inline:'center', block:'nearest', behavior:'smooth'});
    });
  }
  function go(n){ show(n); }
  function next(){ go(i+1); }
  function prev(){ go(i-1); }
  function play(){
    playing = true;
    document.getElementById('btnPlay').textContent = '⏸ Pauza';
    clearInterval(timer);
    timer = setInterval(next, 4500);
  }
  function pause(){
    playing = false;
    document.getElementById('btnPlay').textContent = '▶ Play';
    clearInterval(timer); timer=null;
  }
  document.getElementById('btnPlay').onclick=()=>{ playing?pause():play(); };
  document.getElementById('btnPrev').onclick=()=>{ prev(); if(playing){pause();play();} };
  document.getElementById('btnNext').onclick=()=>{ next(); if(playing){pause();play();} };
  document.getElementById('startShow').onclick=async()=>{
    gate.hidden = true;
    try{ music.volume=.25; await music.play(); }catch(e){}
    try{ intro.volume=1; intro.currentTime=0; await intro.play(); }catch(e){}
    play();
  };
  document.addEventListener('keydown', e=>{
    if(e.key==='ArrowRight') next();
    if(e.key==='ArrowLeft') prev();
    if(e.key===' '){ e.preventDefault(); playing?pause():play(); }
  });
  renderStrip(); show(0);
})();
