import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';
import { environment } from '@env/environment';


@Injectable()
export class ConsultaEnvioService {

    public text ='';
    public isProduction = environment.production;

    constructor(private http: Http) { }

    public getText(): string {
        return this.text;
    }
    
    public setText(newText: string): string {
        return this.text = newText;
    }

    public getTextLocalStorage(): string {
        return localStorage.getItem('myText');
    }
    
    public setTextLocalStorage() {
        localStorage.setItem('myText', 'Hello im from LocalStorage');
    }

    
    public getInfo(): Observable<any> {
        const url = '';
        let params = '';
        
        return this.http.post(url, params).map(this.getJson).catch(this.controlarError);

    }

    private getJson(res: Response) {
        const respuestaJson = res.json();
        return respuestaJson.data || {};
    
      }
    
      private controlarError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
          const body = error.json() || '';
          const err = body.error || JSON.stringify(body);
          errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
          errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Promise.reject(errMsg);
      }
    


}