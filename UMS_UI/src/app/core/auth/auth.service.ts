import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_BASE_URL, endPoint } from '../../shared/endpoints/endpoints.const';
import { LoginDto } from '../models/user.model';
import { ApiResponseDTO } from '../models/apiresponse.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl = API_BASE_URL;
  private isLoggedInSubject: BehaviorSubject<boolean>;

  constructor(private http: HttpClient) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.isLoggedInSubject = new BehaviorSubject<boolean>(isLoggedIn);
  }

  get isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  login(loginDto: LoginDto): Observable<ApiResponseDTO<string>> {
    return this.http.post<ApiResponseDTO<string>>(this.baseUrl + endPoint.Authentication, loginDto)
      .pipe(
        tap(response => {
          const isLoggedIn = response.success;
          this.isLoggedInSubject.next(isLoggedIn);
          localStorage.setItem('isLoggedIn', isLoggedIn.toString());
        })
      );
  }

  logout(): void {
    this.isLoggedInSubject.next(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('token');
  }

  setToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue)
  }

  getToken() {
    return localStorage.getItem('token')
  }

}
