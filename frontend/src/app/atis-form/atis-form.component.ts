import { Component, Input } from '@angular/core';
import { ReceivedMessage, WebsocketService } from '../websocket.service';

@Component({
  selector: 'app-atis-form',
  templateUrl: './atis-form.component.html',
  styleUrls: ['./atis-form.component.css'],
  providers: [WebsocketService],
})
export class AtisFormComponent {
  @Input() ReceivedData;

  ngOnInit() {}
  @Input() collapsed = false;
  @Input() screenWidth = 0;

  getBodyClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      styleClass = 'body-trimmed';
    } else if (
      this.collapsed &&
      this.screenWidth <= 768 &&
      this.screenWidth > 0
    ) {
      styleClass = 'body-md-screen';
    }
    return styleClass;
  }

  received: ReceivedMessage;
  sent = [];

  constructor(private WebsocketService: WebsocketService) {
    WebsocketService.messages.subscribe((msg) => {
      this.received = msg;
      console.log('Response from websocket: ' + msg);
    });
  }
  sendMessageToWebsocket() {
    let message = {
      content: this.ReceivedData,
      topic: '/ATIS_ARRDEP/ENFL',
      type: 'PUBLICATION',
    };

    this.sent.push(message);
    this.WebsocketService.messages.next(message);
  }

  sendSubscribeMsg() {
    let message = {
      topic: '/ATIS_ARRDEP/ENFL',
      type: 'SUBSCRIBE',
      content: null,
    };

    this.sent.push(message);
    this.WebsocketService.messages.next(message);
  }
}
