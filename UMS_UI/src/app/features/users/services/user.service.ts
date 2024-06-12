import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, catchError, forkJoin } from 'rxjs';
import { API_BASE_URL, endPoint } from '../../../shared/endpoints/endpoints.const';
import { CommonFunctionService } from '../../../shared/commonFunction/common.function.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient, public commonFunctionService: CommonFunctionService) { }

  getUsers = (id: number): Observable<User[]> => {
    return this.http.get<User[]>(this.baseUrl + endPoint.AllUsers + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  addUser(user: User): Observable<void> {
    return this.http.post<void>(this.baseUrl + endPoint.Users, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateUser(user: User): Observable<void> {
    return this.http.put<void>(this.baseUrl + endPoint.Users + user.id, user)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteUser(ids: number[]): Observable<void> {
    return this.http.delete<void>(this.baseUrl + endPoint.Users, { body: ids })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    this.commonFunctionService.showSnackbar("Something is wrong!", 1500);
    throw error;
  }

}
