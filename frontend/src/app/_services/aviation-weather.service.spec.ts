import { TestBed } from '@angular/core/testing';

import { AviationWeatherService } from './aviation-weather.service';

describe('AviationWeatherService', () => {
  let service: AviationWeatherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AviationWeatherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
