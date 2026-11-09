(() => {
  'use strict';
  const form = document.getElementById('brief-form');
  const result = document.getElementById('brief-result');
  const output = document.getElementById('brief-output');
  const copyStatus = document.getElementById('copy-status');
  const services = Object.freeze({ software: '企业软件开发', agent: 'AI Agent 搭建', workflow: '工作流自动化', web: '网站搭建', undecided: '尚未确定' });
  const concepts = Object.freeze({
    operations: { service: 'software', name: '序章 · 运营工作台' },
    agent: { service: 'agent', name: '知间 · 知识 Agent' },
    workflow: { service: 'workflow', name: '有序 · 审批工作流' }
  });
  const params = new URLSearchParams(location.search);
  const requestedService = params.get('service');
  const requestedProject = params.get('project');
  const validService = Object.hasOwn(services, requestedService) ? requestedService : null;
  let reference = Object.hasOwn(concepts, requestedProject) ? concepts[requestedProject] : null;
  form.elements.service.value = validService || reference?.service || 'undecided';
  if (reference && reference.service !== form.elements.service.value) reference = null;
  const referencePanel = document.getElementById('brief-reference');
  const referenceStatus = document.getElementById('reference-status');
  function renderReference() {
    referencePanel.hidden = !reference;
    document.getElementById('brief-reference-name').textContent = reference?.name || '';
  }
  renderReference();
  const problemExamples={software:'例如：订单分散在多份表格里，需要统一录入、分派和跟踪。',agent:'例如：同事反复查找业务资料，希望按问题找到答案和来源。',workflow:'例如：表单提交后还要手动录入另一个系统，希望减少重复操作。',web:'例如：重新整理公司官网，让访客看懂业务并方便联系。',undecided:'例如：描述现在怎样完成这件事，以及最想改变的一个环节。'};
  const updateExample=()=>{form.elements.scenario.placeholder=problemExamples[form.elements.service.value]||problemExamples.undecided;};
  updateExample();
  form.addEventListener('change',event=>{if(event.target.name==='service')updateExample();});
  form.addEventListener('change', event => {
    if (event.target.name === 'service' && reference && reference.service !== form.elements.service.value) {
      reference = null;
      renderReference();
      referenceStatus.textContent = '已按你的服务选择清除参考概念。';
    }
  });
  document.getElementById('clear-reference').addEventListener('click', () => {
    reference = null;
    renderReference();
    referenceStatus.textContent = '已清除参考概念。';
    form.querySelector('input[name="service"]:checked')?.focus({ preventScroll: true });
  });
  let previousFocus;
  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(text); return true; } catch (_) { /* Try the local fallback below. */ }
    }
    const selection = document.createElement('textarea');
    selection.value = text;
    selection.setAttribute('readonly', '');
    selection.style.cssText = 'position:fixed;left:-9999px;top:0;opacity:0;';
    document.body.appendChild(selection);
    const focused = document.activeElement;
    selection.select(); selection.setSelectionRange(0, selection.value.length);
    let copied = false;
    try { copied = document.execCommand('copy'); } catch (_) { copied = false; }
    selection.remove();
    if (focused && typeof focused.focus === 'function') focused.focus({ preventScroll: true });
    return copied;
  }
  form.addEventListener('submit', event => {
    event.preventDefault();
    const scenario = form.elements.scenario.value.trim();
    if (!scenario) {
      form.elements.scenario.setCustomValidity('请描述一个希望解决的业务问题。');
      form.elements.scenario.reportValidity(); return;
    }
    const data = new FormData(form);
    const optional = name => String(data.get(name) || '').trim() || '待沟通确认';
    output.value = [
      '项目简报｜栗子软件科技',
      '',
      `服务方向：${services[data.get('service')] || services.undecided}`,
      ...(reference && reference.service === data.get('service') ? [`参考概念：${reference.name}（自主概念演示，仅作沟通参考）`] : []),
      `当前阶段：${data.get('stage')}`,
      '',
      '希望解决的业务问题：',
      scenario,
      '',
      `目前使用的工具或系统：${optional('tools')}`,
      `期望启动时间：${optional('time')}`,
      '',
      '待沟通事项：需求范围、交付内容、协作节点与验收标准。'
    ].join('\n');
    previousFocus = document.activeElement;
    form.hidden = true; result.hidden = false;
    copyStatus.textContent = '复制后发送至下方微信或邮箱。';
    output.focus({ preventScroll: true });
    result.scrollIntoView({ block: 'nearest', behavior: window.LiziMotion?.paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  });
  form.elements.scenario.addEventListener('input', () => form.elements.scenario.setCustomValidity(''));
  document.getElementById('edit-brief').addEventListener('click', () => {
    result.hidden = true; form.hidden = false;
    (previousFocus || form.elements.scenario).focus({ preventScroll: true });
  });
  document.getElementById('copy-brief').addEventListener('click', async () => {
    if (await copyText(output.value)) {
      copyStatus.textContent = '已复制。可粘贴到微信或邮件中发送。';
    } else {
      output.focus(); output.select(); output.setSelectionRange(0, output.value.length);
      copyStatus.textContent = '已选中简报，请按 Ctrl+C 或长按文本复制。';
    }
  });
  document.querySelectorAll('.about-contact-copy').forEach(button => button.addEventListener('click', async () => {
    const value = button.dataset.contactCopy;
    const copied = await copyText(value);
    document.getElementById('contact-status').textContent = copied
      ? `已复制：${value}`
      : `请手动复制：${value}`;
  }));
})();
