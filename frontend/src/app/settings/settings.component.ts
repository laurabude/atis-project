import { Component } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { StorageService } from '../_services/storage.service';
import { LogService } from '../_services/log.service';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          transform: 'translateY(0)',
          opacity: 1,
        })
      ),
      state(
        'out',
        style({
          transform: 'translateY(-10%)',
          opacity: 0,
        })
      ),
      transition('in => out', animate('300ms ease-out')),
      transition('out => in', animate('300ms ease-in')),
    ]),
  ],
})
export class SettingsComponent {
  showModal: boolean = false;
  selectedPhoto: string;
  userPhoto = '/assets/photo.jpeg';
  isLogVisible = false;
  showWarning = false;
  deleteErrorMessage = null;
  user: any;
  logs: any;
  photos: string[] = [
    '/assets/photo(1).jpg',
    '/assets/photo(2).jpg',
    '/assets/photo(3).jpg',
    '/assets/photo(4).jpg',
    '/assets/photo(5).jpg',
    '/assets/photo.jpeg',
  ];
  usernameForm: { [key: string]: string } = {
    username: null,
    email: null,
    password: null,
  };
  deletePassword: null;
  passwordForm: { [key: string]: string } = {
    oldPass: null,
    password: null,
    confirmPassword: null,
  };
  constructor(
    private storageService: StorageService,
    private logService: LogService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.storageService.getUser();
    if (this.user.roles == null) {
      this.router.navigate(['login']);
    } else {
      this.userPhoto =
        this.user.pic == ''
          ? '//ssl.gstatic.com/accounts/ui/avatar_2x.png'
          : this.user.pic;
      this.logService
        .getLogs(this.user.username, this.user.roles)
        .subscribe((data) => ((this.logs = data), console.log(data)));
    }
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
      this.authService
        .changepicture(this.user.username, this.selectedPhoto)
        .subscribe((user) => {
          this.storageService.saveUser(user);
          window.location.reload();
        });
    }
    this.closeModal();
    this.userPhoto = this.selectedPhoto;
  }

  changeUsername(): void {
    console.log(this.usernameForm['username']);
    this.authService
      .updateusername(
        this.usernameForm['username'],
        this.usernameForm['email'],
        this.usernameForm['password']
      )
      .subscribe((response) => {
        this.storageService.saveUser(response);
        window.location.reload();
      });
  }

  changePassword(): void {
    this.authService
      .updatepassword(
        this.user.username,
        this.passwordForm['oldPass'],
        this.passwordForm['password']
      )
      .subscribe((response) => {
        window.location.reload();
      });
  }

  deleteAccountPopup(): void {
    this.showWarning = true;
  }

  deleteAccount(): void {
    console.log(this.deletePassword);
    this.authService
      .deleteuser(this.user.username, this.deletePassword)
      .subscribe((response) => {
        if (response.message == 'Invalid Password!') {
          console.log('invalidPassword');
        }
      });
  }

  deleteUserAccount(): void {
    this.authService
      .deleteuser(this.user.username, this.deletePassword)
      .subscribe((response) => {
        if (response.message == 'User deleted successfully.') {
          this.storageService.clean();
          window.location.reload();
        } else {
          this.deleteErrorMessage = response.message;
        }
      });
  }

  closeWarning(): void {
    this.showWarning = false;
    this.deletePassword = null;
    this.deleteErrorMessage = null;
  }
}
