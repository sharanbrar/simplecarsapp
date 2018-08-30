import { Component,ViewChild, ElementRef,NgZone} from '@angular/core';
import { NavController, NavParams,ModalController,AlertController} from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { SearchResultPage } from '../search-result/search-result';
import { LocationListPage } from '../location-list/location-list';
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
  actualUserLoc;
  userCurrentLoc;
  currenLocDisp;
  pickedLocation;
  minDistelement;
  allLocation : any[] = [];
  curentMarker:any;
  errorCustomPlace : boolean = false;
  pleaseWait:boolean = false;
  constructor(public modalCtrl: ModalController,public navCtrl: NavController, public navParams: NavParams,private zone: NgZone,public geolocation: Geolocation,public servercall:ServercallsProvider,private alertCtrl: AlertController) {
  	this.userCurrentLoc = { location : '',lat:'',lng:''};
    this.pickedLocation;
    this.minDistelement = 0;
    this.getCurrentLoca();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PickTestdriveLocationPage');
  }

  showResults(){
    if(this.servercall.getLocalStorage('SimplecarsAppCurrentLocation',false)){
      this.navCtrl.push(SearchResultPage);
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
  getCurrentLoca(){
    this.geolocation.getCurrentPosition().then(
      (position) => {
          this.actualUserLoc = {
            lat : position.coords.latitude,
            lng : position.coords.longitude
          }
          this.fetchLoactions();
      }, (err) => {
          this.actualUserLoc = null;
        console.log(err);
          this.fetchLoactions();
      }
    );
  }

  loadMap(lat,lng){
      let latLng = new google.maps.LatLng(lat,lng);
      let mapOptions = {
        center: latLng,
        zoom: 9,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      } ;
      this.zone.run(() => {
        this.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      });
      this.autoComplete();
      this.addMarkers();
  }

  clearautoloc(){
    if(this.pickedLocation){
      this.errorCustomPlace = false;
      this.addCurrentMarker(this.allLocation[this.minDistelement],'update')
      this.zone.run(() => {
        this.pickedLocation = "";
      });
    }
  }

  showLocaList(area){
      let locationListModal = this.modalCtrl.create(LocationListPage, { area: area,allLocation:this.allLocation});
      locationListModal.onDidDismiss(data => {
        if(data){
          this.addCurrentMarker(data,'update');
        }
      });
      locationListModal.present();
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
        if(this.checkdist(markdat.lat,markdat.lng)){
            this.errorCustomPlace  = false;
           this.addCurrentMarker(markdat,'update');
        }else{
          this.errorCustomPlace  = true;
          this.presentPrompt(markdat);
          // this.servercall.presentToast('Location Not Allowed');
        }
     });
  }

  presentPrompt(markdat) {
      let alert = this.alertCtrl.create({
        title: markdat.location,
        message: 'We are sorry but we do not offer test drives in the area you entered, Please try another address thats closer to one of our locations. Or you can submit this address, enter your phone number below, and we will get back to you.',
        inputs: [
          {
            name: 'fullname',
            placeholder: 'Your Name'
          },
          {
            name: 'phone',
            placeholder: 'Your Number',
            type: 'tel'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: data => {
              this.clearautoloc();
            }
          },
          {
            text: 'Submit',
            handler: data => {
                this.SendCustomLoc(markdat,data);
            }
          }
        ]
      });
      alert.present();
    }

  SendCustomLoc(markdat,data){
      if(data.fullname && data.phone){
        let CusData = {
          fullname : data.fullname,
          phone  : data.phone,
          address : markdat.address
        }
        this.pleaseWait = true;
        this.servercall.postCall(this.servercall.baseUrl+'doLocationRequest',CusData).subscribe(
          resp =>{
            if(resp.status){
              this.presentBasicAlert("Thankyou","We will get back to you soon.");
            }else{
              this.servercall.presentToast("Try Again! Something went wrong.");
            }
            this.pleaseWait = false;
            this.clearautoloc();
          },
          error => {
            console.log(error);
            this.pleaseWait = false;
          }  
        );
      }else{
        this.presentPrompt(markdat);
      }
  }

  presentBasicAlert(title,message) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: message,
      buttons: ['Ok']
    });
    alert.present();
  }

 
  checkdist(lat,lng){
    for (var i = 0; i < this.allLocation.length; i++){
        let dis : number = parseInt(this.calcCrow(lat,lng, this.allLocation[i].lat,this.allLocation[i].lng));
        if(dis <= 10){
          return true;
        }
    }
    return false;
  }

  addMarkers(){
    let minDis = null;
   setTimeout(()=>{ 
    for (var i = 0; i < this.allLocation.length; i++){
      if(this.actualUserLoc){
        let dis = this.calcCrow(this.actualUserLoc.lat, this.actualUserLoc.lng, this.allLocation[i].lat,this.allLocation[i].lng);
        if(minDis == null || minDis > dis){
          minDis = dis;
          this.minDistelement = i;
        }
      }
      let pos =  new google.maps.LatLng(this.allLocation[i].lat,this.allLocation[i].lng);
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: pos,
        icon:'assets/imgs/map-pin.png',
        markerid: i,
        location_name : (this.allLocation[i].location_name)? this.allLocation[i].location_name: this.allLocation[i].short_address,
        short_address: this.allLocation[i].short_address,
        address:(this.allLocation[i].address)?this.allLocation[i].address:this.allLocation[i].short_address
      });     
      this.addInfoWindow(marker);
    }
    this.addCurrentMarker(this.allLocation[this.minDistelement],'update');
   },200);
  }

  markthiscurrent(marker){
      let markData = { 
                        lat:marker.getPosition().lat(),
                        lng:marker.getPosition().lng(),
                        location_name : (marker.location_name)? marker.location_name: marker.short_address,
                        short_address : marker.short_address,
                        address: (marker.address)?marker.address:marker.short_address
                      };
      this.addCurrentMarker(markData,'update');
  }

  addCurrentMarker(markdata,type='update'){
    if(type == 'update'){
      if(this.curentMarker){
        this.curentMarker.setMap(null);
      }
      this.zone.run(() => {
        this.userCurrentLoc = { 
                                location_name : (markdata.location_name)? markdata.location_name: markdata.short_address,
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
                              location_name : (markdata.location_name)? markdata.location_name: markdata.short_address,
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
        location_name : (this.userCurrentLoc.location_name)? this.userCurrentLoc.location_name: this.userCurrentLoc.short_address,
        short_address: this.userCurrentLoc.short_address,
        address:(this.userCurrentLoc.address)?this.userCurrentLoc.address:this.userCurrentLoc.short_address
      });        
      this.curentMarker = marker;
      this.addInfoWindow(marker);
      this.map.panTo(pos);

      let dis ;
      if(this.actualUserLoc){
        dis = this.calcCrow(this.actualUserLoc.lat, this.actualUserLoc.lng, this.userCurrentLoc.lat, this.userCurrentLoc.lng);
      }else{
        dis = this.calcCrow(this.allLocation[0].lat, this.allLocation[0].lng, this.userCurrentLoc.lat, this.userCurrentLoc.lng);
      }
      let locname = (this.userCurrentLoc.location_name) ? this.userCurrentLoc.location_name : this.userCurrentLoc.location;
      this.zone.run(() => {
        this.currenLocDisp = "<h3>"+locname+"</h3><p>"+this.userCurrentLoc.address+" <br> ( "+dis+" miles away)<p>";
      });
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

  calcCrow(lat1, lon1, lat2, lon2) {
     if(lat1 !='' && lon1!=''){
         var R = 3959;
         var dLat = this.toRad(lat2-lat1);
         var dLon = this.toRad(lon2-lon1);
         lat1 = this.toRad(lat1);
         lat2 = this.toRad(lat2);
         var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
         Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
         var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
         var d = R * c;
         return d.toFixed(2);
     }

  }

  toRad(Value){
     return Value * Math.PI / 180;
  }
}
