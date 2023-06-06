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
  searchCallsign: string = '';
  airplanes: Feature<Point>[] = [];
  private callsignMap: { [key: string]: Feature<Point> } = {};

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
        const altitudeInMeters = (altitude * 0.3048).toFixed(2);

        this.popup = new mapboxgl.Popup({ closeButton: false })
          .setLngLat(coordinates as LngLatLike)
          .setHTML(
            `<div>
              <strong>Call Sign:</strong> ${callSign}<br>
              <strong>Altitude:</strong> ${altitudeInMeters} m<br>
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
      this.airplanes = flightData.map(
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
          features: this.airplanes,
        });
      } else {
        this.map.addSource('airplanes', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: this.airplanes,
          },
        });

        this.map.addLayer({
          id: 'airplane-layer',
          type: 'symbol',
          source: 'airplanes',
          layout: {
            'icon-image': 'airplane-icon',
            'icon-size': {
              base: 1,
              stops: [
                [0, 0.001], // Set the initial icon size
                [8, 0.04], // Increase the icon size at zoom level 8
                [16, 0.2], // Increase the icon size at zoom level 16
              ],
            },
            'icon-allow-overlap': true,
            'icon-rotate': ['get', 'heading'], // Use heading property to rotate the icon
          },
          paint: {},
        });
      }
    } catch (error) {
      console.error('Error fetching flight data:', error);
    }
    this.preprocessCallsigns();
  }

  private preprocessCallsigns(): void {
    this.airplanes.forEach((airplane: Feature<Point>) => {
      const callsign = airplane.properties['callSign'];
      const callsignWithoutSpaces = callsign.replace(/\s/g, '');
      // Map the callsign without spaces to the airplane feature
      this.callsignMap[callsignWithoutSpaces] = airplane;
    });
  }

  searchByCallsign(): void {
    // Retrieve the preprocessed callsign from the map
    const foundAirplane = this.callsignMap[this.searchCallsign];

    if (foundAirplane) {
      const coordinates: LngLatLike = [
        foundAirplane.geometry.coordinates[0],
        foundAirplane.geometry.coordinates[1],
      ];

      // Center the map on the found airplane's coordinates
      this.map.flyTo({
        center: coordinates,
        zoom: 10, // Adjust the zoom level as needed
      });

      // Create and open the popup for the found airplane
      const altitudeInMeters = (
        foundAirplane.properties['altitude'] * 0.3048
      ).toFixed(2);
      const { callSign, altitude, speed } = foundAirplane.properties;
      const popupContent = `
        <div>
          <strong>Call Sign:</strong> ${callSign}<br>
          <strong>Altitude:</strong> ${altitudeInMeters} m<br>
          <strong>Speed:</strong> ${speed} knots
        </div>
      `;

      if (this.popup && this.popup.isOpen()) {
        // If a popup is already open, update its content and position
        this.popup.setLngLat(coordinates).setHTML(popupContent);
      } else {
        // If no popup is open, create a new one and open it
        this.popup = new mapboxgl.Popup({ closeButton: false })
          .setLngLat(coordinates)
          .setHTML(popupContent)
          .addTo(this.map);
      }
    }
  }
}
