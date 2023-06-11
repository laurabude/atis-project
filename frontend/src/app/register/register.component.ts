import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form: any = {
    username: null,
    email: null,
    password: null,
    photo: ''
  };
  userPhoto= '//ssl.gstatic.com/accounts/ui/avatar_2x.png';
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  photos: string[] = ['/assets/photo(1).jpg', '/assets/photo(2).jpg', '/assets/photo(3).jpg', '/assets/photo(4).jpg', '/assets/photo(5).jpg', '/assets/photo.jpeg'];
  selectedPhoto: string;
  showModal: boolean = false;
  confirmedPhoto: string;
  backgorund = document.getElementById('bkg');
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.backgorund.style.backgroundImage = 'url(../assets/register.png)';
    this.backgorund.style.backgroundSize = 'cover';
  }
  ngOnDestroy(): void {
    this.backgorund.style.backgroundImage = '';
  }

  selectPhoto(photo: string): void {
    this.selectedPhoto = photo;
  }
  
  confirmSelection(): void {
    if (this.selectedPhoto) {
      this.form.photo = this.selectedPhoto;
    }
    this.closeModal();
    this.userPhoto = this.selectedPhoto;
  }

  onSubmit(): void {
    const { username, email, password } = this.form;

    this.authService.register(username, email, password).subscribe({
      next: (data) => {
        console.log(data);
        this.isSuccessful = true;
        this.isSignUpFailed = false;
      },
      error: (err) => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      },
    });
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
}
