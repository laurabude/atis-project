import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import airportsData from '../../assets/airports-data.json';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-airports',
  templateUrl: './airports.component.html',
  styleUrls: ['./airports.component.css'],
})
export class AirportsComponent implements OnInit {
  cardData: any[];
  user: any;
  showWarning: boolean;
  constructor(private storageService: StorageService, private router: Router) {}

  ngOnInit() {
    this.user = this.storageService.getUser();
    this.cardData = airportsData.cards;
  }

  clickCard(href: string) {
    console.log(this.user);
    if (this.user.roles != null) {
      this.router.navigate([href]);
    } else {
      this.showWarning = true;
    }
  }

  closeWarning() {
    this.showWarning = false;
  }
}
