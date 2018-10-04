import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
import { ToastController } from 'ionic-angular';

/*
  Generated class for the ServercallsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServercallsProvider {
  public loginState :boolean = false;
  public baseUrl : string = 'http://admin.simplecarapp.com/api/';
  public ImagebaseUrl : string = 'http://admin.simplecarapp.com/public/storage/';
  public loginChange: Subject<boolean> = new Subject<boolean>();
  public feedbackChanged: Subject<boolean> = new Subject<boolean>();
  constructor(public http: HttpClient,private toastCtrl: ToastController) {
    console.log('Hello ServercallsProvider Provider');
    this.loginChange.subscribe((value) => {
            this.loginState = value;
    });
  }

/*************LocalStorage Functions****************/
  public setLocalStorage(item,value){
	  localStorage.setItem(item, value);
  }

  public getLocalStorage(item,defaultvalue:any = ''){
	 return localStorage.getItem(item) ? localStorage.getItem(item) : defaultvalue;
  }

  public checkLogin(){
  	console.log("checkking login");
  	this.loginState = localStorage.getItem('SimplecarLoginState') == 'true' ? true : false;
	  return this.loginState;
  }
  
  public setLogin(value){
	  localStorage.setItem('SimplecarLoginState', value);
      this.loginChange.next(value);
  }

  public setUserInfo(userdata){
  	localStorage.setItem('SimplecaruserInfo', JSON.stringify(userdata));
  }
  public removeUserInfo(){
  	localStorage.removeItem('SimplecaruserInfo');
  }
  public getUserInfo(param?){
	let Userinfo = JSON.parse(localStorage.getItem('SimplecaruserInfo'));
  	if(param){
      return (Userinfo[0][param]) ? Userinfo[0][param] : '' ;
    }else{
      return  Userinfo;
    }
  }

/**************************************/

formatDte(what,date){
	if(what == 'time'){
	    let dt = date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
	    return dt ;
	}else{
		let month = date.getMonth() + 1;
  		month = month < 10 ? '0' + month : '' + month;
  		let day = date.getDate();
  		day = day < 10 ? '0' + day : '' + day;
	    let dt = date.getFullYear()+"-"+month+"-"+day;
	    return dt;
	}
}

/**************************************/
	  private extractData(res: Response) {
	    let body = res;
	    return body || {};
	  }

	  public postCall(url, data){
	     return this.http.post(url,data).pipe(
	      map(this.extractData),
	      catchError(this.handleError)
	    );
	  }

	  public getCall(url){
	     return this.http.get(url).pipe(
	      map(this.extractData),
	      catchError(this.handleError)
	    );
	  }
	  

	  private handleError (error: Response | any) {
	    let errMsg: string;
	    if (error instanceof Response) {
	      const err = error || '';
	      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
	    } else {
	      errMsg = error.message ? error.message : error.toString();
	    }
	    console.error(errMsg);
	    return Observable.throw(errMsg);
	  }
/**************************************/
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
