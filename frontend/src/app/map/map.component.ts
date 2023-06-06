import { Component, OnInit } from '@angular/core';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { Feature, Point } from 'geojson';
import axios from 'axios';

const OPENSKY_API_URL = 'https://opensky-network.org/api/states/all';
const MAPBOX_ACCESS_TOKEN =
  'pk.eyJ1IjoibGF1cmFnaCIsImEiOiJjbGk4cThscnMxdjY0M2VtbDc3Yjdsa25wIn0.S3BdCi6irPxokf4rJcGBMQ';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  private map!: mapboxgl.Map;
  private popup!: mapboxgl.Popup;

  ngOnInit(): void {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    this.initializeMap();
    this.fetchFlightData();
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

      this.map.loadImage('/assets/airplane.png', (error, image) => {
        if (error) {
          console.error('Error loading the airplane icon image:', error);
        } else {
          this.map.addImage('airplane-icon', image);
        }
      });

      this.map.on('click', 'airplane-layer', (event) => {
        const coordinates = (
          event.features[0].geometry as Point
        ).coordinates.slice();
        const { callSign, altitude, speed } = event.features[0].properties;

        // Ensure that the popup is not already open
        if (this.popup && this.popup.isOpen()) {
          this.popup.remove();
        }

        this.popup = new mapboxgl.Popup({ closeButton: false })
          .setLngLat(coordinates as LngLatLike)
          .setHTML(
            `<div>
              <strong>Call Sign:</strong> ${callSign}<br>
              <strong>Altitude:</strong> ${altitude} ft<br>
              <strong>Speed:</strong> ${speed} knots
            </div>`
          )
          .addTo(this.map);
      });

      // Change the cursor style when hovering over an airplane marker
      this.map.on('mouseenter', 'airplane-layer', () => {
        this.map.getCanvas().style.cursor = 'pointer';
      });

      // Change the cursor style back to default when not hovering over an airplane marker
      this.map.on('mouseleave', 'airplane-layer', () => {
        this.map.getCanvas().style.cursor = '';
      });
    });
  }

  private async fetchFlightData(): Promise<void> {
    try {
      const response = await axios.get(OPENSKY_API_URL);
      const flightData = response.data.states;
      const airplanes: Feature<Point>[] = flightData.map(
        (flightArr: any) =>
          ({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [flightArr[5], flightArr[6]],
            },
            properties: {
              callSign: flightArr[1] || '',
              altitude: flightArr[7] || 0,
              speed: flightArr[9] || 0,
              heading: flightArr[10] || 0, // Add heading property
            },
          } as Feature<Point>)
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

        this.map.addLayer({
          id: 'airplane-layer',
          type: 'symbol',
          source: 'airplanes',
          layout: {
            'icon-image': 'airplane-icon',
            'icon-size': 0.02,
            'icon-allow-overlap': true,
            'icon-rotate': ['get', 'heading'], // Use heading property to rotate the icon
          },
          paint: {},
        });
      }
    } catch (error) {
      console.error('Error fetching flight data:', error);
    }
  }
}
