import { formatDate } from '@angular/common';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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

  constructor(private http: HttpClient) {}
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

  convertTextToSpeech(message: string, language: string): void {
    const requestBody = { text: message, language: language };
    console.log(message);
    this.http
      .post<any>('http://localhost:5000/convert-text-to-speech', requestBody)
      .subscribe({
        next: (response) => {
          const audio = new Audio(
            'http://localhost:5000/assets/current-broadcast.mp3?_=' + Date.now()
          );
          audio.play();
        },
        error: (error) => {
          // Handle any errors
        },
      });
  }
}
