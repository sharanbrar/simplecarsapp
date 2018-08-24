import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ServercallsProvider } from '../providers/servercalls/servercalls';
// import { HomePage } from '../pages/home/home';
import { SlideWalkPage } from '../pages/slide-walk/slide-walk';
// import { PickTestdriveLocationPage } from '../pages/pick-testdrive-location/pick-testdrive-location';
import { FeedbackPage } from '../pages/feedback/feedback';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = SlideWalkPage;
  public login: any;
  public loginChangeSubscription: any;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,public servercall:ServercallsProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    this.setDefaults();
  }

  setDefaults(){
    this.login = this.servercall.checkLogin();
    this.servercall.loginChange.subscribe(value => {
        this.login = value;
        console.log('detecting.');
        console.log(this.login);
    });
    // if(this.servercall.getLocalStorage('SimpleCarsApplaunched',false)){
    //    this.rootPage = PickTestdriveLocationPage;
    // }
    if(this.servercall.checkLogin()){
      // this.servercall.getCall(this.servercall.baseUrl+'token/refresh?token='+this.servercall.getLocalStorage('SimpleAppUserToken')).subscribe(
      //     resp=>{
      //         console.log(resp);
      //     },
      //     error=>{
      //       console.log(error);
      //     }
      // );
      this.checkFeedback();
    }
  }

  checkFeedback(){
      let cdate = new Date();
      let formateddate = this.servercall.formatDte('date',cdate)+" "+this.servercall.formatDte('time',cdate);
      this.servercall.postCall(this.servercall.baseUrl+'check-booking?token='+this.servercall.getLocalStorage('SimpleAppUserToken'),{date:formateddate}).subscribe(
        resp=>{
            if(resp.status){
                this.rootPage = FeedbackPage;
            }
        },
        error=>{
          console.log(error);
        }
      );
  }

}

