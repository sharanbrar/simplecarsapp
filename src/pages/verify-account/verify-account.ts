import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ServercallsProvider } from '../../providers/servercalls/servercalls';
/**
 * Generated class for the VerifyAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-verify-account',
  templateUrl: 'verify-account.html',
})
export class VerifyAccountPage {
  otperror = "";
  userOTP;
  pleaseWait;
  constructor(public viewCtrl: ViewController,public servercall:ServercallsProvider, public navCtrl: NavController, public navParams: NavParams) {
  	this.pleaseWait = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VerifyAccountPage');
  }

  dismiss(val) {
	   this.viewCtrl.dismiss(val);
  }

  verifyOtp(){
  	let ptrn = /^-?(0|[1-9]\d*)?$/;
  	if(this.userOTP !== "" && ptrn.test(this.userOTP)){
  		this.otperror = "";
  		this.pleaseWait = true;
  		this.servercall.postCall(this.servercall.baseUrl+'verify',{verification_code:this.userOTP}).subscribe(
  			resp => {
  				console.log(resp);
  				if(resp.success){
  					this.servercall.presentToast('Verified Successfully.');
  					this.dismiss(true);
  				}else{
  					this.otperror = "<p>Invalid OTP</p>";
  				}
	  			this.pleaseWait = false;
  			},
  			error=>{
  				this.pleaseWait = false;
  				this.otperror = "<p>Something Went Wrong! Try Again</p>";
  				console.log(error);
  			}
  		);
  	}else{
  		this.otperror = "<p>Invalid OTP</p>";
  	}
  }
}
