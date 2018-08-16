import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ServercallsProvider } from '../../providers/servercalls/servercalls';
import { SearchResultPage } from '../search-result/search-result';
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
  constructor(public navCtrl: NavController, public navParams: NavParams,public servercall:ServercallsProvider) {
  	if(!this.servercall.checkLogin()){
      this.navCtrl.pop();
    }
    this.currentUser_id = 0;
    this.alreadybooked = false;
    this.pleaseWait = false;
    this.selectedDate = new Date();
  	this.carID = navParams.get("carID");
    console.log(this.carID);
    this.updatetimelist(this.servercall.formatDte('date',this.selectedDate));
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
      this.servercall.postCall(this.servercall.baseUrl+'time-slots?token='+this.servercall.getLocalStorage('SimpleAppUserToken'),ddata).subscribe(
        resp =>{
              console.log(resp);
          if(resp["status"] == 'success'){
            this.timeList = resp.results;
            this.currentUser_id = this.servercall.getUserInfo('id');
            let bookindex = this.timeList.findIndex(time => time.user == this.currentUser_id);
            console.log(bookindex);
            if(bookindex > -1){
              this.alreadybooked = true;
            }else{
              this.alreadybooked = false;
            }
            console.log(this.alreadybooked);
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
  bookthistime(i){
      let selectedslot = this.timeList[i];
      let locaddress = JSON.parse(this.servercall.getLocalStorage("SimplecarsAppCurrentLocation"));
      let bData ={
          car_id : this.carID,
          booked_time : this.servercall.formatDte('date',this.selectedDate)+' '+selectedslot.time,
          address : locaddress.address
      };
    this.pleaseWait = true;
    this.servercall.postCall(this.servercall.baseUrl+'booking?token='+this.servercall.getLocalStorage('SimpleAppUserToken'),bData).subscribe(
        resp =>{
          console.log(resp);
          if(resp.status == "Booking success"){
            this.servercall.presentToast("Booking successfull");
            this.pleaseWait = false;
            this.updatetimelist(this.servercall.formatDte('date',this.selectedDate));
            this.navCtrl.setRoot(SearchResultPage);
          }else{
            this.servercall.presentToast("Try Again! Something went wrong");
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
}
