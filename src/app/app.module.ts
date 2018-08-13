import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import {HttpClientModule} from '@angular/common/http';
import { Geolocation } from '@ionic-native/geolocation';

import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SlideWalkPage } from '../pages/slide-walk/slide-walk';
import { SingingPage } from '../pages/singing/singing';
import { SignButtonsPage } from '../pages/sign-buttons/sign-buttons';
import { PickTestdriveLocationPage } from '../pages/pick-testdrive-location/pick-testdrive-location';
import { SearchResultPage } from '../pages/search-result/search-result';
import { CarDetailsPage } from '../pages/car-details/car-details';
import { ServercallsProvider } from '../providers/servercalls/servercalls';
import { ScanLicensePage } from '../pages/scan-license/scan-license';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SlideWalkPage,
    SingingPage,
    SignButtonsPage,
    PickTestdriveLocationPage,
    SearchResultPage,
    CarDetailsPage,
    ScanLicensePage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SlideWalkPage,
    SingingPage,
    SignButtonsPage,
    PickTestdriveLocationPage,
    SearchResultPage,
    CarDetailsPage,
    ScanLicensePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ServercallsProvider,
    BarcodeScanner
  ]
})
export class AppModule {}
