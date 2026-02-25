$(document).ready(function () {
  const table = $('#registerTable').DataTable({
    pageLength: 10,
    orderFixed: [[0, 'asc']], // group by Category (hidden)
    order: [[1, 'asc']],      // then sort by Reference Number
    columnDefs: [{ targets: 0, visible: false }],

    drawCallback: function () {
      const api = this.api();
      const rows = api.rows({ page: 'current' }).nodes();
      let last = null;

      api.column(0, { page: 'current' }).data().each(function (group, i) {
        if (last !== group) {
          // 4 visible columns: Reference, Processing, Record, Privacy
          $(rows).eq(i).before(
            '<tr class="group"><td colspan="4">' + group + '</td></tr>'
          );
          last = group;
        }
      });
    }
  });

  // optional: click group row to toggle sort direction
  $('#registerTable tbody').on('click', 'tr.group', function () {
    const currentOrder = table.order()[0];
    if (currentOrder[0] === 0 && currentOrder[1] === 'asc') table.order([0, 'desc']).draw();
    else table.order([0, 'asc']).draw();
  });
});
