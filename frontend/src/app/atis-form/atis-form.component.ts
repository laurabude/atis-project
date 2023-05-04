import { Component, ElementRef, Input, ViewChild } from '@angular/core';
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
  @ViewChild('myInput') myInput: ElementRef;
  messageContent: Content;
  public formAtisFields: AtisFields = {
    obstime: { name: 'obstime', value: '' },
    holding: { name: 'holding', value: '' },
    'mrl.wind.gusts': { name: 'holding', value: '' },
    'mrl.wind.dir': { name: 'mrl.wind.dir', value: '' },
    'mrl.wind.var.min': { name: 'mrl.wind.var.min', value: '' },
    'mrl.wind.var.max': { name: 'mrl.wind.var.max', value: '' },
    visibility: { name: 'visibility', value: '' },
    rvr: { name: 'rvr', value: '' },
    presentweather: { name: 'presentweather', value: '' },
    clouds: { name: 'clouds', value: '' },
    temperature: { name: 'temperature', value: '' },
    dewpoint: { name: 'dewpoint', value: '' },
    qfe: { name: 'qfe', value: '' },
    qnh: { name: 'qnh', value: '' },
    tl: { name: 'tl', value: '' },
    freetext: { name: 'freetext', value: '' },
  };
  isChanged: object = {
    obstime: false,
    holding: false,
    'mrl.wind.gusts': false,
    'mrl.wind.dir': false,
    'mrl.wind.var.max': false,
    visibility: false,
    rvr: false,
    presentweather: false,
    clouds: false,
    temperature: false,
    dewpoint: false,
    qfe: false,
    qnh: false,
    tl: false,
    freetext: false,
  };
  isOptionSelected: boolean = false;
  fieldName: string = '';
  fieldValue: string = '';

  ngOnInit() {}

  received: ReceivedMessage;
  sent = [];

  constructor(private WebsocketService: WebsocketService) {
    WebsocketService.messages.subscribe((msg) => {
      console.log('Response from websocket: ' + JSON.stringify(msg));
      if (msg.type === 'PUBLICATION') {
        this.received = msg;
        if (this.fieldName === '') {
          Object.keys(this.isChanged).reduce(
            (acc, prop) => ((acc[prop] = true), acc),
            this.isChanged
          );
        } else {
          this.isChanged[this.fieldName] = true;
        }
      } else if (msg.type === 'ERROR') {
        this.isChanged[this.fieldName] = false;
      }
      console.log(msg.type + this.isChanged);
    });
  }

  sendMessageToWebsocket() {
    this.messageContent = {
      atisFields: this.formAtisFields,
      atisCode: '/',
    };
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
  sendUpdateMessage(updateMessage) {
    this.sent.push(updateMessage);
    this.WebsocketService.messages.next(updateMessage);
  }
  onInputChange(event: KeyboardEvent) {
    this.fieldName = (event.target as HTMLInputElement).name;
    this.fieldValue = this.formAtisFields[this.fieldName].value;
    if (this.fieldValue != undefined) {
      let updateMessage = {
        content: {
          type: 'ATIS_FIELD_UPDATE',
          airport: 'ENFL',
          reportType: 'ATIS_ARRDEP',
          fieldName: this.fieldName,
          value: this.fieldValue,
        },
        topic: '/ATIS_ARRDEP/ENFL',
        type: 'PUBLICATION',
      };
      this.sendUpdateMessage(updateMessage);
    } else {
      this.isChanged[this.fieldName] = false;
    }
  }
  onSelect() {
    this.isOptionSelected = true;
  }
}
