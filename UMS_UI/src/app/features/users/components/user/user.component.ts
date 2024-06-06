import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
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

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatPaginatorModule, MatPaginator, CommonModule, MatTableModule, MatInputModule, MatSelectModule, MatButtonModule, MatRadioModule, MatIconModule, RouterLink, MatSortModule, AddEditUserComponent, MatSort],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})

export class UserComponent implements OnInit, AfterViewInit {
  user: User[] = [];
  displayedColumns: string[] = ['userName', 'firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'password', 'action'];
  allColumns: string[] = ['userName', 'firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'password', 'action'];
  dataSource: MatTableDataSource<User>;
  pageSizeOptions: number[] = [5, 10, 20];
  pageSize: number = 5;
  selectedSortColumns: string[] = [];
  defaultSortOrder: 'asc' | 'desc' = 'asc';


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userService: UserService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource([]);
  }

  ngOnInit() {
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
      this.applySorting(); // Ensure sorting is applied when data is loaded
    });
  }

  deleteUser(id: number) {
    this.userService.deleteUser(id).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
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

  // applySorting() {
  //   this.dataSource.sortingDataAccessor = (data, sortHeaderId) => {
  //     if (!this.isSortEnabled(sortHeaderId) || sortHeaderId === 'action') {
  //       return '';
  //     }
  //     return data[sortHeaderId];
  //   };
  //   this.dataSource.sort = this.sort;
  // }
  applySorting() {
    const defaultSortDirection: SortDirection = this.defaultSortOrder === 'asc' ? 'asc' : 'desc';

    this.dataSource.sortingDataAccessor = (data, sortHeaderId) => {
      if (!this.isSortEnabled(sortHeaderId) || sortHeaderId === 'action') {
        return '';
      }
      return data[sortHeaderId];
    };

    this.dataSource.sort.direction = defaultSortDirection;
    this.dataSource.sort.active = this.selectedSortColumns[0];
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
}