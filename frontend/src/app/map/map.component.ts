import { Component, OnInit } from '@angular/core';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { Feature, Point, Geometry } from 'geojson';
import { Socket, io } from 'socket.io-client';

const OPENSKY_WEBSOCKET_URL = 'wss://opensky-network.org/api/states/all';
const MAPBOX_ACCESS_TOKEN = 'pk.eyJ1IjoibGF1cmFnaCIsImEiOiJjbGk4cThscnMxdjY0M2VtbDc3Yjdsa25wIn0.S3BdCi6irPxokf4rJcGBMQ';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  private map!: mapboxgl.Map;
  private socket!: Socket;

  ngOnInit(): void {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    this.initializeMap();
    this.initializeWebSocket();
  }

  private initializeMap(): void {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/outdoors-v11',
      center: [0.45, 51.47],
      zoom: 4,
    });

    this.map.on('load', () => {
      this.map.addControl(new mapboxgl.NavigationControl());
    });
  }

  private initializeWebSocket(): void {
    this.socket = io(OPENSKY_WEBSOCKET_URL);

    this.socket.on('message', (data: any) => {
      const flightData = JSON.parse(data);
      this.displayFlightData(flightData);
    });
  }

  private displayFlightData(data: any): void {
    const airplanes: Feature<Point, {
      heading: number;
      callSign: string;
      altitude: number;
      speed: number;
    }>[] = data.states.map(
      (flightArr: any) =>
        ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [flightArr[5], flightArr[6]],
          },
          properties: {
            heading: flightArr[10] || 0,
            callSign: flightArr[1] || '',
            altitude: flightArr[7] || 0,
            speed: flightArr[9] || 0,
          },
        } as Feature<Point, {
          heading: number;
          callSign: string;
          altitude: number;
          speed: number;
        }>)
    );

    const source = this.map.getSource('airplanes') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: airplanes,
      });
    } else {
      this.map.addSource('airplanes', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: airplanes,
        },
      });
    }

    this.map.loadImage('/assets/airplane.png', (error, image) => {
      if (error) {
        console.error('Error loading the airplane icon image:', error);
      } else {
        this.map.addImage('airplane-icon', image);
        this.map.addLayer({
          id: 'airplane-layer',
          type: 'symbol',
          source: 'airplanes',
          layout: {
            'icon-image': 'airplane-icon',
            'icon-size': 0.02,
            'icon-allow-overlap': true,
            'icon-rotate': ['get', 'heading'],
          },
          paint: {},
        });
      }
    });
  }
}
