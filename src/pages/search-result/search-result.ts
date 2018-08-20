import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { CarDetailsPage } from '../car-details/car-details';
import { ServercallsProvider } from '../../providers/servercalls/servercalls';

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
  pleaseWait;
  constructor(public navCtrl: NavController, public navParams: NavParams,public servercall:ServercallsProvider) {
    this.resultTypeTab = 'resultTab';
    this.updatecardata();
    this.pleaseWait=true;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchResultPage');
  }
  carDeatials(carId){
    this.navCtrl.push(CarDetailsPage,{carID: carId});
  }
  updatecardata(){
    this.servercall.getCall(this.servercall.baseUrl+'list').subscribe( 
      resp =>{
        this.pleaseWait=false;
        if(resp["status"] == 'success'){
           this.carsData = resp.results;
        }else{
          this.servercall.presentToast('Oops! Something went wrong.');
        }
      },
      error => {
        this.servercall.presentToast('Oops! Something went wrong.');
        this.pleaseWait=false;
      }  
    );
  }

}
