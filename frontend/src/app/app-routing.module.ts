import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AtisFormComponent } from './atis-form/atis-form.component';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [
  {path:'', redirectTo:'home', pathMatch:'full'},
  {path:'atis-report' , component:AtisFormComponent },
  {path:'home' , component:HomePageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
