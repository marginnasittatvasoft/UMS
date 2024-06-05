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


  constructor(private fb: FormBuilder, private userService: UserService, @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
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
      id: [''],
      firstName: ['', [Validators.required, Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      street: ['', [Validators.required, Validators.maxLength(150)]],
      city: [''],
      state: [''],
      userName: ['', [Validators.required, Validators.maxLength(20)]],
      password: ['', [Validators.required, Validators.maxLength(20), Validators.minLength(6)]],
    });
  }


  onSubmit() {
    console.log(this.addUserForm.value);
    debugger;
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
