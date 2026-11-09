(() => {
  'use strict';
  const scenarios = {
    software: { kicker: '订单协同 / ORDER OPERATIONS', labels: ['录入订单','校验与分派','人工确认','业务交付'], steps: [
      ['明确输入','业务从一份完整的订单开始。','结构化记录客户、商品、数量与交期；区分必填信息、可选信息和异常信息，为后续协作建立统一的数据入口。','字段规范 · 订单记录 · 异常提示'],
      ['规则处理','把规则写进系统，减少口头转交。','按照约定规则校验数据、识别重复记录并分派处理任务。权限与状态流转在系统内定义，异常进入待处理列表。','校验结果 · 任务分派 · 状态记录'],
      ['人工审核','关键决定，交给有权限的人。','价格调整、异常交期等关键事项由负责人审核；记录处理人、意见与时间，避免系统在信息不足时自行推进。','审核意见 · 操作留痕 · 异常处理'],
      ['结果交付','每个角色，都能找到下一步。','向业务人员展示已确认的订单状态与待办事项，按已约定的系统接口推送必要数据。失败操作保留重试与核对入口。','业务视图 · 数据交接 · 交付记录']
    ]},
    agent: { kicker: '知识辅助 / KNOWLEDGE ASSISTANCE', labels: ['提出问题','检索与生成','审核与修订','确认后使用'], steps: [
      ['明确输入','让问题有上下文，也有边界。','使用者提供问题与必要背景；限定可访问的知识来源和操作权限，避免将无关信息带入任务。','问题上下文 · 知识范围 · 权限边界'],
      ['检索与推理','先找到依据，再形成候选答案。','检索授权资料，结合任务指令生成带来源的草稿。检索不到依据时提示信息不足，模型输出仍需验证。','检索片段 · 来源线索 · 候选答案'],
      ['人工审核','把不确定性留在可检查的位置。','由使用者核对引用、事实与措辞。涉及对外发送、修改业务数据等操作，应按场景设置确认节点和执行权限。','事实核对 · 内容修订 · 操作确认'],
      ['确认后使用','经过确认，再进入业务动作。','使用者确认内容后复制、保存或按权限触发后续工具；保留必要的输入、来源与结果记录，便于追溯和改进。','已确认内容 · 执行结果 · 可追溯记录']
    ]},
    workflow: { kicker: '跨系统协同 / CONNECTED WORKFLOW', labels: ['事件触发','映射与判断','异常核对','同步与记录'], steps: [
      ['事件输入','让一次明确的变化，启动流程。','以新表单、状态变更或定时任务作为触发条件。检查事件来源与字段是否完整，并为重复触发建立识别依据。','触发事件 · 字段检查 · 唯一标识'],
      ['自动处理','在系统之间，建立共同语言。','完成字段映射、条件判断和目标系统调用。对明确的重复事件进行去重，对网络或服务异常设置有边界的重试。','数据映射 · 条件分支 · 调用结果'],
      ['异常核对','流程遇到例外，有人可以接手。','字段缺失、权限不足或结果不明确时暂停相关步骤，向指定负责人呈现上下文。外部结果未知时先核对，再决定是否重试。','异常清单 · 核对结论 · 恢复动作'],
      ['闭环记录','流程结束，结果也能被核对。','记录源事件、同步结果和处理时间，将成功与失败分别呈现。后续可根据运行记录定位问题并调整规则。','同步结果 · 运行日志 · 待处理事项']
    ]}
  };
  const tabs = [...document.querySelectorAll('.cap-tab')];
  const nodes = [...document.querySelectorAll('.cap-node')];
  let active = 'software';
  let step = 0;
  const setText = (id, value) => { document.getElementById(id).textContent = value; };
  function render() {
    const scenario = scenarios[active];
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
  function chooseTab(tab) {
    active = tab.dataset.scenario; step = 0;
    tabs.forEach(button => {
      const selected = button === tab;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
    });
    document.getElementById('scenario-panel').setAttribute('aria-labelledby', tab.id);
    render();
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
})();
