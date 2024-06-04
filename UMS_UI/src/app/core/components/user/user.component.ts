import { Component, ViewChild } from '@angular/core';
import { MatPaginatorModule } from '@angular/material/paginator';
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
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';

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
  imports: [MatPaginatorModule, MatPaginator, CommonModule, MatTableModule, MatInputModule, MatSelectModule, MatButtonModule, MatRadioModule, MatIconModule, RouterLink, MatSortModule, AddEditUserComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  user: User[] = [];
  displayedColumns: string[] = ['userName', 'firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'password', 'action'];
  dataSource: MatTableDataSource<User>;


  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;



  constructor(private userService: UserService, public dialog: MatDialog) {
  }

  EditUserForm(user: User) {
    console.log(user)
    const dialogRef = this.dialog.open(AddEditUserComponent, {
      data: {
        user: user ? { ...user } : null
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      this.loadUsers();
    });

  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource([]);
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
}
