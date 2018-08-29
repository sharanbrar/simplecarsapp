import { Component } from '@angular/core';
import { NavController, NavParams,Platform } from 'ionic-angular';
import { ServercallsProvider } from '../../providers/servercalls/servercalls';
import { Geolocation } from '@ionic-native/geolocation';

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
  constructor(public platform: Platform,public geolocation: Geolocation,public navCtrl: NavController, public navParams: NavParams,public servercall:ServercallsProvider) {
  	this.data =  navParams.get("data");
  	this.slot =  navParams.get("slot");
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

  startExternalMap() {
    if (this.data.location.lat) {
      this.platform.ready().then(() => {
          if (this.platform.is('ios')) {
            window.open('maps://?q=' + this.data.location.short_address + '&saddr=' + this.actualUserLoc.lat + ',' + this.actualUserLoc.lng + '&daddr=' + this.data.location.lat + ',' + this.data.location.lng, '_system');
          }else if (this.platform.is('android')) {
            window.open('geo://' + this.actualUserLoc.lat + ',' + this.actualUserLoc.lng + '?q=' + this.data.location.lat + ',' + this.data.location.lng + '(' + this.data.location.short_address + ')', '_system');
          }
          //  else{
          //   window.open('https://www.google.com/maps/dir/?api=1&origin='+this.actualUserLoc.lat+','+this.actualUserLoc.lng+'&destination='+this.data.location.lat+','+this.data.location.lng, '_blank');
          // }
          ; 
      });
    };
  }
}
