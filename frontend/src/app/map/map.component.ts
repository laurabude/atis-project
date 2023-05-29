import { Component, OnInit } from '@angular/core';
import { ScatterplotLayer } from '@deck.gl/layers';
import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox';
import mapboxgl from 'mapbox-gl';
import axios from 'axios';

const OPENSKY_API_URL = 'https://opensky-network.org/api/states/all';
const REFRESH_INTERVAL = 5000; // 5 seconds

interface FlightData {
  time: number;
  states: number[][];
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  private deckOverlay: any;
  private intervalId: any;

  ngOnInit(): void {
    mapboxgl.accessToken =
      'pk.eyJ1IjoibGF1cmFnaCIsImEiOiJjbGk4cThscnMxdjY0M2VtbDc3Yjdsa25wIn0.S3BdCi6irPxokf4rJcGBMQ';

    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [0.45, 51.47],
      zoom: 4,
      bearing: 0,
      pitch: 30,
    });

    this.deckOverlay = new DeckOverlay({
      layers: [],
    });

    map.addControl(this.deckOverlay);
    map.addControl(new mapboxgl.NavigationControl());

    this.fetchFlightData(); // Fetch flight data initially
    this.intervalId = setInterval(() => {
      this.fetchFlightData(); // Fetch flight data periodically
    }, REFRESH_INTERVAL);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId); // Stop the interval when the component is destroyed
  }

  private async fetchFlightData(): Promise<void> {
    try {
      const response = await axios.get(OPENSKY_API_URL);
      const flightData: FlightData = response.data;
      const transformedData = this.transformData(flightData);
      this.updateMap(transformedData);
    } catch (error) {
      console.error('Error fetching flight data:', error);
    }
  }

  private transformData(data: FlightData): any[] {
    const latestData = data.states.map((flightArr: number[]) => ({
      coordinates: {
        lon: flightArr[5] !== null ? flightArr[5] : null,
        lat: flightArr[6] !== null ? flightArr[6] : null,
      },
    }));
    return latestData;
  }

  private updateMap(data: any[]): void {
    const layers = [
      new ScatterplotLayer({
        id: 'aircraft',
        data: data,
        pickable: true,
        opacity: 0.8,
        stroked: true,
        filled: true,
        radiusScale: 6,
        radiusMinPixels: 1,
        radiusMaxPixels: 100,
        lineWidthMinPixels: 1,
        getPosition: (d: any) => [d.coordinates.lon, d.coordinates.lat],
        getRadius: () => 15,
        getFillColor: () => [255, 140, 0],
        getLineColor: () => [0, 0, 0],
      }),
    ];

    this.deckOverlay.setProps({ layers: layers });
  }
}
