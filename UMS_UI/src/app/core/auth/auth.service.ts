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


// import { HttpClient } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { BehaviorSubject, Observable, tap } from 'rxjs';
// import { API_BASE_URL, endPoint } from '../../shared/endpoints/endpoints.const';
// import { LoginDto } from '../models/user.model';
// import { ApiResponseDTO } from '../models/apiresponse.model';
// import { Router } from '@angular/router';

// const IS_LOGGED_IN_KEY = 'isLoggedIn';
// const ROLE_KEY = 'role';
// const ID_KEY = 'id';
// const TOKEN_KEY = 'token';

// @Injectable({
//   providedIn: 'root'
// })
// export class AuthService {
//   private readonly baseUrl = API_BASE_URL;
//   private isLoggedInSubject: BehaviorSubject<boolean>;

//   constructor(private http: HttpClient, private router: Router) {
//     this.isLoggedInSubject = new BehaviorSubject<boolean>(this.getIsLoggedInFromLocalStorage());
//     this.initLocalStorageEventListener();
//   }

//   private getIsLoggedInFromLocalStorage(): boolean {
//     return localStorage.getItem(IS_LOGGED_IN_KEY) === 'true';
//   }

//   private initLocalStorageEventListener(): void {
//     window.addEventListener('storage', (event) => {
//       if (event.key === IS_LOGGED_IN_KEY) {
//         const isLoggedIn = event.newValue === 'true';
//         this.isLoggedInSubject.next(isLoggedIn);
//         if (!isLoggedIn) {
//           this.router.navigate(['/login']);
//         }
//       }
//     });
//   }

//   get isLoggedIn(): Observable<boolean> {
//     return this.isLoggedInSubject.asObservable();
//   }

//   login(loginDto: LoginDto): Observable<ApiResponseDTO<string>> {
//     return this.http.post<ApiResponseDTO<string>>(`${this.baseUrl}${endPoint.Authentication}`, loginDto)
//       .pipe(
//         tap(response => {
//           const isLoggedIn = response.success;
//           if (isLoggedIn) {
//             this.isLoggedInSubject.next(true);
//             this.setLocalStorage(IS_LOGGED_IN_KEY, 'true');
//             this.setLocalStorage(ROLE_KEY, response.role);
//             this.setLocalStorage(ID_KEY, response.id.toString());
//           } else {
//             this.clearLocalStorage();
//           }
//         })
//       );
//   }

//   logout(): void {
//     this.isLoggedInSubject.next(false);
//     this.clearLocalStorage();
//     this.router.navigate(['/login']);
//   }

//   getToken(): string | null {
//     return localStorage.getItem(TOKEN_KEY);
//   }

//   getUserRole() {
//     return localStorage.getItem('role')
// }

//   private setLocalStorage(key: string, value: string): void {
//     localStorage.setItem(key, value);
//   }

//   private clearLocalStorage(): void {
//     localStorage.removeItem(IS_LOGGED_IN_KEY);
//     localStorage.removeItem(TOKEN_KEY);
//     localStorage.removeItem(ROLE_KEY);
//     localStorage.removeItem(ID_KEY);
//   }
// }
