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
import { MatDialog, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { UserDeleteModalComponent } from '../user-delete-modal/user-delete-modal.component';
import { TableGridComponent } from '../../../grid/table-grid/table-grid.component';
import { TableDataGrid } from '../../../grid/table-grid/models/table-grid.config';
import { CommonFunctionService } from '../../../../shared/commonFunction/common.function.service';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatPaginatorModule, MatPaginator, CommonModule, MatTableModule, MatInputModule, MatCheckbox, MatSelectModule, MatButtonModule, MatRadioModule, MatIconModule, RouterLink, MatSortModule, AddEditUserComponent, MatSort, MatCheckboxModule, TableGridComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})

export class UserComponent implements OnInit {

  constructor(private userService: UserService, public dialog: MatDialog, public commonFunctionService: CommonFunctionService) { }
  datagridConfig: TableDataGrid;
  user: User[] = [];
  isAdmin: boolean;
  userId: string;

  ngOnInit(): void {
    this.loadUsers();
    this.loadTable();
  }


  loadUsers() {
    this.userId = this.commonFunctionService.getUserId();
    if (this.userId) {
      const id = Number(this.userId);
      if (!isNaN(id)) {
        this.userService.getUsers(id).subscribe((data) => {
          this.user = data;
          this.isAdmin = this.commonFunctionService.getUserRole() === 'Admin';
          this.loadTable();
        });
      } else {
        this.commonFunctionService.showSnackbar("Something is wrong!", 1500)
      }
    } else {
      this.commonFunctionService.showSnackbar("Something is wrong!", 1500)
    }
  }


  loadTable() {
    this.datagridConfig = {
      pagination: {
        defaultPageSize: 5,
        pageSizeOption: [5, 10, 15],
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
        showSelectColumn: true,
        userData: this.user,
        userRole: this.commonFunctionService.getUserRole(),
        userId: Number(this.userId),

      },
      headerColumn: [
        {
          columnName: 'userName',
          isSortable: false,
          isFilterable: true,
        },
        {
          columnName: 'firstName',
          isSortable: false,
          isFilterable: true,
        },
        {
          columnName: 'lastName',
          isSortable: true,
          isFilterable: false,
        },
        {
          columnName: 'email',
          isSortable: false,
          isFilterable: false,
        },
        {
          columnName: 'phone',
          isSortable: true,
          isFilterable: false,
        },
        {
          columnName: 'street',
          isSortable: true,
          isFilterable: false,
        },
        {
          columnName: 'city',
          isSortable: true,
          isFilterable: false,
        },
        {
          columnName: 'state',
          isSortable: true,
          isFilterable: false,
        },

      ],
      actionButtons: [
        {
          icon: 'edit',
          color: 'primary',
          callBack: (data) => {
            this.EditUserForm(data);
          }
        },
        {
          icon: 'delete',
          color: 'warn',
          callBack: (data) => {
            this.deleteUser([data.id]);
          }
        },
      ],
      allDeleteFeature: {
        callBack: (data) => {
          this.deleteSelectedUsers(data);
        },
      },

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
            this.commonFunctionService.showSnackbar("Deleted Successfully!", 1500)
            this.loadUsers();
          },
          error: (error) => {
            this.commonFunctionService.showSnackbar("Something is wrong!", 1500)
          },
        });
      }
    });
  }

  deleteSelectedUsers(selectedUsers: number[]): void {
    const dialogRef = this.dialog.open(UserDeleteModalComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performDeletion(selectedUsers);
      }
    });
  }

  performDeletion(selectedUsers: number[]): void {
    this.userService.deleteUser(selectedUsers).subscribe({
      next: () => {
        this.commonFunctionService.showSnackbar("Deleted Successfully!", 1500)
        this.loadUsers();
      },
      error: (error) => {
        this.commonFunctionService.showSnackbar("Something is wrong!", 1500)
      }
    });
  }
}

