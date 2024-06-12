
import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, Sort, MatSortModule, SortDirection } from '@angular/material/sort';
import { TableDataGrid } from './models/table-grid.config';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { User } from '../../users/models/user.model';
import { UserService } from '../../users/services/user.service';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { UserDeleteModalComponent } from '../../users/components/user-delete-modal/user-delete-modal.component';
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

export class TableGridComponent implements OnInit, AfterViewInit, OnChanges {
  constructor(private userService: UserService, public dialog: MatDialog, public commonFunctionService: CommonFunctionService) { }

  @Input() config: TableDataGrid;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  user: User[] = [];
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<User>;
  addAnotherColumn: string[];
  defaultSortColumn: string;
  selectedSortColumns: string[] = [];
  filterDataColumn: string[] = [];
  selectedUserIds: number[] = [];
  isHeaderSelected: boolean = false;
  defalutPageSize: number;
  userRole: string;
  isAdmin: boolean;
  userId: number;


  ngOnInit() {
    this.initializeTable();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['config']) {
      this.initializeTable();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  initializeTable() {
    if (this.config) {
      this.displayedColumns = this.config.headerColumn.map(i => i.columnName);
      this.isAdmin = this.config.tableData.userRole === 'Admin';
      this.userId = this.config.tableData.userId;
      this.filterDataColumn = this.config.headerColumn.filter(i => i.isFilterable).map(i => i.columnName);
      this.dataSource = new MatTableDataSource(this.config.tableData.userData);
      this.addAnotherColumn = [...this.displayedColumns];
      if (this.config.tableData.showSelectColumn && this.config.allDeleteFeature.callBack) {
        this.addAnotherColumn.unshift('select');
      }
      if (this.config.actionButtons.length > 0) {
        this.addAnotherColumn.push('action');
      }
      this.user = this.config.tableData.userData;
      this.defaultSortColumn = this.config.sorting.matSortActiveColumn;
      this.applySorting(this.config.headerColumn.filter(x => x.isSortable).map(i => i.columnName));
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
      return data[sortHeaderId].toString().toLowerCase();
    };

    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event, columns: string[]) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      return columns.some(column => {
        return data[column].toLowerCase().includes(filter);
      });
    };
  }

  isCheckboxSelected(userId: number): boolean {
    return this.selectedUserIds.includes(userId);
  }

  toggleSelectAll(event: any) {
    this.isHeaderSelected = event.checked;
    if (this.isHeaderSelected) {
      this.selectedUserIds = this.user.map(user => user.id).filter(id => id !== this.userId);
    } else {
      this.selectedUserIds = [];
    }
  }

  toggleSelection(event: MatCheckboxChange, userId: number) {
    if (event.checked) {
      this.selectedUserIds.push(userId);
    } else {
      const index = this.selectedUserIds.indexOf(userId);
      if (index !== -1) {
        this.selectedUserIds.splice(index, 1);
      }
    }
  }

  isAllCellsSelected(): boolean {
    const selectableUserCount = this.user.filter(user => user.id !== this.userId).length;
    if (selectableUserCount !== 0) {
      return this.selectedUserIds.length === selectableUserCount;
    }
    return false;
  }

  isNoUsersFound(): boolean {
    return this.dataSource.filteredData.length === 0 || this.dataSource.data.length === 0;
  }

  get showFilterOption() {
    if (!this.isAdmin) {
      return false;
    }
    return this.config.headerColumn.filter(i => i.isFilterable).length > 0;
  }

  get pageSize() {
    return this.defalutPageSize ?? this.config.pagination?.defaultPageSize ?? 5;
  }

  get showFirstLastButtons() {
    return this.config.pagination?.showFirstLastButton ?? true;
  }

  get pageSizeOptions() {
    return this.config.pagination?.pageSizeOption ?? [5, 10, 15];
  }

  get hidePageSizeOption() {
    return this.config.pagination?.hidePageSizeOption ?? false;
  }

  get disabledPagination() {
    return this.config.pagination?.disabledPagination ?? false;
  }

  get disabledSorting() {
    if (!this.isAdmin) {
      return true;
    }
    return this.config.sorting?.disabledSorting ?? false;
  }

  get sortActiveColumn() {
    return this.config.sorting?.matSortActiveColumn;
  }

  get sortDisabledClear() {
    return this.config.sorting?.sortDisableClear ?? true;
  }

  get sortDirection() {
    if (!this.isAdmin) {
      return '';
    }
    return this.config.sorting?.defaultSortingOrder ?? 'asc';
  }

}

