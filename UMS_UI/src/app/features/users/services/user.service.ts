import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user.model';
import { Observable, forkJoin } from 'rxjs';
import { API_BASE_URL, endPoint } from '../../../shared/endpoints/endpoints.const';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) { }

  getUsers = (): Observable<User[]> => {
    return this.http.get<User[]>(this.baseUrl + endPoint.Users);
  }

  getUserById(id: number): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + endPoint.Users + id);
  }

  addUser(user: User): Observable<void> {
    return this.http.post<void>(this.baseUrl + endPoint.Users, user);
  }

  updateUser(user: User): Observable<void> {
    console.log(user);
    return this.http.put<void>(this.baseUrl + endPoint.Users + user.id, user);
  }

  deleteUser(ids: number[]): Observable<void[]> {
    const deleteRequests = ids.map(id =>
      this.http.delete<void>(this.baseUrl + endPoint.Users + id)
    );
    return forkJoin(deleteRequests);
  }

}
