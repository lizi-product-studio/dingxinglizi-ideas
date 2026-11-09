(() => {
  'use strict';
  const scenarios = {
  "software": {
    "kicker": "订单处理 / ORDER OPERATIONS",
    "labels": [
      "记录订单",
      "分派处理",
      "负责人确认",
      "查看进度"
    ],
    "steps": [
      [
        "记录信息",
        "先把订单记下来。",
        "记录客户、商品、数量和交期。必要信息不完整时，提醒补充。",
        "订单信息 · 补充提醒"
      ],
      [
        "安排处理",
        "让负责的人接到任务。",
        "按事先约定的方式分派订单，重复记录或需要特别处理的情况留给同事检查。",
        "负责人 · 待办事项"
      ],
      [
        "人工确认",
        "价格或交期有变化，先确认。",
        "需要负责人决定的事项，由人核对后继续，并记录谁在什么时候作了确认。",
        "确认意见 · 更新记录"
      ],
      [
        "查看进度",
        "回到订单，就能看见下一步。",
        "同事可以查看最新内容、处理状态和待办；需要传给其他工具的信息，再按约定处理。",
        "最新状态 · 待处理事项"
      ]
    ]
  },
  "agent": {
    "kicker": "资料问答 / KNOWLEDGE ASSISTANCE",
    "labels": [
      "提出问题",
      "查找资料",
      "人工核对",
      "确认使用"
    ],
    "steps": [
      [
        "提出问题",
        "说清想查什么。",
        "输入问题和必要背景，助手只在使用者有权查看的资料范围内查找。",
        "问题 · 可查资料"
      ],
      [
        "查找依据",
        "从资料中找答案和出处。",
        "根据可用资料整理回答并附上来源；找不到依据时，提示资料不足。",
        "回答草稿 · 资料来源"
      ],
      [
        "人工核对",
        "看一眼来源，再决定怎么用。",
        "使用者核对内容和出处；对外发送或修改业务信息等重要动作，由有权限的人确认。",
        "内容核对 · 人工确认"
      ],
      [
        "确认使用",
        "确认后再保存或使用。",
        "核对过的内容可以复制、保存，或按项目约定用于下一步；保留必要记录，方便回看。",
        "确认内容 · 使用记录"
      ]
    ]
  },
  "workflow": {
    "kicker": "重复步骤 / CONNECTED WORKFLOW",
    "labels": [
      "收到信息",
      "按规则处理",
      "检查异常",
      "查看结果"
    ],
    "steps": [
      [
        "收到信息",
        "有人提交表单，流程开始。",
        "收到表单后先检查必要信息是否齐全；具体从哪里开始，由实际工作方式决定。",
        "表单信息 · 完整性检查"
      ],
      [
        "按规则处理",
        "把信息送到该去的地方。",
        "按约定整理信息、记录到目标工具，并通知对应同事；能否连接需要先确认。",
        "记录结果 · 处理提醒"
      ],
      [
        "检查异常",
        "遇到问题，交给负责人。",
        "信息缺失、权限不足或结果不明确时，提示负责人核对；结果不明时先检查，再决定是否重试。",
        "异常提示 · 核对结果"
      ],
      [
        "查看结果",
        "知道哪些办好了，哪些还在等。",
        "记录处理结果和时间，让同事查看成功、失败及待处理的事项。",
        "处理记录 · 待办事项"
      ]
    ]
  }
};
  const tabs = [...document.querySelectorAll('.cap-tab')];
  const nodes = [...document.querySelectorAll('.cap-node')];
  const requestedScenario=new URLSearchParams(location.search).get('scenario');
  let active=Object.hasOwn(scenarios,requestedScenario)?requestedScenario:'software';
  let step = 0;
  const setText = (id, value) => { document.getElementById(id).textContent = value; };
  function render() {
    const scenario = scenarios[active];
    const related={software:['operations','体验工作台概念'],agent:['agent','体验知识 Agent 概念'],workflow:['workflow','体验审批流程概念']}[active];
    document.getElementById('cap-related-concept').href='project.html?project='+related[0];
    document.getElementById('cap-related-concept').textContent=related[1]+' ↗';
    document.getElementById('cap-scenario-brief').href='about.html?service='+active+'#project-brief';

    const entry = scenario.steps[step];
    setText('scenario-kicker', scenario.kicker);
    scenario.labels.forEach((label, index) => setText(`node-label-${index}`, label));
    nodes.forEach((node, index) => {
      node.classList.toggle('is-current', index === step);
      node.classList.toggle('is-past', index < step);
      node.setAttribute('aria-pressed', String(index === step));
    });
    document.getElementById('cap-line-progress').style.width = `${step / 3 * 100}%`;
    setText('step-number', String(step + 1).padStart(2, '0'));
    ['step-category','step-title','step-description','step-output'].forEach((id, index) => setText(id, entry[index]));
    const next = document.getElementById('next-step');
    next.firstElementChild.textContent = step === 3 ? '重新查看' : '下一环节';
    next.setAttribute('aria-label', step === 3 ? '返回第一个流程步骤' : `查看第 ${step + 2} 个流程步骤`);
  }
  function chooseTab(tab, syncUrl=true) {
    active = tab.dataset.scenario; step = 0;
    tabs.forEach(button => {
      const selected = button === tab;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    document.getElementById('scenario-panel').setAttribute('aria-labelledby', tab.id);
    render();
    if(syncUrl){const url=new URL(location.href);url.searchParams.set('scenario',active);history.replaceState(null,'',url);}
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => chooseTab(tab));
    tab.addEventListener('keydown', event => {
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') target = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = tabs.length - 1;
      else return;
      event.preventDefault(); chooseTab(tabs[target]); tabs[target].focus();
    });
  });
  nodes.forEach(node => node.addEventListener('click', () => { step = Number(node.dataset.step); render(); }));
  document.getElementById('next-step').addEventListener('click', () => { step = (step + 1) % 4; render(); });
  chooseTab(tabs.find(tab=>tab.dataset.scenario===active),false);
})();
