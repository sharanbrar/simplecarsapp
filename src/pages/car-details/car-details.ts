import { Component,ViewChild} from '@angular/core';
import { NavController, NavParams,ViewController,ModalController,Slides} from 'ionic-angular';
import { SingingPage } from '../singing/singing';
import { BookingCalendarPage } from '../booking-calendar/booking-calendar';
import { ScanLicensePage } from '../scan-license/scan-license';
import { ServercallsProvider } from '../../providers/servercalls/servercalls';
import { VerifyAccountPage } from '../verify-account/verify-account';
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
  slidesMoving: boolean = true;
  slidesHeight: string | number;
  @ViewChild('slider') slider: Slides;
  constructor(public modalCtrl: ModalController,public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams,public servercall:ServercallsProvider) {
  	this.carID = navParams.get("carID");
  	this.updatecardata();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CarDetailsPage');
      setTimeout(()=> {
          this.slideDidChange();
        },1000
    );
  }



  updatecardata(){
    if(this.carID){
      this.servercall.getCall(this.servercall.baseUrl+'car/'+this.carID).subscribe( 
        resp =>{
          // console.log(resp);
          if(resp["status"] == 'success'){
            this.carsData = resp.results;
            this.servercall.setLocalStorage("slectedCar",JSON.stringify(this.carsData[0]));
          }else{
            this.servercall.presentToast('Oops! Something went wrong.');
          }
        },
        error => {
          console.log(error);
        }  
      );
    }
  }

  showSignIn(){
    if(this.servercall.checkLogin()){
      if(this.servercall.getUserInfo('is_verified') == "0"){
        
      }else{
        this.doafterverify();
      }
    }else{
    	this.navCtrl.push(SingingPage,{carID: this.carID});
    }
  }

  doafterverify(){
    if(this.servercall.getUserInfo('licenseinfo')){
      this.navCtrl.push(BookingCalendarPage,{carID: this.carID});
    }else{
      console.log(this.servercall.getUserInfo('id'));
      this.navCtrl.push(ScanLicensePage,{carID: this.carID,userID:this.servercall.getUserInfo('id')});
    }
  }

  showVerify(){
    let verifyModal = this.modalCtrl.create(VerifyAccountPage);
    verifyModal.onDidDismiss(data => {
      if(data){
        this.doafterverify();
      }
    });
    verifyModal.present();
  }

  slideDidChange () {
    try{
      this.slidesMoving = false;
      let slideIndex : number = this.slider.getActiveIndex();
      let currentSlide : Element = this.slider._slides[slideIndex];
      let slideNumerbers=this.slider.length();
      if(slideIndex<slideNumerbers){
        this.slidesHeight = currentSlide.clientHeight;
      }
    }catch(e){}
  }
  slideWillChange () {
    this.slidesMoving = true;
  }
}
