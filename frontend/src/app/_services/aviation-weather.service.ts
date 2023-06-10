import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AviationWeatherService {
  constructor(private http: HttpClient) {}

  getMETARData(airport: string) {
    const url = `http://localhost:8080/api/aviation-weather/cgi-bin/data/metar.php?ids=${airport}&format=decoded`;

    return this.http.get(url, { responseType: 'text' });
  }

  getTAFData(airport: string) {
    const url = `http://localhost:8080/api/aviation-weather/cgi-bin/data/taf.php?ids=${airport}&format=decoded`;

    return this.http.get(url, { responseType: 'text' });
  }
}
