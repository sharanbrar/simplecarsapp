import { Component } from '@angular/core';
import { NavController, NavParams,ViewController,ModalController } from 'ionic-angular';
import {FormBuilder, FormGroup,FormControl,Validators,ValidatorFn} from '@angular/forms';
import { ScanLicensePage } from '../scan-license/scan-license';
import { BookingCalendarPage } from '../booking-calendar/booking-calendar';
import { ForgetPasswordPage } from '../forget-password/forget-password';
import { ServercallsProvider } from '../../providers/servercalls/servercalls';
import { VerifyAccountPage } from '../verify-account/verify-account';
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
  pleaseWait;
  carID;
  tabtype;
  loginerror;
  SignUperror;
  confirmInvalid;
  public signInform : FormGroup;
  public signUpform : FormGroup;
  constructor(public modalCtrl: ModalController,public viewCtrl: ViewController,public navCtrl: NavController, public navParams: NavParams,private formBuilder: FormBuilder,public servercall:ServercallsProvider) {
      this.pleaseWait = false;
      this.confirmInvalid = false;
      this.carID = navParams.get("carID");
      this.tabtype = 'singintab';
      this.signInform = this.formBuilder.group({
                           'signinEmail'        : ['', Validators.compose([Validators.required,this.validatorEmail()])],
                           'signinPassword'     : ['', Validators.compose([Validators.required])]
                        });
      this.signUpform = this.formBuilder.group({
                           'signupName'           : ['', Validators.compose([Validators.required])],
                           'signupEmail'          : ['', Validators.compose([Validators.required,this.validatorEmail()])],
                           'signupPassword'       : ['', Validators.compose([Validators.required])],
                           'signupConfirmPassword': ['', Validators.compose([Validators.required])]
                        });  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingingPage');
  }

  movetocalendar(){
    this.navCtrl.push(BookingCalendarPage,{carID: this.carID})
     .then(() => {
        const index = this.viewCtrl.index;
        this.navCtrl.remove(index);
    });
  }

  movetoaddlicense(userID){
    this.navCtrl.push(ScanLicensePage,{carID: this.carID,userID:userID})
     .then(() => {
        const index = this.viewCtrl.index;
        this.navCtrl.remove(index);
    });
  }


  submitSignUp(){
      console.log(this.signUpform);
      this.signUpform['controls']['signupName'].markAsDirty();
      this.signUpform['controls']['signupEmail'].markAsDirty();
      this.signUpform['controls']['signupPassword'].markAsDirty();
      this.signUpform['controls']['signupConfirmPassword'].markAsDirty();
      if(this.signUpform.status == 'VALID'){
        if(this.signUpform.get('signupPassword').value == this.signUpform.get('signupConfirmPassword').value){
          this.confirmInvalid = false;
          this.pleaseWait = true;
          let cdata = {
                        "name":this.signUpform.get('signupName').value,
                        "email":this.signUpform.get('signupEmail').value,
                        "password":this.signUpform.get('signupPassword').value,
                      };
          console.log(cdata);
          this.servercall.postCall(this.servercall.baseUrl+'signup',cdata).subscribe( 
            resp =>{
                console.log(resp);
                if(resp.status == "success"){
                  this.signUpform.reset();
                  this.servercall.presentToast('Sign Up Successful');
                  this.showVerify('signup',resp);
                }else{
                  if(resp.error['email'][0]){
                    this.SignUperror = "<p>"+resp.error['email'][0]+"</p>"
                  }
                  this.servercall.presentToast('Something went wrong.');
                }
                this.pleaseWait = false;
            },
            error => {
              console.log(error);
              this.pleaseWait = false;
            }  
          );
        }else{
          this.confirmInvalid = true;
          this.servercall.presentToast('Password Not Matching');
        }
      }else{
        this.servercall.presentToast('Invalid Details');
      }
  }

  submitSignIn(){
      console.log(this.signInform);
      this.signInform['controls']['signinEmail'].markAsDirty();
      this.signInform['controls']['signinPassword'].markAsDirty();

      if(this.signInform.status == 'VALID'){
        this.pleaseWait = true;
         let cdata = {
                      "email":this.signInform.get('signinEmail').value,
                      "password":this.signInform.get('signinPassword').value,
                    };
        this.servercall.postCall(this.servercall.baseUrl+'login',cdata).subscribe( 
          resp =>{
              console.log(resp);
              if(resp.status == "success"){
                  this.servercall.setLocalStorage('SimpleAppUserToken',resp.token);
                  this.servercall.getCall(this.servercall.baseUrl+'auth/user?token='+resp.token).subscribe(
                      userresp =>{
                        console.log(userresp);
                        if(userresp.status == "success"){
                          if(userresp['data'][0]['is_verified'] == "0"){
                            this.showVerify('signin',userresp);
                          }else{
                            this.doafterSign('signin',userresp);
                          }
                        }else{
                          this.servercall.presentToast('Please try again.');
                          this.pleaseWait = false;
                        }
                      },
                      usererror=>{
                        this.servercall.presentToast('Please try again.');
                        this.pleaseWait = false;
                      }
                    );
              }else{
                 this.signInform.get('signinEmail').setValue("");
                 this.signInform.get('signinPassword').setValue("");
                 this.servercall.presentToast('Invalid Email/Password');
                 this.pleaseWait = false;
              }
          },
          error => {
            console.log(error);
            this.pleaseWait = false;
          }  
        );

      }else{
        this.servercall.presentToast('Invalid Email/Password');
      }
  }

  forgetPassword(){
    let forgetPasswordModal = this.modalCtrl.create(ForgetPasswordPage);
      forgetPasswordModal.present();
  }

  doafterSign(type,respData){
    if(type == 'signup'){
      this.servercall.setLocalStorage('SignedUpuser',JSON.stringify(respData.data));
      this.movetoaddlicense(respData['data'].id);
    }else{
        this.servercall.setUserInfo(respData.data);
        this.servercall.setLogin(true);
        this.pleaseWait = false;
        if(this.servercall.getUserInfo('licenseinfo')){
          this.movetocalendar();
        }else{
          this.movetoaddlicense(respData.data[0].id);
        }
    }
  }

  showVerify(type,respData){
      let verifyModal = this.modalCtrl.create(VerifyAccountPage);
      verifyModal.onDidDismiss(data => {
        if(data){
          if(type == 'signup'){
            this.doafterSign('signup',respData);
          }else{
            respData.data[0]["is_verified"] = '1';
            this.doafterSign('signin',respData);
          }
        }
      });
      verifyModal.present();
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
