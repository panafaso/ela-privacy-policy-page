$(document).ready(function () {
  var groupColumn = 0; // Category

  var table = $('#registerTable').DataTable({
    columnDefs: [{ visible: false, targets: groupColumn }],
    order: [[groupColumn, 'asc']],
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
            // Visible columns now = 4 (Reference, Processing, Record, Privacy)
            $(rows).eq(i).before(
              '<tr class="group"><td colspan="4">' + group + '</td></tr>'
            );
            last = group;
          }
        });
    }
  });

  $('#registerTable tbody').on('click', 'tr.group', function () {
    var currentOrder = table.order()[0];
    if (currentOrder[0] === groupColumn && currentOrder[1] === 'asc') {
      table.order([[groupColumn, 'desc']]).draw();
    } else {
      table.order([[groupColumn, 'asc']]).draw();
    }
  });
});
