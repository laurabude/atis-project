import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AirportsComponent } from './airports/airports.component';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { TabsEvraComponent } from './tabs-evra/tabs-evra.component';
import { TabsSabeComponent } from './tabs-sabe/tabs-sabe.component';
import { TabsComponent } from './tabs/tabs.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: 'atis-report', pathMatch: 'full' },
  { path: 'atis-report', component: AirportsComponent },
  { path: 'atis-report/enfl', component: TabsComponent },
  { path: 'atis-report/sabe', component: TabsSabeComponent },
  { path: 'atis-report/evra', component: TabsEvraComponent },
  { path: 'weather-data', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'map', component: MapComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'admin', component: BoardAdminComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
