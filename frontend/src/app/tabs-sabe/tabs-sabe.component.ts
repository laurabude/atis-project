import { formatDate } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs-sabe',
  templateUrl: './tabs-sabe.component.html',
  styleUrls: ['./tabs-sabe.component.css'],
})
export class TabsSabeComponent {
  message: string;
  nextMessage: string;
  state: boolean;
  broadcastTime: string;
  currentCode: string;
  nextCode: string;
  isRed: boolean = false;

  getCurrentCode(currentCode) {
    this.currentCode = currentCode;
    this.addClass();
  }
  getNextCode(nextCode) {
    this.nextCode = nextCode;
  }

  getBroadcastTime(broadcastTime) {
    this.broadcastTime = formatDate(broadcastTime, 'HH:mm', 'en-US', '+0000');
  }
  getCurrentBroadcast(message) {
    this.message = message;
  }
  getSubscribeState(state) {
    this.state = state;
  }
  getNextBroadcast(nextMessage) {
    this.nextMessage = nextMessage;
  }
  addClass() {
    if (this.currentCode === 'N/A') {
      this.isRed = true;
    } else {
      this.isRed = false;
    }
  }
}
