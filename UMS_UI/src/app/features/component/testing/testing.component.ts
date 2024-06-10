import { Component, Input, OnInit, input } from '@angular/core';
import { TableGridComponent } from '../../grid/table-grid/table-grid.component';
import { TableDataGrid } from '../../grid/table-grid/models/table-grid.config';

@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [TableGridComponent],
  templateUrl: './testing.component.html',
  styleUrl: './testing.component.css'
})
export class TestingComponent implements OnInit {

  datagridConfig: TableDataGrid;

  ngOnInit(): void {
    this.datagridConfig = {
      pagination: {
        defaultPageSize: 10,
        PageSizeOption: [10, 15, 20],
        showFirstLastButton: true,
        hidePageSizeOption: false,
        disabledPagination: false
      },
      sorting: {
        disabledSorting: false,
        matSortActiveColumn: 'name',
        SortDisableClear: true,
        defaultSortingOrder: 'desc'
      }

    }
  }

}
