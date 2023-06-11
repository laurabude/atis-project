import { Component, OnInit } from '@angular/core';
import airportsData from '../../assets/airports-data.json';

@Component({
  selector: 'app-airports',
  templateUrl: './airports.component.html',
  styleUrls: ['./airports.component.css'],
})
export class AirportsComponent implements OnInit {
  cardData: any[];

  constructor() {}

  ngOnInit() {
    this.cardData = airportsData.cards;
  }
}
