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
  selector: 'app-atis-form-evra',
  templateUrl: './atis-form-evra.component.html',
  styleUrls: ['./atis-form-evra.component.css'],
})
export class AtisFormEvraComponent {
  @ViewChild('myInput') myInput: ElementRef;
  messageContent: Content;
  public formAtisFields: AtisFields = {
    obstime: { name: 'obstime', value: '', state: '' },
    mlr: { name: 'mlr', value: '', state: '' },
    apptype1: { name: 'apptype1', value: '', state: '' },
    holding: { name: 'holding', value: '', state: '' },
    tl: { name: 'tl', value: '', state: '' },
    'mlr.wind.dir': { name: 'mlr.wind.dir', value: '', state: '' },
    'mlr.wind.var.min': { name: 'mlr.wind.var.min', value: '', state: '' },
    'mlr.wind.var.max': { name: 'mlr.wind.var.max', value: '', state: '' },
    'mlr.wind.gusts.min': { name: 'mlr.wind.gusts.min', value: '', state: '' },
    'mlr.wind.gusts': { name: 'mlr.wind.gusts', value: '', state: '' },
    'mlr.wind.speed': { name: 'mlr.wind.speed', value: '', state: '' },

    'mlr.mid.wind.dir': { name: 'mlr.mid.wind.dir', value: '', state: '' },
    'mlr.mid.wind.var.min': {
      name: 'mlr.mid.wind.var.min',
      value: '',
      state: '',
    },
    'mlr.mid.wind.var.max': {
      name: 'mlr.mid.wind.var.max',
      value: '',
      state: '',
    },
    'mlr.mid.wind.gusts.min': {
      name: 'mlr.mid.wind.gusts.min',
      value: '',
      state: '',
    },
    'mlr.mid.wind.gusts': { name: 'mlr.mid.wind.gusts', value: '', state: '' },
    'mlr.mid.wind.speed': { name: 'mlr.mid.wind.speed', value: '', state: '' },

    'mlr.end.wind.dir': { name: 'mlr.end.wind.dir', value: '', state: '' },
    'mlr.end.wind.var.min': {
      name: 'mlr.end.wind.var.min',
      value: '',
      state: '',
    },
    'mlr.end.wind.var.max': {
      name: 'mlr.end.wind.var.max',
      value: '',
      state: '',
    },
    'mlr.end.wind.gusts.min': {
      name: 'mlr.end.wind.gusts.min',
      value: '',
      state: '',
    },
    'mlr.end.wind.gusts': { name: 'mlr.end.wind.gusts', value: '', state: '' },
    'mlr.end.wind.speed': { name: 'mlr.end.wind.speed', value: '', state: '' },
    visibility: { name: 'visibility', value: '', state: '' },
    rvrTdz: { name: 'rvrTdz', value: '', state: '' },
    rvrMid: { name: 'rvrMid', value: '', state: '' },
    rvrEnd: { name: 'rvrEnd', value: '', state: '' },
    presentweather: { name: 'presentweather', value: '', state: '' },
    clouds: { name: 'clouds', value: '', state: '' },
    temperature: { name: 'temperature', value: '', state: '' },
    qfe: { name: 'qfe', value: '', state: '' },
    dewpoint: { name: 'dewpoint', value: '', state: '' },
    pressure: { name: 'pressure', value: '', state: '' },
    windsheartype: { name: 'windsheartype', value: '', state: '' },
    windshearintensity: { name: 'windshearintensity', value: '', state: '' },
    windshearlocation: { name: 'windshearlocation', value: '', state: '' },
    windshearrwy: { name: 'windshearrwy', value: '', state: '' },
    windsheartime: { name: 'windsheartime', value: '', state: '' },
    turbulenceintensity: { name: 'turbulenceintensity', value: '', state: '' },
    turbulencelocation: { name: 'turbulencelocation', value: '', state: '' },
  };
  isChanged: { [key: string]: number } = {
    obstime: 0,
    mlr: 0,
    apptype1: 0,
    holding: 0,
    tl: 0,
    'mlr.wind.dir': 0,
    'mlr.wind.var.min': 0,
    'mlr.wind.var.max': 0,
    'mlr.wind.gusts.min': 0,
    'mlr.wind.gusts': 0,
    'mlr.wind.speed': 0,
    'mlr.mid.wind.dir': 0,
    'mlr.mid.wind.var.min': 0,
    'mlr.mid.wind.var.max': 0,
    'mlr.mid.wind.gusts.min': 0,
    'mlr.mid.wind.gusts': 0,
    'mlr.mid.wind.speed': 0,
    'mlr.end.wind.dir': 0,
    'mlr.end.wind.var.min': 0,
    'mlr.end.wind.var.max': 0,
    'mlr.end.wind.gusts.min': 0,
    'mlr.end.wind.gusts': 0,
    'mlr.end.wind.speed': 0,
    visibility: 0,
    rvrTdz: 0,
    rvrMid: 0,
    rvrEnd: 0,
    presentweather: 0,
    clouds: 0,
    temperature: 0,
    qfe: 0,
    dewpoint: 0,
    pressure: 0,
    windsheartype: 0,
    windshearintensity: 0,
    windshearlocation: 0,
    windshearrwy: 0,
    windsheartime: 0,
    turbulenceintensity: 0,
    turbulencelocation: 0,
  };

