$(function () {

  /* =========================
     DATATABLE INITIALISATION
  ========================== */

  const groupColumn = 4; // hidden Category column

  const table = $('#registerTable').DataTable({

    pageLength: 50,
    lengthMenu: [
      [50, 100],
      [50, 100]
    ],

    // Order by Category (hidden) then by Reference Number
    order: [[groupColumn, 'asc'], [0, 'asc']],

    columnDefs: [

      // Hide Category column
      { targets: [groupColumn], visible: false },

      // Disable sorting & searching for Record and Privacy columns
      { targets: [2, 3], orderable: false, searchable: false },

      // Allow sorting only for Reference & Processing
      { targets: [0, 1], orderable: true },

      { targets: [groupColumn], orderable: false }
    ],

    rowGroup: {
      dataSrc: groupColumn,
      startRender: function (rows, group) {
        // Remove numeric prefix (01 - ...)
        return group.replace(/^\d+\s*-\s*/, '');
      }
    }

  });

  // Optional: clicking group header toggles asc/desc
  $('#registerTable tbody').on('click', 'tr.dtrg-group', function () {
    const currentOrder = table.order();

    if (
      currentOrder.length &&
      currentOrder[0][0] === groupColumn &&
      currentOrder[0][1] === 'asc'
    ) {
      table.order([[groupColumn, 'desc'], [0, 'asc']]).draw();
    } else {
      table.order([[groupColumn, 'asc'], [0, 'asc']]).draw();
    }
  });


  /* =========================
     TOC ACTIVE SECTION SCROLL
  ========================== */

  const tocLinks = document.querySelectorAll('.toc-list a[href^="#"]');
  const sections = [];

  tocLinks.forEach(link => {
    const section = document.querySelector(link.getAttribute('href'));
    if (section) sections.push(section);
  });

  if (sections.length) {

    const observer = new IntersectionObserver(
      (entries) => {

        const visibleSections = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (!visibleSections.length) return;

        const activeId = visibleSections[0].target.id;

        tocLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + activeId) {
            link.classList.add('active');
          }
        });

      },
      {
        root: null,
        threshold: 0.15,
        rootMargin: "-20% 0px -70% 0px"
      }
    );

    sections.forEach(section => observer.observe(section));
  }

});

/* Smooth scroll παντού */
html { scroll-behavior: smooth; }

/* Fix: όταν έχεις sticky header (αν χρειάζεται), να μη “κόβεται” ο τίτλος */
.section { scroll-margin-top: 90px; }  /* άλλαξέ το αν θες πιο πολύ/λίγο */

/* TOC active highlight (όπως screenshot) */
.toc-list a{
  transition: background-color .15s ease, font-weight .15s ease;
}

.toc-list a.active{
  background:#dbe8ff;
  font-weight:700;
  color:var(--nav2);
}

/* Breadcrumbs πιο “καθαρά” (να μη φαίνεται “τελος”) */
.breadcrumbs{
  background:#fff;
  border-bottom:1px solid var(--line);
}

.breadcrumbs-inner{
  padding:10px 16px;   /* πιο “σφιχτό” */
  margin:0 auto;
  max-width:1200px;
  font-size:14px;
  color:var(--muted);
}

/* Back to top button */
.back-to-top{
  position:fixed;
  right:18px;
  bottom:18px;
  border:0;
  border-radius:14px;
  background:#0a58ca;
  color:#fff;
  font-weight:700;
  padding:12px 14px;
  cursor:pointer;
  box-shadow:0 12px 24px rgba(0,0,0,.18);
  display:none; /* θα το ανοίγει το JS */
  align-items:center;
  gap:10px;
  z-index:9999;
}

.back-to-top svg{
  width:22px;
  height:22px;
}

.back-to-top.show{
  display:flex;
}
