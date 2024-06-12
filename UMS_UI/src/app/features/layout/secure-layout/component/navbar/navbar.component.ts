import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonFunctionService } from '../../../../../shared/commonFunction/common.function.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterLink, CommonModule, MatSnackBarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isLoggedIn: boolean = false;
  userRole: string;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar, public commonFunctionService: CommonFunctionService) { }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });

  }

  getNavigationLinks(): { label: string, route: string }[] {
    this.userRole = this.commonFunctionService.getUserRole();
    if (this.isLoggedIn && this.userRole === "Admin") {
      return [
        { label: 'User', route: '/Ums/user' },
        { label: 'Add_User', route: '/Ums/adduser' }
      ];
    }
    else if (this.isLoggedIn && this.userRole !== "Admin") {
      return [
        { label: 'User', route: '/Ums/user' },
      ];
    }
    else {
      return [
        { label: 'Login', route: '/login' },
      ];
    }
  }

  logout(): void {
    this.snackBar.open('Logged out Successfully', '', { duration: 1500 });
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
