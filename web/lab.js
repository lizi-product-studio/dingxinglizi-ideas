(() => { 'use strict'; const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)]; let reduced=document.documentElement.dataset.motion ? document.documentElement.dataset.motion==='off' : matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Explicit rotation is local to this experiment. A new global choice takes precedence.
  let rotationChoice=null;
  const autoRotate=()=>rotationChoice===null?!reduced:rotationChoice;
  function syncRotation(){
    $('.lab-pause').textContent=autoRotate()?'暂停旋转 Ⅱ':'开始旋转 ▷';
    $('.lab-pause').removeAttribute('aria-pressed');
    $('.lab-motion-state').textContent=autoRotate()?'自动旋转中；拖拽可调整视角。':'自动旋转已暂停；拖拽可调整视角。';
  }
  // The field sleeps outside the viewport and when all motion has settled.
  const artCanvas=$('.lab-canvas'),artCtx=artCanvas.getContext('2d',{alpha:false});
  const COLS=96,ROWS=12,N=COLS*ROWS,forms=[new Float32Array(N*3),new Float32Array(N*3),new Float32Array(N*3)];
  for(let j=0;j<ROWS;j++)for(let i=0;i<COLS;i++){
    const n=j*COLS+i,k=n*3,u=i/COLS*Math.PI*2,v=j/ROWS*Math.PI*2;
    const radius=1.35+.45*Math.cos(3*u);
    forms[0].set([(radius+.13*Math.cos(v))*Math.cos(2*u),(radius+.13*Math.cos(v))*Math.sin(2*u),.55*Math.sin(3*u)+.13*Math.sin(v)],k);
    const phi=(j+.5)/ROWS*Math.PI;
    forms[1].set([1.6*Math.sin(phi)*Math.cos(u),1.6*Math.cos(phi),1.6*Math.sin(phi)*Math.sin(u)],k);
    forms[2].set([(i%12-5.5)*.29,(j-5.5)*.21,(Math.floor(i/12)-3.5)*.27],k);
  }
  const positions=new Float32Array(forms[0]),points=Array.from({length:N},()=>({x:0,y:0,z:0}));
  let artZoom=1;
  let artMode=0,artW=1,artH=1,artVisible=false,artFrame=0,artTime=0,artLast=0,artPulse=0,artMorph=0;
  let artRX=.45,artRY=-.35,artVX=0,artVY=0,artDrag=null,artPointer={x:-9999,y:-9999};
  function artResize(){const r=artCanvas.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,1.5);artW=r.width;artH=r.height;artCanvas.width=Math.round(artW*d);artCanvas.height=Math.round(artH*d);artCtx.setTransform(d,0,0,d,0,0);artWake();}
  function artWake(){if(!artFrame&&artVisible&&!document.hidden)artFrame=requestAnimationFrame(artDraw);}
  function artDraw(now){
    artFrame=0;if(!artVisible||document.hidden)return;
    const dt=Math.min((now-(artLast||now))/16.667,2);artLast=now;
    const rotating=autoRotate(),live=!reduced||rotating;
    if(rotating&&!artDrag){artRY+=artVY*dt+.0024*dt;artRX+=artVX*dt;artVX*=Math.pow(.91,dt);artVY*=Math.pow(.91,dt);}else if(!artDrag){artVX=artVY=0;}
    artTime+=live?dt*.009:0;artPulse=live?artPulse*Math.pow(.94,dt||1):0;artMorph=live?artMorph*.93:0;
    artCtx.fillStyle='#10110f';artCtx.fillRect(0,0,artW,artH);
    const scale=Math.min(artW*.21,artH*.22)*artZoom,cx=artW*.5,cy=artH*.5;
    const sy=Math.sin(artRY),cyR=Math.cos(artRY),sx=Math.sin(artRX),cxR=Math.cos(artRX),blend=live?1-Math.pow(.94,dt||1):1;
    for(let n=0;n<N;n++){
      const k=n*3;for(let axis=0;axis<3;axis++)positions[k+axis]+=(forms[artMode][k+axis]-positions[k+axis])*blend;
      const swell=1+artPulse*.22*Math.sin(n*.043-artTime*4),x=positions[k]*swell,y=positions[k+1]*swell,z=positions[k+2]*swell;
      const xx=x*cyR+z*sy,zz=-x*sy+z*cyR,yy=y*cxR-zz*sx,depth=y*sx+zz*cxR,p=4.7/(4.7-depth);
      let px=cx+xx*scale*p,py=cy+yy*scale*p;
      if(live&&!artDrag){const dx=px-artPointer.x,dy=py-artPointer.y,dist=Math.hypot(dx,dy);if(dist<125&&dist>1){const f=(1-dist/125)*12;px+=dx/dist*f;py+=dy/dist*f;}}
      points[n].x=px;points[n].y=py;points[n].z=depth;
    }
    for(let j=0;j<ROWS;j++){
      artCtx.beginPath();for(let i=0;i<COLS;i++){const p=points[j*COLS+i];if(i===0)artCtx.moveTo(p.x,p.y);else artCtx.lineTo(p.x,p.y);}
      if(artMode!==2)artCtx.closePath();artCtx.strokeStyle=j%3===0?'rgba(209,161,112,.40)':'rgba(214,223,215,.22)';artCtx.lineWidth=.7;artCtx.stroke();
    }
    for(let n=0;n<N;n++){const p=points[n],a=Math.max(.13,Math.min(.9,(p.z+2.5)/5));artCtx.globalAlpha=a;artCtx.fillStyle=n%7===0?'#deb582':'#e6eee3';const r=.65+(p.z+2)*.26;artCtx.fillRect(p.x-r/2,p.y-r/2,r,r);}
    artCtx.globalAlpha=1;
    if(rotating||artDrag||(live&&(artPulse>.001||artMorph>.001)))artWake();
  }
  new ResizeObserver(artResize).observe(artCanvas);
  new IntersectionObserver(entries=>{artVisible=entries[0].isIntersecting;if(artVisible){artLast=0;artWake();}else{cancelAnimationFrame(artFrame);artFrame=0;}},{rootMargin:'100px'}).observe(artCanvas);
  $$('.lab-mode').forEach(btn=>btn.addEventListener('click',()=>{
    artMode=Number(btn.dataset.form);artMorph=1;artPulse=reduced?0:.65;
    $$('.lab-mode').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));$('.lab-counter b').textContent='0'+(artMode+1);$('.lab-status').textContent='已切换至'+btn.textContent.split('/')[1].trim();artWake();
  }));
  $('.lab-pause').addEventListener('click',()=>{rotationChoice=!autoRotate();artVX=artVY=0;artLast=0;syncRotation();artWake();});
  artCanvas.addEventListener('pointerdown',e=>{if(e.button!==0||artDrag)return;e.preventDefault();artDrag={id:e.pointerId,x:e.clientX,y:e.clientY,total:0};artCanvas.setPointerCapture(e.pointerId);artCanvas.focus({preventScroll:true});});
  artCanvas.addEventListener('pointermove',e=>{const r=artCanvas.getBoundingClientRect();artPointer={x:e.clientX-r.left,y:e.clientY-r.top};if(artDrag&&artDrag.id===e.pointerId){const dx=e.clientX-artDrag.x,dy=e.clientY-artDrag.y;artDrag.total+=Math.abs(dx)+Math.abs(dy);artVY=dx*.004;artVX=dy*.004;artRY+=artVY;artRX+=artVX;artDrag.x=e.clientX;artDrag.y=e.clientY;}artWake();},{passive:true});
  function releaseArt(e){if(!artDrag||(e.pointerId!==undefined&&e.pointerId!==artDrag.id))return;if(e.type==='pointerup'&&artDrag.total<6){artPulse=1;artMorph=1;}const id=artDrag.id;artDrag=null;if(!autoRotate())artVX=artVY=0;if(artCanvas.hasPointerCapture(id))artCanvas.releasePointerCapture(id);artWake();}
  artCanvas.addEventListener('pointerup',releaseArt);artCanvas.addEventListener('pointercancel',releaseArt);artCanvas.addEventListener('lostpointercapture',releaseArt);artCanvas.addEventListener('pointerleave',()=>{artPointer={x:-9999,y:-9999};artWake();});
  artCanvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',' ','Home'].includes(e.key))return;e.preventDefault();if(e.key===' ')artPulse=1;else if(e.key==='Home'){artRX=.45;artRY=-.35;}else{artRY+=e.key==='ArrowLeft'?-.15:e.key==='ArrowRight'?.15:0;artRX+=e.key==='ArrowUp'?-.15:e.key==='ArrowDown'?.15:0;}artMorph=1;artWake();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(artFrame);artFrame=0;}else{artLast=0;artWake();}});

  $('.lab-reset').addEventListener('click',()=>{artRX=.45;artRY=-.35;artVX=artVY=0;artZoom=1;$('.lab-zoom').value=100;$('.zoom-value').textContent='100%';artMorph=1;artWake();});
  $('.lab-zoom').addEventListener('input',e=>{artZoom=Number(e.target.value)/100;$('.zoom-value').textContent=e.target.value+'%';artMorph=1;artWake();});
  window.addEventListener('lizi:motion',event=>{
    reduced=Boolean(event.detail.paused);rotationChoice=null;artVX=artVY=0;artLast=0;artPulse=0;artMorph=0;syncRotation();artWake();
  });
  window.addEventListener('blur',()=>releaseArt({type:'blur'}));
  syncRotation();

})();


