import {VERSION,stepProgress,fields,blank,visible,answered,label,validate,normalize,recommend,brief,isRequired,handoff,AI_DECIDES} from './model.mjs?v=dev';
import {blankIdea,normalizeIdea,ideaTitles,ideaProgress,ideaTitle,ideaHTML,ideaBrief,ideaPrompt,ensureTasks,ideaSource,suggestedTasks,projectSeed,directions} from './idea.mjs?v=dev';
const $=s=>document.querySelector(s),key='kickoff.projects.v1';
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const uid=()=>globalThis.crypto?.randomUUID?.()||`p-${Date.now()}-${Math.random().toString(36).slice(2)}`;
const titles=['产品定位','业务与功能','专项设置','约束与偏好','项目简报'];
let projects=[],current,step=0,errors=[],storageError=false,toastTimer;
const generated=new Map(); let generating=false,localService=null;
function announce(message){const live=$('#live');if(live)live.textContent=message}
function toast(message){announce(message);$('#toast').textContent=message;$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4500)}
function validProject(p,issues=[]){if(!p||typeof p.id!=='string'||p.id.length>150)throw Error('无效标识');return {id:p.id,updated:typeof p.updated==='string'&&Number.isFinite(Date.parse(p.updated))?p.updated:new Date().toISOString(),mode:p.mode==='idea'?'idea':'project',idea:normalizeIdea(p.idea),data:normalize(p.data,issues),agents:p.agents&&typeof p.agents.markdown==='string'&&p.agents.markdown.length<=40000&&typeof p.agents.input==='string'&&p.agents.input.length<=40000?p.agents:null}}
const isIdea=()=>current.mode==='idea';
const newDraft=(mode='idea')=>({id:uid(),updated:new Date().toISOString(),mode,idea:blankIdea(),data:blank()});
const draftName=p=>p.mode==='idea'?ideaTitle(p.idea):p.data.name.trim()||'未命名项目';
// 多个标签页共用同一份存储：保存时先读最新数据，只写回本页改动的那份草稿，不覆盖其他标签页的修改。
// 读不出的条目原样保留；存储版本不认识时停止写入，避免覆盖。
const removed=new Set();let saveWarned=false;
function readStored(issues=[]){const saved=JSON.parse(localStorage.getItem(key)||'null');if(!saved)return {projects:[],broken:[],currentId:null};if(saved.version!==VERSION||!Array.isArray(saved.projects))throw Error('不支持的版本');const list=[],broken=[];for(const p of saved.projects){try{list.push(validProject(p,issues))}catch{broken.push(p)}}return {projects:list,broken,currentId:saved.currentId}}
function mergeStored(latest){const list=latest.projects.filter(x=>!removed.has(x.id)).map(x=>x.id===current?.id?current:x);if(current&&!list.includes(current))list.push(current);return list}
try{const issues=[],latest=readStored(issues);projects=latest.projects;current=projects.find(p=>p.id===latest.currentId)||projects[0];if(latest.broken.length)toast(`有 ${latest.broken.length} 份草稿数据损坏，没有加载（原数据保留）。`);else if(issues.length)toast(`草稿已按新版表单调整：${[...new Set(issues)].join('；')}`)}catch{storageError=true;toast('无法读取本机草稿；原数据未覆盖，请导出备份。')}
if(!current){current=newDraft();projects.push(current)}
for(const p of projects)if(p.agents)generated.set(p.id,p.agents);
function persist(p=current,touch=true){if(touch)p.updated=new Date().toISOString();if(storageError){$('#saveStatus').textContent='保存不可用 · 请导出';return}
 try{const latest=readStored(),list=latest.projects.filter(x=>!removed.has(x.id)).map(x=>x.id===p.id?p:x.id===current.id?current:x);for(const x of [p,current])if(!removed.has(x.id)&&!list.includes(x))list.push(x);
  localStorage.setItem(key,JSON.stringify({version:VERSION,currentId:current.id,projects:[...list,...latest.broken]}));projects=list;saveWarned=false;$('#saveStatus').textContent='已保存到本机'}
 catch(err){if(err?.message==='不支持的版本'){storageError=true;$('#saveStatus').textContent='保存不可用 · 请导出';return}$('#saveStatus').textContent='保存失败 · 请导出';if(!saveWarned)toast('这次没能保存到浏览器，下次修改时会重试；重要内容请先导出 JSON。');saveWarned=true}}
