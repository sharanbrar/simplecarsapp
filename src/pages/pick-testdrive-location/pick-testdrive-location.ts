import { Component,ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { SearchResultPage } from '../search-result/search-result';

declare var google;

/**
 * Generated class for the PickTestdriveLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-pick-testdrive-location',
  templateUrl: 'pick-testdrive-location.html',
})
export class PickTestdriveLocationPage {
  @ViewChild('map') mapElement: ElementRef;
  // @ViewChild('map', {read: ElementRef}) private mapElement: ElementRef;
  map: any;
  userCurrentLoc;
  constructor(public navCtrl: NavController, public navParams: NavParams,public geolocation: Geolocation) {
	console.log(this.mapElement);
  	this.userCurrentLoc = { location : 'Riverside',lat:'',long:''};
  	setTimeout( () => {this.loadMap();},200);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PickTestdriveLocationPage');
  }
  showResults(){
    this.navCtrl.push(SearchResultPage);
  }
  loadMap(){

  	 this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
      let mapOptions = {
        center: latLng,
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      } 
      this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      setTimeout(()=>{ this.addMarker(this.map.getCenter(),"<h4>Your Location</h4>"); },300);
    }, (err) => {
      console.log(err);
    });

    // let latLng = new google.maps.LatLng(32.7157, 117.1611);
    // let mapOptions = {
    //   center: latLng,
    //   zoom: 15,
    //   mapTypeId: google.maps.MapTypeId.ROADMAP
    // }

    // this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    // this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  autoComplete(){
     let input = document.getElementById('googlePlaces').getElementsByTagName('input')[0];
     let autocomplete = new google.maps.places.Autocomplete(input, {types: ['geocode']});
     google.maps.event.addListener(autocomplete, 'place_changed', () => {
       // retrieve the place object for your use
       let place = autocomplete.getPlace();
       console.log(place);
     });
  }

  addMarker(positn,contnt){
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: positn
    });
    let content = contnt;         
    this.addInfoWindow(marker, content);
  }

  addInfoWindow(marker, content){
    let infoWindow = new google.maps.InfoWindow({
      content: content
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });
  }
}
