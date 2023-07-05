import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  register(
    username: string,
    email: string,
    password: string,
    pic: string
  ): Observable<any> {
    return this.http.post(
      AUTH_API + 'signup',
      {
        username,
        email,
        password,
        pic,
      },
      httpOptions
    );
  }

  logout(): Observable<any> {
    return this.http.post(AUTH_API + 'signout', {}, httpOptions);
  }

  changepicture(username: string, pic: string): Observable<any> {
    return this.http.put(
      AUTH_API + 'changepicture',
      { username, pic },
      httpOptions
    );
  }

  updateusername(username: string, email: string, password: string) {
    console.log(email);
    return this.http.put(
      AUTH_API + 'updateusername',
      { username, email, password },
      httpOptions
    );
  }

  updatepassword(username: string, oldPass: string, password: string) {
    return this.http.put(
      AUTH_API + 'updatepassword',
      { username, oldPass, password },
      httpOptions
    );
  }

  deleteuser(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'deleteuser',
      { username, password },
      httpOptions
    );
  }
}
