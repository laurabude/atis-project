import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AtisFormComponent } from './atis-form/atis-form.component';

const routes: Routes = [
  {path:'', redirectTo:'atis-report', pathMatch:'full'},
  {path:'atis-report' , component:AtisFormComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
