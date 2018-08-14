import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BookingCalendarPage } from '../booking-calendar/booking-calendar';
/**
 * Generated class for the ScanLicensePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-scan-license',
  templateUrl: 'scan-license.html',
})
export class ScanLicensePage {

  constructor(public navCtrl: NavController, public navParams: NavParams,public barcodeScanner: BarcodeScanner) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanLicensePage');
  }

  openBarScanner(){
    this.navCtrl.push(BookingCalendarPage);
  	console.log("Bar Scanner Launched");
  	// this.barcodeScanner.scan().then(barcodeData => {
  	//  console.log('Barcode data', barcodeData);
  	// }).catch(err => {
  	//     console.log('Error', err);
  	// });
  }
}
