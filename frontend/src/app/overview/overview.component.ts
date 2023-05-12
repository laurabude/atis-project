import { Component } from '@angular/core';
import { Input } from '@angular/core';
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent {
  broadcast: string;
  @Input('currentBroadcast') message: string;
  @Input('nextBroadcast') nextMessage: string;
}