window.addEventListener('storage',e=>{if(e.key!==key||storageError)return;try{projects=mergeStored(readStored());for(const x of projects)if(x.agents&&!generated.has(x.id))generated.set(x.id,x.agents);if($('#draftDialog').open)showDrafts()}catch{}});
const isBlankProject=p=>JSON.stringify(p.data)===JSON.stringify(blank())&&JSON.stringify(p.idea)===JSON.stringify(blankIdea());
function fieldHTML(f){const v=current.data[f.id],err=errors.find(e=>e.id===f.id),req=isRequired(f,current.data),hint=f.placeholder&&f.placeholder!==f.label?f.placeholder:'';const title=`${esc(f.label)}<span class="badge ${req?'required':''}">${req?'必填':'选填'}</span>${f.kind==='multi'?'<span class="field-multi">多选</span>':''}`;let content='';
 if(f.kind==='text'||f.kind==='textarea'){const described=[hint&&`hint-${f.id}`,err&&`error-${f.id}`].filter(Boolean).join(' ');const attrs=`id="field-${f.id}" data-field="${f.id}" class="text-input" maxlength="${f.max||5000}" ${req?'required aria-required="true"':''} ${err?'aria-invalid="true"':''} ${described?`aria-describedby="${described}"`:''}`;content=`<label class="field-title" for="field-${f.id}">${title}</label>${hint?`<p class="hint" id="hint-${f.id}">${esc(hint)}</p>`:''}${f.kind==='textarea'?`<textarea ${attrs}>${esc(v)}</textarea>`:`<input type="text" ${attrs} value="${esc(v)}">`}`}
 else{const single=f.kind==='single';content=`<fieldset class="choice-set" ${single?'role="radiogroup"':''} ${err?`aria-invalid="true" aria-describedby="error-${f.id}"`:''}><legend>${title}</legend><div class="${f.cards?'choice-grid':'chips'}">${f.options.map(o=>{const selected=Array.isArray(v)?v.includes(o.value):v===o.value;return `<button type="button" class="${f.cards?'choice':'chip'} ${single?'radio':''} ${selected?'selected':''}" data-choice="${f.id}" data-value="${o.value}" ${single?`role="radio" aria-checked="${selected}"`:`aria-pressed="${selected}"`}>${f.cards?`<span class="choice-mark" aria-hidden="true">✓</span><span class="choice-text"><strong>${esc(o.label)}</strong>${o.description?`<small>${esc(o.description)}</small>`:''}</span>`:esc(o.label)}</button>`}).join('')}</div></fieldset>`}
 return `<div class="field ${err?'has-error':''}" data-group="${f.id}">${content}${err?`<div id="error-${f.id}" class="field-error" role="alert">${esc(err.message)}</div>`:''}</div>`;
}
function renderSteps(){$('#steps').innerHTML=(isIdea()?ideaTitles:titles).map((t,i)=>{const p=isIdea()?ideaProgress(current.idea,i):stepProgress(current.data,i),count=i<(isIdea()?2:4);return `<button class="step ${step===i?'active':''}" data-${isIdea()?'idea-step':'step'}="${i}" ${step===i?'aria-current="step"':''}><span class="number">${i+1}</span><span class="step-label">${t}</span>${count?`<small aria-label="已填 ${p.filled} 项，共 ${p.total} 项" title="已填 / 当前可见字段">${p.filled}/${p.total}</small>`:''}</button>`}).join('');
 const nav=$('#steps'),active=nav.querySelector('.step.active');if(active&&nav.scrollWidth>nav.clientWidth)nav.scrollLeft+=active.getBoundingClientRect().left-nav.getBoundingClientRect().left-(nav.clientWidth-active.offsetWidth)/2}

