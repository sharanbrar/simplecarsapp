import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SingingPage } from '../singing/singing';
import { BookingCalendarPage } from '../booking-calendar/booking-calendar';
import { ScanLicensePage } from '../scan-license/scan-license';
import { ServercallsProvider } from '../../providers/servercalls/servercalls';
/**
 * Generated class for the CarDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-car-details',
  templateUrl: 'car-details.html',
})
export class CarDetailsPage {
  carID;
  carsData;
  constructor(public navCtrl: NavController, public navParams: NavParams,public servercall:ServercallsProvider) {
  	this.carID = navParams.get("carID");
  	this.updatecardata();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CarDetailsPage');
  }
  updatecardata(){
    if(this.carID){
      this.servercall.getCall(this.servercall.baseUrl+'car/'+this.carID).subscribe( 
        resp =>{
          // console.log(resp);
          if(resp["status"] == 'success'){
            this.carsData = resp.results;
            this.servercall.setLocalStorage("slectedCar",JSON.stringify(this.carsData[0]));
              console.log(this.carsData[0]);
          }else{
            this.servercall.presentToast('Oops! Something went wrong.');
          }
        },
        error => {
          console.log(error);
        }  
      );
    }
  }

  showSignIn(){
    if(this.servercall.checkLogin()){
      if(this.servercall.getUserInfo('licenseinfo')){
        this.navCtrl.push(BookingCalendarPage,{carID: this.carID});
      }else{
        console.log(this.servercall.getUserInfo('id'));
        this.navCtrl.push(ScanLicensePage,{carID: this.carID,userID:this.servercall.getUserInfo('id')});
      }
    }else{
    	this.navCtrl.push(SingingPage,{carID: this.carID});
    }
  }

}
