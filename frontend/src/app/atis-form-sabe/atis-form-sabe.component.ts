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
  selector: 'app-atis-form-sabe',
  templateUrl: './atis-form-sabe.component.html',
  styleUrls: ['./atis-form-sabe.component.css'],
})
export class AtisFormSabeComponent {
  @ViewChild('myInput') myInput: ElementRef;
  messageContent: Content;
  public formAtisFields: AtisFields = {
    obstime: { name: 'obstime', value: '' },
    mlr: { name: 'mlr', value: '' },
    apptype1: { name: 'apptype1', value: '' },
    holding: { name: 'holding', value: '' },
    tl: { name: 'tl', value: '' },
    temperature: { name: 'temperature', value: '' },
    'mlr.wind.dir': { name: 'mlr.wind.dir', value: '' },
    'mlr.wind.var.min': { name: 'mlr.wind.var.min', value: '' },
    'mlr.wind.var.max': { name: 'mlr.wind.var.max', value: '' },
    dewpoint: { name: 'dewpoint', value: '' },
    'mlr.wind.speed': { name: 'mlr.wind.speed', value: '' },
    'mlr.wind.gusts': { name: 'mlr.wind.gusts', value: '' },
    pressure: { name: 'pressure', value: '' }, //QNH
    visibility: { name: 'visibility', value: '' },
    rvrTdz: { name: 'rvrTdz', value: '' },
    rvrMid: { name: 'rvrMid', value: '' },
    rvrEnd: { name: 'rvrEnd', value: '' },
    presentweather: { name: 'presentweather', value: '' },
    cloud1: { name: 'cloud1', value: '' },
    cbtcu: { name: 'cbtcu', value: '' },
    remarksEnglish: { name: 'remarksEnglish', value: '' },
    remarksSpanish: { name: 'remarksSpanish', value: '' },
  };
  isChanged: { [key: string]: number } = {
    obstime: 0,
    apptype1: 0,
    mlr: 0,
    holding: 0,
    tl: 0,
    temperature: 0,
    'mlr.wind.dir': 0,
    'mlr.wind.var.min': 0,
    'mlr.wind.var.max': 0,
    dewpoint: 0,
    'mlr.wind.speed': 0,
    'mlr.wind.gusts': 0,
    pressure: 0,
    visibility: 0,
    rvrTdz: 0,
    rvrMid: 0,
    rvrEnd: 0,
    presentweather: 0,
    cloud1: 0,
    cbtcu: 0,
    remarksEnglish: 0,
    remarksSpanish: 0,
  };

  ENGLISH: string = '';
  isOptionSelected: boolean = false;
  fieldName: string = '';
  fieldValue: string = '';
  readonlyMode = false;
  isBroadcastBtnDisabled = false;
  messageReceived = false;
  @Output() currentBroadcastEnglish = new EventEmitter<string>();
  @Output() currentBroadcastSpanish = new EventEmitter<string>();
  @Output() currentBroadcastDATIS = new EventEmitter<string>();
  @Output() isSubscribed = new EventEmitter<boolean>();
  @Output() nextBroadcastEnglish = new EventEmitter<string>();
  @Output() nextBroadcastSpanish = new EventEmitter<string>();
  @Output() nextBroadcastDATIS = new EventEmitter<string>();
  @Output() lastBroadcastTime = new EventEmitter<string>();
  @Output() currentAtisCode = new EventEmitter<string>();
  @Output() nextAtisCode = new EventEmitter<string>();
  received: ReceivedMessage;
  sent = [];

