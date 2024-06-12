import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class CommonFunctionService {

    constructor(private snackBar: MatSnackBar) { }

    controlValidity(formGroup: FormGroup, controlName: string): boolean {
        if (formGroup.get(controlName)?.invalid || formGroup.get(controlName)?.touched) {
            return true;
        } else {
            return false;
        }
    }

    getErrorMessage(formGroup: FormGroup, formField: string, controlName: string): string {
        const control = formGroup.get(formField);

        if (control?.hasError('required')) {
            return `${controlName} is required.`;
        }

        if (control?.hasError('pattern')) {
            if (formField == 'phone') {
                return `${controlName} must be 10 digits.`;
            }
            return 'Invalid format! Password must contain at least 1 uppercase, 1 lowercase, 1 digit and the total length should be greater than or equal to 8 and less or equal to 16 ';
        }

        if (control?.hasError('minlength')) {

            if (formField == 'userName') {
                return `${controlName} must be at least 5 characters long.`;
            }

            return `${controlName} must be at least 2 characters long.`;
        }

        if (control?.hasError('maxlength')) {
            if (formField == 'street') {
                return `${controlName} Cannot exceed 150 character.`;
            }
            return 'Cannot exceed 20 charcters.';
        }

        if (control?.hasError('email')) {
            return 'Please enter valid Email.';
        }

        return '';
    }

    showSnackbar(message: string, duration?: number) {
        if (duration !== undefined) {
            this.snackBar.open(message, 'OK', { duration: duration });
        }
        else {
            this.snackBar.open(message, 'OK');
        }
    }

    setToken(tokenValue: string) {
        localStorage.setItem('token', tokenValue)
    }

    getUserRole() {
        return localStorage.getItem('role')
    }
    getUserId() {
        return localStorage.getItem('id')
    }
}

