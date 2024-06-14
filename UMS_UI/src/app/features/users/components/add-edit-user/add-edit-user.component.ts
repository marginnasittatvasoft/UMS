import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, Optional, Output, SimpleChanges, input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { CommonFunctionService } from '../../../../shared/commonFunction/common.function.service';
import { Subscription } from 'rxjs';
import { AspNetRoles, User } from '../../models/user.model';


@Component({
  selector: 'app-add-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatRadioModule, MatButtonModule, MatIconModule, MatDialogModule, RouterLink, MatDialogTitle, MatDialogContent],
  templateUrl: './add-edit-user.component.html',
  styleUrl: './add-edit-user.component.css'
})
export class AddEditUserComponent implements OnDestroy {
  addUserForm!: FormGroup;
  userRoles: AspNetRoles[] = [];
  isDialogMode?: boolean = false;
  isDisabledField?: boolean = false;
  isAdmin: boolean = false;
  userId: number;
  hide = true;
  private subscriptions: Subscription = new Subscription();


  constructor(private formbuilder: FormBuilder, private userService: UserService, @Optional() @Inject(MAT_DIALOG_DATA) public data: { user: User }, public commonFunctionService: CommonFunctionService, private router: Router) { }

  ngOnInit(): void {
    debugger;
    this.isAdmin = this.commonFunctionService.getUserRole() === 'Admin';
    if (this.data != null && this.data.user != null) {
      this.isDisabledField = Number(this.commonFunctionService.getUserId()) === this.data.user.id;
      this.isDialogMode = !!this.data.user;
    }
    this.createForm();
    this.loadAspNetUserRoles();
    if (this.isDialogMode && this.data.user) {
      const userData = this.data.user;
      this.addUserForm.patchValue(userData);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  createForm() {
    this.addUserForm = this.formbuilder.group({
      id: ['', []],
      firstName: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(2)]],
      email: [{ value: '', disabled: (this.isDisabledField) }, [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      street: ['', [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      city: ['', []],
      state: ['', []],
      userName: [{ value: '', disabled: (this.isDisabledField) }, [Validators.required, Validators.maxLength(20), Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+\-]).{6,16}$/)]],
      roleId: ['', [Validators.required]],
    });
  }

  loadAspNetUserRoles() {
    const loadRolesSub = this.userService.getRoles().subscribe((data) => {
      this.userRoles = data;
    });
    this.subscriptions.add(loadRolesSub);
  }

  onSubmit() {
    if (this.addUserForm.valid) {
      if (this.addUserForm.controls['email'].disabled) {
        this.addUserForm.controls['email'].enable();
      }
      if (this.addUserForm.controls['userName'].disabled) {
        this.addUserForm.controls['userName'].enable();
      }
      if (this.isDialogMode) {
        this.submitDialogForm();
      } else {
        this.submitStandaloneForm();
      }
    }
  }

  submitStandaloneForm() {
    const addUserSub = this.userService.addUser(this.addUserForm.value).subscribe({
      next: () => {
        this.resetForm();
        this.commonFunctionService.showSnackbar("Data Added Successfully!", 1500);
        this.router.navigate(['/Ums/user']);
      },
      error: (error) => {
        if (error.status === 409) {
          this.commonFunctionService.showSnackbar("User already exists!", 1500);
          this.addUserForm.patchValue({ email: '' });
          this.addUserForm.patchValue({ userName: '' });
        } else {
          this.commonFunctionService.showSnackbar("Something is wrong!", 1500);
        }
      },
    });
    this.subscriptions.add(addUserSub);
  }

  submitDialogForm() {
    const updateUserSub = this.userService.updateUser(this.addUserForm.value).subscribe({
      next: () => {
        this.commonFunctionService.showSnackbar("Data Updated Successfully!", 1500);
      },
      error: (error) => {
        if (error.status === 409) {
          this.commonFunctionService.showSnackbar("User already exists!", 1500);
          this.addUserForm.patchValue({ email: '' });
          this.addUserForm.patchValue({ userName: '' });
        } else {
          this.commonFunctionService.showSnackbar("Something is wrong!", 1500);
        }
      },
    });
    this.subscriptions.add(updateUserSub);
  }

  resetForm() {
    this.addUserForm.reset();
  }
}
