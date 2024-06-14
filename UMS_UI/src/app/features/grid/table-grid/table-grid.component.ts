
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { TableDataGrid } from './models/table-grid.config';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { UserService } from '../../users/services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonFunctionService } from '../../../shared/commonFunction/common.function.service';

@Component({
  selector: 'app-table-grid',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatIconModule, CommonModule, MatButtonModule, RouterLink, MatInputModule, MatSelectModule],
  templateUrl: './table-grid.component.html',
  styleUrl: './table-grid.component.css'
})

export class TableGridComponent<T> implements OnInit, AfterViewInit, OnChanges {
  @Input() config: TableDataGrid<T>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<T>;
  selection = new SelectionModel<T>(true, []);
  addAnotherColumn: string[];
  defaultSortColumn: string;
  selectedSortColumns: string[] = [];
  filterDataColumn: string[] = [];
  isHeaderSelected: boolean = false;
  defalutPageSize: number;

  get showFilterOption() {
    if (this.config.features.isShowFilterOption) {
      return this.config.column.filter(i => i.isFilterable).length > 0;
    }
    return false;
  }

  get showPagination() {
    return this.config.pagination.isShowPagination ?? false;
  }
  get pageSize() {
    return this.defalutPageSize ?? this.config.pagination?.defaultPageSize ?? 5;
  }

  get showFirstLastButtons() {
    return this.config.pagination?.isShowFirstLastButton ?? true;
  }

  get pageSizeOptions() {
    return this.config.pagination?.pageSizeOption ?? [5, 10, 15];
  }

  get hidePageSizeOption() {
    return this.config.pagination?.isHidePageSizeOption ?? false;
  }

  get disabledPagination() {
    return this.config.pagination?.isDisabledPagination ?? false;
  }

  get disabledSorting() {
    if (this.config.sorting.isVisibleSorting) {
      return this.config.sorting?.disabledSorting ?? false;
    }
    return true;
  }

  get sortActiveColumn() {
    return this.config.sorting?.defaultSortActiveColumn;
  }

  get sortDisabledClear() {
    return this.config.sorting?.sortDisableClear ?? true;
  }

  get sortDirection() {
    if (this.config.sorting.isVisibleSortDirection) {
      return this.config.sorting?.defaultSortingOrder ?? 'asc';
    }
    return '';
  }

  constructor(private userService: UserService, public dialog: MatDialog, public commonFunctionService: CommonFunctionService) { }

  ngOnInit(): void {
    this.initializeTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['config']) {
      this.initializeTable();
    }
    this.selection.clear();
    this.isHeaderSelected = false;
  }

  ngAfterViewInit(): void {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  initializeTable(): void {
    if (this.config) {
      this.displayedColumns = this.config.column.map(i => i.columnName);
      this.filterDataColumn = this.config.column.filter(i => i.isFilterable).map(i => i.columnName);
      this.dataSource = new MatTableDataSource<T>(this.config.tableGridData.tableData);
      this.addAnotherColumn = [...this.displayedColumns];
      if (this.config.features.isShowSelectColumn && this.config.multipleDelete.callBack) {
        this.addAnotherColumn.unshift('select');
      }
      if (this.config.actionButtons.length > 0) {
        this.addAnotherColumn.push('action');
      }
      this.defaultSortColumn = this.config.sorting.defaultSortActiveColumn;
      this.applySorting(this.config.column.filter(x => x.isSortable).map(i => i.columnName));
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  isSortEnabled(column: string): boolean {
    return this.selectedSortColumns.includes(column);
  }

  applySorting(selectedColumns: string[]) {
    this.selectedSortColumns = [...selectedColumns];
    this.selectedSortColumns.push(this.defaultSortColumn);

    this.dataSource.sortingDataAccessor = (data, sortHeaderId) => {
      if (!this.isSortEnabled(sortHeaderId)) {
        return '';
      }
      return data[sortHeaderId]?.toString().toLowerCase() || '';
    };

    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event, columns: string[]) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = (data: T, filter: string) => {
      return columns.some(column => {
        return data[column]?.toString().toLowerCase().includes(filter);
      });
    };
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.filter(data => !this.isDisabledById(data)).length;
    return numSelected === numRows;
  }

  toggleAllRows(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }
    this.selection.select(...this.dataSource.data.filter(data => !this.isDisabledById(data)));
  }

  deleteSelectedData(): void {
    const deleteSelectedIds = this.config.multipleDelete;
    if (this.config && deleteSelectedIds) {
      if (deleteSelectedIds.callBack) {
        const selectedData = this.selection.selected.map(item => item);
        deleteSelectedIds.callBack(selectedData);
        this.selection.clear();
        this.isHeaderSelected = false;
      }
    }
  }

  isNoDataFound(): boolean {
    return this.dataSource.filteredData.length === 0 || this.dataSource.data.length === 0;
  }

  isDisabledById(data: T): boolean {
    return this.config?.features?.callBackById?.(data) ?? false;
  }

}

