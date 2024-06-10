
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
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-table-grid',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, MatCheckboxModule, MatIconModule, CommonModule, MatButtonModule, RouterLink, MatInputModule, MatSelectModule],
  templateUrl: './table-grid.component.html',
  styleUrl: './table-grid.component.css'
})

export class TableGridComponent implements OnInit, AfterViewInit, OnChanges {
  constructor(private userService: UserService, public dialog: MatDialog, private snackBar: MatSnackBar) { }

  @Input() config: TableDataGrid;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  user: User[] = [];
  displayedColumns: string[] = [];
  dataSource: MatTableDataSource<User>;
  addAnotherColumn: string[];
  selectedSortColumns: string[] = [];
  filterDataColumn: string[] = [];
  sortingOrder: SortDirection;
  selectedUserIds: number[] = [];
  isHeaderSelected: boolean = false;
  defalutPageSize: number;


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
      this.displayedColumns = this.config.tableData.displayedColumn;
      this.filterDataColumn = this.config.tableData.filterDataColumn;
      this.dataSource = new MatTableDataSource(this.config.tableData.userData);
      this.addAnotherColumn = [...this.displayedColumns];
      this.addAnotherColumn.unshift('select');
      if (this.config.tableData.showActionColumn) {
        this.addAnotherColumn.push('action');
      }
      this.user = this.config.tableData.userData;
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.selectedSortColumns = [this.config.sorting.matSortActiveColumn];
    }
  }

  isSortEnabled(column: string): boolean {
    return this.selectedSortColumns.includes(column);
  }

  editUser(user: User) {
    if (this.config && this.config.actionButtons) {
      const editButton = this.config.actionButtons.find(i => i.icon === 'edit');
      if (editButton && editButton.callBack) {
        editButton.callBack(user);
      }
      else {
        this.snackBar.open('Something is wrong!!!', 'OK');
      }
    }
    else {
      this.snackBar.open('Something is wrong with the configuration!!!', 'OK');
    }
  }



  deleteUser(id: number[]) {
    if (this.config && this.config.actionButtons) {
      const deleteButton = this.config.actionButtons.find(i => i.icon === 'delete');
      if (deleteButton && deleteButton.callBack) {
        deleteButton.callBack(id);
      }
      else {
        this.snackBar.open('Something is wrong!!!', 'OK');
      }
    }
    else {
      this.snackBar.open('Something is wrong with the configuration!!!', 'OK');
    }
  }


  isCheckboxSelected(userId: number): boolean {
    return this.selectedUserIds.includes(userId);
  }

  toggleSelectAll(event: any) {
    this.isHeaderSelected = event.checked;
    if (this.isHeaderSelected) {
      this.selectedUserIds = this.user.map(user => user.id);
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
    return this.selectedUserIds.length === this.user.length;
  }

  deleteSelectedUsers(): void {
    if (this.selectedUserIds.length === 0) {
      return;
    }
    if (this.config && this.config.tableFeatures) {
      const deleteSelectedButton = this.config.tableFeatures.find(i => i.selectField === 'deleteselectedbtn');
      if (deleteSelectedButton && deleteSelectedButton.callBack) {
        deleteSelectedButton.callBack(this.selectedUserIds);
        this.isHeaderSelected = false;
      } else {
        this.toggleSelectAll(false);
      }
    }
    else {
      this.snackBar.open('Something is wrong with the configuration!!!', 'OK');
    }
  }

  applySorting(selectedColumns: string[]) {
    this.selectedSortColumns = selectedColumns;

    this.dataSource.sortingDataAccessor = (data, sortHeaderId) => {
      if (!this.isSortEnabled(sortHeaderId)) {
        return '';
      }
      return data[sortHeaderId];
    };

    this.dataSource.sort = this.sort;
  }

  changeSortingOrder(sortdirection: SortDirection) {
    this.sortingOrder = sortdirection;
    if (this.config && this.config.tableFeatures) {
      const loadUserFeature = this.config.tableFeatures.find(i => i.selectField === 'loaduser');
      if (loadUserFeature && loadUserFeature.callBack) {
        loadUserFeature.callBack(null);
      } else {
        this.snackBar.open('Something is wrong!!!', 'OK');
      }
    }
    else {
      this.snackBar.open('Something is wrong with the configuration!!!', 'OK');
    }
  }



  changePageSize(pageSizeValue: string) {
    const pageSize = parseInt(pageSizeValue, 10)
    if (!Number.isNaN(pageSize)) {
      this.defalutPageSize = pageSize;
      this.paginator.pageSize = pageSize;
    }
    else {
      this.defalutPageSize = this.config.pagination?.defaultPageSize;
      this.paginator.pageSize = this.config.pagination?.defaultPageSize;
    }

    if (this.config.tableFeatures.find(i => i.selectField === 'loaduser').callBack) {
      this.config.tableFeatures.find(i => i.selectField === 'loaduser').callBack(null);
    }
    else {
      this.snackBar.open('Something is wrong!!!', 'OK');
    }

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


  get showFilterOption() {
    return this.config.tableData?.showFilterOption ?? true;
  }

  get showSortOrderOption() {
    return this.config.tableData?.showSortOrderOption ?? true;
  }

  get showSortingByColumnOption() {
    return this.config.tableData?.showSortingByColumnOption ?? true;
  }

  get showPageSizeOptionField() {
    return this.config.tableData?.showPageSizeOption ?? true;
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
    return this.config.sorting?.disabledSorting ?? false;
  }

  get sortActiveColumn() {
    return this.config.sorting?.matSortActiveColumn ?? 'userName';
  }

  get sortDisabledClear() {
    return this.config.sorting?.sortDisableClear ?? true;
  }

  get sortDirection() {
    return this.sortingOrder ?? this.config.sorting?.defaultSortingOrder ?? 'asc';
  }
}

