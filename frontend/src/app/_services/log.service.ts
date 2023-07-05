import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const LOG_API = 'http://localhost:8080/api/log/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class LogService {
  constructor(private http: HttpClient) {}

  addEntry(
    username: string,
    airport: string,
    log: string,
    language: string
  ): Observable<any> {
    console.log(username);
    return this.http.post(
      LOG_API + 'createLog',
      {
        username,
        airport,
        log,
        language,
      },
      httpOptions
    );
  }

  getLogs(username: string, userRole: string[]): Observable<any> {
    return this.http.post(
      LOG_API + 'getLogs',
      {
        username,
        userRole,
      },
      httpOptions
    );
  }
}
