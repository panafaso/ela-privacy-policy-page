$(function () {
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
      // hide category column
      { targets: [groupColumn], visible: false },

      // IMPORTANT: remove sorting (and the little arrows) from Record + Privacy columns
      { targets: [2, 3], orderable: false, searchable: false },

      // keep sorting only for Reference + Processing
      { targets: [0, 1], orderable: true },

      // optional: prevent category sorting arrow since hidden anyway
      { targets: [groupColumn], orderable: false }
    ],

    rowGroup: {
      dataSrc: groupColumn,
      startRender: function (rows, group) {
        // group comes like "01 - Inspections & Enforcement"
        const label = group.replace(/^\d+\s*-\s*/,'');
        return label;
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
});
