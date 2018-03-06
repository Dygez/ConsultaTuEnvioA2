import { Injectable } from '@angular/core';
import { Http, Response, URLSearchParams, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import { environment } from '@env/environment';
import { Order } from 'app/modules/ConsultaEnvio/model/order';
import { OrderJazztel } from 'app/modules/ConsultaEnvio/model/orderJazzTel';
import { OrderOrange } from 'app/modules/ConsultaEnvio/model/orderOrange';
import { OrderDetail } from 'app/modules/ConsultaEnvio/model/orderDetail';
import { OrderBP } from 'app/modules/ConsultaEnvio/model/orderBP';
import { Person } from 'app/modules/ConsultaEnvio/model/person';
import { Tracking } from 'app/modules/ConsultaEnvio/model/tracking';
import { Email } from 'app/modules/ConsultaEnvio/model/email';
import { PersistenceService } from 'angular-persistence/src/services/persistence.service';
import { Image } from 'app/modules/ConsultaEnvio/model/image';
import { Router, ActivatedRoute } from '@angular/router';
import { PlataForma } from 'app/modules/ConsultaEnvio/model/plataforma';

@Injectable()
export class ConexionsService {

mail: Response;

  constructor(private http: Http, private persistence: PersistenceService, private route: ActivatedRoute) {}

  // get the generic order
  public getOrderData(text: string): Observable<Order> {
    text=this.persistence.get('queryString');
    const url = `${environment.api}/peticion?urldata=${text}`;
    return this.http.get(url).map(this.obtenerJson).catch(this.controlarError.bind(this));
  };

  // get the specific Jazztel order
  public getOrderDataBP(text: string): Observable<OrderBP> {
    text=this.persistence.get('queryString');
    const url = `${environment.api}/peticionbp?urldata=${text}`;
    return this.http.get(url).map(this.obtenerJson).catch(this.controlarError.bind(this));
  };

  // get the specific Jazztel order
  public getOrderDataJazztel(text: string): Observable<OrderJazztel> {
    text=this.persistence.get('queryString');
    const url = `${environment.api}/peticionjazztel?urldata=${text}`;
    return this.http.get(url).map(this.obtenerJson).catch(this.controlarError.bind(this));
  };

  // get the specific Orange order
  public getOrderDataOrange(text: string): Observable<OrderOrange> {
    text=this.persistence.get('queryString');
    const url = `${environment.api}/peticionorange?urldata=${text}`;
    return this.http.get(url).map(this.obtenerJson).catch(this.controlarError.bind(this));
  }

  // get the customer info
  // this is the first interaction going through the web service. Saving the querystring.
  public getClienteData(text: string): Observable<Person>{
    if (this.persistence.get('queryString') !== undefined)
      {
        text=this.persistence.get('queryString');
        const url = `${environment.api}/cliente?urldata=${text}`;
        return this.http.get(url).map(this.obtenerJson).catch(this.controlarError.bind(this));    
      }
    else {
      this.route.queryParams.subscribe(params => 
        {
          const query = encodeURIComponent(params['data']);
          if (this.persistence.get('queryString') == undefined) {
            this.persistence.set('queryString', query);
          }
        })
    }

  }

  public getTrackingData(text: string): Observable<Tracking[]> {
    text=this.persistence.get('queryString');
    const url = `${environment.api}/tracking_a2?urldata=${text}`;
    return this.http.get(url).map(this.obtenerJson).catch(this.controlarError.bind(this));
  };

   public getOrderDetailData(text: string): Observable<OrderDetail[]> {
    text=this.persistence.get('queryString');
    const url = `${environment.api}/pedido?urldata=${text}`;
    return this.http.get(url).map(this.obtenerJson).catch(this.controlarError.bind(this));
  }; 

  public getOrderDetailData_a2(text: string): Observable<OrderDetail[]> {
    text=this.persistence.get('queryString');
    const url = `${environment.api}/pedido_A2?urldata=${text}`;
    return this.http.get(url).map(this.obtenerJson).catch(this.controlarError.bind(this));
  }; 

public getDocument(text: string): Observable<any[]> {
  text=this.persistence.get('queryString');
  const url = `${environment.api}/documentacion?urldata=${text}`;
  return this.http.get(url).map(this.obtenerJson).catch(this.controlarError.bind(this));
}; 

  // authentication Jazztel
   public authenticateJazztel(text: string, nif: string, cp: string): Observable<number> {
      text=this.persistence.get('queryString');
      const url = `${environment.api}/authentication?urldata=${text}`+`&`+`nif=${nif}`+`&`+`cp=${cp}`;
      return this.http.get(url).map(this.obtenerJson).catch(this.controlarError.bind(this));
   }

  // plataforma 
  public getPlataforma(peticion: string, transportista: string, cp: number): Observable<PlataForma> {
    // const url = `${environment.api}/plataforma_a2?transportista=`+`${transportista}`+`&`+`peticion=${peticion}`+`&`+`cp=${cp}&inv=0`;
    const url = `${environment.api}/plataforma_a2/`+`${transportista}`+`/`+`${peticion}`+`/`+`${cp}/0`;
    return this.http.get(url).map(this.obtenerJson).catch(this.controlarError.bind(this));
 }

  // get SCL
    public getSCL(text: string): Observable<number> {
    text=this.persistence.get('queryString');
    const url = `${environment.api}/authentication?urldata=${text}`;
    return this.http.get(url).map(this.obtenerJson).catch(this.controlarError.bind(this));
   }

  // comprobante
  public getComprobante(text: string): Observable<Image> {
    text=this.persistence.get('queryString');
    const url = `${environment.api}/comprobante?urldata=${text}`;
    return this.http.get(url).map(this.obtenerJson).catch(this.controlarError.bind(this));
   }

  // email
  public getEmail(text: string): Observable<Email> {
    const url = `${environment.api}/getmail?urldata=${text}`;
    return this.http.get(url).map(this.obtenerJson).catch(this.controlarError.bind(this));
  }

  public getEmailP(text: string): Promise<Email> {
    const url = `${environment.api}/getmail?urldata=${text}`;
    let promise = new Promise((resolve, reject) => {
      this.http.get(url).map(this.obtenerJson).toPromise().then(
        res => {
          resolve(res);
          return res;
        },
        msg => {
          reject(msg);
        }
      ).catch(dError => {
      });
    });
    return undefined;
  }


  public obtenerJson(res: Response) {
    const respuestaJson = res.json();
    if (respuestaJson.IsError) {
      return Observable.throw("");;
    }
    return respuestaJson.data || {};
  };

  private controlarError(error: Response | any) {
    let errMsg: string; 
    if (error instanceof Response) {
      const body = JSON.parse(JSON.stringify(error)) || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    //console.error(errMsg);
    return Promise.reject(errMsg);
  };
}
