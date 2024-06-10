import { Component, Input, OnInit, input } from '@angular/core';
import { TableGridComponent } from '../../grid/table-grid/table-grid.component';
import { TableDataGrid } from '../../grid/table-grid/models/table-grid.config';
import { UserService } from '../../users/services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../users/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { AddEditUserComponent } from '../../users/components/add-edit-user/add-edit-user.component';
import { UserDeleteModalComponent } from '../../users/components/user-delete-modal/user-delete-modal.component';

@Component({
  selector: 'app-testing',
  standalone: true,
  imports: [TableGridComponent],
  templateUrl: './testing.component.html',
  styleUrl: './testing.component.css'
})
export class TestingComponent implements OnInit {
  constructor(private userService: UserService, public dialog: MatDialog) {

  }

  datagridConfig: TableDataGrid;
  user: User[] = [];

  ngOnInit(): void {
    this.loadUsers();
    this.loadTable();
  }

  loadUsers() {
    this.userService.getUsers().subscribe((data) => {
      this.user = data;
      this.loadTable();
    });
  }

  loadTable() {
    this.datagridConfig = {
      pagination: {
        defaultPageSize: 2,
        pageSizeOption: [10, 15, 20],
        showFirstLastButton: true,
        hidePageSizeOption: false,
        disabledPagination: false
      },
      sorting: {
        disabledSorting: false,
        matSortActiveColumn: 'userName',
        sortDisableClear: true,
        defaultSortingOrder: 'desc'
      },
      tableData: {
        displayedColumn: ['userName', 'firstName', 'lastName', 'email', 'phone', 'street', 'city', 'state', 'action'],
        userData: this.user,
      },
      actionButtons: [
        {
          icon: 'edit',
          callBack: (data) => {
            this.EditUserForm(data);
          }
        },
        {
          icon: 'delete',
          callBack: (data) => {
            this.deleteUser(data);
          }
        }

      ]
    }
  }


  EditUserForm(user: User) {
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
}
