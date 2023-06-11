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
    obstime: { name: 'obstime', value: '', state: '' },
    mlr: { name: 'mlr', value: '', state: '' },
    holding: { name: 'holding', value: '', state: '' },
    'mlr.wind.speed': { name: 'mlr.wind.speed', value: '', state: '' },
    'mlr.wind.gusts': { name: 'mlr.wind.gusts', value: '', state: '' },
    'mlr.wind.dir': { name: 'mlr.wind.dir', value: '', state: '' },
    'mlr.wind.var.min': { name: 'mlr.wind.var.min', value: '', state: '' },
    'mlr.wind.var.max': { name: 'mlr.wind.var.max', value: '', state: '' },
    visibility: { name: 'visibility', value: '', state: '' },
    rvr: { name: 'rvr', value: '', state: '' },
    presentweather: { name: 'presentweather', value: '', state: '' },
    clouds: { name: 'clouds', value: '', state: '' },
    temperature: { name: 'temperature', value: '', state: '' },
    dewpoint: { name: 'dewpoint', value: '', state: '' },
    qfe: { name: 'qfe', value: '', state: '' },
    fixedtext: { name: 'fixedtext', value: '', state: '' },
    apptype: { name: 'apptype', value: '', state: '' },
    pressure: { name: 'pressure', value: '', state: '' }, //QNH
    tl: { name: 'tl', value: '', state: '' },
    freetext: { name: 'freetext', value: '', state: '' },
  };
  isChanged: { [key: string]: number } = {
    obstime: 0,
    holding: 0,
    mlr: 0,
    'mlr.wind.speed': 0,
    'mlr.wind.gusts': 0,
    'mlr.wind.dir': 0,
    'mlr.wind.var.min': 0,
    'mlr.wind.var.max': 0,
    visibility: 0,
    rvr: 0,
    presentweather: 0,
    clouds: 0,
    temperature: 0,
    dewpoint: 0,
    pressure: 0,
    qfe: 0,
    tl: 0,
    freetext: 0,
    fixedtext: 0,
    apptype: 0,
  };
  ENGLISH: string = '';
  isOptionSelected: boolean = false;
  fieldName: string = '';
  fieldValue: string = '';
  readonlyMode = false;
  isBroadcastBtnDisabled = false;
  messageReceived = false;
  @Output() currentBroadcastENGLISH = new EventEmitter<string>();
  @Output() isSubscribed = new EventEmitter<boolean>();
  @Output() nextBroadcastENGLISH = new EventEmitter<string>();
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
        this.nextBroadcastENGLISH.emit(msg.content.nextMessageText.ENGLISH);
        this.nextAtisCode.emit(msg.content.nextIcaoCode);
      } else if (msg.content.type === 'ATIS_FIELD_UPDATED') {
        this.isBroadcastBtnDisabled = false;
        if (
          msg.content.fieldState === 'CHANGED_BEFORE_BROADCAST' &&
          msg.content.fieldName != 'atiscode'
        ) {
          this.formAtisFields[msg.content.fieldName].value = msg.content.value;
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
        this.currentBroadcastENGLISH.emit(msg.content.messageText.ENGLISH);
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
            console.log(this.isChanged['mlr']);
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
  }
  sendMessage(messageToSend) {
    this.messageReceived = false;
    this.sent.push(messageToSend);
    this.WebsocketService.messages.next(messageToSend);
    setTimeout(() => {
      if (!this.messageReceived) {
        this.isChanged[messageToSend.content.fieldName] = 0;
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
          airport: 'ENFL',
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
    this.currentBroadcastENGLISH.emit(msg.content.messageText.ENGLISH);
    this.nextBroadcastENGLISH.emit(msg.content.nextMessageText.ENGLISH);
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
