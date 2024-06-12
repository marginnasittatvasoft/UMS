import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_BASE_URL, endPoint } from '../../shared/endpoints/endpoints.const';
import { LoginDto } from '../models/user.model';
import { ApiResponseDTO } from '../models/apiresponse.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = API_BASE_URL;
  private isLoggedInSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient, private router: Router) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isLoggedInSubject = new BehaviorSubject<boolean>(isLoggedIn);

    window.addEventListener('storage', (event) => {
      if (event.key === 'isLoggedIn') {
        const isLoggedIn = event.newValue === 'true';
        this.isLoggedInSubject.next(isLoggedIn);
        if (!isLoggedIn) {
          this.router.navigate(['/login']);
        }
      }
    });
  }

  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  login(loginDto: LoginDto): Observable<ApiResponseDTO<string>> {
    return this.http.post<ApiResponseDTO<string>>(this.baseUrl + endPoint.Authentication, loginDto)
      .pipe(
        tap(response => {
          const isLoggedIn = response.success;
          const role = response.role;
          const id = response.id.toString();
          this.isLoggedInSubject.next(isLoggedIn);
          localStorage.setItem('isLoggedIn', isLoggedIn.toString());
          localStorage.setItem('role', role);
          localStorage.setItem('id', id);
        })
      );
  }

  logout(): void {
    this.isLoggedInSubject.next(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
  }


  getToken() {
    return localStorage.getItem('token')
  }

  getRole() {
    return localStorage.getItem('role')
  }

}

