import { Component,NgZone} from '@angular/core';
import { NavController, NavParams,ModalController,AlertController} from 'ionic-angular';
// import { Geolocation } from '@ionic-native/geolocation';
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
  map: any;
  actualUserLoc;
  userCurrentLoc;
  closestlocationmarker;
  currentlocationmarker;
  allMapMarkersRightNow : any[] = [];
  currenLocDisp;
  pickedLocation;
  minDistelement;
  allLocation : any[] = [];
  curentMarker:any;
  bounds  = new google.maps.LatLngBounds();
  errorCustomPlace : boolean = false;
  pleaseWait:boolean = false;
  showComingsoon:boolean = true;
  constructor(public modalCtrl: ModalController,public navCtrl: NavController, public navParams: NavParams,private zone: NgZone,public servercall:ServercallsProvider,private alertCtrl: AlertController) {
    this.pleaseWait = true;
    this.userCurrentLoc = { location : '',lat:'',lng:''};
    this.pickedLocation;
    this.minDistelement = null;
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


  getCurrentLoca(){
      this.servercall.getCurrentLoca();
      if(this.servercall.actualUserLoc){
        this.actualUserLoc = this.servercall.actualUserLoc;
        this.fetchLoactions();
      }else{
          this.actualUserLoc = null;
          this.fetchLoactions();
      }
  }

  fetchLoactions(){
    this.servercall.getCall(this.servercall.baseUrl+'drive-locations').subscribe( 
      resp =>{
        if(resp["status"] == 'success'){
          this.allLocation = resp.results;
          if(this.actualUserLoc){
            this.loadMap(this.actualUserLoc.lat,this.actualUserLoc.lng);
            let  closeloc = this.findclosest(this.actualUserLoc.lat,this.actualUserLoc.lng);
            this.minDistelement = closeloc.mindisloc;
            this.addclosestloc(this.allLocation[closeloc.mindisloc]);
            this.currenLocDisp = "<h3>"+this.allLocation[closeloc.mindisloc].location_name+"</h3><p>"+this.allLocation[closeloc.mindisloc].address+" <br> ( "+closeloc.mindist+" miles away) <br> <span class='newspan'>press to select</span><p>";
          }else{
            this.loadMap(this.allLocation[0].lat,this.allLocation[0].lng);
            // this.minDistelement = 0;
          }
          this.pleaseWait = false;
        }else{
          this.servercall.presentToast('Oops! Something went wrong.');
        }
      },
      error => {
        console.log(error);
      }  
    );
  }

  findclosest(lat,lng){
    let mindist = null;
    let mindisloc = 0;
    for(var i = 0; i < this.allLocation.length; i++){
      if(mindist !== null){
        let dis : number = parseInt(this.calcCrow(lat,lng, this.allLocation[i].lat,this.allLocation[i].lng));
        if(mindist > dis){
            mindist = dis;
            mindisloc = i;
        }
      }else{
        mindist = parseInt(this.calcCrow(lat,lng, this.allLocation[i].lat,this.allLocation[i].lng));
        mindisloc = i;
      }
    }
    return {mindisloc,mindist};
  }

  pickclosest(){
    if(this.minDistelement != null){
      this.addCurrentMarker(this.allLocation[this.minDistelement],'update');
    }
  }
  addclosestloc(location){
    if(this.closestlocationmarker){
      this.closestlocationmarker.setMap(null);
      this.closestlocationmarker = null;
    }
    let latLng = new google.maps.LatLng(location.lat,location.lng);
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: latLng,
      icon : {
        url: 'assets/imgs/closestloc.png',
        scaledSize: new google.maps.Size(10, 10),
      },
    });
    let infoWindow = new google.maps.InfoWindow({
      content: 'Closest location : '+location.address,
    });
    marker.addListener('click', function() {
      infoWindow.open(this.map,marker);
    });
    this.closestlocationmarker = marker;
    this.AddMapbound(latLng);
  }
