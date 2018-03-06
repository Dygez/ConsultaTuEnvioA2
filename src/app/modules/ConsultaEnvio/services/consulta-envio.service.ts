import { Injectable, Input } from '@angular/core';
import { Http, Response, URLSearchParams, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';
import { environment } from '@env/environment';
import { HttpResponse } from 'selenium-webdriver/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PersistenceService } from 'angular-persistence/src/services/persistence.service';
import { ResponseContentType } from '@angular/http';
import { Headers } from '@angular/http/src/headers';


@Injectable()
export class ConsultaEnvioService {
// parameter to pass the current culture
@Input() language: string;

    public bQuery: boolean = false;
    public authenticated: boolean = false;
    public isError: boolean = true;
    public providerSCL: string = "";
    public status: number = 0;
    public isProduction = environment.production;
    public showClient: boolean = false;
    public fichero: ByteString;
    dataBlob: Blob;

    constructor(private http: Http, private router: Router, private route: ActivatedRoute, private persistence: PersistenceService) {
        this.getQueryString();
    }

    public getSCL(key: string): string {
        return localStorage.getItem('SCL');
    }
    
    public setSCL(key: string) {
        localStorage.setItem(key, this.providerSCL);
    }

   public downloadPDF() {
        let text=this.persistence.get('queryString');
        const url = `${environment.api}/documentacion_a2?urldata=${text}`;
        return this.http.get(url).map(this.obtenerJson).catch(this.controlarError);
        };

    public getQueryString(){
        let url_string = window.location.href;
        let url = new URL(url_string);
        let d: string = "";
        try {
            d = url.searchParams.get("data");
        } catch (error) {
            d = ''
        } finally 
        {
            return d
        }
      };

    public getInfo(): Observable<any> {
        let url_string = window.location.href;
        let url = new URL(url_string)
        // passando dal post va in errore, mentre con il get funziona todos.
        return this.http.get(url_string).map(this.getJson).catch(this.controlarError);
    }

    public obtenerJson(res: Response) {
        const respuestaJson = res.json();
        if (respuestaJson.IsError) {
          return Observable.throw("");;
        }
        return respuestaJson.data || {};
      };

    private getJson(res: Response) {
        const respuestaJson = res.json();
        return respuestaJson.data || {};
          }
    
    public controlarError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            this.isError = true;
            const body = JSON.parse(JSON.stringify(error)) || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
            return Observable.throw(errMsg);
        }
        return Promise.reject(errMsg);
    }
    


}