import { Component} from '@angular/core';
import { NavController} from 'ionic-angular';
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
  constructor(public servercall:ServercallsProvider,public navCtrl: NavController) {
    if(this.servercall.checkLogin()){ this.islogin = true;}
    this.servercall.loginChange.subscribe(value => {
         this.islogin = value;
    });
  }

  logout(){
  	this.servercall.setLogin(false);
  	this.servercall.removeUserInfo();
  }
}
