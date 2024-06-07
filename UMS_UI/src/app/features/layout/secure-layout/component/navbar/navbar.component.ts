import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../../core/auth/auth.service';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, RouterLink, CommonModule, MatSnackBarModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.authService.isLoggedIn.subscribe((loggedIn: boolean) => {
      this.isLoggedIn = loggedIn;
    });
  }

  getNavigationLinks(): { label: string, route: string }[] {
    if (this.isLoggedIn) {
      return [
        { label: 'User', route: '/Ums/user' },
        { label: 'Add_User', route: '/Ums/adduser' }
      ];
    } else {
      return [
        { label: 'Login', route: '/login' },
      ];
    }
  }

  logout(): void {
    this.snackBar.open('Logged out Successfully', '', { duration: 1000 });
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
