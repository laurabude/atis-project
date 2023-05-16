import { Component } from '@angular/core';
import { Input } from '@angular/core';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent {
  broadcast: string;
  @Input('currentBroadcastEN') messageEN: string;
  @Input('nextBroadcastEN') nextMessageEN: string;
}
