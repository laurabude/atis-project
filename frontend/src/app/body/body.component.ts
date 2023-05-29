import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css'],
})
export class BodyComponent {
  @Input() collapsed = false;
  @Input() screenWidth = 0;
  constructor(private router: Router) {}
  getBodyClass(): string {
    let styleClass = '';
    if (this.collapsed && this.screenWidth > 768) {
      if (
        this.router.url === '/atis-report/enfl' ||
        this.router.url === '/atis-report/sabe' ||
        this.router.url === '/atis-report/evra' ||
        this.router.url === '/home'
      ) {
        styleClass = 'body-trimmed-atis';
      } else {
        styleClass = 'body-trimmed';
      }
    } else if (
      this.collapsed &&
      this.screenWidth <= 768 &&
      this.screenWidth > 0
    ) {
      styleClass = 'body-md-screen';
    }

    return styleClass;
  }
}
