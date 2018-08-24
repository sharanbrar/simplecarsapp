import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {FormBuilder,FormControl,Validators,ValidatorFn} from '@angular/forms';
import { ServercallsProvider } from '../../providers/servercalls/servercalls';
import { PickTestdriveLocationPage } from '../pick-testdrive-location/pick-testdrive-location';

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
  constructor(public navCtrl: NavController, public navParams: NavParams,private formBuilder: FormBuilder,public servercall:ServercallsProvider) {
      if(!this.servercall.checkLogin()){
        this.navCtrl.setRoot(PickTestdriveLocationPage);
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
              console.log(resp);
               this.bookingId = resp.booking;
            }else{
              this.navCtrl.setRoot(PickTestdriveLocationPage);
            }
          this.pleaseWait = false;
        },
        error=>{
          this.navCtrl.setRoot(PickTestdriveLocationPage);
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
                 this.navCtrl.setRoot(PickTestdriveLocationPage);
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
