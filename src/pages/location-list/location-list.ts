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
  constructor(public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams) {
  		this.area = navParams.get("area");
  		this.allLocations = navParams.get("allLocation");
  		console.log(this.area,this.allLocations);
  		this.selected = null;
  		this.fetchList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LocationListPage');
  }

  fetchList(){
  	for(var i = 0; i < this.allLocations.length; i++){
  		if(this.area == this.allLocations[i].area){
  			this.showList.push(this.allLocations[i]);
  		}
  	}
  }


  dismiss() {
	   this.viewCtrl.dismiss(this.selected);
  }

  selectthis(loc){
  	this.selected = loc;
  	this.dismiss();
  }
}
