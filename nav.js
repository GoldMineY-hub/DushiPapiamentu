(function(){
  var nav=document.querySelector('.dpn');if(!nav)return;
  var btn=nav.querySelector('.dpn-toggle');
  function setOpen(o){nav.classList.toggle('open',o);if(btn){btn.setAttribute('aria-expanded',o?'true':'false');btn.setAttribute('aria-label',o?'Menu sluiten':'Menu openen');}}
  if(btn)btn.addEventListener('click',function(e){e.stopPropagation();setOpen(!nav.classList.contains('open'));});
  nav.querySelectorAll('.dpn-links a').forEach(function(a){a.addEventListener('click',function(){setOpen(false);});});
  document.addEventListener('click',function(e){if(!nav.contains(e.target))setOpen(false);});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')setOpen(false);});
  var p=location.pathname.replace(/\.html$/,'').replace(/\/index$/,'/');
  var key=p.indexOf('/blog')===0?'blog':p.indexOf('/lessen')===0?'lessen':p.indexOf('/over-ons')===0?'over-ons':(p==='/'||p==='')?'home':'';
  var cur=nav.querySelector('[data-nav="'+key+'"]');if(cur)cur.setAttribute('aria-current','page');
})();
