import { Component,ViewChild, ElementRef,NgZone} from '@angular/core';
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
  pickedLocation;
  allLocation : any[] = [];
  curentMarker:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,private zone: NgZone,public geolocation: Geolocation,public servercall:ServercallsProvider) {
  	this.userCurrentLoc = { location : '',lat:'',lng:''};
    this.pickedLocation;
  	this.fetchLoactions();
    // setTimeout( () => {;},200);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PickTestdriveLocationPage');
  }

  showResults(){
    if(this.servercall.getLocalStorage('SimplecarsAppCurrentLocation',false)){
      this.navCtrl.setRoot(SearchResultPage);
    }else{
      this.servercall.presentToast('Please Select a Location..');
    }
  }


  fetchLoactions(){
    this.servercall.getCall(this.servercall.baseUrl+'drive-locations').subscribe( 
      resp =>{
          console.log(resp);
        if(resp["status"] == 'success'){
          this.allLocation = resp.results;
          this.loadMap(this.allLocation[0].lat,this.allLocation[0].lng);
        }else{
          this.servercall.presentToast('Oops! Something went wrong.');
        }
      },
      error => {
        console.log(error);
      }  
    );
  }



/************Map Functions********************/

  loadMap(lat,lng){
    // this.geolocation.getCurrentPosition().then((position) => {
    // }, (err) => {
    //   console.log(err);
    // });
      let latLng = new google.maps.LatLng(lat,lng);
      let mapOptions = {
        center: latLng,
        zoom: 8,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      } 
      this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      this.autoComplete();
      this.addMarkers();
  }

  autoComplete(){
     let input = document.getElementById('googlePlaces').getElementsByTagName('input')[0];
     let autocomplete = new google.maps.places.Autocomplete(input, {types: ['geocode']});
     google.maps.event.addListener(autocomplete, 'place_changed', () => {
       // retrieve the place object for your use
       let place = autocomplete.getPlace();
       let markdat = { 
          location : place.formatted_address,
          lat:place.geometry.location.lat(),
          lng:place.geometry.location.lng(),
          short_address : place.formatted_address,
          address:  place.formatted_address
        }
         this.pickedLocation = markdat.location;
         this.addCurrentMarker(markdat,'update');
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
        short_address: this.allLocation[i].short_address,
        address:(this.allLocation[i].address)?this.allLocation[i].address:this.allLocation[i].short_address
      });     
      this.addInfoWindow(marker);
    }
    setTimeout(()=>{this.addCurrentMarker(this.allLocation[0],'check')},200);
  }

  markthiscurrent(marker){
      let markData = { 
                        lat:marker.getPosition().lat(),
                        lng:marker.getPosition().lng(),
                        short_address : marker.short_address,
                        address: (marker.address)?marker.address:marker.short_address
                      };
      this.addCurrentMarker(markData,'update');
  }

  addCurrentMarker(markdata,type='update'){
    if(type == 'update'){
      this.curentMarker.setMap(null);
      this.zone.run(() => {
        this.userCurrentLoc = { 
                                location : markdata.short_address,
                                lat:markdata.lat,
                                lng:markdata.lng,
                                short_address : markdata.short_address,
                                address: (markdata.address)?markdata.address:markdata.short_address
                              };
      });
      this.servercall.setLocalStorage('SimplecarsAppCurrentLocation',JSON.stringify(this.userCurrentLoc));
    }else{
      if(this.servercall.getLocalStorage('SimplecarsAppCurrentLocation',false)){
         this.zone.run(() => {
           this.userCurrentLoc = JSON.parse(this.servercall.getLocalStorage('SimplecarsAppCurrentLocation','{}'));
         }); 
      }else{
        this.zone.run(() => {
          this.userCurrentLoc = { 
                              location : markdata.short_address,
                              lat:markdata.lat,
                              lng:markdata.lng,
                              short_address : markdata.short_address,
                              address: (markdata.address)?markdata.address:markdata.short_address
                            };
        });
          this.servercall.setLocalStorage('SimplecarsAppCurrentLocation',JSON.stringify(this.userCurrentLoc));
      }
    }
    let pos = new google.maps.LatLng(this.userCurrentLoc.lat,this.userCurrentLoc.lng);
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: pos,
        markerid: this.allLocation.length,
        short_address: this.userCurrentLoc.short_address,
        address:(this.userCurrentLoc.address)?this.userCurrentLoc.address:this.userCurrentLoc.short_address
      });        
      this.curentMarker = marker;
      this.addInfoWindow(marker);
      this.map.panTo(pos);
  }

  addInfoWindow(marker){
    // let infoWindow = new google.maps.InfoWindow({
    //   content: marker.address
    // });
    google.maps.event.addListener(marker, 'click', () => {
      //infoWindow.open(this.map, marker); 
      this.markthiscurrent(marker);
    });
  }
}
