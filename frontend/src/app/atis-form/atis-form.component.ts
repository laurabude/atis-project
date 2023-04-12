import { Component, Input } from '@angular/core';
import {
  AtisFields,
  Content,
  ReceivedMessage,
  WebsocketService,
} from '../websocket.service';

@Component({
  selector: 'app-atis-form',
  templateUrl: './atis-form.component.html',
  styleUrls: ['./atis-form.component.css'],
  providers: [WebsocketService],
})
export class AtisFormComponent {
  messageContent: Content;
  formAtisFields: AtisFields;

  ngOnInit() {}

  received: ReceivedMessage;
  sent = [];

  constructor(private WebsocketService: WebsocketService) {
    WebsocketService.messages.subscribe((msg) => {
      this.received = msg;
      this.formAtisFields = msg.content.atisFields;
      console.log('Response from websocket: ' + JSON.stringify(msg));
    });
  }
  sendMessageToWebsocket() {
    let message = {
      content: this.messageContent,
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
