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
    activeRunway: { name: 'activrunway', value: '' },
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
    fixedtext: { name: 'fixedtext', value: '' },
    apptype: { name: 'apptype', value: '' },
    qnh: { name: 'qnh', value: '' },
    tl: { name: 'tl', value: '' },
    freetext: { name: 'freetext', value: '' },
  };
  isChanged: { [key: string]: boolean } = {
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
  ENGLISH: string = '';
  isOptionSelected: boolean = false;
  fieldName: string = '';
  fieldValue: string = '';
  @Output() currentBroadcast = new EventEmitter<string>();
  @Output() isSubscribed = new EventEmitter<boolean>();

  received: ReceivedMessage;
  sent = [];

  constructor(private WebsocketService: WebsocketService) {
    WebsocketService.messages.subscribe((msg) => {
      console.log('Response from websocket: ' + JSON.stringify(msg));
      if (msg.content.messageText != null) {
        this.currentBroadcast.emit(msg.content.messageText.ENGLISH);
      }
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

  ngAfterViewInit() {
    setTimeout(() => {
      this.sendSubscribeMsg();
    }, 100);
  }

  sendBroadcastMessage() {
    Object.entries(this.isChanged).forEach(([key, value]) => {
      if (value) console.log(`${key} gri`);
      // Add your own logic here
    });
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

  onSelect() {
    this.isOptionSelected = true;
  }
}
