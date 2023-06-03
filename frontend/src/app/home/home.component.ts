import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';
import { AviationWeatherService } from '../_services/aviation-weather.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  content?: string;
  weather: { ENFL: ''; SABE: ''; EVRA: '' } = { ENFL: '', SABE: '', EVRA: '' };

  constructor(
    private userService: UserService,
    private weatherService: AviationWeatherService
  ) {}

  ngOnInit(): void {
    this.userService.getPublicContent().subscribe({
      next: (data) => {
        this.content = data;
      },
      error: (err) => {
        if (err.error) {
          try {
            const res = JSON.parse(err.error);
            this.content = res.message;
          } catch {
            this.content = `Error with status: ${err.status} - ${err.statusText}`;
          }
        } else {
          this.content = `Error with status: ${err.status}`;
        }
      },
    });
  }
  onMetarRequest(airport) {
    this.weatherService.getMETARData(airport).subscribe((data: any) => {
      this.weather[airport] = data;
    });
  }
}