  constructor(private WebsocketService: WebsocketService) {
    this.autoMode();
    WebsocketService.messages.subscribe((msg) => {
      this.messageReceived = true;
      console.log('Response from websocket: ' + JSON.stringify(msg));
      if (msg.content.type === 'SUBSCRIBE') {
        this.isSubscribed.emit(true);
        this.handleSubscribeMessage(msg);
      } else if (msg.content.type == 'ATIS_NEXT_UPDATE') {
        //Update next message
        this.nextBroadcastEnglish.emit(msg.content.nextMessageText.ENGLISH);
        this.nextBroadcastSpanish.emit(msg.content.nextMessageText.SPANISH);
        this.nextBroadcastDATIS.emit(msg.content.nextMessageText.DATIS);
        this.nextAtisCode.emit(msg.content.nextIcaoCode);
      } else if (msg.content.type === 'ATIS_FIELD_UPDATED') {
        this.isBroadcastBtnDisabled = false;
        if (msg.content.fieldState === 'CHANGED_BEFORE_BROADCAST') {
          this.formAtisFields[msg.content.fieldName].value = msg.content.value;
          this.isChanged[msg.content.fieldName] = 1; // albastru
        } else if (msg.content.fieldState === 'CHANGED_AFTER_BROADCAST') {
          this.isChanged[msg.content.fieldName] = 2; // gri
        }
        if (msg.content.value == '') {
          this.isChanged[msg.content.fieldName] = 1; // albastru
        }
      } else if (msg.type === 'ERROR') {
        this.isChanged[this.fieldName] = 3; // rosu
        this.isBroadcastBtnDisabled = true;
      } else if (msg.content.type === 'ATIS_RELEASED') {
        this.currentAtisCode.emit(msg.content.atisCode);
        this.lastBroadcastTime.emit(msg.content.releaseTime);
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.sendSubscribeMsg();
    }, 100);
  }

  sendBroadcastMessage() {
    let broadcastMessage = {
      content: {
        type: 'ATIS_RELEASE_REQUEST',
        airport: 'SABE',
        reportType: 'ATIS_ARRDEP',
      },
      topic: '/ATIS_ARRDEP/SABE',
      type: 'PUBLICATION',
    };

    this.sendMessage(broadcastMessage);
  }

  sendSubscribeMsg() {
    let message = {
      topic: '/ATIS_ARRDEP/SABE',
      type: 'SUBSCRIBE',
      content: null,
    };
    this.sent.push(message);
    this.WebsocketService.messages.next(message);
  }
  sendMessage(messageToSend) {
    this.messageReceived = false;
    this.sent.push(messageToSend);
    this.WebsocketService.messages.next(messageToSend);
    setTimeout(() => {
      if (!this.messageReceived) {
        this.isChanged[messageToSend.content.fieldName] = 1;
      }
    }, 50);
  }

  onInputChange(event, name?: string) {
    if (!this.readonlyMode) {
      if (name) {
        this.fieldName = name;
      } else {
        this.fieldName = (event.target as HTMLInputElement).name;
      }
      this.fieldValue = this.formAtisFields[this.fieldName].value;
      let updateMessage = {
        content: {
          type: 'ATIS_FIELD_UPDATE',
          airport: 'SABE',
          reportType: 'ATIS_ARRDEP',
          fieldName: this.fieldName,
          value: this.fieldValue,
        },
        topic: '/ATIS_ARRDEP/ENFL',
        type: 'PUBLICATION',
      };
      this.sendMessage(updateMessage);
    }
  }

  onSelect() {
    this.isOptionSelected = true;
  }

  manualMode() {
    this.readonlyMode = false;
    this.isBroadcastBtnDisabled = false;
    let manualModeMessage = {
      content: {
        type: 'ATIS_RELEASE_MODE_UPDATE',
        airport: 'ENFL',
        reportType: 'ATIS_ARRDEP',
        releaseMode: 'MANUAL',
      },
      topic: '/ATIS_ARRDEP/ENFL',
      type: 'PUBLICATION',
    };
    this.sendMessage(manualModeMessage);
  }
  semiAutoMode() {
    this.manualMode();
    setTimeout(() => {
      this.sendBroadcastMessage();
    }, 3000); // 5 minutes expressed in milliseconds
    let semiAutoModeMessage = {
      content: {
        type: 'ATIS_RELEASE_MODE_UPDATE',
        airport: 'ENFL',
        reportType: 'ATIS_ARRDEP',
        releaseMode: 'SEMI_AUTOMATIC',
      },
      topic: '/ATIS_ARRDEP/ENFL',
      type: 'PUBLICATION',
    };
    this.sendMessage(semiAutoModeMessage);
  }
  autoMode() {
    this.readonlyMode = true;
    this.isBroadcastBtnDisabled = true;
    let autoModeMessage = {
      content: {
        type: 'ATIS_RELEASE_MODE_UPDATE',
        airport: 'ENFL',
        reportType: 'ATIS_ARRDEP',
        releaseMode: 'AUTOMATIC',
      },
      topic: '/ATIS_ARRDEP/ENFL',
      type: 'PUBLICATION',
    };
    this.sendMessage(autoModeMessage);
  }

  handleSubscribeMessage(msg: ReceivedMessage) {
    this.currentBroadcastEnglish.emit(msg.content.messageText.ENGLISH);
    this.currentBroadcastSpanish.emit(msg.content.messageText.SPANISH);
    this.currentBroadcastDATIS.emit(msg.content.messageText.DATIS);
    this.lastBroadcastTime.emit(msg.content.releaseTime);
    Object.entries(this.formAtisFields).forEach(([key, field]) => {
      this.formAtisFields[field.name].value =
        msg.content.atisFields[field.name].value;
      if (msg.content.atisFields[field.name].value != '') {
        this.isChanged[field.name] = 2;
      }
    });
    if (msg.content.atisCode === '/') {
      this.currentAtisCode.emit('N/A');
    } else {
      this.currentAtisCode.emit(msg.content.atisCode);
    }
    this.nextAtisCode.emit(msg.content.nextIcaoCode);
  }
}