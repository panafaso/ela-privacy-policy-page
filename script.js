$(function () {
  /* =========================
     1) DATATABLES / ROWGROUP
  ========================== */
  const groupColumn = 4; // Category hidden column

  const table = $('#registerTable').DataTable({
    pageLength: 50,
    lengthMenu: [
      [50, 100],
      [50, 100]
    ],

    // Order by Category (hidden) then by Reference Number
    order: [[groupColumn, 'asc'], [0, 'asc']],

    columnDefs: [
      { targets: [groupColumn], visible: false },                 // hide category column
      { targets: [2, 3], orderable: false, searchable: false },   // no sorting/search for Record + PS
      { targets: [0, 1], orderable: true },                       // keep sorting for Reference + Processing
      { targets: [groupColumn], orderable: false }
    ],

    rowGroup: {
      dataSrc: groupColumn,
      startRender: function (rows, group) {
        // group like "01 - Inspections & Enforcement"
        return group.replace(/^\d+\s*-\s*/, '');
      }
    }
  });

  // Optional: clicking a group header toggles ordering asc/desc on Category
  $('#registerTable tbody').on('click', 'tr.dtrg-group', function () {
    const currentOrder = table.order();
    if (currentOrder.length && currentOrder[0][0] === groupColumn && currentOrder[0][1] === 'asc') {
      table.order([[groupColumn, 'desc'], [0, 'asc']]).draw();
    } else {
      table.order([[groupColumn, 'asc'], [0, 'asc']]).draw();
    }
  });


  /* =========================
     2) TOC ACTIVE HIGHLIGHT
        + SMOOTH SCROLL (offset)
  ========================== */
  const headerOffset = 110; // ίδιο με scroll-margin-top περίπου
  const tocLinks = Array.from(document.querySelectorAll('.toc-list a[href^="#"]'))
    .filter(a => document.querySelector(a.getAttribute('href')));

  const sections = tocLinks
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  function setActiveToc(targetId) {
    tocLinks.forEach(a => {
      const isActive = a.getAttribute('href') === targetId;
      a.classList.toggle('active', isActive);
      // δεν αλλάζουμε font-weight εδώ για να μην γίνεται reflow
    });
  }

  // Click -> smooth scroll με offset (χωρίς απότομο jump)
  tocLinks.forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const id = a.getAttribute('href');
      const el = document.querySelector(id);
      if (!el) return;

      const y = el.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveToc(id);
      history.replaceState(null, '', id); // ενημερώνει το hash χωρίς jump
    });
  });

  // Scroll spy -> βάφει το σωστό TOC item καθώς σκρολάρεις
  const observer = new IntersectionObserver((entries) => {
    // βρίσκουμε το πιο “κοντά” section που είναι visible
    const visible = entries
      .filter(en => en.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (visible && visible.target && visible.target.id) {
      setActiveToc('#' + visible.target.id);
    }
  }, {
    root: null,
    // “σπρώχνουμε” το detection λίγο πιο κάτω λόγω header
    rootMargin: `-${headerOffset}px 0px -55% 0px`,
    threshold: [0.15, 0.25, 0.4, 0.6]
  });

  sections.forEach(sec => observer.observe(sec));

  // Αν ανοίξει η σελίδα με hash (#s2 κτλ), βάφ’το σωστά
  if (window.location.hash && document.querySelector(window.location.hash)) {
    setActiveToc(window.location.hash);
  } else if (tocLinks.length) {
    setActiveToc(tocLinks[0].getAttribute('href'));
  }


  /* =========================
     3) BACK TO TOP (show/hide)
  ========================== */
  const backBtn = document.getElementById('backToTop');
  if (backBtn) {
    const toggleBackToTop = () => {
      if (window.scrollY > 450) backBtn.classList.add('show');
      else backBtn.classList.remove('show');
    };

    window.addEventListener('scroll', () => {
  // εμφανίζεται αφού περάσεις περίπου τη μέση της σελίδας
  const showAfter = document.documentElement.scrollHeight * 0.5;

  if (window.scrollY > showAfter) {
    backToTop.classList.add('show');
  } else {
    backToTop.classList.remove('show');
  }
});