const footerText=()=>`${step+1} / 4 · ${stepProgress(current.data,step).filled}/${fields.filter(f=>f.step===step&&visible(f,current.data)).length} 已填`;
function render(){
 for(const b of document.querySelectorAll('[data-mode]')){const active=b.dataset.mode===(current.mode||'project');b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))}
 $('#newBtn').textContent=isIdea()?'新想法':'新项目';
 $('#formView').hidden=isIdea();$('#resultView').hidden=isIdea();$('#ideaView').hidden=!isIdea();
 renderSteps();if(isIdea()){$('#formView').replaceChildren();$('#resultView').replaceChildren();$('#ideaView').innerHTML=ideaHTML(current.idea,step,errors.length>0);return}
 $('#ideaView').replaceChildren();
$('#formView').hidden=step===4;$('#resultView').hidden=step!==4;if(step===4){renderResult();return}const fs=fields.filter(f=>f.step===step&&visible(f,current.data)),req=fs.some(f=>isRequired(f,current.data));$('#formView').innerHTML=`<div class="page-heading"><h1>${titles[step]}</h1>${step?`<span class="muted">${req?`交付目标为「${esc(label('depth',current.data.depth))}」，标为必填的需要填写`:'选填'}</span>`:''}</div><div class="form-card">${step?'<details class="field-help"><summary>待推荐与待确认有什么区别？</summary><p>待推荐：交给 AI 提出方案。待确认：留给你决定。多选时可以保留已有选择。</p></details>':''}${fs.map(fieldHTML).join('')}</div><div class="form-footer"><span class="footer-meta" id="footerMeta">${footerText()}</span><div class="footer-actions">${step?'<button class="btn" data-prev>上一步</button>':''}${step<3?'<button class="btn" data-result>生成简报</button>':''}<button class="btn primary" data-next>${step===3?'生成简报':step>0&&!req?'下一步 / 跳过':'下一步'}</button></div></div>`}
const list=a=>`<ul>${a.map(s=>`<li>${esc(s)}</li>`).join('')}</ul>`;
// 交接状态：该由人定的是否都定了。
function statusHTML(h){const state=validate(current.data).length?'blocked':h.open.length?'pending':'ready';
 const title={blocked:'必填信息未完成',pending:`还有 ${h.open.length} 项需要你决定`,ready:'可以交给 AI'}[state];
 const note={blocked:'回到表单补齐必填项。',pending:'在下方逐条写下决定，或点「交给 AI 决定」。没决定的事项会写进简报，AI 开工前必须先问你。',ready:'该由你定的都已定下。复制或导出简报，交给 AI 开发。'}[state];
 const counts=[['人已决定',h.decided.length+h.settled.length],['交给 AI',h.ai.length],['待你决定',h.open.length],['需要你准备',h.prepare.length]];
 return `<section class="handoff ${state}" id="handoffStatus"><h2><span class="handoff-dot" aria-hidden="true"></span>${title}</h2><p>${note}</p><dl class="handoff-counts">${counts.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl></section>`}
