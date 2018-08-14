import { Component,ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { SearchResultPage } from '../search-result/search-result';
import { ServercallsProvider } from '../../providers/servercalls/servercalls';

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
  allLocation : any[] = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,public geolocation: Geolocation,public servercall:ServercallsProvider) {
    this.userCurrentLoc = { location : '',lat:'',long:''};
    this.fetchLoactions();
    // setTimeout( () => {;},200);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PickTestdriveLocationPage');
  }

  showResults(){
    this.navCtrl.push(SearchResultPage);
  }

  fetchLoactions(){
    this.servercall.getCall(this.servercall.baseUrl+'drive-locations').subscribe( 
      resp =>{
          console.log(resp);
          this.allLocation = resp.results;
          this.loadMap(this.allLocation[0].lat,this.allLocation[0].lng);
      },
      error => {
        console.log(error);
      }  
    );
  }



/************Map Functions********************/
  loadMap(lat,lng){
    this.geolocation.getCurrentPosition().then((position) => {
      let latLng = new google.maps.LatLng(lat,lng);
      let mapOptions = {
        center: latLng,
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      } 
      this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      this.autoComplete();
      this.addMarkers();
    }, (err) => {
      console.log(err);
    });
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

  addMarkers(){
    for (var i = 0; i < this.allLocation.length; i++){
      let pos =  new google.maps.LatLng(this.allLocation[i].lat,this.allLocation[i].lng);
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: pos,
        icon:'assets/imgs/map-pin.png',
        markerid: i,
        simple_address: this.allLocation[i].short_address,
        simple_long_address:(this.allLocation[i].address)?this.allLocation[i].address:this.allLocation[i].short_address
      });     
      this.addInfoWindow(marker);
    }
    setTimeout(()=>{this.addCurrentMarker(this.allLocation[0],'update')},200);
  }

  addCurrentMarker(markdata,type='update'){
    if(type == 'update'){
      this.userCurrentLoc = { 
                              location : markdata.short_address,
                              lat:markdata.lat,
                              long:markdata.lng,
                              simple_address : markdata.short_address,
                              simple_long_address: (markdata.address)?markdata.address:markdata.short_address
                            };
      this.servercall.setLocalStorage('SimplecarsAppCurrentLocation',JSON.stringify(this.userCurrentLoc));
    }else{
      if(this.servercall.getLocalStorage('SimplecarsAppCurrentLocation',false)){
          this.userCurrentLoc = JSON.parse(this.servercall.getLocalStorage('SimplecarsAppCurrentLocation','{}'));
      }else{
          this.userCurrentLoc = { 
                              location : markdata.short_address,
                              lat:markdata.lat,
                              long:markdata.lng,
                              simple_address : markdata.short_address,
                              simple_long_address: (markdata.address)?markdata.address:markdata.short_address
                            };
          this.servercall.setLocalStorage('SimplecarsAppCurrentLocation',JSON.stringify(this.userCurrentLoc));
      }
    }
    let pos = new google.maps.LatLng(markdata.lat,markdata.lng);
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: pos,
        markerid: this.allLocation.length,
        simple_address: markdata.short_address,
        simple_long_address:(markdata.address)?markdata.address:markdata.short_address
      });        
      this.addInfoWindow(marker);
  }

  addInfoWindow(marker){
    console.log(marker);
    let infoWindow = new google.maps.InfoWindow({
      content: marker.simple_long_address
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker); console.log(marker);
    });
  }
}
