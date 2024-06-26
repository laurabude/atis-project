import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AtisFormComponent } from './atis-form/atis-form.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { BodyComponent } from './body/body.component';
import { HomePageComponent } from './home-page/home-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BoardAdminComponent } from './board-admin/board-admin.component';
import { BoardUserComponent } from './board-user/board-user.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from './_helpers/http.interceptor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TabsComponent } from './tabs/tabs.component';
import { MatTabsModule } from '@angular/material/tabs';
import { OverviewComponent } from './overview/overview.component';
import { AtisFormSabeComponent } from './atis-form-sabe/atis-form-sabe.component';
import { TabsSabeComponent } from './tabs-sabe/tabs-sabe.component';
import { OverviewESComponent } from './overview-es/overview-es.component';
import { OverviewDATISComponent } from './overview-datis/overview-datis.component';
import { AirportsComponent } from './airports/airports.component';
import { MapComponent } from './map/map.component';
import { TabsEvraComponent } from './tabs-evra/tabs-evra.component';
import { AtisFormEvraComponent } from './atis-form-evra/atis-form-evra.component';
import { SettingsComponent } from './settings/settings.component';
@NgModule({
  declarations: [
    AppComponent,
    AtisFormComponent,
    SidebarComponent,
    BodyComponent,
    HomePageComponent,
    BoardAdminComponent,
    BoardUserComponent,
    HomeComponent,
    LoginComponent,
    ProfileComponent,
    RegisterComponent,
    TabsComponent,
    OverviewComponent,
    AtisFormSabeComponent,
    TabsSabeComponent,
    OverviewESComponent,
    OverviewDATISComponent,
    AirportsComponent,
    MapComponent,
    TabsEvraComponent,
    AtisFormEvraComponent,
    SettingsComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    MatTabsModule,
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
