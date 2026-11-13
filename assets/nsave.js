/* nsave guide: client-only enhancements. Both languages have complete static HTML. */
(()=>{'use strict';
  const html=document.documentElement;
  const body=document.body;
  const pageLang=body.dataset.pageLanguage;
  const KEY='majd-nsave-preferred-language';
  try{
    document.querySelectorAll('[data-language-choice]').forEach(el=>el.addEventListener('click',()=>localStorage.setItem(KEY,el.dataset.languageChoice)));
    // Only the Arabic entry chooses a browser-language alternative. The English URL always keeps its English canonical content.
    if(pageLang==='ar'&&!new URLSearchParams(location.search).has('lang')){
      let pref=localStorage.getItem(KEY);
      if(pref===null){
        const browser=(navigator.languages&&navigator.languages[0])||navigator.language||'ar';
        pref=/^ar(?:-|$)/i.test(browser)?'ar':'en';
      }
      if(pref==='en' && !/bot|crawl|spider|preview/i.test(navigator.userAgent||'')){
        const dest=body.dataset.altPage;
        if(dest&&new URL(dest).origin===location.origin) location.replace(dest);
      }
    }
  }catch(e){ /* storage may be blocked: leave accessible Arabic page */ }
  const video=document.getElementById('nsavePlayer');
  const frame=document.getElementById('video');
  const chapterButtons=document.querySelectorAll('[data-seconds]');
  chapterButtons.forEach(el=>el.addEventListener('click',()=>{
    if(!video||!frame)return;
    const sec=Number(el.dataset.seconds);
    if(!Number.isSafeInteger(sec)||sec<0||sec>7200)return;
    video.src='https://www.youtube-nocookie.com/embed/7QC6sQrjBCQ?rel=0&playsinline=1&start='+sec+'&autoplay=1';
    frame.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
  }));
  const search=document.getElementById('chapterSearch');
  const empty=document.getElementById('chapterEmpty');
  if(search){
    const entries=[...document.querySelectorAll('.chapter')];
    const normalize=x=>String(x).normalize('NFKD').replace(/[\u064B-\u065F]/g,'').toLocaleLowerCase();
    search.addEventListener('input',()=>{
      const q=normalize(search.value.trim());let shown=0;
      entries.forEach(item=>{const ok=!q||normalize(item.dataset.search||item.textContent).includes(q);item.hidden=!ok;if(ok)shown++;});
      if(empty)empty.hidden=shown!==0;
    });
  }
})();
