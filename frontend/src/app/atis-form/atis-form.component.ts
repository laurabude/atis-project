import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-atis-form',
  templateUrl: './atis-form.component.html',
  styleUrls: ['./atis-form.component.css'],
})
export class AtisFormComponent {
  @Input() ReceivedData;
  ngOnInit() {}
}
