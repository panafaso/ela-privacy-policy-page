$(document).ready(function () {
  // helper: read grouping value from each row
  function categoryForRow(rowNode) {
    return $(rowNode).attr('data-category') || '';
  }

  const table = $('#registerTable').DataTable({
    pageLength: 10,
    order: [[0, 'asc']], // sort by Reference Number (like normal)
    drawCallback: function () {
      const api = this.api();
      const rows = api.rows({ page: 'current' }).nodes();

      let last = null;

      api.rows({ page: 'current' }).every(function (rowIdx) {
        const rowNode = this.node();
        const group = categoryForRow(rowNode);

        if (group && group !== last) {
          // ✅ Insert a group row where the category appears in FIRST column
          $(rowNode).before(`
            <tr class="group">
              <td class="group-cell">${group}</td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          `);
          last = group;
        }
      });
    }
  });
});
