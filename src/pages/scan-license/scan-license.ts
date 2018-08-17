import { Component } from '@angular/core';
import { NavController, NavParams,ViewController } from 'ionic-angular';
// import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { BookingCalendarPage } from '../booking-calendar/booking-calendar';
import { ServercallsProvider } from '../../providers/servercalls/servercalls';
import { SingingPage } from '../singing/singing';
/**
 * Generated class for the ScanLicensePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-scan-license',
  templateUrl: 'scan-license.html',
})
export class ScanLicensePage {
  carID;
  currenuser_id;
  scanwhat;
  licenseData ;
  pleaseWait;
  imgsrc;
  constructor(public viewCtrl: ViewController,private camera: Camera,public navCtrl: NavController, public navParams: NavParams,public servercall:ServercallsProvider) {
    this.carID = navParams.get("carID");
    // this.movetocalendar();
    if(!this.servercall.checkLogin()){
        let userData = JSON.parse(this.servercall.getLocalStorage("SignedUpuser",'{}'));
        this.currenuser_id = userData.id;
    }else{
       this.currenuser_id  = this.servercall.getUserInfo('id');
    }
    this.resetScan();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ScanLicensePage');
  }

  addImage(src){
    if(src.status){
      if(!this.licenseData.front_image){
        this.licenseData.front_image = src.data;
        this.imgsrc = src.data ;
        this.scanwhat = "<p>Now scan Backside of your License</p>";
      }else{
        this.licenseData.back_image = src.data;
        this.imgsrc = src.data;
        this.sendImages();
      }
    }else{
      console.log(src.error);
      this.servercall.presentToast('Try Again! Something went wrong');
    }
  }

  resetScan(){
    this.imgsrc = null;
    this.licenseData = {
                          user_id:this.currenuser_id,
                          front_image : null,
                          back_image  : null
                       };
    this.scanwhat = "<p>Scan Frontside of your License</p>";
    this.pleaseWait = false;
  }
   
  sendImages(){
     this.pleaseWait = true;
     this.servercall.postCall(this.servercall.baseUrl+'license?token='+this.servercall.getLocalStorage('SimpleAppUserToken'),this.licenseData).subscribe( 
          resp =>{
              console.log(resp);
              if(resp.status == "success"){
                this.movetocalendar();
              }else{
                  this.resetScan();
              }
            },
          error=>{
            console.log(error);  
            this.resetScan();
            this.servercall.presentToast('Try Again! Something went wrong');
          }
    );
  }

  movetocalendar(){
    if(this.servercall.checkLogin()){
        this.navCtrl.push(BookingCalendarPage,{carID: this.carID})
         .then(() => {
            const index = this.viewCtrl.index;
            this.navCtrl.remove(index);
        });
    }else{
        this.navCtrl.push(SingingPage,{carID: this.carID})
         .then(() => {
            const index = this.viewCtrl.index;
            this.navCtrl.remove(index);
        });
    }
  }

  getImage(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      let  result ={status:true, data: 'data:image/jpeg;base64,' + imageData};
       this.addImage(result);
    }, (err) => {
       let result = {status:false, error : err};
       this.addImage(result);
    });
  }
}
