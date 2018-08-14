import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

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
  selectedDate ;
  timeList;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.selectedDate = new Date();
  	this.updatetimelist();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookingCalendarPage');
  }
  onDaySelect(event){
  	this.selectedDate = event._d;
  	console.log(event._d);
  }
  updatetimelist(){
  	this.timeList = [];
  	this.timeList = [
  					{'time':'9:00 - 10:30','avaliable':false},
  					{'time':'1:30 - 12:00','avaliable':true},
  					{'time':'12:00 - 1:30','avaliable':false},
  					{'time':'1:30 - 3:00','avaliable':true},
  					{'time':'3:00 - 4:30','avaliable':false},
  					{'time':'4:30 - 6:00','avaliable':true},
  			   ];
  }
  // public open(itemSlide: ItemSliding, item: Item) {
  // 	console.log(itemSlide,item);
  // 		document.getElementById(itemSlide).classList.add("active-sliding");
  // 		document.getElementById(itemSlide).classList.add("active-slide");
  // 		document.getElementById(itemSlide).classList.add("active-options-right");
  // 		document.getElementById(item).style.transform = "translate3d(-241px, 0px, 0px)";
  //    //    itemSlide.setElementClass("active-sliding", true);
	 //    // itemSlide.setElementClass("active-slide", true);
	 //    // itemSlide.setElementClass("active-options-right", true);
	 //    // item.setElementStyle("transform", "translate3d(-241px, 0px, 0px)");

  //   }

  // public close(item: ItemSliding) {
  //       // item.close();
  //       document.getElementById(item).classList.remove("active-sliding");
  // 		document.getElementById(item).classList.remove("active-slide");
  // 		document.getElementById(item).classList.remove("active-options-right");
  //   }
}
