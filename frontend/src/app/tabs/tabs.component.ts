import { formatDate } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

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

  getCurrentBroadcast(message) {
    this.message = message;
  }

  getSubscribeState(state) {
    this.state = state;
  }

  getNextBroadcast(nextMessage) {
    this.nextMessage = nextMessage;
    console.log(this.nextMessage);
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
