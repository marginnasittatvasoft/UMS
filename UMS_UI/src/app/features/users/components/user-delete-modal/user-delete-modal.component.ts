import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogContent, MatDialogModule, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-delete-modal',
  standalone: true,
  imports: [MatDialogContent, MatDialogModule, MatDialogTitle, MatButtonModule],
  templateUrl: './user-delete-modal.component.html',
  styleUrl: './user-delete-modal.component.css'
})
export class UserDeleteModalComponent {
  constructor(
    public dialogRef: MatDialogRef<UserDeleteModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onCancelDelete(): void {
    this.dialogRef.close();
  }

}
