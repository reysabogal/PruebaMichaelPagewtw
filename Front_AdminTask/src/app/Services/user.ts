import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../Interfaces/_user';

type UserApiModel = {
  id: number;  
  name?: string;
  email?: string;
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = `${environment.endPoint}api/Users`;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http
      .get<UserApiModel[]>(this.apiUrl)
      .pipe(map((users) => users.map((user) => this.mapUser(user))));
  }

  getUser(id: number): Observable<User> {
    return this.http
      .get<UserApiModel>(`${this.apiUrl}/${id}`)
      .pipe(map((user) => this.mapUser(user)));
  }

  getUserByName(id: number): Observable<User> {
    return this.http
      .get<UserApiModel>(`${this.apiUrl}/name/${id}`)
      .pipe(map((user) => this.mapUser(user)));
  }

  createUser(user: User): Observable<User> {
    return this.http
      .post<UserApiModel>(this.apiUrl, this.toApiUser(user))
      .pipe(map((createdUser) => this.mapUser(createdUser)));
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http
      .put<UserApiModel>(`${this.apiUrl}/${id}`, this.toApiUser(user))
      .pipe(map((updatedUser) => this.mapUser(updatedUser)));
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private mapUser(user: UserApiModel): User {
    return {
      id: user.id ?? 0,
      name: user.name ?? '',
      email: user.email ?? '',
    };
  }

  private toApiUser(user: User): UserApiModel {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
    };
  }
}
