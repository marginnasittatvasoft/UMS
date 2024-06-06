
import { Component, EventEmitter, Inject, Input, OnChanges, Optional, Output, SimpleChanges, input } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { CommonFunctionService } from '../../../../shared/commonFunction/common.function.service';


@Component({
  selector: 'app-add-edit-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatSelectModule, MatRadioModule, MatButtonModule, MatIconModule, MatDialogModule, RouterLink, MatDialogTitle, MatDialogContent],
  templateUrl: './add-edit-user.component.html',
  styleUrl: './add-edit-user.component.css'
})
export class AddEditUserComponent {
  addUserForm!: FormGroup;
  isDialogMode: boolean = false;


  constructor(private fb: FormBuilder, private userService: UserService, @Optional() @Inject(MAT_DIALOG_DATA) public data: any, public commonFunctionService: CommonFunctionService) {
  }

  ngOnInit(): void {
    this.isDialogMode = !!this.data;
    this.createForm();
    if (this.isDialogMode && this.data && this.data.user) {
      this.addUserForm.patchValue(this.data.user);
    }

  }

  createForm() {
    this.addUserForm = this.fb.group({
      id: ['', []],
      firstName: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern("[0-9 ]{10}")]],
      street: ['', [Validators.required, Validators.maxLength(150), Validators.minLength(2)]],
      city: ['', []],
      state: ['', []],
      userName: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(5)]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*_=+\-]).{6,16}$/)]],
    });
  }


  onSubmit() {
    console.log(this.addUserForm.value);
    if (this.addUserForm.valid) {
      if (this.isDialogMode) {
        this.submitDialogForm();
      } else {
        this.submitStandaloneForm();
      }
    }
  }

  submitStandaloneForm() {
    this.userService.addUser(this.addUserForm.value).subscribe({
      next: () => {
        this.resetForm();
      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }

  submitDialogForm() {
    this.userService.updateUser(this.addUserForm.value).subscribe({
      next: () => {

      },
      error: (error) => {
        console.error('There was an error!', error);
      },
    });
  }

  resetForm() {
    this.addUserForm.reset();
  }
}
