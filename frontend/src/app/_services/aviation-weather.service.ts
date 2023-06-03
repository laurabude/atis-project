import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AviationWeatherService {
  constructor(private http: HttpClient) {}

  getMETARData(airport: string) {
    const url = `https://beta.aviationweather.gov/cgi-bin/data/metar.php?ids=${airport}&format=decoded`;
    return this.http.get(url);
  }
}
