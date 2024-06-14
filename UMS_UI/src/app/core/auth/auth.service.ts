import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, tap } from 'rxjs';
import { endPoint } from '../../shared/endpoints/endpoints.const';
import { LoginDto } from '../models/user.model';
import { ApiResponseDTO } from '../models/apiresponse.model';
import { Router } from '@angular/router';
import { CommonFunctionService } from '../../shared/commonFunction/common.function.service';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private isLoggedInSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, private router: Router, private commonFunctionService: CommonFunctionService) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isLoggedInSubject = new BehaviorSubject<boolean>(isLoggedIn);

    window.addEventListener('storage', this.syncLoginStatusWithLocalStorage.bind(this));
  }

  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  login(loginDto: LoginDto): Observable<ApiResponseDTO<string>> {
    return this.http.post<ApiResponseDTO<string>>(endPoint.Authentication, loginDto)
      .pipe(
        catchError(this.commonFunctionService.handleError),
        tap(response => {
          if (response.success) {
            this.updateLoginStatus(true, response.role, response.id.toString(), response.token);
          }
        })
      );
  }

  logout(): void {
    this.updateLoginStatus(false, '', '', '');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  private syncLoginStatusWithLocalStorage(event: StorageEvent): void {
    if (event.key === 'isLoggedIn') {
      const isLoggedIn = event.newValue === 'true';
      this.isLoggedInSubject.next(isLoggedIn);
      if (!isLoggedIn) {
        this.router.navigate(['/login']);
      }
    }
  }

  private updateLoginStatus(isLoggedIn: boolean, role: string, id: string, token: string): void {
    this.isLoggedInSubject.next(isLoggedIn);
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
    localStorage.setItem('token', token)
    localStorage.setItem('role', role);
    localStorage.setItem('id', id);
  }
}
