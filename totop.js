(function(){
  var css='.totop{position:fixed;right:16px;bottom:20px;width:46px;height:46px;border-radius:50%;border:0;background:#0077A8;color:#fff;box-shadow:0 4px 14px rgba(26,35,50,.25);cursor:pointer;display:flex;align-items:center;justify-content:center;z-index:80;opacity:0;transform:translateY(12px);pointer-events:none;transition:opacity .2s,transform .2s}'+
    '.totop.on{opacity:.85;transform:none;pointer-events:auto}.totop:hover,.totop:focus-visible{opacity:1;background:#005A7D}.totop:focus-visible{outline:3px solid #F4A236;outline-offset:2px}'+
    '@media(min-width:900px){.totop{right:28px;bottom:28px}}@media print{.totop{display:none}}';
  var s=document.createElement('style');s.textContent=css;document.head.appendChild(s);
  var b=document.createElement('button');b.type='button';b.className='totop';b.setAttribute('aria-label','Terug naar boven');b.title='Terug naar boven';
  b.innerHTML='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>';
  b.onclick=function(){window.scrollTo({top:0,behavior:'smooth'});};
  document.body.appendChild(b);
  var blocked=0,vis={},last=window.scrollY,up=false;
  function upd(){var y=window.scrollY,d=y-last;if(d<-6)up=true;else if(d>6)up=false;if(Math.abs(d)>6)last=y;b.classList.toggle('on',up&&y>window.innerHeight*2&&blocked===0);}
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){var k=e.target.__tt;if(e.isIntersecting&&!vis[k]){vis[k]=1;blocked++;}else if(!e.isIntersecting&&vis[k]){vis[k]=0;blocked--;}});upd();});
    var n=0;function watch(){document.querySelectorAll('footer,.ldl-sh,.dsu-end').forEach(function(el){if(el.__tt)return;el.__tt=++n;io.observe(el);});}
    watch();setTimeout(watch,1500);
  }
  addEventListener('scroll',upd,{passive:true});addEventListener('resize',upd);upd();
})();
