import { formatDate } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tabs-evra',
  templateUrl: './tabs-evra.component.html',
  styleUrls: ['./tabs-evra.component.css'],
})
export class TabsEvraComponent {
  messageEnglish: string;
  nextMessageEnglish: string;
  messageES: string;
  nextMessageES: string;
  messageDATIS: string;
  nextMessageDATIS: string;
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
  getCurrentBroadcastEN(messageEnglish) {
    this.messageEnglish = messageEnglish;
  }
  getCurrentBroadcastES(messageES) {
    this.messageES = messageES;
  }
  getCurrentBroadcastDATIS(messageDATIS) {
    this.messageDATIS = messageDATIS;
  }
  getSubscribeState(state) {
    this.state = state;
  }
  getNextBroadcastEN(nextMessageEnglish) {
    this.nextMessageEnglish = nextMessageEnglish;
  }
  getNextBroadcastES(nextMessageES) {
    this.nextMessageES = nextMessageES;
  }
  getNextBroadcastDATIS(nextMessageDATIS) {
    this.nextMessageDATIS = nextMessageDATIS;
  }
  addClass() {
    if (this.currentCode === 'N/A') {
      this.isRed = true;
    } else {
      this.isRed = false;
    }
  }
}
