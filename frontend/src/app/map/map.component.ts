import { Component, OnInit } from '@angular/core';
import mapboxgl, { LngLatLike } from 'mapbox-gl';
import { Feature, Point } from 'geojson';
import axios from 'axios';
import Papa from 'papaparse';

const OPENSKY_API_URL = ''; //https://opensky-network.org/api/states/all
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
  showOnlyInAir: boolean = false;
  airplanes: Feature<Point>[] = [];
  filteredAirplanes: Feature<Point>[] = [];
  private callsignMap: { [key: string]: Feature<Point> } = {};
  airportData: any[] = []; // Array to store the parsed airport data
  showAirports: boolean = true;

  ngOnInit(): void {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;

    this.initializeMap();
    this.parseCSVData().then((data) => {
      this.airportData = data;
      this.addMarkers(this.map);
    });
    this.fetchFlightData();
  }

  parseCSVData(): Promise<any[]> {
    const csvUrl = 'assets/filtered_airports.csv'; // Path to your airport data file

    return new Promise((resolve, reject) => {
      axios
        .get(csvUrl)
        .then((response) => {
          const csvData = response.data;
          const parsedData = Papa.parse(csvData, { header: true }).data;
          resolve(parsedData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  addMarkers(map: mapboxgl.Map) {
    const airportMarkers: mapboxgl.Marker[] = [];

    this.airportData.forEach((airport) => {
      const latitude = parseFloat(airport.latitude_deg);
      const longitude = parseFloat(airport.longitude_deg);

      if (!isNaN(latitude) && !isNaN(longitude)) {
        const markerElement = document.createElement('img');
        markerElement.className = 'airport-marker';
        markerElement.src = 'assets/airport.png';
        markerElement.width = 20;
        markerElement.height = 20;

        const popupContent = `
          <div>
            <strong>Name:</strong> ${airport.name}<br>
            <strong>Country:</strong> ${airport.iso_country}<br>
            <strong>Continent:</strong> ${airport.continent}
          </div>
        `;

        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([longitude, latitude])
          .setPopup(
            new mapboxgl.Popup({ closeButton: false }).setHTML(popupContent)
          );

        // Change cursor to pointer on marker hover
        marker.getElement().style.cursor = 'pointer';

        airportMarkers.push(marker);
      }
    });

    airportMarkers.forEach((marker) => {
      marker.addTo(map);
    });

    // Toggle visibility of airport markers
    const toggleButton = document.getElementById('toggle-airports');
    let airportsVisible = true;

    toggleButton?.addEventListener('click', () => {
      if (airportsVisible) {
        airportMarkers.forEach((marker) => {
          marker.remove();
        });
      } else {
        airportMarkers.forEach((marker) => {
          marker.addTo(map);
        });
      }

      airportsVisible = !airportsVisible;
    });
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
      this.airplanes = flightData.map((flightArr: any) => {
        return {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [flightArr[5], flightArr[6]],
          },
          properties: {
            callSign: flightArr[1] || '',
            altitude: flightArr[7] || 0,
            speed: flightArr[9] || 0,
            heading: flightArr[10] || 0,
          },
        } as Feature<Point>;
      });

      this.filterAirplanes();

      const airplaneSource = this.map.getSource(
        'airplanes'
      ) as mapboxgl.GeoJSONSource;
      if (airplaneSource) {
        airplaneSource.setData({
          type: 'FeatureCollection',
          features: this.filteredAirplanes,
        });
      } else {
        this.map.addSource('airplanes', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: this.filteredAirplanes,
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
                [0, 0.001],
                [8, 0.04],
                [16, 0.2],
              ],
            },
            'icon-allow-overlap': true,
            'icon-rotate': ['get', 'heading'],
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

  toggleFilterInAir(): void {
    this.showOnlyInAir = !this.showOnlyInAir;
    this.filterAirplanes();
    const source = this.map.getSource('airplanes') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: this.filteredAirplanes,
      });
    }
  }

  private filterAirplanes(): void {
    if (this.showOnlyInAir) {
      this.filteredAirplanes = this.airplanes.filter(
        (airplane: Feature<Point>) => airplane.properties['altitude'] > 0
      );
    } else {
      this.filteredAirplanes = this.airplanes;
    }
  }
}
