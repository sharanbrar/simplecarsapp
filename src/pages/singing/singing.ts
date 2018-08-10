import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {FormBuilder, FormGroup,FormControl,Validators,ValidatorFn} from '@angular/forms';
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
  constructor(public navCtrl: NavController, public navParams: NavParams,private formBuilder: FormBuilder) {
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
  }

  submitSignIn(){
      console.log(this.signInform);
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

}
