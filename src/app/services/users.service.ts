import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  URL_API = "http://localhost:3030/api/v1/users/";
  users: User[] = [];
  selectedUser: any = {
    nombre: '',
    apellido: '',
    cedula: '',
    email: ''
  };

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get<User[]>(this.URL_API);
  }

  createUser(user: User) {
    return this.http.post(this.URL_API, user);
  }

  updateUser(user: any) {
    return this.http.put(`${this.URL_API}/${user._id}`, user);
  }

  deleteUser(user: any) {    
    return this.http.delete(`${this.URL_API}/${user.id}`);
  }
}
