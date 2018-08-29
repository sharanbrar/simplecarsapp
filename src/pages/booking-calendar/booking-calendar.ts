import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ServercallsProvider } from '../../providers/servercalls/servercalls';
import { BookingConfirmedPage } from '../booking-confirmed/booking-confirmed';
import { AlertController } from 'ionic-angular';

/**
 * Generated class for the BookingCalendarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-booking-calendar',
  templateUrl: 'booking-calendar.html',
})
export class BookingCalendarPage {
  carID;
  selectedDate ;
  timeList;
  pleaseWait;
  alreadybooked ;
  currentUser_id;
  carData;
  locaddress;
  bookingError;
  constructor(public viewCtrl: ViewController,private alertCtrl: AlertController,public navCtrl: NavController, public navParams: NavParams,public servercall:ServercallsProvider) {
  	if(!this.servercall.checkLogin()){
      this.navCtrl.pop();
    }
    this.currentUser_id = 0;
    this.alreadybooked = false;
    this.pleaseWait = false;
    this.selectedDate = new Date();
  	this.carID = navParams.get("carID");
    this.carData = JSON.parse(this.servercall.getLocalStorage("slectedCar",{'Image':null}));
    this.locaddress = JSON.parse(this.servercall.getLocalStorage("SimplecarsAppCurrentLocation"));
    this.updatetimelist(this.servercall.formatDte('date',this.selectedDate));
    this.bookingError = "";
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingCalendarPage');
  }
  onDaySelect(event){
  	this.selectedDate = event._d;
    this.updatetimelist(this.servercall.formatDte('date',this.selectedDate));
  	console.log(event._d);
  }

  updatetimelist(selecteddate){
    if(this.carID){
      let ddata = {
        car_id : this.carID,
        date : selecteddate
      };
      this.pleaseWait = true;
      this.bookingError  = "";
      this.servercall.postCall(this.servercall.baseUrl+'time-slots?token='+this.servercall.getLocalStorage('SimpleAppUserToken'),ddata).subscribe(
        resp =>{
              console.log(resp);
          if(resp["status"] == 'success'){
            this.timeList = resp.results;
            this.currentUser_id = this.servercall.getUserInfo('id');
            let bookindex = this.timeList.findIndex(time => time.user == this.currentUser_id);
            if(bookindex > -1){
              this.alreadybooked = true;
            }else{
              this.alreadybooked = false;
            }
          }else{
            this.servercall.presentToast('Oops! Something went wrong.');
          }
          this.pleaseWait = false;
        },
        error => {
          console.log(error);
          this.pleaseWait = false;
        }  
      );
    }
  }
  
  movetoConfirmed(data,slot){
    this.navCtrl.push(BookingConfirmedPage,{data:data,slot:slot})
     .then(() => {
        const index = this.viewCtrl.index;
        this.navCtrl.remove(index);
        this.navCtrl.remove(index-1);
    });
  }

  bookthistime(i){
      let selectedslot = this.timeList[i];
      
      let bData ={
          car_id : this.carID,
          booked_time : this.servercall.formatDte('date',this.selectedDate)+' '+selectedslot.time,
          address : this.locaddress.address,
          location : this.locaddress
      };
    this.pleaseWait = true;
    this.servercall.postCall(this.servercall.baseUrl+'booking?token='+this.servercall.getLocalStorage('SimpleAppUserToken'),bData).subscribe(
        resp =>{
          console.log(resp);
          this.bookingError  = "";
          if(resp.status){
            this.servercall.presentToast("Booking successfull");
            this.pleaseWait = false;
            this.updatetimelist(this.servercall.formatDte('date',this.selectedDate));
            this.movetoConfirmed(bData,selectedslot);
            // this.navCtrl.setRoot(SearchResultPage);
          }else{
            this.bookingError = "<p>"+resp.error+"</p>";
            this.servercall.presentToast(resp.error);
            this.pleaseWait = false;
          }
        },
        error=>{
          console.log(error);
          this.servercall.presentToast("Try Again! Something went wrong");
          this.pleaseWait = false;
        }
      );
  }
  open(itemSlide: string, item: string) {
      document.getElementById(itemSlide).classList.add("active-sliding");
      document.getElementById(itemSlide).classList.add("active-slide");
      document.getElementById(itemSlide).classList.add("active-options-right");
      document.getElementById(item).style.transform = "translate3d(-150px, 0px, 0px)";

  }

  presentConfirm(i) {
    let alert = this.alertCtrl.create({
      title: 'Confirm Booking',
      message: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Book',
          handler: () => {
            this.bookthistime(i);
          }
        }
      ]
    });
    alert.present();
  }

}
