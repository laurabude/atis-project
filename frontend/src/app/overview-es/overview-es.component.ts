import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-overview-es',
  templateUrl: './overview-es.component.html',
  styleUrls: ['./overview-es.component.css'],
})
export class OverviewESComponent {
  @Input('currentBroadcastES') messageES: string;
  @Input('nextBroadcastES') nextMessageES: string;
}
