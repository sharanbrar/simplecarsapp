import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
// import { SingingPage } from '../singing/singing';
import { PickTestdriveLocationPage } from '../pick-testdrive-location/pick-testdrive-location';


/**
 * Generated class for the SlideWalkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-slide-walk',
  templateUrl: 'slide-walk.html',
})
export class SlideWalkPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SlideWalkPage');
  }

  letsGo(){
  	this.navCtrl.push(PickTestdriveLocationPage);
  }
}
