import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Subject } from 'rxjs/Subject';
/*
  Generated class for the ServercallsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ServercallsProvider {
  public baseUrl : string = '';
  public loginChange: Subject<boolean> = new Subject<boolean>();
  public httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
    })
  };
  constructor(public http: HttpClient) {
    console.log('Hello ServercallsProvider Provider');
  }

/**************************************/
	  private extractData(res: Response) {
	    let body = res;
	    return body || {};
	  }

	  public postCall(url, data){
	     return this.http.post(url,data, this.httpOptions).pipe(
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

}
