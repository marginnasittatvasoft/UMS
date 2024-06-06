import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckbox, MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';
import { MatSort, Sort, MatSortModule, SortDirection } from '@angular/material/sort';

import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { AddEditUserComponent } from '../add-edit-user/add-edit-user.component';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogTitle,
  MatDialogContent,
} from '@angular/material/dialog';
import { UserDeleteModalComponent } from '../user-delete-modal/user-delete-modal.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatPaginatorModule, MatPaginator, CommonModule, MatTableModule, MatInputModule, MatCheckbox, MatSelectModule, MatButtonModule, MatRadioModule, MatIconModule, RouterLink, MatSortModule, AddEditUserComponent, MatSort, MatCheckboxModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})

export class UserComponent implements OnInit, AfterViewInit {
  user: User[] = [];
  displayedColumns: string[] = ['userName', 'firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'action'];
  addSelectColumn: string[];
  dataSource: MatTableDataSource<User>;
  pageSizeOptions: number[] = [5, 10, 20];
  pageSize: number = 5;
  selectedSortColumns: string[] = ['userName'];
  defaultSortOrder: SortDirection = 'desc';
  selectedUserIds: number[] = [];
  isHeaderSelected: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: UserService, public dialog: MatDialog) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource([]);
    this.addSelectColumn = [...this.displayedColumns];
    this.addSelectColumn.unshift('select')
    this.loadUsers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadUsers() {
    this.userService.getUsers().subscribe((data) => {
      this.dataSource.data = data;
      this.user = data;
      this.applySorting(['userName']);
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
    this.dataSource.filterPredicate = (data: User, filter: string) => {
      return data.firstName.toLowerCase().includes(filter) ||
        data.lastName.toLowerCase().includes(filter) ||
        data.email.toLowerCase().includes(filter) ||
        data.userName.toLowerCase().includes(filter);
    };
  }

  changePageSize(pageSizeValue: string) {
    const pageSize = parseInt(pageSizeValue, 10);
    this.pageSize = pageSize;
    this.paginator.pageSize = pageSize;
    this.loadUsers();
  }

  isSortEnabled(column: string): boolean {
    return this.selectedSortColumns.includes(column);
  }

  applySorting(selectedColumns: string[]) {
    this.selectedSortColumns = selectedColumns;

    this.dataSource.sortingDataAccessor = (data, sortHeaderId) => {
      if (!this.isSortEnabled(sortHeaderId) || sortHeaderId === 'action') {
        return '';
      }
      return data[sortHeaderId];
    };

    this.dataSource.sort = this.sort;
  }

  EditUserForm(user: User) {
    console.log(user);
    const dialogRef = this.dialog.open(AddEditUserComponent, {
      data: {
        user: user ? { ...user } : null
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadUsers();
    });
  }

  deleteUser(id: number[]) {
    const dialogRef = this.dialog.open(UserDeleteModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.loadUsers();
          },
          error: (error) => {
            console.error('There was an error!', error);
          },
        });
      }
    });

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
    const dialogRef = this.dialog.open(UserDeleteModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performDeletion();
      }
      else {
        this.toggleSelectAll(false);
      }
    });
  }

  performDeletion(): void {
    this.userService.deleteUser(this.selectedUserIds).subscribe({
      next: () => {
        this.loadUsers();
        this.selectedUserIds = [];
      },
      error: (error) => {
        console.error('There was an error deleting users!', error);
      }
    });
    this.isHeaderSelected = false;
  }
}