/* LIZI — local, dependency-free site shell and progressive interactions. */
(() => {
 'use strict';
 const body = document.body, root = document.documentElement;
 const page = body.dataset.page || 'home';
 const nav = [['home','首页','index.html','01'],['work','概念演示','work.html','02'],['capabilities','服务','capabilities.html','03'],['lab','实验室','lab.html','04'],['about','关于与联系','about.html','05']];
 const active = page === 'project' ? 'work' : page;
 const navMarkup = nav.map(([id,label,href,n]) => `<a class="nav-item" href="${href}"${id===active?' aria-current="page"':''}>${label}</a>`).join('');
 const mobileMarkup = nav.map(([id,label,href,n]) => `<a href="${href}"${id===active?' aria-current="page"':''}>${label}<span>${n} / ${id.toUpperCase()} ↗</span></a>`).join('');
 const headerSlot = document.getElementById('site-header');
 if (headerSlot) headerSlot.innerHTML = `<a class="skip-link" href="#main">跳至主要内容</a><div class="page-progress" aria-hidden="true"></div><header class="site-header"><a class="brand" href="index.html" aria-label="栗子软件科技首页"><span class="brand-mark">LIZI<span style="color:var(--accent)">.</span></span><span class="brand-cn">栗子<br>软件科技</span></a><nav class="desktop-nav" aria-label="主导航">${navMarkup}</nav><div class="header-end"><button class="motion-button" type="button" aria-label="暂停动态效果" aria-pressed="false"><span class="motion-icon" aria-hidden="true"><i></i><i></i><i></i></span><span class="motion-label">动态开启</span></button><a class="header-contact" href="${page === 'about' ? '#project-brief' : 'about.html#project-brief'}">聊聊需求 <span aria-hidden="true">↗</span></a><button class="menu-toggle" aria-label="打开菜单" aria-expanded="false" aria-controls="mobile-navigation"><i></i><i></i></button></div></header><nav class="mobile-nav" id="mobile-navigation" aria-label="移动导航" inert>${mobileMarkup}<div class="mobile-nav-contact"><a class="mobile-project-link" href="about.html#project-brief">整理一下需求 ↗</a><span>也可以直接联系</span><a href="tel:19932599869">199 3259 9869 ↗</a></div></nav>`;
 const footerSlot = document.getElementById('site-footer');
 if (footerSlot) footerSlot.innerHTML = `<footer class="site-footer wrap" id="${page === 'about' ? 'site-contact' : 'contact'}"><p class="eyebrow">项目沟通 / 栗子软件科技</p><div class="footer-top"><div><h2 class="footer-headline">有件事想做？<br><span>我们聊聊。</span></h2><p class="footer-intro">从眼前的一个问题聊起，一起看看软件、AI 或自动化能帮上什么忙。</p></div><div><a class="footer-project-link" href="about.html#project-brief">整理一下需求 <span aria-hidden="true">↗</span></a><div class="contact-list"><a class="contact-item" href="tel:19932599869"><div><span>PHONE / 电话</span><strong>199 3259 9869</strong></div><span class="contact-arrow" aria-hidden="true">↗</span></a><div class="contact-item"><div><span>WECHAT / 微信</span><strong>19932599869</strong></div><button class="copy-button" type="button" data-copy="19932599869">复制微信号</button></div><a class="contact-item email" href="mailto:dingxinglizi@outlook.com"><div><span>EMAIL / 邮箱</span><strong>dingxinglizi@outlook.com</strong></div><span class="contact-arrow" aria-hidden="true">↗</span></a></div><p class="copy-feedback" role="status" aria-live="polite"></p></div></div><div class="footer-bottom"><small>© ${new Date().getFullYear()} 栗子软件科技<br>软件设计与开发</small><span class="footer-legal">经营主体：定兴县栗子软件科技店</span><button class="back-top" type="button">回到顶部 <span aria-hidden="true">↑</span></button></div><div class="footer-wordmark" aria-hidden="true">LIZI<span>.</span></div></footer>`;
 if (page === 'about' && footerSlot) { const footer = footerSlot.querySelector('footer'); footer.classList.add('footer-compact'); footer.querySelector('.eyebrow')?.remove(); footer.querySelector('.footer-top')?.remove(); }
 const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
 let storedMotion;
 try { storedMotion = localStorage.getItem('lizi-motion'); } catch (_) {}
 let motionOff = storedMotion ? storedMotion === 'off' : motionQuery.matches;
 const motionButton = document.querySelector('.motion-button');
 function applyMotion() {
  root.dataset.motion = motionOff ? 'off' : 'on';
  root.classList.toggle('reduced-motion', motionOff);
  root.classList.toggle('motion-off', motionOff);
  root.classList.toggle('js-motion', !motionOff);
  if (motionButton) { motionButton.setAttribute('aria-pressed', String(motionOff)); motionButton.setAttribute('aria-label', motionOff ? '动态效果已暂停，点击开启' : '动态效果已开启，点击暂停'); motionButton.querySelector('.motion-label').textContent = motionOff ? '动态暂停' : '动态开启'; }
  window.dispatchEvent(new CustomEvent('lizi:motion', { detail:{ paused:motionOff } }));
 }
 applyMotion();
 motionButton?.addEventListener('click', () => { motionOff = !motionOff; storedMotion = motionOff ? 'off' : 'on'; try { localStorage.setItem('lizi-motion', storedMotion); } catch (_) {} applyMotion(); });
 motionQuery.addEventListener?.('change', e => { if (!storedMotion) {motionOff=e.matches;applyMotion();} });
 window.LiziMotion = { get paused() {return motionOff;} };
 const menuButton = document.querySelector('.menu-toggle'), mobileNav = document.querySelector('.mobile-nav');
 function setMenu(open) { if(!menuButton || !mobileNav)return; menuButton.setAttribute('aria-expanded',String(open)); menuButton.setAttribute('aria-label',open?'关闭菜单':'打开菜单'); mobileNav.classList.toggle('is-open',open); mobileNav.inert = !open; body.classList.toggle('menu-open',open); }
 menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
 mobileNav?.addEventListener('click', e => {if(e.target.closest('a'))setMenu(false);});
 document.addEventListener('keydown', e => {if(e.key==='Escape' && menuButton?.getAttribute('aria-expanded')==='true'){setMenu(false);menuButton.focus();}if(e.key==='Tab' && menuButton?.getAttribute('aria-expanded')==='true'){const focusables=[menuButton,...mobileNav.querySelectorAll('a')],first=focusables[0],last=focusables[focusables.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}});
 window.matchMedia('(min-width:761px)').addEventListener?.('change', e => {if(e.matches)setMenu(false);});
 const reveals = document.querySelectorAll('.reveal');
 if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => { entries.forEach(entry => {if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}); },{threshold:.08,rootMargin:'0px 0px 25px 0px'});
  reveals.forEach(el => { const r = el.getBoundingClientRect(); if(r.top < innerHeight && r.bottom>0) el.classList.add('is-visible'); else el.setAttribute('data-reveal-ready',''); observer.observe(el); });
 }
 let progressPending=false;
 function updateProgress(){const meter=document.querySelector('.page-progress');if(meter){const total=root.scrollHeight-innerHeight;meter.style.transform=`scaleX(${total>0?Math.min(1,scrollY/total):0})`;}progressPending=false;}
 addEventListener('scroll',()=>{if(!progressPending){requestAnimationFrame(updateProgress);progressPending=true;}},{passive:true});updateProgress();
 document.querySelector('.back-top')?.addEventListener('click',()=>window.scrollTo({top:0,behavior:motionOff?'instant':'smooth'}));
 document.querySelectorAll('[data-copy]').forEach(button=>button.addEventListener('click',async()=>{const value=button.dataset.copy;let copied=false;try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(value);copied=true;}}catch(_){}if(!copied){const input=document.createElement('textarea');input.value=value;input.setAttribute('readonly','');input.style.cssText='position:fixed;left:-9999px;top:0';body.append(input);input.select();try{copied=document.execCommand('copy');}catch(_){}input.remove();button.focus();}const status=document.querySelector('.copy-feedback');if(status)status.textContent=copied?'微信号已复制，可前往微信添加。':`微信号：${value}，请长按或选中复制。`;button.textContent=copied?'已复制 ✓':'19932599869';}));
 const scene=document.querySelector('.system-scene'), object=document.querySelector('.system-object');
 const tabs=[...document.querySelectorAll('.system-tab')];
 const descriptions={software:'把订单、任务和进度放在一起查看。',ai:'从团队资料中查找依据，辅助回答问题。',flow:'把信息记到指定位置，并提醒负责同事。'};
 function selectSystem(tab){tabs.forEach(t=>{const selected=t===tab;t.setAttribute('aria-selected',String(selected));t.tabIndex=selected?0:-1;});const key=tab.dataset.system,panel=document.querySelector('.system-tab-description');if(panel){panel.textContent=descriptions[key];panel.setAttribute('aria-labelledby',tab.id);}if(scene){scene.style.setProperty('--system-color',key==='ai'?'#e4b98d':key==='flow'?'#afcddd':'#c3d78b');scene.dataset.mode=key;}document.querySelectorAll('.system-node').forEach(n=>n.style.borderColor=key==='ai'&&n.classList.contains('node-agent')?'#e4b98d':key==='flow'&&n.classList.contains('node-action')?'#afcddd':'');}
 tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>selectSystem(tab));tab.addEventListener('keydown',e=>{let index=i;if(e.key==='ArrowRight')index=(i+1)%tabs.length;else if(e.key==='ArrowLeft')index=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')index=0;else if(e.key==='End')index=tabs.length-1;else return;e.preventDefault();tabs[index].focus();selectSystem(tabs[index]);});});
 const hero=document.querySelector('.home-hero');
 if(hero&&scene&&object&&matchMedia('(pointer:fine)').matches){hero.addEventListener('pointermove',e=>{if(motionOff)return;const r=hero.getBoundingClientRect();scene.style.setProperty('--rx',`${(e.clientY-r.top-r.height/2)/r.height*-8}deg`);scene.style.setProperty('--ry',`${(e.clientX-r.left-r.width/2)/r.width*12}deg`);},{passive:true});hero.addEventListener('pointerleave',()=>{scene.style.setProperty('--rx','0deg');scene.style.setProperty('--ry','0deg');});}
})();

