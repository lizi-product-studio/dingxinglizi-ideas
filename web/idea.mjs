// The public site uses local rules, not a model. Keep suggestions editable and
// separate from the user's decisions and from the existing project form.
export const directions = [
  {id:'time', label:'省点时间', example:'每周整理报销单很费时间，想让它更省事', try:'选一次真实任务，用现成工具或表格做完，记下用时和卡住的地方。'},
  {id:'life', label:'改善生活', example:'家里的食材总是放到过期，想少浪费一些', try:'选一个真实场景，用清单或手动方式试一次，记录是否更方便。'},
  {id:'create', label:'做点作品', example:'想把家人的拿手菜整理成一本小食谱', try:'先完成一个能给人看的小样，不急着做完整作品。'},
  {id:'business', label:'试个生意', example:'想帮附近的宠物主人临时照看宠物，先看看有没有人需要', try:'把服务内容做成一个简单样例，找一位可能需要的人了解具体需求，不急着投入。'},
];
export const ideaFields = [
  {id:'thought',step:0,label:'想做的事',required:true,placeholder:'一个麻烦、一个愿望，或一个想试试的点子',max:2000},
  {id:'direction',step:0,label:'方向',options:directions},
  {id:'who',step:0,label:'给谁用',placeholder:'自己、家人、同事，或某一类人',max:500},
  {id:'firstTry',step:1,label:'先试哪一小步',placeholder:'如：先整理 3 道菜，发给家人看看',max:1000},
  {id:'success',step:1,label:'怎样算有用',placeholder:'如：家人能照着做出一道菜',max:1000},
  {id:'time',step:1,label:'这次投入的时间',options:[{id:'half',label:'半小时'},{id:'evening',label:'一个晚上'},{id:'weekend',label:'一个周末'},{id:'flexible',label:'暂不限定'}]},
  {id:'resources',step:1,label:'已有条件 / 限制',placeholder:'资料、工具、能帮忙的人、预算或不想做的事',max:1500},
];
export const ideaTitles=['想法','小尝试','行动卡'];
export const blankIdea=()=>({...Object.fromEntries(ideaFields.map(f=>[f.id,''])),tasks:[],taskSource:'',feedback:''});
export function normalizeIdea(raw){
  const d=blankIdea();if(!raw||typeof raw!=='object'||Array.isArray(raw))return d;
  for(const f of ideaFields){const v=raw[f.id];if(typeof v==='string'&&(!f.options||f.options.some(o=>o.id===v)))d[f.id]=v.slice(0,f.max||50)}
  // Unknown tasks cannot become executable code. Text stays bounded and is escaped in the view.
  if(Array.isArray(raw.tasks))d.tasks=raw.tasks.slice(0,10).filter(t=>t&&typeof t.text==='string').map((t,i)=>({id:`task-${i}`,text:t.text.slice(0,1500),done:t.done===true}));
  if(typeof raw.taskSource==='string')d.taskSource=raw.taskSource.slice(0,12000);
  if(typeof raw.feedback==='string')d.feedback=raw.feedback.slice(0,3000);
  return d;
}
export const ideaSource=d=>JSON.stringify(ideaFields.map(f=>d[f.id]));
export function ideaProgress(d,step){const fs=ideaFields.filter(f=>f.step===step);return {filled:fs.filter(f=>(d[f.id]||'').trim()).length,total:fs.length}}
export const ideaTitle=d=>(d.thought.trim().split('\n')[0]||'未命名想法').slice(0,60);
export function suggestedTasks(d){
  const who=d.who.trim()||'一位可能受益的人';
  const first=d.firstTry.trim()||directions.find(x=>x.id===d.direction)?.try||'选一个真实场景，先用现成工具、表格或手动方式试一次。';
  const subject=d.thought.trim().length>90?d.thought.trim().slice(0,90)+'…':d.thought.trim();
  const understand=d.direction==='create'?`确定这份作品${d.who.trim()?`要给${d.who.trim()}看`:'给谁看'}，找一份喜欢的参考，选出最想先做的一小部分。`:d.direction==='business'?`向${who}了解一个实际需求、目前怎么解决，以及愿意为哪部分付费。先收集反馈，不做收款承诺。`:`围绕「${subject}」，${d.who.trim()==='自己'?'记录自己最近一次遇到的具体情形':`和${who}确认最近一次遇到的情形、现在的做法和最麻烦的一点`}。`;
  return [
    understand,
    `${first}${/[。！？.!?]$/.test(first)?'':'。'}${d.time&&d.time!=='flexible'?` 本次控制在${ideaFields.find(f=>f.id==='time').options.find(o=>o.id===d.time)?.label}内，做不完就缩小范围。`:''}`,
    d.success.trim()?`试完后对照「${d.success.trim()}」记录实际结果，再决定继续、调整或停下。`:'记下这次尝试带来的变化、仍然不方便的地方，再决定继续、调整或停下。',
  ].map((text,i)=>({id:`task-${i}`,text,done:false}));
}
export function ensureTasks(d){if(!d.tasks.length){d.tasks=suggestedTasks(d);d.taskSource=ideaSource(d)}return d}
export const tasksStale=d=>!!d.tasks.length&&d.taskSource!==ideaSource(d);
export function ideaBrief(d){
  const lines=ideaFields.filter(f=>d[f.id]?.trim()).map(f=>`- ${f.label}：${f.options?.find(o=>o.id===d[f.id])?.label||d[f.id].trim().replace(/\n/g,'\n  ')}`);
  return `# ${ideaTitle(d)}\n\n## 想法与条件\n${lines.join('\n')}\n\n## 行动草案\n按表单规则整理，可自行修改；不是模型分析，也不代表已验证可行。${tasksStale(d)?'\n注意：想法已修改，以下行动仍是先前版本，请重新核对。':''}\n${d.tasks.map(t=>`- [${t.done?'x':' '}] ${t.text.replace(/\n/g,'\n  ')}`).join('\n')}\n\n## 尝试结果\n${d.feedback.trim()||'尚未记录'}\n`;
}
export function ideaPrompt(d){return `${ideaBrief(d)}\n## 请协助我继续\n先判断这个想法是否值得试，以及能否用现成工具、模板或手动方式完成。给出两三个可比较的方向，标明假设与取舍，不默认要开发软件。只追问会改变方向的缺口，每次最多问两个问题。选定方向后，帮我完成最小的一步，给出可用的作品、模板或执行步骤，并说明怎样检验结果。不要把行动草案当作我的授权或已确定需求；花钱、对外发布、发消息或使用他人数据前，先取得具体授权。只有我提出开发需求时，再整理项目范围与验收标准。模型和推理设置由我决定。\n`}
export function projectSeed(d){
  // Transfer only explicit inputs. Do not invent a product type, acceptance
  // criterion or deployment requirement from a generic action suggestion.
  return {goal:d.thought.trim(),acceptance:d.success.trim(),constraints:d.resources.trim(),notes:[d.who.trim()&&`给谁用：${d.who.trim()}`,d.firstTry.trim()&&`先试的一步：${d.firstTry.trim()}`,d.time&&`尝试投入：${ideaFields.find(f=>f.id==='time').options.find(o=>o.id===d.time)?.label}`,d.feedback.trim()&&`尝试结果：${d.feedback.trim()}`].filter(Boolean).join('\n')};
}
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function fieldHTML(f,d,error){const title=`${esc(f.label)}<span class="badge ${f.required?'required':''}">${f.required?'必填':'选填'}</span>`;
  if(f.options)return `<div class="field"><fieldset class="choice-set"><legend>${title}</legend><div class="chips">${f.options.map(o=>`<button class="chip ${d[f.id]===o.id?'selected':''}" data-idea-choice="${f.id}" data-value="${o.id}" aria-pressed="${d[f.id]===o.id}">${esc(o.label)}</button>`).join('')}</div></fieldset></div>`;
  return `<div class="field ${error&&f.required?'has-error':''}"><label class="field-title" for="idea-${f.id}">${title}</label><textarea class="text-input" id="idea-${f.id}" data-idea-field="${f.id}" maxlength="${f.max}" placeholder="${esc(f.placeholder)}" ${f.required?'required':''} ${error&&f.required?'aria-invalid="true" aria-describedby="idea-error"':''}>${esc(d[f.id])}</textarea>${error&&f.required?'<p class="field-error" id="idea-error" role="alert">先写下一件想做的事</p>':''}</div>`;
}
export function ideaHTML(d,step,error=false){
  if(step===2)return `<div class="page-heading"><h1>行动卡</h1><span class="muted" id="taskCount">${d.tasks.filter(t=>t.done).length}/${d.tasks.length} 已完成</span></div><section class="result-card idea-summary"><p>${esc(d.thought)}</p><button class="btn subtle" data-idea-step="0">修改想法</button></section><div class="toolbar"><button class="btn primary" id="copyIdeaPrompt">复制给 AI</button><button class="btn" id="exportIdea">导出行动卡</button><button class="btn" id="exportJson">备份 JSON</button></div><section class="result-card"><div class="card-heading"><h2>先做这几件事</h2><button class="btn subtle" id="resetIdeaTasks">重新整理</button></div><p class="muted">按你的填写整理，可直接修改。</p>${tasksStale(d)?'<p class="stale-note" role="status">想法已修改。核对下面的行动，或重新整理。</p>':''}<div class="action-list">${d.tasks.map((t,i)=>`<div class="action-row ${t.done?'done':''}"><input type="checkbox" data-task-done="${i}" aria-label="第 ${i+1} 项完成" ${t.done?'checked':''}><textarea class="text-input" data-task-text="${i}" aria-label="第 ${i+1} 项行动" maxlength="1500">${esc(t.text)}</textarea></div>`).join('')}</div></section><section class="result-card"><label class="field-title" for="idea-feedback">尝试结果<span class="badge">选填</span></label><textarea class="text-input" id="idea-feedback" data-idea-feedback maxlength="3000" placeholder="实际发生了什么？哪些要保留，哪些要调整？">${esc(d.feedback)}</textarea></section><section class="next-path"><div><h2>需要做成软件？</h2><p class="muted">把想法带入项目表单，继续确定功能和交付范围。</p></div><button class="btn" id="ideaToProject">转为项目草稿</button></section><details class="result-card"><summary>查看发给 AI 的内容</summary><p class="muted">复制后粘贴到你使用的 AI 助手；本页不会调用模型。</p><textarea id="ideaPrompt" class="text-input brief-text" aria-label="发给 AI 的内容" readonly>${esc(ideaPrompt(d))}</textarea></details><div class="form-footer"><span class="footer-meta">3 / 3</span><button class="btn" data-idea-step="1">修改小尝试</button></div>`;
  const p=ideaProgress(d,step);
  return `<div class="page-heading"><h1>${step?'小尝试':'梳理想法'}</h1>${step?'<span class="muted">可跳过</span>':''}</div>${!step?`<details class="idea-examples"><summary>还没想好？看看例子</summary><div class="example-grid">${directions.map(o=>`<button class="example" data-example="${o.id}"><strong>${o.label}</strong><span>${esc(o.example)}</span><small>用这个例子 ↗</small></button>`).join('')}</div></details>`:''}<div class="form-card">${ideaFields.filter(f=>f.step===step).map(f=>fieldHTML(f,d,error)).join('')}</div><div class="form-footer"><span class="footer-meta" id="ideaFooterMeta">${step+1} / 3 · ${p.filled}/${p.total} 已填</span><div class="footer-actions">${step?'<button class="btn" data-idea-step="0">上一步</button>':'<button class="btn" data-idea-step="2">直接整理</button>'}<button class="btn primary" data-idea-step="${step+1}">${step?'整理行动卡':'下一步'}</button></div></div>`;
}
