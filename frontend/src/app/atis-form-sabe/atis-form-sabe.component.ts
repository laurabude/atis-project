import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  AtisFields,
  Content,
  ReceivedMessage,
  WebsocketService,
} from '../websocket.service';
import { LogService } from '../_services/log.service';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-atis-form-sabe',
  templateUrl: './atis-form-sabe.component.html',
  styleUrls: ['./atis-form-sabe.component.css'],
})
export class AtisFormSabeComponent {
  @ViewChild('myInput') myInput: ElementRef;
  messageContent: Content;
  public formAtisFields: AtisFields = {
    obstime: { name: 'obstime', value: '', state: '' },
    mlr: { name: 'mlr', value: '', state: '' },
    apptype1: { name: 'apptype1', value: '', state: '' },
    holding: { name: 'holding', value: '', state: '' },
    tl: { name: 'tl', value: '', state: '' },
    temperature: { name: 'temperature', value: '', state: '' },
    'mlr.wind.dir': { name: 'mlr.wind.dir', value: '', state: '' },
    'mlr.wind.var.min': { name: 'mlr.wind.var.min', value: '', state: '' },
    'mlr.wind.var.max': { name: 'mlr.wind.var.max', value: '', state: '' },
    dewpoint: { name: 'dewpoint', value: '', state: '' },
    'mlr.wind.speed': { name: 'mlr.wind.speed', value: '', state: '' },
    'mlr.wind.gusts': { name: 'mlr.wind.gusts', value: '', state: '' },
    pressure: { name: 'pressure', value: '', state: '' }, //QNH
    visibility: { name: 'visibility', value: '', state: '' },
    rvrTdz: { name: 'rvrTdz', value: '', state: '' },
    rvrMid: { name: 'rvrMid', value: '', state: '' },
    rvrEnd: { name: 'rvrEnd', value: '', state: '' },
    presentweather: { name: 'presentweather', value: '', state: '' },
    cloud1: { name: 'cloud1', value: '', state: '' },
    cbtcu: { name: 'cbtcu', value: '', state: '' },
    remarksEnglish: { name: 'remarksEnglish', value: '', state: '' },
    remarksSpanish: { name: 'remarksSpanish', value: '', state: '' },
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
  user: any;

  constructor(
    private WebsocketService: WebsocketService,
    private storageService: StorageService,
    private logService: LogService,
    private router: Router
  ) {
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
        this.nextBroadcastSpanish.emit(msg.content.nextMessageText.SPANISH);
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
        this.currentBroadcastSpanish.emit(msg.content.messageText.SPANISH);
        this.currentBroadcastDATIS.emit(msg.content.messageText.DATIS);
        this.logBroadcast(msg.content.messageText.ENGLISH, 'EN');
        this.logBroadcast(msg.content.messageText.SPANISH, 'ES');
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

  ngOnInit() {
    this.user = this.storageService.getUser();
    if (this.user.roles == null) {
      this.router.navigate(['login']);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.sendSubscribeMsg();
    }, 100);
  }

  logBroadcast(text: string, language: string) {
    this.logService
      .addEntry(this.user.username, 'ENFL', text, language)
      .subscribe({
        next: (data) => {
          console.log(data);
        },
        error: (err) => {
          console.log(err);
        },
      });
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
        topic: '/ATIS_ARRDEP/SABE',
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
        airport: 'SABE',
        reportType: 'ATIS_ARRDEP',
        releaseMode: 'MANUAL',
      },
      topic: '/ATIS_ARRDEP/SABE',
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
        airport: 'SABE',
        reportType: 'ATIS_ARRDEP',
        releaseMode: 'SEMI_AUTOMATIC',
      },
      topic: '/ATIS_ARRDEP/SABE',
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
        airport: 'SABE',
        reportType: 'ATIS_ARRDEP',
        releaseMode: 'AUTOMATIC',
      },
      topic: '/ATIS_ARRDEP/SABE',
      type: 'PUBLICATION',
    };
    this.sendMessage(autoModeMessage);
  }

  handleSubscribeMessage(msg: ReceivedMessage) {
    this.currentBroadcastEnglish.emit(msg.content.messageText.ENGLISH);
    this.currentBroadcastSpanish.emit(msg.content.messageText.SPANISH);
    this.currentBroadcastDATIS.emit(msg.content.messageText.DATIS);
    this.nextBroadcastEnglish.emit(msg.content.nextMessageText.ENGLISH);
    this.nextBroadcastSpanish.emit(msg.content.nextMessageText.SPANISH);
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
