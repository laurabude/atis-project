import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
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
    mlr: { name: 'mlr', value: '' },
    holding: { name: 'holding', value: '' },
    'mlr.wind.speed': { name: 'mlr.wind.speed', value: '' },
    'mlr.wind.gusts': { name: 'mlr.wind.gusts', value: '' },
    'mlr.wind.dir': { name: 'mlr.wind.dir', value: '' },
    'mlr.wind.var.min': { name: 'mlr.wind.var.min', value: '' },
    'mlr.wind.var.max': { name: 'mlr.wind.var.max', value: '' },
    visibility: { name: 'visibility', value: '' },
    rvr: { name: 'rvr', value: '' },
    presentweather: { name: 'presentweather', value: '' },
    clouds: { name: 'clouds', value: '' },
    temperature: { name: 'temperature', value: '' },
    dewpoint: { name: 'dewpoint', value: '' },
    qfe: { name: 'qfe', value: '' },
    fixedtext: { name: 'fixedtext', value: '' },
    apptype: { name: 'apptype', value: '' },
    pressure: { name: 'pressure', value: '' }, //QNH
    tl: { name: 'tl', value: '' },
    freetext: { name: 'freetext', value: '' },
  };
  isChanged: { [key: string]: boolean } = {
    obstime: false,
    holding: false,
    mlr: false,
    'mlr.wind.speed': false,
    'mlr.wind.gusts': false,
    'mlr.wind.dir': false,
    'mlr.wind.var.min': false,
    'mlr.wind.var.max': false,
    visibility: false,
    rvr: false,
    presentweather: false,
    clouds: false,
    temperature: false,
    dewpoint: false,
    pressure: false,
    qfe: false,
    tl: false,
    freetext: false,
  };
  lastValue: { [key: string]: string } = {
    obstime: null,
    holding: null,
    'mlr.wind.speed': null,
    'mlr.wind.gusts': null,
    'mlr.wind.dir': null,
    'mlr.wind.var.min': null,
    'mlr.wind.var.max': null,
    visibility: null,
    rvr: null,
    presentweather: null,
    clouds: null,
    temperature: null,
    dewpoint: null,
    pressure: null,
    qnh: null,
    tl: null,
    freetext: null,
  };
  ENGLISH: string = '';
  isOptionSelected: boolean = false;
  fieldName: string = '';
  fieldValue: string = '';
  readonlyMode = false;
  isBroadcastBtnDisabled = false;
  isBroadcastAction = false;
  @Output() currentBroadcast = new EventEmitter<string>();
  @Output() isSubscribed = new EventEmitter<boolean>();
  @Output() nextBroadcast = new EventEmitter<string>();
  @Output() lastBroadcastTime = new EventEmitter<string>();
  @Output() currentAtisCode = new EventEmitter<string>();
  @Output() nextAtisCode = new EventEmitter<string>();
  received: ReceivedMessage;
  sent = [];

  constructor(private WebsocketService: WebsocketService) {
    WebsocketService.messages.subscribe((msg) => {
      console.log('Response from websocket: ' + JSON.stringify(msg));
      if (msg.type === 'PUBLICATION' && msg.content.type == 'ATIS_RELEASED') {
        this.currentBroadcast.emit(msg.content.messageText.ENGLISH);
        this.lastBroadcastTime.emit(msg.content.releaseTime);
        this.currentAtisCode.emit(msg.content.atisCode);
      } else if (msg.content.type === 'SUBSCRIBE') {
        this.currentBroadcast.emit(msg.content.messageText.ENGLISH);
        this.lastBroadcastTime.emit(msg.content.releaseTime);
        this.currentAtisCode.emit(msg.content.atisCode);
        this.nextBroadcast.emit(msg.content.nextMessageText.ENGLISH);
        this.nextAtisCode.emit(msg.content.nextIcaoCode);
      } else if (
        msg.type === 'PUBLICATION' &&
        msg.content.type == 'ATIS_NEXT_UPDATE'
      ) {
        this.nextBroadcast.emit(msg.content.nextMessageText.ENGLISH);
        this.nextAtisCode.emit(msg.content.nextIcaoCode);
      } else if (
        msg.content.type === 'ATIS_FIELD_UPDATED' &&
        this.isBroadcastAction
      ) {
        this.lastValue[msg.content.fieldName] = msg.content.value;
      }
      if (msg.type === 'PUBLICATION') {
        this.received = msg;
        this.isBroadcastBtnDisabled = false;
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
        this.isBroadcastBtnDisabled = true;
      }
      console.log(msg.type + this.isChanged);
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.sendSubscribeMsg();
    }, 100);
  }

  sendBroadcastMessage() {
    this.isBroadcastAction = true;
    let broadcastMessage = {
      content: {
        type: 'ATIS_RELEASE_REQUEST',
        airport: 'ENFL',
        reportType: 'ATIS_ARRDEP',
      },
      topic: '/ATIS_ARRDEP/ENFL',
      type: 'PUBLICATION',
    };

    this.sendMessage(broadcastMessage);
  }

  sendSubscribeMsg() {
    let message = {
      topic: '/ATIS_ARRDEP/ENFL',
      type: 'SUBSCRIBE',
      content: null,
    };

    this.sent.push(message);
    this.WebsocketService.messages.next(message);
    this.isSubscribed.emit(true);
  }
  sendMessage(messageToSend) {
    this.sent.push(messageToSend);
    this.WebsocketService.messages.next(messageToSend);
  }

  onInputChange(event, name?: string) {
    if (!this.readonlyMode) {
      if (name) {
        this.fieldName = name;
      } else {
        this.fieldName = (event.target as HTMLInputElement).name;
      }
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
        this.sendMessage(updateMessage);
      } else {
        this.isChanged[this.fieldName] = false;
      }
    }
    if (this.isBroadcastAction) this.isBroadcastAction = false;
  }

  onSelect() {
    this.isOptionSelected = true;
  }

  manualMode() {
    this.readonlyMode = false;
    this.isBroadcastBtnDisabled = false;
  }
  semiAutoMode() {
    this.manualMode();
    setTimeout(() => {
      this.sendBroadcastMessage();
    }, 3000); // 5 minutes expressed in milliseconds
  }
  autoMode() {
    this.readonlyMode = true;
    this.isBroadcastBtnDisabled = true;
  }
}
