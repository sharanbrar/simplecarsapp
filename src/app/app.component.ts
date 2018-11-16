import { Component,ViewChild } from '@angular/core';
import { Nav,Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {Observable} from 'rxjs';
import { ServercallsProvider } from '../providers/servercalls/servercalls';
// import { HomePage } from '../pages/home/home';
import { SlideWalkPage } from '../pages/slide-walk/slide-walk';
import { PickTestdriveLocationPage } from '../pages/pick-testdrive-location/pick-testdrive-location';
import { FeedbackPage } from '../pages/feedback/feedback';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
   @ViewChild(Nav) nav: Nav;
  rootPage:any = SlideWalkPage;
  public login: any;
  public loginChangeSubscription: any;
  public checkfeedback : any;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,public servercall:ServercallsProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
    this.setDefaults();
    this.checkfeedback = true;
    
    this.servercall.feedbackChanged.subscribe(value =>{
        this.checkfeedback = value;
    });

    Observable.interval(30000*3).subscribe(x => {
      if(this.checkfeedback && this.servercall.checkLogin()){
        this.checkFeedback();
      }
    });
    localStorage.removeItem('SimplecarsAppCurrentLocation');
  }

  setDefaults(){
    this.login = this.servercall.checkLogin();
    this.servercall.loginChange.subscribe(value => {
        this.login = value;
        console.log(this.login);
        if(!this.login) this.nav.setRoot(PickTestdriveLocationPage);
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
    }
  }

  checkFeedback(){
      let cdate = new Date();
      let formateddate = this.servercall.formatDte('date',cdate)+" "+this.servercall.formatDte('time',cdate);
      this.servercall.postCall(this.servercall.baseUrl+'check-booking?token='+this.servercall.getLocalStorage('SimpleAppUserToken'),{date:formateddate}).subscribe(
        resp=>{
            console.log(resp);
            if(resp.status){
                //this.rootPage = FeedbackPage;
                this.nav.push(FeedbackPage);
            }
        },
        error=>{
          console.log(error);
        }
      );
  }

}

