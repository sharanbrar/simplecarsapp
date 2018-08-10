import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CarDetailsPage } from '../car-details/car-details';

/**
 * Generated class for the SearchResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-search-result',
  templateUrl: 'search-result.html',
})
export class SearchResultPage {
  resultTypeTab;
  carsData;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.resultTypeTab = 'resultTab';
  	this.updatecardata();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchResultPage');
  }
  carDeatials(carId){
  	this.navCtrl.push(CarDetailsPage,{carID: carId});
  }
  updatecardata(){
  	this.carsData = [
  		{'id':1,'name':'Pontiac','miles':'34,382 miles','image':'assets/imgs/car-1.png'},
  		{'id':2,'name':'Jeep Rubicon','miles':'56,232 miles','image':'assets/imgs/car-2.png'},
  		{'id':3,'name':'2012 Mazda Mazda5','miles':'86,182 miles','image':'assets/imgs/car-3.png'},
  		{'id':4,'name':'M3 BMW','miles':'1236 miles','image':'assets/imgs/car-4.png'},
  		{'id':5,'name':'Mazda 323','miles':'41,162 miles','image':'assets/imgs/car-5.png'},
  		{'id':6,'name':'2013 Mazda SUV','miles':'34,382 miles','image':'assets/imgs/car-6.png'},
  	];
  }

}