/************Map Functions********************/
  AddMapbound(mark){
    this.bounds.extend(mark);
    this.map.fitBounds(this.bounds); 
    this.map.panToBounds(this.bounds); 
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
      if(this.actualUserLoc){
        let marker = new google.maps.Marker({
          map: this.map,
          animation: google.maps.Animation.DROP,
          position: latLng,
          icon : {
            url: 'assets/imgs/currnt.png',
            scaledSize: new google.maps.Size(10, 10),
          },
        });
        let infoWindow = new google.maps.InfoWindow({
          content: 'Your Location'
        });
        marker.addListener('click', function() {
          infoWindow.open(this.map, marker);
        });
        this.currentlocationmarker = marker;
        this.AddMapbound(latLng);
      }
  }

  autoComplete(){ /*Add Google Places Auto Complete To filed*/
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
        }
     });
  }

  // OK

  clearautoloc(){
    if(this.pickedLocation){
      this.errorCustomPlace = false;
      this.removeCurrentLocation();
      // this.addCurrentMarker(this.allLocation[this.minDistelement],'update')
      this.zone.run(() => {
        this.pickedLocation = "";
      });
    }
  }

  removeCurrentLocation(){
    this.userCurrentLoc = { location : '',lat:'',lng:''};
    localStorage.removeItem('SimplecarsAppCurrentLocation');
    if(this.curentMarker){
      this.curentMarker.setMap(null);
    }
  }

  showLocaList(area,subhead){
      let showList : any[] = [];
      for(var i = 0; i < this.allLocation.length; i++){
        if(area == this.allLocation[i].area){
          showList.push(this.allLocation[i]);
        }
      }
      // if(showList){
      //   this.addMarkers(showList);
      // }else{
      //   this.addMarkers(new Array());
      // }
      let locationListModal = this.modalCtrl.create(LocationListPage, { area: area,allLocation:showList,sub:subhead});
      locationListModal.onDidDismiss(data => {
        if(data){
          this.addCurrentMarker(data,'update');
        }
      });
      locationListModal.present();
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
    /*Send Message to Admin if a custom location is far then 10mile from the available locations */
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
    /*Check Distance of given lat,long from all the available locations*/
    for (var i = 0; i < this.allLocation.length; i++){
        let dis : number = parseInt(this.calcCrow(lat,lng, this.allLocation[i].lat,this.allLocation[i].lng));
        if(dis <= 10){
          return true;
        }
    }
    return false;
  }

  addMarkers(locations){
   let i : number = 0;
   for(i = 0; i < this.allMapMarkersRightNow.length; i++){
       this.allMapMarkersRightNow[i].setMap(null);
   }
   this.allMapMarkersRightNow = [];
    for (i = 0; i < locations.length; i++){
      let pos =  new google.maps.LatLng(locations[i].lat,locations[i].lng);
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        position: pos,
        icon:'assets/imgs/map-pin.png',
        markerid: i,
        location_name : (locations[i].location_name)? locations[i].location_name: locations[i].short_address,
        short_address: locations[i].short_address,
        address:(locations[i].address)?locations[i].address:locations[i].short_address
      });     
      this.allMapMarkersRightNow.push(marker);
      this.addInfoWindow(marker);
      this.map.panTo(pos);
    }

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
      }
    }
    let pos = new google.maps.LatLng(this.userCurrentLoc.lat,this.userCurrentLoc.lng);
      let marker = new google.maps.Marker({
        map: this.map,
        animation: google.maps.Animation.DROP,
        icon : {
          url: 'assets/imgs/carmapicon.png',
            scaledSize: new google.maps.Size(30,38),
        },
        position: pos,
        markerid: this.allLocation.length,
        location_name : (this.userCurrentLoc.location_name)? this.userCurrentLoc.location_name: this.userCurrentLoc.short_address,
        short_address: this.userCurrentLoc.short_address,
        address:(this.userCurrentLoc.address)?this.userCurrentLoc.address:this.userCurrentLoc.short_address
      });        
      this.curentMarker = marker;
      this.addInfoWindow(marker);
      this.AddMapbound(pos);
      // this.map.panTo(pos);
  }

  addInfoWindow(marker){
    let infoWindow = new google.maps.InfoWindow({
      content: marker.address
    });
    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker); 
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

  over(){
    if(this.showComingsoon) this.showComingsoon = false;
    // this.showLocaList('Inland Empire','Coming Soon');
    // else this.showComingsoon = true;
  }
  inland(){
    this.addMarkers(new Array());
  }
}
