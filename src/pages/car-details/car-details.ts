import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SingingPage } from '../singing/singing';
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
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  	this.carID = navParams.get("carID");
  	this.updatecardata();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CarDetailsPage');
  }
  updatecardata(){
  	this.carsData = {
        'id':1,'name':'Pontiac',
        'miles':'34,382 miles',
        'price':'$73',
        'desc':'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s',
        'image':['assets/imgs/car-1.png','assets/imgs/car-2.png'],
        'routes':['assets/imgs/drive-test-1.png',
              'assets/imgs/drive-test-1.png',
              'assets/imgs/drive-test-1.png',
              'assets/imgs/drive-test-1.png',
              'assets/imgs/drive-test-1.png',
              'assets/imgs/drive-test-1.png',
              'assets/imgs/drive-test-1.png',
              'assets/imgs/drive-test-1.png',
              'assets/imgs/drive-test-1.png',
              'assets/imgs/drive-test-1.png'
            ],
          'additionalf':['Cruise Control',
                         '4 Wheeled Drive',
                         'Heated Seats',
                         'A/C',
                         'Leather Seats',
                         'Tinted Windows',
                         'Auto Transmission',
                         'Movie Screens',
                         'Sun Roof',
                         'Moon Roof',
                         'Navigation System']
      };
  }

  showSignIn(){
  	this.navCtrl.push(SingingPage);
  }

}