  ENGLISH: string = '';
  isOptionSelected: boolean = false;
  fieldName: string = '';
  fieldValue: string = '';
  readonlyMode = false;
  isBroadcastBtnDisabled = false;
  messageReceived = false;
  @Output() currentBroadcastEnglish = new EventEmitter<string>();
  @Output() currentBroadcastDATIS = new EventEmitter<string>();
  @Output() isSubscribed = new EventEmitter<boolean>();
  @Output() nextBroadcastEnglish = new EventEmitter<string>();
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
      } else if (msg.content.type === 'ATIS_NEXT_UPDATE') {
        //Update next message
        this.nextBroadcastEnglish.emit(msg.content.nextMessageText.ENGLISH);
        this.nextBroadcastDATIS.emit(msg.content.nextMessageText.DATIS);
        this.nextAtisCode.emit(msg.content.nextIcaoCode);
      } else if (msg.content.type === 'ATIS_FIELD_UPDATED') {
        this.isBroadcastBtnDisabled = false;
        this.formAtisFields[msg.content.fieldName].value = msg.content.value;
        if (msg.content.fieldState === 'CHANGED_BEFORE_BROADCAST') {
          this.isChanged[msg.content.fieldName] = 1; // albastru
        } else if (msg.content.fieldState === 'CHANGED_AFTER_BROADCAST') {
          this.isChanged[msg.content.fieldName] = 2; // gri
        } else if (msg.content.fieldState === 'NORMAL') {
          this.isChanged[msg.content.fieldName] = 0; //alb
          // schimb culoare text
        }
      } else if (msg.type === 'ERROR') {
        this.isChanged[this.fieldName] = 3; // rosu
        this.isBroadcastBtnDisabled = true;
      } else if (msg.content.type === 'ATIS_RELEASED') {
        this.currentAtisCode.emit(msg.content.atisCode);
        this.lastBroadcastTime.emit(msg.content.releaseTime);
        this.currentBroadcastEnglish.emit(msg.content.messageText.ENGLISH);
        this.currentBroadcastDATIS.emit(msg.content.messageText.DATIS);
        Object.entries(this.formAtisFields).forEach(([key, field]) => {
          this.formAtisFields[field.name].state =
            msg.content.atisFields[field.name].state;
          if (msg.content.atisFields[field.name].state === 'NORMAL') {
            this.isChanged[field.name] = 0;
          } else if (
            msg.content.atisFields[field.name].state ===
            'CHANGED_AFTER_BROADCAST'
          ) {
            this.isChanged[field.name] = 2;
          }
        });
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
        airport: 'EVRA',
        reportType: 'ATIS_ARRDEP',
      },
      topic: '/ATIS_ARRDEP/EVRA',
      type: 'PUBLICATION',
    };

    this.sendMessage(broadcastMessage);
  }

  sendSubscribeMsg() {
    let message = {
      topic: '/ATIS_ARRDEP/EVRA',
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
          airport: 'EVRA',
          reportType: 'ATIS_ARRDEP',
          fieldName: this.fieldName,
          value: this.fieldValue,
        },
        topic: '/ATIS_ARRDEP/EVRA',
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
        airport: 'EVRA',
        reportType: 'ATIS_ARRDEP',
        releaseMode: 'MANUAL',
      },
      topic: '/ATIS_ARRDEP/EVRA',
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
        airport: 'EVRA',
        reportType: 'ATIS_ARRDEP',
        releaseMode: 'SEMI_AUTOMATIC',
      },
      topic: '/ATIS_ARRDEP/EVRA',
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
        airport: 'EVRA',
        reportType: 'ATIS_ARRDEP',
        releaseMode: 'AUTOMATIC',
      },
      topic: '/ATIS_ARRDEP/EVRA',
      type: 'PUBLICATION',
    };
    this.sendMessage(autoModeMessage);
  }

  handleSubscribeMessage(msg: ReceivedMessage) {
    this.currentBroadcastEnglish.emit(msg.content.messageText.ENGLISH);
    this.currentBroadcastDATIS.emit(msg.content.messageText.DATIS);
    this.nextBroadcastEnglish.emit(msg.content.nextMessageText.ENGLISH);
    this.nextBroadcastDATIS.emit(msg.content.nextMessageText.DATIS);
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
