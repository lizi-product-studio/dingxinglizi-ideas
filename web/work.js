(() => {
  const buttons = [...document.querySelectorAll('[data-filter]')];
  const cases = [...document.querySelectorAll('[data-category]')];
  const counter = document.getElementById('work-count');
  buttons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    buttons.forEach(item => { const active = item === button; item.classList.toggle('is-active', active); item.setAttribute('aria-pressed', String(active)); });
    let count = 0;
    cases.forEach(item => { const show = filter === 'all' || item.dataset.category === filter; item.hidden = !show; if (show) count++; });
    document.querySelector('.work-grid').classList.toggle('is-filtered', filter !== 'all');
    counter.textContent = `${String(count).padStart(2, '0')} SELECTED`;
    document.querySelector('.work-empty').hidden = count !== 0;
  }));
})();
