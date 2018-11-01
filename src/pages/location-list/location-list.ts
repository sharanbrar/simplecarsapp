import { Component } from '@angular/core';
import { NavController, NavParams,ViewController } from 'ionic-angular';

/**
 * Generated class for the LocationListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-location-list',
  templateUrl: 'location-list.html',
})
export class LocationListPage {
  area;
  allLocations;
  showList : any[] = [];
  selected;
  sub : string = '';
  constructor(public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams) {
  		this.area = navParams.get("area");
      this.allLocations = navParams.get("allLocation");
  		this.showList = this.allLocations;
      this.sub = navParams.get("sub");
  		this.selected = null;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationListPage');
  }

  dismiss() {
	   this.viewCtrl.dismiss(this.selected);
  }

  selectthis(loc){
  	this.selected = loc;
  	this.dismiss();
  }
}
