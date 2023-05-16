import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-overview-datis',
  templateUrl: './overview-datis.component.html',
  styleUrls: ['./overview-datis.component.css'],
})
export class OverviewDATISComponent {
  @Input('currentBroadcastDATIS') messageDATIS: string;
  @Input('nextBroadcastDATIS') nextMessageDATIS: string;
}
