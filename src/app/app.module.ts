import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SlideWalkPage } from '../pages/slide-walk/slide-walk';
import { SingingPage } from '../pages/singing/singing';
import { SignButtonsPage } from '../pages/sign-buttons/sign-buttons';
import { PickTestdriveLocationPage } from '../pages/pick-testdrive-location/pick-testdrive-location';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SlideWalkPage,
    SingingPage,
    SignButtonsPage,
    PickTestdriveLocationPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SlideWalkPage,
    SingingPage,
    SignButtonsPage,
    PickTestdriveLocationPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
