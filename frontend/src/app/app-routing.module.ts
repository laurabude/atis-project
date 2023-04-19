import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AtisFormComponent } from './atis-form/atis-form.component';
import { HomePageComponent } from './home-page/home-page.component';
import {BrowserModule} from '@angular/platform-browser';

const routes: Routes = [
  {path:'', redirectTo:'home', pathMatch:'full'},
  {path:'atis-report' , component:AtisFormComponent },
  {path:'home' , component:HomePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes), BrowserModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
