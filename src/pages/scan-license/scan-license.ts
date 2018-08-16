import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BookingCalendarPage } from '../booking-calendar/booking-calendar';
import { ServercallsProvider } from '../../providers/servercalls/servercalls';
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
  carID;
  currenuser_id;
  constructor(public navCtrl: NavController, public navParams: NavParams,public barcodeScanner: BarcodeScanner,public servercall:ServercallsProvider) {
    this.carID = navParams.get("carID");
    if(!this.servercall.checkLogin()){
        let userData = jSON.parse(this.servercall.getLocalStorage("SignedUpuser",'{}'));
        this.currenuser_id = userData.id;
    }else{
       this.currenuser_id  = this.servercall.getUserInfo('id');
    }

    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanLicensePage');
  }

  openBarScanner(){
    if(this.carID){
      this.navCtrl.push(BookingCalendarPage,{carID:this.carID});
    }else{
      
    }
  	console.log("Bar Scanner Launched");
  	// this.barcodeScanner.scan().then(barcodeData => {
  	//  console.log('Barcode data', barcodeData);
  	// }).catch(err => {
  	//     console.log('Error', err);
  	// });
  }
}
