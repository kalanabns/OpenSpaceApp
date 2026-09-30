const menuButton=document.querySelector('.menu-toggle');
const navigation=document.querySelector('.site-nav');
menuButton?.addEventListener('click',()=>{
  const open=menuButton.getAttribute('aria-expanded')!=='true';
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',open?'Close menu':'Open menu');
  navigation.classList.toggle('open',open);
});
navigation?.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{
  navigation.classList.remove('open');
  menuButton?.setAttribute('aria-expanded','false');
  menuButton?.setAttribute('aria-label','Open menu');
}));

const journeyTabs=[...document.querySelectorAll('[role="tab"]')];
function selectJourney(tab){
  journeyTabs.forEach(item=>{
    const active=item===tab;
    item.setAttribute('aria-selected',String(active));
    item.tabIndex=active?0:-1;
    document.getElementById(item.getAttribute('aria-controls')).hidden=!active;
  });
}
journeyTabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>selectJourney(tab));
  tab.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    const next=event.key==='Home'?0:event.key==='End'?journeyTabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+journeyTabs.length)%journeyTabs.length;
    selectJourney(journeyTabs[next]);
    journeyTabs[next].focus();
  });
});
document.getElementById('year').textContent=new Date().getFullYear();

const motionIsAllowed = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (motionIsAllowed && 'IntersectionObserver' in window) {
  const revealGroups = [
    '.hero-copy > *, .hero-screen',
    '.section-heading, .problem-card',
    '.journey-tabs, .steps-grid .step',
    '.section-copy > *, .product-visual .screen-stage',
    '.use-grid article',
    '.faq-list details',
    '.closing-inner > *',
    '.footer-grid > *'
  ];
  const revealElements = [...document.querySelectorAll(revealGroups.join(', '))];
  revealElements.forEach((element, index) => {
    element.dataset.reveal = '';
    element.style.setProperty('--reveal-delay', `${(index % 4) * 85}ms`);
  });
  document.body.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });
  revealElements.forEach(element => revealObserver.observe(element));
}
