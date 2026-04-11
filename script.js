$(function () {
  
  const groupColumn = 4; // Category hidden column (5th column)

  const table = $('#registerTable').DataTable({
    pageLength: 50,
    lengthMenu: [
      [50, 100],
      [50, 100]
    ],

    order: [[groupColumn, 'asc'], [0, 'asc']],

    columnDefs: [
      { targets: [groupColumn], visible: false },               // hide category column
      { targets: [2, 3], orderable: false, searchable: false }, // no sorting/search for Record + PS
      { targets: [0, 1], orderable: true },
      { targets: [groupColumn], orderable: false }
    ],

    rowGroup: {
      dataSrc: groupColumn,
      startRender: function (rows, group) {
        return String(group).replace(/^\d+\s*-\s*/, ''); // "01 - X" -> "X"
      }
    }
  });

  $('#registerTable tbody').on('click', 'tr.dtrg-group', function () {
    const currentOrder = table.order();
    if (currentOrder.length && currentOrder[0][0] === groupColumn && currentOrder[0][1] === 'asc') {
      table.order([[groupColumn, 'desc'], [0, 'asc']]).draw();
    } else {
      table.order([[groupColumn, 'asc'], [0, 'asc']]).draw();
    }
  });

 
  const headerOffset = 110;

  const tocLinks = Array.from(document.querySelectorAll('.toc-list a[href^="#"]'))
    .filter(a => document.querySelector(a.getAttribute('href')));

  const sections = tocLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function setActiveToc(targetId) {
    tocLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === targetId));
  }

  tocLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href');
      const el = document.querySelector(id);
      if (!el) return;

      const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });

      setActiveToc(id);
      history.replaceState(null, '', id);
    });
  });

  const observer = new IntersectionObserver((entries) => {
    const visible = entries
      .filter(en => en.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible && visible.target && visible.target.id) {
      setActiveToc('#' + visible.target.id);
    }
  }, {
    root: null,
    rootMargin: `-${headerOffset}px 0px -55% 0px`,
    threshold: [0.15, 0.25, 0.4, 0.6]
  });

  sections.forEach(sec => observer.observe(sec));

  if (window.location.hash && document.querySelector(window.location.hash)) {
    setActiveToc(window.location.hash);
  } else if (tocLinks.length) {
    setActiveToc(tocLinks[0].getAttribute('href'));
  }

  const backBtn = document.getElementById('backToTop');

if (backBtn) {
  const updateBackToTop = () => {
    const showAfter = 200; // εμφανίζεται νωρίς
    backBtn.classList.toggle('show', window.scrollY > showAfter);
  };

  updateBackToTop();
  window.addEventListener('scroll', updateBackToTop, { passive: true });

  backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
});
