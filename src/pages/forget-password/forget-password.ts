import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { ServercallsProvider } from '../../providers/servercalls/servercalls';

/**
 * Generated class for the ForgetPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-forget-password',
  templateUrl: 'forget-password.html',
})
export class ForgetPasswordPage {
  pleaseWait;
  steptype;
  emailerror = "";
  otperror = "";
  passworderror = "";
  useremail;
  userOTP;
  userPassword;
  userConfirmPassword;
  Respotp;
  constructor(public viewCtrl: ViewController,public servercall:ServercallsProvider, public navCtrl: NavController, public navParams: NavParams) {
  	this.steptype="email";
  	this.pleaseWait = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgetPasswordPage');
  }

  dismiss() {
	   this.viewCtrl.dismiss();
  }

  checkEmail(){
  	let ptrn = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  	if(ptrn.test(this.useremail)){
  	   this.emailerror = "";
  	   this.pleaseWait = true;
	  	  this.servercall.postCall(this.servercall.baseUrl+'password/email',{email:this.useremail}).subscribe(
	        resp=>{
	            if(resp.status){
	              this.Respotp = resp.token;
	              this.steptype='otp';
	            }else{
	            	this.emailerror = "<p>Email not found</p>";
	            }
               this.pleaseWait = false;
	        },
	        error=>{ 
	          this.pleaseWait = false;
        	  this.emailerror = "<p>Something went wrong! Try Again.</p>";;
	          console.log(error);
	        }
	      );
  	}else{
  	   this.emailerror = "<p>Enter a valid Email</p>";
  	}
  }

  verifyOtp(){
  	let ptrn = /^-?(0|[1-9]\d*)?$/;
  	if(ptrn.test(this.userOTP) && this.userOTP == this.Respotp){
  		this.otperror="";
  		this.steptype='password';
  	}else{
  		this.otperror = "<p>Invalid OTP</p>";
  	}
  }

  changePassword(){
  	if(this.userPassword.trim() != ""){
  		if(this.userPassword == this.userConfirmPassword){
  			this.passworderror="";
  			this.pleaseWait = true;
  			this.servercall.postCall(this.servercall.baseUrl+'password/reset',{password:this.userPassword,email:this.useremail}).subscribe(
		        resp=>{
		            if(resp.status){
		            	this.passworderror = "";
		            	this.servercall.presentToast('Password Reset Successfully.');
		            	this.dismiss();
		            }else{
		            	this.passworderror = "<p>Something went wrong! Try Again.</p>";
		            }
	               this.pleaseWait = false;
		        },
		        error=>{ 
		          this.pleaseWait = false;
		          console.log(error);
		        }
		      );
  		}else{
  			this.passworderror="<p>Confirm Password Not Matched.</p>";
  		}
  	}else{
  		this.passworderror="<p>Enter Password</p>";
  	}
  }

}
