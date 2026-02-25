$(document).ready(function () {
  // 0 = Category (hidden column used ONLY for grouping)
  var groupColumn = 0;

  var table = $('#registerTable').DataTable({
    columnDefs: [
      { visible: false, targets: groupColumn } // hide ONLY Category
    ],
    order: [[groupColumn, 'asc']], // order by Category
    pageLength: 10,
    lengthMenu: [10, 25, 50],
    autoWidth: false,

    drawCallback: function () {
      var api = this.api();
      var rows = api.rows({ page: 'current' }).nodes();
      var last = null;

      api.column(groupColumn, { page: 'current' })
        .data()
        .each(function (group, i) {
          if (last !== group) {
            // We have 4 visible columns now (Reference + 3)
            $(rows).eq(i).before(
              '<tr class="group"><td colspan="4">' + group + '</td></tr>'
            );
            last = group;
          }
        });
    }
  });

  // Optional: click group row to switch grouping order
  $('#registerTable tbody').on('click', 'tr.group', function () {
    var currentOrder = table.order()[0];
    if (currentOrder[0] === groupColumn && currentOrder[1] === 'asc') {
      table.order([[groupColumn, 'desc']]).draw();
    } else {
      table.order([[groupColumn, 'asc']]).draw();
    }
  });
});
