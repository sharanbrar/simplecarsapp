import { Component } from '@angular/core';
import { NavController, NavParams,AlertController } from 'ionic-angular';
import {FormBuilder,FormControl,Validators,ValidatorFn} from '@angular/forms';
import { ServercallsProvider } from '../../providers/servercalls/servercalls';
// import { PickTestdriveLocationPage } from '../pick-testdrive-location/pick-testdrive-location';

/**
 * Generated class for the FeedbackPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {
  pleaseWait;
  tabtype;
  feedbackerror;
  feedbackForm;
  bookingId;
  bookingDetails:any = null;
  constructor(public navCtrl: NavController, public navParams: NavParams, private alertCtrl: AlertController,private formBuilder: FormBuilder,public servercall:ServercallsProvider) {
      this.servercall.feedbackChanged.next(false);
      if(!this.servercall.checkLogin()){
        this.popme();
      }
      this.pleaseWait = false;
      this.tabtype = 'feedback';
      this.feedbackerror = "";
      this.feedbackForm = this.formBuilder.group({
                           'feedbackRating'  : [0, Validators.compose([Validators.required])],
                           'feedbackEmail'        : [this.servercall.getUserInfo('email'), Validators.compose([Validators.required,this.validatorEmail()])],
                           'feedbackMessage'     : ['', Validators.compose([Validators.required])]
                        });
      this.checkFeedback();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackPage');
  }

  checkFeedback(){
      this.pleaseWait = true;
      let cdate = new Date();
      let formateddate = this.servercall.formatDte('date',cdate)+" "+this.servercall.formatDte('time',cdate);
      this.servercall.postCall(this.servercall.baseUrl+'check-booking?token='+this.servercall.getLocalStorage('SimpleAppUserToken'),{date:formateddate}).subscribe(
        resp=>{
            if(resp.status){
              this.bookingDetails = resp;
              this.bookingDetails['cardetails'] = null;
              this.bookingId = resp.booking;
              this.servercall.getCall(this.servercall.baseUrl+'car/'+this.bookingDetails.detail.car_id).subscribe(
                  res =>{
                    if(res["status"] == 'success'){
                      this.bookingDetails['cardetails'] = res.results[0];
                      console.log(this.bookingDetails);
                      this.pleaseWait = false;
                    }else{
                      this.popme();
                      this.pleaseWait = false;
                    }
                  },
                  err =>{
                      this.popme();
                      this.pleaseWait = false;
                  }
              );
            }else{
              this.popme();
              this.pleaseWait = false;
            }
        },
        error=>{
          this.popme();
          this.pleaseWait = false;
          console.log(error);

        }
      );
  }

  submitfeedback(){
      console.log(this.feedbackForm);
      this.feedbackForm['controls']['feedbackRating'].markAsDirty();
      this.feedbackForm['controls']['feedbackEmail'].markAsDirty();
      this.feedbackForm['controls']['feedbackMessage'].markAsDirty();

      if(this.feedbackForm.get('feedbackRating').value == 0){
        this.servercall.presentToast('Please select a rating.');
      }else if(this.feedbackForm.status == 'VALID'){
        this.pleaseWait = true;
         let rdata ={
                      "rating":this.feedbackForm.get('feedbackRating').value,
                      "email":this.feedbackForm.get('feedbackEmail').value,
                      "message":this.feedbackForm.get('feedbackMessage').value,
                      "booking_id":this.bookingId
                    };
         console.log(rdata);
         this.servercall.postCall(this.servercall.baseUrl+'feedback?token='+this.servercall.getLocalStorage("SimpleAppUserToken",""),rdata).subscribe(
           resp =>{  
               if(resp.status == "success"){
                 this.servercall.presentToast('Thank you! For rating us.');
                 this.popme();
               }else{
                 this.servercall.presentToast('Oops! Somethong went wrong.');
               }
               this.pleaseWait = false;
           },
           error =>{
             console.log(error);
             this.pleaseWait = false;
             this.servercall.presentToast('Oops! Somethong went wrong.');
           }
         );

      }else{
        this.servercall.presentToast('Invalid Email/Message');
      }
  }

  starClicked(rate){
    this.feedbackForm.get('feedbackRating').setValue(rate);
  }
  popme(){
    this.servercall.feedbackChanged.next(false);
    this.navCtrl.pop();
  }

  skipthis(){
    let alert = this.alertCtrl.create({
      title: 'Feedback',
      message: 'Are you sure, you want to skip?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Skip',
          handler: () => {
            // let rdata ={
            //           "rating":0,
            //           "email":'',
            //           "message":'',
            //           "booking_id":this.bookingId
            //         };
            // this.servercall.postCall(this.servercall.baseUrl+'feedback?token='+this.servercall.getLocalStorage("SimpleAppUserToken",""),rdata).subscribe(
            //    resp =>{  
            //    },
            //    error =>{  
            //    }
            // );
            this.servercall.feedbackChanged.next(false);
            this.navCtrl.pop();
          }
        }
      ]
    });
    alert.present();
  }
  /************* Custom Validators *************/
  validatorEmail(){
    const validator: ValidatorFn = (control: FormControl) => {
      let val=null;
      if((control.value !== undefined && control.value !== null && control.value !== "")){
          val = false;
          let ptrn = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          val = ptrn.test(control.value) ? null : {'invalidEmail': true};
      }
      return val;
    };
    return validator;
  }

}
