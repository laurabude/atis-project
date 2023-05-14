import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-overview-sabe',
  templateUrl: './overview-sabe.component.html',
  styleUrls: ['./overview-sabe.component.css'],
})
export class OverviewSabeComponent {
  broadcast: string;
  @Input('currentBroadcast') message: string;
  @Input('nextBroadcast') nextMessage: string;
}
