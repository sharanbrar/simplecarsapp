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
// import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BookingCalendarPage } from '../pages/booking-calendar/booking-calendar';
import { BookingConfirmedPage } from '../pages/booking-confirmed/booking-confirmed';
import { FeedbackPage } from '../pages/feedback/feedback';
import { CalendarModule } from "ion2-calendar";

import { IonStarsComponent } from '../components/ion-stars/ion-stars';
import { Camera } from '@ionic-native/camera';

import { LocationListPage } from '../pages/location-list/location-list';
import { ForgetPasswordPage } from '../pages/forget-password/forget-password';
import { TermPolicyPage } from '../pages/term-policy/term-policy';
import { VerifyAccountPage } from '../pages/verify-account/verify-account';
import { LaunchNavigator } from '@ionic-native/launch-navigator';

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
    ScanLicensePage,
    BookingCalendarPage,
    FeedbackPage,
    IonStarsComponent,
    BookingConfirmedPage,
    LocationListPage,
    ForgetPasswordPage,
    TermPolicyPage,
    VerifyAccountPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CalendarModule,
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
    ScanLicensePage,
    BookingCalendarPage,
    FeedbackPage,
    BookingConfirmedPage,
    LocationListPage,
    ForgetPasswordPage,
    TermPolicyPage,
    VerifyAccountPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ServercallsProvider,
    Camera,
    LaunchNavigator
  ]
})
export class AppModule {}
