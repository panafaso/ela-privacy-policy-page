// Smooth scroll for TOC links
document.querySelectorAll('.toc a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const id = a.getAttribute('href');
    const el = document.querySelector(id);
    if (!el) return;

    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', id);
  });
});

// Active section highlight
const tocLinks = Array.from(document.querySelectorAll('.toc a[href^="#"]'));
const sections = tocLinks
  .map(a => document.querySelector(a.getAttribute('href')))
  .filter(Boolean);

const setActive = (id) => {
  tocLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === id));
};

const observer = new IntersectionObserver((entries) => {
  const visible = entries
    .filter(e => e.isIntersecting)
    .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
  if (visible?.target?.id) setActive('#' + visible.target.id);
}, { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.2, 0.4] });

sections.forEach(s => observer.observe(s));

// Chevron toggle on details
document.querySelectorAll('details.acc-item').forEach(d => {
  d.addEventListener('toggle', () => {
    const chev = d.querySelector('.chev');
    if (!chev) return;
    chev.textContent = d.open ? '▾' : '▸';
  });
});
