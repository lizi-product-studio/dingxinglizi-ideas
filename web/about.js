(() => {
  'use strict';
  const form = document.getElementById('brief-form');
  const result = document.getElementById('brief-result');
  const output = document.getElementById('brief-output');
  const copyStatus = document.getElementById('copy-status');
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
      `希望了解：${data.get('service')}`,
      `当前阶段：${data.get('stage')}`,
      '',
      '希望解决的业务问题：',
      scenario,
      '',
      `目前使用的工具或系统：${optional('tools')}`,
      `期望启动时间：${optional('time')}`,
      '',
      '希望进一步沟通：业务流程、实现范围、交付方式与验收标准。'
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
