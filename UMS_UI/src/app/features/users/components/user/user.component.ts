import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { Route, Router, RouterLink } from '@angular/router';
import { MatSort, Sort, MatSortModule, SortDirection } from '@angular/material/sort';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { AddEditUserComponent } from '../add-edit-user/add-edit-user.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogTitle, MatDialogContent } from '@angular/material/dialog';
import { UserDeleteModalComponent } from '../user-delete-modal/user-delete-modal.component';
import { TableGridComponent } from '../../../grid/table-grid/table-grid.component';
import { TableDataGrid } from '../../../grid/table-grid/models/table-grid.config';
import { CommonFunctionService } from '../../../../shared/commonFunction/common.function.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MatPaginatorModule, MatPaginator, CommonModule, MatTableModule, MatInputModule, MatCheckbox, MatSelectModule, MatButtonModule, MatRadioModule, MatIconModule, RouterLink, MatSortModule, AddEditUserComponent, MatSort, MatCheckboxModule, TableGridComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})

export class UserComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription = new Subscription();

  constructor(private userService: UserService, public dialog: MatDialog, public commonFunctionService: CommonFunctionService, public router: Router) { }
  datagridConfig: TableDataGrid<User>;
  user: User[] = [];
  isAdmin: boolean;
  userId: string;

  ngOnInit(): void {
    this.loadUsers();
    this.loadTable();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }


  loadUsers() {
    this.userId = this.commonFunctionService.getUserId();
    if (this.userId) {
      const id = Number(this.userId);
      if (!isNaN(id)) {
        const loadUsersSub = this.userService.getUsers(id).subscribe({
          next: (data) => {
            this.user = data;
            this.isAdmin = this.commonFunctionService.getUserRole() === 'Admin';
            this.loadTable();
          },
          error: () => {
            this.commonFunctionService.showSnackbar("Something is wrong!", 1500);
          }
        });
        this.subscriptions.add(loadUsersSub);
      } else {
        this.commonFunctionService.showSnackbar("Something is wrong!", 1500);
      }
    } else {
      this.commonFunctionService.showSnackbar("Something is wrong!", 1500);
    }
  }

  loadTable() {
    this.datagridConfig = {
      pagination: {
        defaultPageSize: 5,
        pageSizeOption: [5, 10, 15],
        isShowFirstLastButton: true,
        isHidePageSizeOption: false,
        isDisabledPagination: false,
        isShowPagination: this.commonFunctionService.getUserRole() === 'Admin'
      },

      sorting: {
        disabledSorting: false,
        defaultSortActiveColumn: 'userName',
        sortDisableClear: true,
        defaultSortingOrder: 'desc'
      },

      tableGridData: {
        showSelectColumn: this.commonFunctionService.getUserRole() === 'Admin',
        tableData: this.user,
        isVisibleFeatureByRole: this.commonFunctionService.getUserRole() === 'Admin',
        callBackById: (data) => {
          const isDisabledByid = data.id === Number(this.userId)
          return isDisabledByid;
        },
        callBackByIcon: (data) => {
          const isDisabledByIcon = data.icon === 'delete'
          return isDisabledByIcon;
        },
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

      multipleDelete: {
        callBack: (data) => {
          const selectedIds = data.map(item => item.id);
          this.deleteSelectedUsers(selectedIds);
        },
      },

      addButton: [{
        btnText: "Add User",
        color: 'primary',
        isVisible: this.isAdmin,
        callBack: () => {
          this.navigatePath();
        },
      }]
    }
  }

  checkUserid(id: number) {
    return id === Number(this.userId);
  }

  navigatePath() {
    this.router.navigate(["/Ums/adduser"]);
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
        const deleteUserSub = this.userService.deleteUser(id).subscribe({
          next: () => {
            this.commonFunctionService.showSnackbar("Deleted Successfully!", 1500);
            this.loadUsers();
          },
          error: () => {
            this.commonFunctionService.showSnackbar("Something is wrong!", 1500);
          },
        });
        this.subscriptions.add(deleteUserSub);
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
    const performDeletionSub = this.userService.deleteUser(selectedUsers).subscribe({
      next: () => {
        this.commonFunctionService.showSnackbar("Deleted Successfully!", 1500);
        this.loadUsers();
      },
      error: () => {
        this.commonFunctionService.showSnackbar("Something is wrong!", 1500);
      }
    });
    this.subscriptions.add(performDeletionSub);
  }
}

