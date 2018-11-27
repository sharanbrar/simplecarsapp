import { Component } from '@angular/core';
import { NavController, NavParams,Platform } from 'ionic-angular';
import { ServercallsProvider } from '../../providers/servercalls/servercalls';
import { Geolocation } from '@ionic-native/geolocation';
import { LaunchNavigator, LaunchNavigatorOptions } from '@ionic-native/launch-navigator';

/**
 * Generated class for the BookingConfirmedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-booking-confirmed',
  templateUrl: 'booking-confirmed.html',
})
export class BookingConfirmedPage {
  carData;
  data;
  slot;
  tabtype;
  actualUserLoc;
  bookedTimeShow;
  constructor(private launchNavigator: LaunchNavigator,public platform: Platform,public geolocation: Geolocation,public navCtrl: NavController, public navParams: NavParams,public servercall:ServercallsProvider) {
  	console.log("confirm");
    this.servercall.feedbackChanged.next(false);
    this.data =  navParams.get("data");
  	this.slot =  navParams.get("slot");
    let o  = this.data.booked_time.split(" ");
    this.bookedTimeShow = o[0]; 
  	this.carData = JSON.parse(this.servercall.getLocalStorage("slectedCar",{'Image':null}));
  	this.tabtype = 'confirmed';
    this.getCurrentLoca();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingConfirmedPage');
  }

  goback(){
  	this.navCtrl.pop();
  }

  getCurrentLoca(){
    this.geolocation.getCurrentPosition().then(
      (position) => {
          this.actualUserLoc = {
            lat : position.coords.latitude,
            lng : position.coords.longitude
          }
      }, (err) => {
          this.actualUserLoc = {
            lat : this.data.location.lat,
            lng : this.data.location.lng
          }
          console.log(err);
      }
    );
  }


  launchInMap(){
    console.log("Launching Maps");
    let options: LaunchNavigatorOptions = {
      start: '"'+this.actualUserLoc.lat+","+this.actualUserLoc.lng+'"',
    };

    this.launchNavigator.navigate([this.data.location.lat, this.data.location.lng], options)
      .then(
        success => console.log('Launched navigator'),
        error => console.log('Error launching navigator', error)
      );
  }

}
