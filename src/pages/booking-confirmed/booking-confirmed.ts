import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ServercallsProvider } from '../../providers/servercalls/servercalls';

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
  constructor(public navCtrl: NavController, public navParams: NavParams,public servercall:ServercallsProvider) {
  	this.data =  navParams.get("data");
  	this.slot =  navParams.get("slot");
  	this.carData = JSON.parse(this.servercall.getLocalStorage("slectedCar",{'Image':null}));
  	console.log(this.data,this.slot,this.carData);
  	this.tabtype = 'confirmed';
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingConfirmedPage');
  }

  goback(){
  	this.navCtrl.pop();
  }
}
