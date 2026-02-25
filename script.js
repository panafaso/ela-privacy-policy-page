$(document).ready(function () {
  const table = $('#registerTable').DataTable({
    pageLength: 10,

    // Always sort by Category (hidden col 0)
    orderFixed: [[0, 'asc']],
    // Secondary order (Reference Number)
    order: [[1, 'asc']],

    // Hide Category column (we show it as group row instead)
    columnDefs: [{ targets: 0, visible: false }],

    drawCallback: function () {
      const api = this.api();
      const rows = api.rows({ page: 'current' }).nodes();
      let last = null;

      api.column(0, { page: 'current' }).data().each(function (group, i) {
        if (last !== group) {
          // colspan = 4 because 4 visible columns (Reference, Activity, Record, Privacy)
          $(rows).eq(i).before('<tr class="group"><td colspan="4">' + group + '</td></tr>');
          last = group;
        }
      });
    }
  });

  // Optional: click group row toggles sort direction
  $('#registerTable tbody').on('click', 'tr.group', function () {
    const currentOrder = table.order()[0];
    if (currentOrder[0] === 0 && currentOrder[1] === 'asc') table.order([0, 'desc']).draw();
    else table.order([0, 'asc']).draw();
  });
});
