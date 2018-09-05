import { Component} from '@angular/core';
import { AlertController} from 'ionic-angular';
import { ServercallsProvider } from '../../providers/servercalls/servercalls';
/**
 * Generated class for the LogoutComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'logout',
  templateUrl: 'logout.html'
})
export class LogoutComponent {
  islogin : boolean = false;
  constructor(public servercall:ServercallsProvider, private alertCtrl: AlertController) {
    if(this.servercall.checkLogin()){ this.islogin = true;}
    this.servercall.loginChange.subscribe(value => {
         this.islogin = value;
    });
  }

  logout(){
    let alert = this.alertCtrl.create({
      title: 'Logout',
      message: 'Are you sure, you want to logout?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Logout',
          handler: () => {
            this.servercall.setLogin(false);
            this.servercall.removeUserInfo();
          }
        }
      ]
    });
    alert.present();
  }
}