const answerState=a=>!(a||'').trim()?'待你决定':a.trim()===AI_DECIDES?'已交给 AI':'已决定';
const delegateLabel=a=>(a||'').trim()===AI_DECIDES?'改为自己决定':AI_DECIDES,previousAnswers=new Map();
function questionHTML(q){const a=current.data.answers[q.id]||'';return `<div class="decision ${a.trim()?'done':''}" data-question="${esc(q.id)}"><label class="decision-q" for="answer-${esc(q.id)}">${esc(q.q)}</label><textarea id="answer-${esc(q.id)}" class="text-input" data-answer="${esc(q.id)}" maxlength="2000" placeholder="写下你的决定">${esc(a)}</textarea><div class="decision-actions"><span class="decision-state">${answerState(a)}</span><button type="button" class="btn subtle" data-delegate="${esc(q.id)}">${delegateLabel(a)}</button></div></div>`}
const aiList=h=>list(h.ai.length?h.ai:['无，全部事项由你决定。']);
// 作答时只刷新状态、计数和简报，保留输入焦点。
function refreshHandoff(){const h=handoff(current.data),was=$('#handoffStatus h2')?.textContent;$('#handoffStatus').outerHTML=statusHTML(h);const now=$('#handoffStatus h2').textContent;if(now!==was)announce(now);$('#aiList').innerHTML=aiList(h);for(const el of document.querySelectorAll('[data-question]')){const a=current.data.answers[el.dataset.question]||'';el.classList.toggle('done',!!a.trim());el.querySelector('.decision-state').textContent=answerState(a);el.querySelector('[data-delegate]').textContent=delegateLabel(a)}const count=$('#decisionCount');if(count)count.textContent=`${h.open.length} 项待定`;$('#briefText').value=brief(current.data)}
function renderResult(){const d=current.data,p=recommend(d),h=handoff(d),active=fields.filter(f=>visible(f,d)&&answered(d[f.id]));$('#resultView').innerHTML=`<h1>${esc(d.name.trim()||'项目简报')}</h1><div class="toolbar"><button class="btn primary" id="copyBrief">复制简报</button><button class="btn" id="exportMd">导出 Markdown</button><button class="btn" id="exportJson">备份 JSON</button><button class="btn" data-step="0">编辑</button></div>${statusHTML(h)}${h.questions.length?`<section class="result-card"><h3>需要你决定 <span class="badge" id="decisionCount">${h.open.length} 项待定</span></h3><p class="muted">这些事会影响业务、成本、权限或范围，由你来定。也可以交给 AI，它会在开工前给出选择和理由，等你确认。</p><div class="decision-list">${h.questions.map(questionHTML).join('')}</div></section>`:''}<section class="result-card"><h3>交给 AI 决定</h3><p class="muted">AI 开工前会列出它的选择和理由，等你确认后再写代码。</p><div id="aiList">${aiList(h)}</div></section>${h.prepare.length?`<section class="result-card"><h3>需要你准备</h3>${list(h.prepare)}<p class="muted" style="margin:12px 0 0">AI 用到时会向你要。不要把密码或密钥写进表单或简报。</p></section>`:''}<section class="result-card"><h3>开发阶段</h3><p class="muted">AI 每做完一个阶段就停下，等你验收后再继续。</p><ol class="phase-list">${h.phases.map(x=>`<li><strong>${esc(x.title)}</strong><span>做什么：${esc(x.do)}</span><span>怎么验收：${esc(x.check)}</span></li>`).join('')}</ol></section><section class="result-card"><div class="toolbar"><button class="btn primary" id="generateAgents" ${generating||serviceNote()?'disabled':''}>${generating?'生成中…':'生成 AGENTS.md'}</button><button class="btn" id="downloadAgents" ${generated.get(current.id)?'':'hidden'}>下载 AGENTS.md</button></div><p class="muted" id="agentsStatus" role="status">${generating?'正在调用本机 Codex':serviceNote()||(generated.get(current.id)&&generated.get(current.id).input!==brief(d)?'简报已变化，下面的 AGENTS.md 草案已过期，请重新生成。':'使用本机 Codex · 生成项目约束与验收标准')}</p><textarea class="text-input brief-text" id="agentsText" aria-label="AGENTS.md 草案" ${generated.get(current.id)?'':'hidden'}>${esc(generated.get(current.id)?.markdown||'')}</textarea></section><div class="result-banner"><span class="pill">建议</span><h2 style="margin-top:12px">${esc(p.mode)}</h2><p>${esc(p.first)}</p></div><div class="result-grid"><section class="result-card"><h3>你的参与</h3>${list(p.you)}<p style="margin:14px 0 0">${esc(p.participation)}</p></section><section class="result-card"><h3>助手负责</h3>${list(p.agent)}<p style="margin:14px 0 0">${esc(p.priority)}</p></section></div><section class="result-card"><h3>已填写 <span class="badge">${active.length} 项</span></h3><dl class="summary-list">${active.map(f=>`<div class="summary-row"><dt><button class="summary-edit" data-edit-field="${f.id}" data-edit-step="${f.step}" title="修改${esc(f.label)}">${esc(f.label)} <span aria-hidden="true">↗</span></button></dt><dd>${esc(label(f.id,d[f.id]))}</dd></div>`).join('')}</dl></section><section class="result-card"><h3>架构判断方向</h3>${list(p.architecture.length?p.architecture:['先结合目标确认业务关系、数据和运行边界。'])}</section><section class="result-card"><h3>验证重点</h3>${list(p.checks)}</section><details class="result-card"><summary>完整简报</summary><textarea class="text-input brief-text" id="briefText" aria-label="完整项目简报" readonly>${esc(brief(d))}</textarea></details><p class="muted">复制或导出后发给开发会话。生成 AGENTS.md 时会将简报发送给本机 Codex 使用的模型。</p>`}
// 进入第 2 步只检查第 1 步的必填；生成简报时检查全部，并跳到第一个缺项所在的步骤。
// 步骤写进地址（#1–#5），浏览器后退、刷新都回到对应步骤。
function setHash(replace){const h=(isIdea()?'#idea-':'#')+(step+1);if(location.hash!==h)history[replace?'replaceState':'pushState'](null,'',h)}
function navigate(next,fromHistory=false){const all=validate(current.data);
 if(next>0){const blocking=next===4?all:all.filter(e=>e.step===0);if(blocking.length){errors=blocking;step=blocking[0].step;render();setHash(fromHistory);const el=$(`[data-group="${blocking[0].id}"]`);el?.scrollIntoView({block:'center'});el?.querySelector('input,textarea,button')?.focus({preventScroll:true});if(next===4)toast(`还有 ${blocking.length} 项必填未填写：${blocking.map(e=>fields.find(f=>f.id===e.id).label).join('、')}`);return}}
 errors=errors.filter(e=>all.some(x=>x.id===e.id));step=next;render();setHash(fromHistory);$('#main').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'})}
function readRoute(){const match=location.hash.match(/^#(idea-)?([1-5])$/);if(!match)return {mode:current.mode,step:0};return {mode:match[1]?'idea':'project',step:Number(match[2])-1}}
window.addEventListener('popstate',()=>{const r=readRoute();if(r.mode!==current.mode){current.mode=r.mode;persist(current,false)}if(isIdea())navigateIdea(Math.min(r.step,2),true);else navigate(r.step,true)});
function download(content,ext,mime){const name=draftName(current).replace(/[\\/:*?"<>|\u0000-\u001f]/g,'-').slice(0,80),url=URL.createObjectURL(new Blob([content],{type:mime}));const a=document.createElement('a');a.href=url;a.download=`${name}.${ext}`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000)}
function exportJSON(){download(JSON.stringify({app:'project-kickoff',version:VERSION,exportedAt:new Date().toISOString(),project:current},null,2),'json','application/json;charset=utf-8')}
async function copy(){try{await navigator.clipboard.writeText(brief(current.data));const open=handoff(current.data).open.length;toast(open?`已复制。还有 ${open} 项没决定，AI 开工前会先问你`:'已复制，可以交给 AI')}catch{const t=$('#briefText');t.closest('details').open=true;t.focus();t.select();toast('请使用复制快捷键，或导出 Markdown')}}
function showDrafts(){const sorted=[...projects].sort((a,b)=>b.updated.localeCompare(a.updated));$('#draftList').innerHTML=sorted.map(p=>`<div class="draft-row"><div class="draft-info"><b>${esc(draftName(p))}${p.id===current.id?' · 当前':''}</b><small>${esc(p.mode==='idea'?'想法 · '+p.idea.tasks.filter(t=>t.done).length+'/'+p.idea.tasks.length+' 已完成':label('types',p.data.types)||'未选类型')} · ${esc(new Date(p.updated).toLocaleString('zh-CN',{dateStyle:'short',timeStyle:'short'}))}</small></div><button class="btn" data-open-draft="${esc(p.id)}">打开</button><button class="btn subtle danger" data-delete-draft="${esc(p.id)}">删除</button></div>`).join('');if(!$('#draftDialog').open)$('#draftDialog').showModal()}
function choose(f,v){for(const q of handoff(current.data).questions)if(q.covers===f.id)delete current.data.answers[q.id];if(f.kind==='multi'){const values=current.data[f.id];current.data[f.id]=values.includes(v)?values.filter(x=>x!==v):[...values,v]}else current.data[f.id]=current.data[f.id]===v?'':v;errors=errors.filter(e=>e.id!==f.id);persist();render();$(`[data-choice="${f.id}"][data-value="${v}"]`)?.focus({preventScroll:true})}
// Preserve typing focus; only redraw the form when its structure changes.
document.addEventListener('input',e=>{const id=e.target.dataset.field;if(!id)return;current.data[id]=e.target.value;if(answered(e.target.value)){errors=errors.filter(x=>x.id!==id);const field=e.target.closest('.field');field.classList.remove('has-error');field.querySelector('.field-error')?.remove();e.target.removeAttribute('aria-invalid')}persist();renderSteps();const fm=$('#footerMeta');if(fm)fm.textContent=footerText()});
document.addEventListener('input',e=>{const id=e.target.dataset.answer;if(id===undefined)return;current.data.answers={...current.data.answers,[id]:e.target.value};persist();refreshHandoff()});
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
 if(handleIdeaClick(b))return;
 if(b.dataset.delegate){const id=b.dataset.delegate,a=current.data.answers[id]||'';let next=AI_DECIDES;if(a.trim()===AI_DECIDES)next=previousAnswers.get(id)||'';else if(a.trim())previousAnswers.set(id,a);current.data.answers={...current.data.answers,[id]:next};const ta=document.getElementById('answer-'+id);if(ta)ta.value=next;persist();refreshHandoff();return}
 if(b.dataset.editField){navigate(Number(b.dataset.editStep));const target=$(`[data-group="${b.dataset.editField}"]`);target?.scrollIntoView({block:'center'});(target?.querySelector('[aria-pressed="true"],[aria-checked="true"]')||target?.querySelector('input,textarea,button'))?.focus({preventScroll:true});return}
 if(b.dataset.choice){choose(fields.find(f=>f.id===b.dataset.choice),b.dataset.value);return}
 if(b.dataset.step!==undefined)return navigate(Number(b.dataset.step));if(b.hasAttribute('data-next'))return navigate(step+1);if(b.hasAttribute('data-prev'))return navigate(step-1);if(b.hasAttribute('data-result'))return navigate(4);
 if(b.id==='generateAgents')return generateAgents();if(b.id==='downloadAgents')return downloadAgents();if(b.id==='copyBrief')return copy();if(b.id==='exportMd')return download(brief(current.data),'md','text/markdown;charset=utf-8');if(b.id==='exportJson'||b.id==='backupDraft')return exportJSON();
 if(b.id==='newBtn'){if(isBlankProject(current)){if(isIdea())navigateIdea(0);else navigate(0);toast('当前已经是空白草稿');return}if(storageError&&!confirm('当前草稿未能保存，仍要创建新项目吗？'))return;current=newDraft(current.mode);projects.push(current);persist();step=0;errors=[];render();setHash(true);toast(isIdea()?'新想法已创建':'新项目已创建');return}
 if(b.id==='draftsBtn')return showDrafts();if(b.id==='closeDrafts')return $('#draftDialog').close();if(b.id==='importBtn'){$('#importFile').value='';$('#importFile').click();return}
 if(b.dataset.openDraft){current=projects.find(p=>p.id===b.dataset.openDraft)||current;step=0;errors=[];persist(current,false);$('#draftDialog').close();render();setHash(true);return}
 if(b.dataset.deleteDraft){const target=projects.find(p=>p.id===b.dataset.deleteDraft);if(!target||!confirm(`删除草稿「${draftName(target)}」？删除后无法恢复。`))return;removed.add(target.id);projects=projects.filter(p=>p!==target);if(current===target){current=projects[0]||newDraft();if(!projects.includes(current))projects.push(current);step=0;errors=[];setHash(true)}persist(current,false);render();showDrafts();($('#draftList [data-open-draft]')||$('#closeDrafts')).focus()}
});
$('#importFile').addEventListener('change',async e=>{const file=e.target.files[0];if(!file)return;try{if(file.size>500000)throw Error('文件超过 500 KB');const raw=JSON.parse(await file.text());if(raw.app!=='project-kickoff'||raw.version!==VERSION)throw Error('不是受支持的项目备份');const issues=[],parsed=validProject({...raw.project,id:uid()},issues);current={...parsed,updated:new Date().toISOString(),agents:null};projects.push(current);step=0;errors=[];persist();render();setHash(true);$('#draftDialog').close();toast(issues.length?`已导入为新草稿，并按新版表单调整：${[...new Set(issues)].join('；')}`:'已导入为新草稿')}catch(err){toast(err instanceof SyntaxError?'导入失败：文件不是有效的 JSON 备份。':`导入失败：${err.message}`)}});
$('.brand').addEventListener('click',e=>{e.preventDefault();if(isIdea())navigateIdea(0);else navigate(0)});
function navigateIdea(next,fromHistory=false){
 if(next>0&&!current.idea.thought.trim()){errors=[{id:'thought'}];step=0;render();setHash(fromHistory);$('#idea-thought').focus();return}
 errors=[];step=next;if(next===2){ensureTasks(current.idea);persist()}
 render();setHash(fromHistory);$('#main').focus({preventScroll:true});window.scrollTo({top:0,behavior:'instant'});
}
async function copyIdea(){try{await navigator.clipboard.writeText(ideaPrompt(current.idea));toast('已复制，粘贴到 AI 助手继续')}catch{const t=$('#ideaPrompt');t.closest('details').open=true;t.focus();t.select();toast('请使用复制快捷键')}}
function handleIdeaClick(b){
 if(b.dataset.mode){if(b.dataset.mode===current.mode)return true;current.mode=b.dataset.mode;step=0;errors=[];persist();render();setHash();return true}
 if(b.dataset.ideaStep!==undefined){navigateIdea(Number(b.dataset.ideaStep));return true}
 if(b.dataset.ideaChoice){const id=b.dataset.ideaChoice;current.idea[id]=current.idea[id]===b.dataset.value?'':b.dataset.value;persist();render();$(`[data-idea-choice="${id}"][data-value="${b.dataset.value}"]`)?.focus({preventScroll:true});return true}
 if(b.dataset.example){const sample=directions.find(x=>x.id===b.dataset.example);if(current.idea.thought.trim()&&!confirm('替换当前想法文字为这个例子？其他填写内容会保留。'))return true;current.idea.thought=sample.example;current.idea.direction=sample.id;errors=[];persist();render();$('#idea-thought').focus();return true}
 if(b.id==='copyIdeaPrompt'){copyIdea();return true}
 if(b.id==='exportIdea'){download(ideaBrief(current.idea),'md','text/markdown;charset=utf-8');return true}
 if(b.id==='resetIdeaTasks'){if(!confirm('重新整理会替换行动文字并清空勾选状态。尝试结果会保留，继续吗？'))return true;current.idea.tasks=suggestedTasks(current.idea);current.idea.taskSource=ideaSource(current.idea);persist();render();toast('行动卡已重新整理');return true}
 if(b.id==='ideaToProject'){
  if(storageError&&!confirm('当前想法未能保存，请先备份。仍要创建项目草稿吗？'))return true;
  const source=current.idea;current=newDraft('project');Object.assign(current.data,projectSeed(source));projects.push(current);step=0;errors=[];persist();render();setHash();toast('项目草稿已创建，原想法保留在「我的草稿」');return true;
 }
 return false;
}
function refreshIdeaOutput(){const p=$('#ideaPrompt');if(p)p.value=ideaPrompt(current.idea);const count=$('#taskCount');if(count)count.textContent=`${current.idea.tasks.filter(t=>t.done).length}/${current.idea.tasks.length} 已完成`}
document.addEventListener('input',e=>{
 const el=e.target,id=el.dataset.ideaField;
 if(id!==undefined){current.idea[id]=el.value;if(id==='thought'&&el.value.trim()){errors=[];el.removeAttribute('aria-invalid');el.removeAttribute('aria-describedby');el.closest('.field').classList.remove('has-error');$('#idea-error')?.remove()}persist();renderSteps();const p=ideaProgress(current.idea,step);$('#ideaFooterMeta').textContent=`${step+1} / 3 · ${p.filled}/${p.total} 已填`;return}
 if(el.dataset.taskText!==undefined){const task=current.idea.tasks[Number(el.dataset.taskText)];task.text=el.value;persist();refreshIdeaOutput();return}
 if(el.hasAttribute('data-idea-feedback')){current.idea.feedback=el.value;persist();refreshIdeaOutput()}
});
document.addEventListener('change',e=>{const el=e.target;if(el.dataset.taskDone===undefined)return;current.idea.tasks[Number(el.dataset.taskDone)].done=el.checked;el.closest('.action-row').classList.toggle('done',el.checked);persist();refreshIdeaOutput()});
render();if(storageError)$('#saveStatus').textContent='保存不可用 · 请导出';
{const r=readRoute();if(r.mode===current.mode&&r.step>0){if(isIdea())navigateIdea(Math.min(r.step,2),true);else navigate(r.step,true)}}
// 生成 AGENTS.md 需要本机服务（server.py）调用 Codex；网页版没有这个服务，提前说明，而不是点了才报错。
function serviceNote(){return localService?.offline?'网页版不能生成 AGENTS.md：需要在你的电脑上启动表单（见 README），由本机 Codex 生成。网页版的草稿不会自动出现在本机版里，请先「备份 JSON」，再到本机版「我的草稿 → 导入 JSON」。':localService&&!localService.available?'未检测到本机 Codex：安装并登录 Codex CLI 后，重新启动表单。':localService&&localService.skillAvailable===false?`找不到 focused-delivery 技能（${localService.skill}）：恢复该文件，或用环境变量 KICKOFF_SKILL 指定位置后重新启动表单。`:''}
fetch('api/status').then(r=>r.json()).then(s=>{localService=s}).catch(()=>{localService={available:false,offline:true}}).finally(()=>{const b=$('#generateAgents');if(b&&!generating&&serviceNote()){b.disabled=true;$('#agentsStatus').textContent=serviceNote()}});
const context=document.modelContext;
if(context?.registerTool){try{Promise.resolve(context.registerTool({name:'read_project_kickoff',title:'读取想法或项目简报',description:'读取当前想法行动卡，或项目表单、必填缺口与协作建议；不修改状态或发送消息。',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:true},execute(input){if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length)throw Error('不接受参数');if(isIdea())return {brief:ideaBrief(current.idea),missingRequired:current.idea.thought.trim()?[]:['thought'],openQuestions:[],source:'local-rules'};return {brief:brief(current.data),missingRequired:validate(current.data).map(e=>e.id),openQuestions:handoff(current.data).open.map(q=>q.q)}}})).catch(()=>{});}catch{}}

async function generateAgents(){
 if(generating)return;
 if(generated.has(current.id)&&!confirm('重新生成会覆盖下面的 AGENTS.md 草案（包括你的修改），继续吗？'))return;
 const projectId=current.id, input=brief(current.data);
 generating=true;renderResult();
 try{
  const r=await fetch('api/generate-agents',{method:'POST',headers:{'Content-Type':'application/json','X-Kickoff-Request':'1'},body:JSON.stringify({brief:input})});
  let result;try{result=await r.json()}catch{throw Error('请通过本机启动服务使用模型生成，独立 HTML 不支持此功能')}
  if(!r.ok)throw Error(result.error||'生成失败');
  if(typeof result.markdown!=='string')throw Error('生成结果无效');
  const artifact={markdown:result.markdown,input};generated.set(projectId,artifact);const owner=projects.find(p=>p.id===projectId);if(owner){owner.agents=artifact;persist(owner)}
  if(current.id===projectId&&!isIdea()&&step===4){renderResult();$('#agentsStatus').textContent=brief(current.data)===input?'已生成 · 草案可编辑，采用前核对待确认项':'已生成旧版输入的草案 · 表单已变化，请重新生成'}
  toast('AGENTS.md 已生成');
 }catch(e){if(current.id===projectId&&!isIdea()&&step===4)$('#agentsStatus').textContent=e.message;toast(e.message)}
 finally{generating=false;if($('#generateAgents')){$('#generateAgents').disabled=false;$('#generateAgents').textContent='生成 AGENTS.md'}}
}
function downloadAgents(){
 const item=generated.get(current.id);if(!item)return;
 if(item.input!==brief(current.data)){toast('表单已变化，请重新生成 AGENTS.md');return}
 const content=$('#agentsText').value;item.markdown=content;
 const url=URL.createObjectURL(new Blob([content],{type:'text/markdown;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='AGENTS.md';a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);
}
document.addEventListener('input',e=>{if(e.target.id==='agentsText'&&generated.has(current.id)){generated.get(current.id).markdown=e.target.value;current.agents=generated.get(current.id);persist()}});
