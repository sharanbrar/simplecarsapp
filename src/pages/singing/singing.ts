import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup,FormControl,Validators,ValidatorFn} from '@angular/forms';
import { ScanLicensePage } from '../scan-license/scan-license';
import { ToastController } from 'ionic-angular';
/**
 * Generated class for the SingingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-singing',
  templateUrl: 'singing.html',
})
export class SingingPage {
  tabtype;
  public signInform : FormGroup;
  public signUpform : FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams,private formBuilder: FormBuilder,private toastCtrl: ToastController) {
      this.tabtype = 'singintab';
      this.signInform = this.formBuilder.group({
                           'signinEmail'        : ['', Validators.compose([Validators.required,this.validatorEmail()])],
                           'signinPassword'     : ['', Validators.compose([Validators.required])]
                        });
      this.signUpform = this.formBuilder.group({
                           'signupName'         : ['', Validators.compose([Validators.required])],
                           'signupEmail'        : ['', Validators.compose([Validators.required,this.validatorEmail()])],
                           'signupPassword'     : ['', Validators.compose([Validators.required])]
                        });  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingingPage');
  }


  submitSignUp(){
      console.log(this.signUpform);
      this.signUpform['controls']['signupName'].markAsDirty();
      this.signUpform['controls']['signupEmail'].markAsDirty();
      this.signUpform['controls']['signupPassword'].markAsDirty();

      if(this.signUpform.status == 'VALID'){
        this.navCtrl.push(ScanLicensePage);
      }else{
        this.presentToast('Invalid Name/Email/Password');
      }
  }

  submitSignIn(){
      console.log(this.signInform);
      this.signInform['controls']['signinEmail'].markAsDirty();
      this.signInform['controls']['signinPassword'].markAsDirty();

      if(this.signInform.status == 'VALID'){
        this.navCtrl.push(ScanLicensePage);
      }else{
        this.presentToast('Invalid Email/Password');
      }
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

  validatorNumber(){
    const validator: ValidatorFn = (control: FormControl) => {
      let val=null;
      if((control.value !== undefined && control.value !== null && control.value !== "")) {
          val = false;
          let ptrn = /^-?(0|[1-9]\d*)?$/;
          val = ptrn.test(control.value) ? null : {'invalidNumber': true};
      }
      return val;
    };
    return validator;
  }

  


  validatorPassword(){
    const validator: ValidatorFn = (control: FormControl) => {
      let val=null;
      if((control.value !== undefined && control.value !== null && control.value !== "")) {
          val = false;
          // '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}'
          let ptrn = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{5,}/;
          val = ptrn.test(control.value) ? null : {'invalidPassword': true};
      }
      return val;
    };
    return validator;
  }

  presentToast(DispText,DispPosition = 'top',DispDuration=3000) {
    let toast = this.toastCtrl.create({
      message: DispText,
      duration: DispDuration,
      position: DispPosition
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

}
