import { Component } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      state('out', style({
        transform: 'translateY(-10%)',
        opacity: 0
      })),
      transition('in => out', animate('300ms ease-out')),
      transition('out => in', animate('300ms ease-in'))
    ])
  ]
})
export class SettingsComponent {
  showModal : boolean = false;
  selectedPhoto: string;
  userPhoto= '/assets/photo.jpeg';
  isLogVisible = false;
  photos: string[] = ['/assets/photo(1).jpg', '/assets/photo(2).jpg', '/assets/photo(3).jpg', '/assets/photo(4).jpg', '/assets/photo(5).jpg', '/assets/photo.jpeg'];

  ngOnInit(){
  }

  toggleLogVisibility() {
    this.isLogVisible = !this.isLogVisible;
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  selectPhoto(photo: string): void {
    this.selectedPhoto = photo;
  }

  confirmSelection(): void {
    if (this.selectedPhoto) {
       //add change photo logic here
    }
    this.closeModal();
    this.userPhoto = this.selectedPhoto;
  }
}
