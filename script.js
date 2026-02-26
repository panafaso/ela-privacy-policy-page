// ===============================
// DATA TABLE (Register)
// ===============================
$(document).ready(function () {

  const groupColumn = 4; // hidden Category column

  const table = $('#registerTable').DataTable({

    pageLength: 50,

    lengthMenu: [
      [50, 100],
      [50, 100]
    ],

    order: [[groupColumn, 'asc'], [0, 'asc']],

    columnDefs: [
      { targets: [groupColumn], visible: false },

      // Disable sorting + search on Record & Privacy columns
      { targets: [2, 3], orderable: false, searchable: false },

      // Enable only for Reference + Processing
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

  // Toggle group ordering when clicking group header
  $('#registerTable tbody').on('click', 'tr.dtrg-group', function () {
    const currentOrder = table.order();

    if (currentOrder.length &&
        currentOrder[0][0] === groupColumn &&
        currentOrder[0][1] === 'asc') {

      table.order([[groupColumn, 'desc'], [0, 'asc']]).draw();

    } else {

      table.order([[groupColumn, 'asc'], [0, 'asc']]).draw();
    }
  });

});


// ===============================
// TOC + SMOOTH SCROLL + SCROLL SPY
// ===============================
document.addEventListener("DOMContentLoaded", function () {

  const tocLinks = Array.from(document.querySelectorAll(".toc-list a"));
  const sections = tocLinks
    .map(link => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  // --- Click smooth scroll ---
  tocLinks.forEach(link => {
    link.addEventListener("click", function (e) {

      const target = document.querySelector(this.getAttribute("href"));
      if (!target) return;

      e.preventDefault();

      // Remove active from all
      tocLinks.forEach(l => l.classList.remove("active"));
      this.classList.add("active");

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });

  // --- Scroll Spy (auto highlight while scrolling) ---
  const observer = new IntersectionObserver((entries) => {

    const visibleSections = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

    if (visibleSections.length > 0) {
      const id = visibleSections[0].target.id;

      tocLinks.forEach(link => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === "#" + id
        );
      });
    }

  }, {
    root: null,
    threshold: [0.3, 0.5, 0.7],
    rootMargin: "-15% 0px -65% 0px"
  });

  sections.forEach(section => observer.observe(section));

});


// ===============================
// BACK TO TOP
// ===============================
document.addEventListener("DOMContentLoaded", function () {

  const backToTop = document.getElementById("backToTop");

  if (!backToTop) return;

  const toggleVisibility = () => {
    if (window.scrollY > 500) {
      backToTop.classList.add("show");
    } else {
      backToTop.classList.remove("show");
    }
  };

  window.addEventListener("scroll", toggleVisibility, { passive: true });

  toggleVisibility();

  backToTop.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });

});
