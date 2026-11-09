(() => {
  const projects = {
  "operations": {
    "number": "01",
    "name": "序章",
    "subtitle": "运营工作台",
    "english": "OPERATIONS",
    "category": "企业软件开发 / 概念演示",
    "description": "项目进度、任务和记录，<br>放在一起查看。",
    "type": "企业协作 · 产品概念",
    "fields": "产品设计 / 交互设计 / 前端原型",
    "contextTitle": "任务发在群里，<br>进度还要挨个问。",
    "context": "多个人同时做事时，任务可能在群聊里，进度记在表格里，确认结果又散在不同消息里。这个概念把项目、负责人、任务状态和操作记录放在一起，看看日常协作可以如何进行。",
    "question": "谁在负责，<br>下一步等什么？",
    "approachTitle": "打开任务，<br>就能看到进展。",
    "steps": [
      [
        "看清项目与负责人",
        "从项目列表查看当前阶段，再进入具体任务，知道谁负责、还需要做什么。",
        "01 / 项目与任务"
      ],
      [
        "把相关信息放在一起",
        "任务旁展示相关说明和交付内容，减少在不同消息中来回寻找。",
        "02 / 工作信息"
      ],
      [
        "确认后留下记录",
        "在演示中确认任务，状态随之变化，操作记录也会更新。",
        "03 / 操作记录"
      ]
    ],
    "scope": "这是可交互的前端概念，可以切换视图并确认一项示例任务。真实业务接入、账号、数据存储与协作功能需要另行开发。",
    "scopes": [
      [
        "界面与信息",
        "项目、任务和操作记录",
        "概念已呈现"
      ],
      [
        "示例操作",
        "切换视图、确认任务、查看状态",
        "可在本页体验"
      ],
      [
        "真实数据与协作",
        "账号、数据保存和多人协作",
        "待开发"
      ],
      [
        "上线与维护",
        "测试、部署及后续支持",
        "待具体约定"
      ]
    ],
    "tabs": [
      [
        "overview",
        "◫",
        "项目总览"
      ],
      [
        "tasks",
        "≡",
        "任务协作"
      ],
      [
        "activity",
        "◷",
        "操作记录"
      ]
    ],
    "next": "agent"
  },
  "agent": {
    "number": "02",
    "name": "知间",
    "subtitle": "知识 Agent",
    "english": "KNOWLEDGE AGENT",
    "category": "AI Agent 搭建 / 概念演示",
    "description": "看看示例回答、<br>资料来源和使用提示。",
    "type": "企业知识 · AI 产品概念",
    "fields": "场景设计 / 检索交互 / 前端原型",
    "contextTitle": "资料放在不同文件里，<br>找答案要翻好几处。",
    "context": "制度、操作说明和团队资料多起来后，同一个问题可能需要反复查找，也要确认看到的是不是合适的版本。这个概念展示问题、预设回答和资料来源如何放在一起。",
    "question": "找到答案后，<br>怎么核对出处？",
    "approachTitle": "回答旁边，<br>放上可查看的来源。",
    "steps": [
      [
        "先确定能查哪些资料",
        "真实使用时，需要根据使用者身份确定可查范围，不能把无权查看的资料带入回答。",
        "01 / 资料范围"
      ],
      [
        "回答和出处一起看",
        "展示对应资料和片段，让使用者核对来源、版本与上下文。",
        "02 / 查看来源"
      ],
      [
        "重要事项由人确认",
        "资料不够时提示继续核对；涉及业务承诺和重要决定时，交由负责人判断。",
        "03 / 人工确认"
      ]
    ],
    "scope": "页面展示预设问题、回答和示例资料，尚未接入真实知识库、模型或后台权限控制。",
    "scopes": [
      [
        "问答与来源",
        "预设问题、回答和资料引用",
        "概念已呈现"
      ],
      [
        "资料与使用提示",
        "资料目录、可见范围示意",
        "可在本页体验"
      ],
      [
        "知识库与模型",
        "资料处理、检索和模型调用",
        "待开发"
      ],
      [
        "账号与权限",
        "身份确认、实际资料权限",
        "待开发"
      ]
    ],
    "tabs": [
      [
        "overview",
        "✳",
        "问答空间"
      ],
      [
        "sources",
        "▤",
        "知识来源"
      ],
      [
        "boundary",
        "◈",
        "权限边界"
      ]
    ],
    "next": "workflow"
  },
  "workflow": {
    "number": "03",
    "name": "有序",
    "subtitle": "审批工作流",
    "english": "WORKFLOW",
    "category": "工作流自动化 / 概念演示",
    "description": "按示例金额判断路径，<br>由负责人进行审批。",
    "type": "采购审批 · 自动化概念",
    "fields": "流程梳理 / 规则设计 / 前端原型",
    "contextTitle": "申请发出去之后，<br>不知道到了谁手里。",
    "context": "采购申请有时在群里提出，再手动登记、转交。这个概念用一笔示例申请展示金额判断、审批路径和处理记录，让申请人知道当前停在哪一步。",
    "question": "这笔申请交给谁，<br>现在进行到哪一步？",
    "approachTitle": "按金额找到负责人，<br>把经过记录下来。",
    "steps": [
      [
        "先检查申请信息",
        "看看金额和材料是否齐全，缺少时先请申请人补充。",
        "01 / 检查申请"
      ],
      [
        "按金额选择路径",
        "用示例金额展示不同审批路径；真实规则需要根据实际制度确认。",
        "02 / 审批路径"
      ],
      [
        "查看流转到哪一步",
        "演示提交、规则判断和等待审批的过程；实际使用还需实现审批决定、通知和异常处理。",
        "03 / 处理记录"
      ]
    ],
    "scope": "可以在本页模拟一笔采购申请到达人工审批节点。按钮只改变当前页面状态，不会提交申请、发送通知或连接外部系统。",
    "scopes": [
      [
        "流程画面",
        "申请、金额判断和审批节点",
        "概念已呈现"
      ],
      [
        "示例记录与规则",
        "逐步模拟、查看金额分支",
        "可在本页体验"
      ],
      [
        "真实审批与通知",
        "审批操作、组织信息和消息",
        "待开发"
      ],
      [
        "异常处理",
        "撤回、拒绝、重复提交和失败处理",
        "待开发"
      ]
    ],
    "tabs": [
      [
        "overview",
        "⌘",
        "流程画布"
      ],
      [
        "runs",
        "◷",
        "运行记录"
      ],
      [
        "rules",
        "◇",
        "规则配置"
      ]
    ],
    "next": "operations"
  }
};
  const requested = new URLSearchParams(location.search).get('project');
  const key = Object.hasOwn(projects, requested) ? requested : 'operations';
  const data = projects[key];
  const next = projects[data.next];
  const serviceKey={operations:'software',agent:'agent',workflow:'workflow'}[key];
  document.getElementById('project-brief-link').href='about.html?service='+serviceKey+'&project='+key+'#project-brief';
  document.body.dataset.concept = key;
  document.title = `${data.name} · ${data.subtitle} — 栗子软件科技`;
  const put = (id, value) => { document.getElementById(id).innerHTML = value; };
  put('project-number',`交互概念 ${data.number} / 03`);put('project-category',data.category);put('project-title',`${data.name}<span>${data.subtitle}</span>`);put('project-description',data.description);put('project-type',data.type);put('project-fields',data.fields);put('demo-brand-icon',data.name[0]);put('demo-brand-name',`${data.name}<small>${data.english}</small>`);put('context-title',data.contextTitle);put('context-copy',data.context);put('context-question',data.question);put('approach-title',data.approachTitle);put('scope-copy',data.scope);
  put('approach-steps', data.steps.map((step,i)=>`<article><span class="step-index">0${i+1}</span><div><small>${step[2]}</small><h3>${step[0]}</h3><p>${step[1]}</p></div></article>`).join(''));
  put('scope-list',data.scopes.map((row,i)=>`<div><span>0${i+1}</span><div><h3>${row[0]}</h3><p>${row[1]}</p></div><em class="${i<2?'scope-present':''}">${row[2]}</em></div>`).join(''));
  const nextLink = document.getElementById('next-project-link');nextLink.href=`project.html?project=${data.next}`;nextLink.querySelector('.eyebrow').textContent=`下一个概念 / ${next.number}`;put('next-project-title',`${next.name} <span>${next.subtitle}</span>`);put('next-project-copy',next.description.replace('<br>',''));
  const view = document.getElementById('demo-view');
  const tabs = document.getElementById('demo-tabs');
  tabs.innerHTML=data.tabs.map((tab,i)=>`<button type="button" role="tab" id="tab-${tab[0]}" aria-selected="${i===0}" aria-controls="demo-view" tabindex="${i===0?'0':'-1'}" data-view="${tab[0]}"><i>${tab[1]}</i>${tab[2]}<span>↗</span></button>`).join('');
  let activeView='overview', taskDone=false, questionIndex=0, flowStep=0;
  const title = (eyebrow, heading, subtitle, action='')=>`<div class="app-heading"><div><small>${eyebrow}</small><h2>${heading}</h2><p>${subtitle}</p></div>${action}</div>`;
  const taskRows = ()=>`<div class="app-task-row"><span class="task-check ${taskDone?'checked':''}">${taskDone?'✓':''}</span><div><strong>确认客户服务平台的原型方案</strong><small>客户服务平台 / 产品设计</small></div><span class="person-dot">LC</span><em class="app-tag ${taskDone?'green':'amber'}">${taskDone?'已完成':'待确认'}</em></div><div class="app-task-row"><span class="task-check"></span><div><strong>整理供应链管理需要记录的信息</strong><small>供应链管理工具 / 需求梳理</small></div><span class="person-dot pink">ZY</span><em class="app-tag">进行中</em></div><div class="app-task-row"><span class="task-check"></span><div><strong>整理团队知识空间的资料目录</strong><small>团队知识空间 / 信息结构</small></div><span class="person-dot sand">YH</span><em class="app-tag neutral">待开始</em></div>`;
  function operationsView(){
    if(activeView==='overview') return title('演示空间 / 总览','项目总览','看看示例项目、待办和操作记录。')+`<div class="app-stats"><div><small>演示项目</small><b>03<span>个项目</span></b><p>查看项目负责人和当前阶段</p></div><div><small>需要确认</small><b>${taskDone?'00':'01'}<span>项任务</span></b><p>${taskDone?'当前演示任务已确认':'原型方案等待你的确认'}</p></div><div><small>工作记录</small><b>${taskDone?'04':'03'}<span>条动态</span></b><p>查看本页的示例操作记录</p></div></div><div class="app-section-title"><h3>进行中的项目</h3><span>演示项目 / 03</span></div><div class="app-projects"><div><b class="app-project-icon">▦</b><small>产品设计</small><h3>客户服务平台</h3><p>客户列表、服务记录与任务分配。</p><div><em class="app-tag ${taskDone?'green':'amber'}">${taskDone?'设计已确认':'设计确认'}</em><span>林澈 ↗</span></div></div><div><b class="app-project-icon purple">◈</b><small>业务工具</small><h3>供应链管理工具</h3><p>整理采购、供应商与订单的协作关系。</p><div><em class="app-tag">需求梳理</em><span>张也 ↗</span></div></div><div><b class="app-project-icon sand">◫</b><small>知识管理</small><h3>团队知识空间</h3><p>整理团队资料目录与文档结构。</p><div><em class="app-tag neutral">信息结构</em><span>余禾 ↗</span></div></div></div><div class="app-section-title"><h3>我的任务</h3><button type="button" data-goto="tasks">查看任务协作 ↗</button></div><div class="app-tasks">${taskRows()}</div>`;
    if(activeView==='tasks') return title('演示空间 / 任务','确认示例任务','试着确认一项任务，看看状态如何变化。')+`<div class="task-detail"><div class="task-detail-top"><span class="app-tag ${taskDone?'green':'amber'}">${taskDone?'已完成':'待确认'}</span><span>DESIGN-012</span></div><h3>确认客户服务平台的原型方案</h3><p>请核对客户列表、服务记录与任务分配三个界面，确认信息结构与关键操作符合演示场景。</p><dl><div><dt>负责人</dt><dd><span class="person-dot">LC</span> 林澈</dd></div><div><dt>所属项目</dt><dd>客户服务平台</dd></div><div><dt>验收条件</dt><dd>页面结构完整，关键路径可操作</dd></div></dl><div class="task-deliverable"><span>▤</span><div><b>客户服务平台 · 原型说明</b><small>示例交付物 / 版本 0.3 / 供概念演示</small></div><i>↗</i></div><div class="task-action"><p><i>${taskDone?'✓':'◌'}</i> ${taskDone?'方案已确认，操作记录已更新。':'确认后将更新任务状态，并保留操作记录。'}</p><button class="app-button" type="button" id="task-toggle">${taskDone?'重置演示':'确认方案完成'} <span>↗</span></button></div></div>`;
    return title('演示空间 / 动态','操作记录','查看这项工作在演示中的状态变化。')+`<div class="activity-list">${taskDone?'<article class="new-event"><b>✓</b><div><small>刚刚 / 本次演示</small><h3>林澈确认了原型方案</h3><p>客户服务平台 · 状态由「待确认」变为「已完成」</p></div><span class="app-tag green">状态已同步</span></article>':''}<article><b>▤</b><div><small>演示记录 / 10:30</small><h3>林澈更新了原型说明</h3><p>上传示例交付物，补充关键操作说明。</p></div></article><article><b>◈</b><div><small>演示记录 / 09:45</small><h3>张也创建了信息整理任务</h3><p>供应链管理工具 · 已关联负责人及业务范围。</p></div></article><article><b>＋</b><div><small>演示记录 / 09:00</small><h3>余禾建立了团队知识空间</h3><p>创建项目，并整理首批资料目录。</p></div></article></div><div class="app-info">◌ 本次会话内的演示操作会同步显示；刷新页面后恢复初始状态。</div>`;
  }
  const questions=[{q:'新同事入职，需要准备什么？',a:'根据团队的入职指引，建议从以下三件事开始：',items:['开通工作账号，按岗位申请工具权限。','与负责人确认第一周的工作计划。','了解团队协作方式，预约一次同事交流。'],source:'团队入职指引',section:'第 2 节 · 入职第一周',quote:'入职第一周，请先完成账号申请，并与直属负责人共同确认工作计划。'}, {q:'项目启动前，需要确认哪些信息？',a:'项目启动清单里列出了三项必要信息：',items:['明确要解决的问题与项目范围。','确认负责人、参与角色和沟通方式。','约定交付物、关键节点与验收条件。'],source:'项目协作手册',section:'第 1 节 · 启动准备',quote:'启动项目时，应明确业务目标、责任分工与验收条件，并由相关负责人确认。'}];
  function agentView(){const q=questions[questionIndex];if(activeView==='overview')return title('演示空间 / 问答','示例问答','试一个团队常见问题，看看回答如何连接到依据。')+`<div class="knowledge-question"><span>YOU</span><p>${q.q}</p></div><div class="knowledge-answer"><b class="knowledge-mark">✳</b><div><small>知间 / 示例回答</small><p>${q.a}</p><ol>${q.items.map(x=>`<li>${x}</li>`).join('')}</ol><button class="citation" type="button" data-goto="sources"><span>▤</span><div><b>${q.source}</b><small>${q.section}</small></div><i>查看来源 ↗</i></button><p class="answer-note">实际安排以团队最新指引及负责人确认为准。</p></div></div><div class="knowledge-actions"><span>本演示使用预设回答，未调用 AI 模型。</span><button class="app-button" id="change-question" type="button">换一个示例问题 ↗</button></div>`;
    if(activeView==='sources')return title('演示空间 / 资料','示例资料','示例资料仅用于说明来源展示方式。')+`<div class="source-document"><div class="source-head"><span>▤</span><div><h3>${q.source}</h3><p>团队知识库 / 示例资料 / v1.0</p></div><em class="app-tag">团队可见</em></div><div class="source-body"><small>${q.section}</small><h4>${q.source==='团队入职指引'?'入职第一周的准备事项':'项目启动信息清单'}</h4><p>团队的协作依赖清晰的信息与明确的分工。以下内容作为内部资料结构的示例，便于定位问题对应的上下文。</p><blockquote>${q.quote}</blockquote><p>当实际情况与文档内容不一致时，请联系对应负责人确认，并提出资料更新建议。</p></div><div class="source-footer"><span>示例维护人 · 团队负责人</span><span>概念资料，非真实制度</span></div></div>`;
    return title('演示空间 / 权限','使用范围与人工确认','知识助手应当遵循组织已有的权限与责任分工。')+`<div class="boundary-cards"><article><span>01 / 资料访问</span><h3>按用户权限检索资料</h3><p>只检索当前用户有权查看的资料。真实系统需要在服务端校验身份，过滤文档与引用内容。</p><em class="app-tag">待接入组织权限</em></article><article><span>02 / 信息缺口</span><h3>提示资料不足或版本冲突</h3><p>资料不足或版本冲突时，说明信息缺口，给出可核对的来源与对应负责人。</p><em class="app-tag neutral">保留人工确认</em></article><article><span>03 / 人工确认</span><h3>关键决策由负责人确认</h3><p>业务承诺、制度解释与重要决策，由有权限的负责人确认。回答不能替代审批。</p><em class="app-tag amber">关键动作需复核</em></article></div><div class="app-info">◌ 当前为权限交互的概念展示，未实现身份认证或实际权限控制。</div>`;
  }
  const flowLabels=['待提交','检查申请信息','匹配金额规则','等待负责人审批'];
  function workflowView(){if(activeView==='overview')return title('演示空间 / 流程','模拟采购申请','模拟一笔 ¥3,200 的采购申请，逐步查看流转状态。',`<span class="app-tag ${flowStep===3?'amber':''}">${flowLabels[flowStep]}</span>`)+`<div class="workflow-preview"><div class="workflow-line"></div>${[['↗','申请提交','申请人 · 林澈'],['◇','检查规则','金额 ≤ ¥5,000'],['◉','负责人审批','部门负责人 · 待处理']].map((n,i)=>`<div class="workflow-demo-node ${i<2 && flowStep>i?'complete':''} ${flowStep===i+1?'current':''}"><b>${n[0]}</b><div><small>STEP 0${i+1}</small><h3>${n[1]}</h3><p>${n[2]}</p></div><span>${i<2 && flowStep>i?'✓':'○'}</span></div>`).join('')}</div><div class="workflow-simulation"><div><small>SIMULATION / ${String(flowStep).padStart(2,'0')} OF 03</small><p>${['点击开始，将申请放入演示流程。','材料完整，下一步检查申请金额。','申请金额符合部门负责人审批路径。','已到达人工审批节点，等待负责人处理。'][flowStep]}</p></div><button class="app-button" id="flow-next" type="button">${['开始模拟','检查规则','进入审批','重新演示'][flowStep]} <span>↗</span></button></div>`;
    if(activeView==='runs')return title('演示空间 / 记录','本次演示记录','这里显示当前演示中实际发生的步骤。')+`<div class="run-summary"><div><small>演示申请</small><h3>办公设备采购</h3></div><div><small>申请金额</small><h3>¥ 3,200.00</h3></div><span class="app-tag ${flowStep===3?'amber':''}">${flowLabels[flowStep]}</span></div><div class="activity-list">${flowStep===0?'<div class="app-empty"><span>◷</span><h3>还没有运行记录</h3><p>在流程画布中开始模拟，这里会显示每一步。</p><button type="button" data-goto="overview">前往流程画布 ↗</button></div>':[['申请已进入流程','申请人：林澈 · 采购金额：¥3,200'],['规则匹配完成','材料完整 · 申请金额 ≤ ¥5,000'],['已送达部门负责人','等待人工审批；演示不会自动批准申请。']].slice(0,flowStep).map((n,i)=>`<article><b>${i===2?'◉':'✓'}</b><div><small>演示步骤 0${i+1}</small><h3>${n[0]}</h3><p>${n[1]}</p></div></article>`).join('')}</div><div class="app-info">◌ 流转记录仅保存在本次页面会话中，不会发送外部通知。</div>`;
    return title('演示空间 / 规则','示例审批规则','以下金额条件仅为演示示例，应以组织实际制度为准。')+`<div class="rule-card"><div class="rule-heading"><span>◇</span><h3>采购申请 / 金额分支</h3><em class="app-tag neutral">只读演示</em></div><div class="rule-row"><small>匹配字段</small><strong>申请金额 <span>NUMBER / CNY</span></strong></div><div class="rule-row"><small>路径 A</small><strong>≤ ¥5,000 <span>→ 部门负责人审批</span></strong></div><div class="rule-row"><small>路径 B</small><strong>＞ ¥5,000 <span>→ 财务负责人审批</span></strong></div><div class="rule-row"><small>缺失字段</small><strong>金额或申请材料不完整 <span>→ 返回申请人补充</span></strong></div></div><div class="app-info">◌ 自动流转完成后，审批决定仍由对应负责人作出。</div>`;
  }
  function render(){view.innerHTML=key==='operations'?operationsView():key==='agent'?agentView():workflowView();view.setAttribute('aria-labelledby',`tab-${activeView}`);document.getElementById('demo-breadcrumb').innerHTML=`演示空间 <i>/</i> ${data.tabs.find(t=>t[0]===activeView)[2]}`;view.querySelectorAll('[data-goto]').forEach(button=>button.addEventListener('click',()=>selectView(button.dataset.goto,true)));view.querySelector('#task-toggle')?.addEventListener('click',()=>{taskDone=!taskDone;render();view.querySelector('#task-toggle')?.focus({preventScroll:true});});view.querySelector('#change-question')?.addEventListener('click',()=>{questionIndex=(questionIndex+1)%questions.length;render();view.querySelector('#change-question')?.focus({preventScroll:true});});view.querySelector('#flow-next')?.addEventListener('click',()=>{flowStep=(flowStep+1)%4;render();view.querySelector('#flow-next')?.focus({preventScroll:true});});}
  function selectView(id,focusPanel=false){activeView=id;tabs.querySelectorAll('button').forEach(button=>{const active=button.dataset.view===id;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});render();if(focusPanel){view.focus({preventScroll:true});view.scrollIntoView({block:'nearest',behavior:'instant'});}}
  tabs.addEventListener('click',event=>{const button=event.target.closest('button[data-view]');if(button)selectView(button.dataset.view);});
  tabs.addEventListener('keydown',event=>{if(!['ArrowDown','ArrowUp','ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;event.preventDefault();const buttons=[...tabs.querySelectorAll('button')];let index=buttons.findIndex(b=>b.dataset.view===activeView);if(event.key==='Home')index=0;else if(event.key==='End')index=buttons.length-1;else index=(index+(['ArrowDown','ArrowRight'].includes(event.key)?1:-1)+buttons.length)%buttons.length;selectView(buttons[index].dataset.view);buttons[index].focus();});
  render();
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting)document.querySelectorAll('.chapter-nav a').forEach(a=>a.classList.toggle('active',a.hash===`#${entry.target.id}`));});},{rootMargin:'-20% 0px -55% 0px'});document.querySelectorAll('.story-section').forEach(section=>observer.observe(section));}
})();
