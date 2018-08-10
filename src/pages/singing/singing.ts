import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
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
  signInform;
  signUpform;
  constructor(public navCtrl: NavController, public navParams: NavParams,private formBuilder: FormBuilder) {
  		this.tabtype = 'singintab';
  		// this.signInform = this.formBuilder.group();
  		// this.singUpform = this.formBuilder.group();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SingingPage');
  }

}
