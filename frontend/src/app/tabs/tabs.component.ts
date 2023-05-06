import { getCurrencySymbol } from '@angular/common';
import { Component } from '@angular/core';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent {
  message: string;
  state: boolean;
  getCurrentBroadcast(message) {
    this.message = message;
  }
  getSubscribeState(state) {
    this.state = state;
  }
}
