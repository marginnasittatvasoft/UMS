import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../../core/auth/auth.service';
import { LoginDto } from '../../../../../core/models/user.model';
import { CommonFunctionService } from '../../../../../shared/commonFunction/common.function.service';
import { loginForm } from '../../models/user.form.model';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, CommonModule, ReactiveFormsModule, MatCardModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})

export class LoginPageComponent {
  constructor(private authService: AuthService, private router: Router, public commonFunctionService: CommonFunctionService) { }
  hide = true;
  loginForm: FormGroup<loginForm> = new FormGroup<loginForm>({
    userName: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required)
  });


  submit(): void {
    if (this.loginForm.valid) {
      const data: LoginDto = { ...this.loginForm.value } as LoginDto;
      this.authService.login(data).subscribe(result => {
        if (result.success) {
          this.commonFunctionService.showSnackbar("Successfully LogeedIn!", 1500)
          this.router.navigate(['Ums/home'])
        } else {
          this.commonFunctionService.showSnackbar("Invalid Credentials!", 1500)
        }
      })

    }
  }

}
