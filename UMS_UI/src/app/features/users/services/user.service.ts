import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, catchError, forkJoin } from 'rxjs';
import { endPoint } from '../../../shared/endpoints/endpoints.const';
import { CommonFunctionService } from '../../../shared/commonFunction/common.function.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, public commonFunctionService: CommonFunctionService) { }

  getUsers = (id: number): Observable<User[]> => {
    return this.http.get<User[]>(endPoint.AllUsers + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  addUser(user: User): Observable<void> {
    return this.http.post<void>(endPoint.User, user);
  }

  updateUser(user: User): Observable<void> {
    return this.http.put<void>(endPoint.User + user.id, user);
  }

  deleteUser(ids: number[]): Observable<void> {
    return this.http.delete<void>(endPoint.User, { body: ids })
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any): Observable<never> {
    this.commonFunctionService.showSnackbar("Something is wrong!", 1500);
    throw error;
  }

}
