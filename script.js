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
