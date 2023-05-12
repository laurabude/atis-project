import { formatDate } from '@angular/common';
import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css'],
})
export class TabsComponent {
  message: string;
  nextMessage: string;
  state: boolean;
  broadcastTime: string;
  currentCode: string;
  nextCode: string;

  getCurrentCode(currentCode) {
    this.currentCode = currentCode;
  }
  getNextCode(nextCode) {
    this.nextCode = nextCode;
  }

  getBroadcastTime(broadcastTime) {
    this.broadcastTime = formatDate(broadcastTime, 'HH:mm', 'en-US');
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
}
