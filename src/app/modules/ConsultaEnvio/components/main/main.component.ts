import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConsultaEnvioService } from '../../services/consulta-envio.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Order } from '../../model/order';
import { Person } from 'app/modules/ConsultaEnvio/model/person';
import { ConexionsService } from 'app/modules/ConsultaEnvio/services/conexions.service';
import { Observable } from 'rxjs/Observable';
import { PaginationComponent } from '../pagination/pagination.component'
import { OrderJazztel } from 'app/modules/ConsultaEnvio/model/orderJazzTel';
import { OrderOrange } from 'app/modules/ConsultaEnvio/model/orderOrange';
import { OrderBP } from 'app/modules/ConsultaEnvio/model/orderBP';
import { error } from 'selenium-webdriver';
import { AuthenticationComponent } from 'app/modules/ConsultaEnvio/components/authentication/authentication.component';
import { PersistenceModule } from 'angular-persistence';
import { PersistenceService } from 'angular-persistence/src/services/persistence.service';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html'
})

export class MainComponent implements OnInit, OnDestroy {

  public SCL: string = "NC"; // NC as in Not Communicated. The program still doesn't know which SCL is coming
  public loaded: boolean = false;
  public bcheckSCL: boolean = false;
  public x: string;
  //public authenticated: boolean = false;
  private interval: any;
  test: any;
  status: number = 0;
  counter: number = 0;
  invoiceData: number;
  

  constructor(public _ce: ConsultaEnvioService, private router: Router, private conexion: ConexionsService, private route: ActivatedRoute, private persistence: PersistenceService) {

    this.interval = Observable.interval(20 * 60).subscribe( x => {
      if (this.bcheckSCL == false && this.loaded == false) {
        if (this._ce.providerSCL == "") 
        {
          this.checkSCL();
        }
        this.checkStatus();
      }
      else {
        this.stopSubs();
      };
    });
   }

  ngOnInit() {
    this.getQueryString();
  }


  private getQueryString() {
    this.route.queryParams.subscribe(params => {
        const query = encodeURIComponent(params['data']);
        if (this.persistence.get('queryString') == undefined) {this.persistence.set('queryString', query);}
    });
};

  stopSubs() {
  if (this.bcheckSCL == true && this.loaded == true) {
    this.interval.unsubscribe;
    this.interval.closed == true;
  }  
}

   ngOnDestroy() {   }

  checkStatus() {
    // Company policy: if the order is 15 days older (FECHA_CONTABILIZACION mark the "end") AND its status is > 5  (ESTATUS_PETICION)
    this.route.queryParams.subscribe(params => {
      if((params !== undefined || this.persistence.get('queryString') !== undefined) && this.route !== undefined) {
        const query = encodeURIComponent(params['data']);
        if (this._ce.providerSCL !== "NC") {
          switch(this._ce.providerSCL) {
            case "JAZZTEL":
            if (this._ce.authenticated==false) {
              this.conexion.getOrderDataJazztel(this.persistence.get('queryString')).subscribe((order: OrderJazztel) => {
                this.invoiceData = order.DIAS_FACTURACION
                this.status = order.ESTATUS_PETICION;
                this.validateOrder();

                this.stopSubs();
                if (this._ce.authenticated == false) {
                  this.router.navigate(['authentication'], { queryParams: {data: this.persistence.get('queryString')} });
                }
              },
              error => {
              })
            }
            else
            {
              this.conexion.getOrderDataJazztel(this.persistence.get('queryString')).subscribe((order: OrderJazztel) => {
                this.invoiceData = order.DIAS_FACTURACION
                this.status = order.ESTATUS_PETICION;
                this.validateOrder();})
            }
              break;              
            case "ORANGE":
              this.conexion.getOrderDataOrange(query).subscribe((order: OrderOrange) => {
                this.invoiceData = order.DIAS_FACTURACION;
                this.status = order.ESTATUS_PETICION;
                this._ce.authenticated = true;
                this.validateOrder();
              })
              break;
            case "BP":
              this.conexion.getOrderDataBP(query).subscribe((order: OrderBP) => {
                this._ce.authenticated = true;
                this.validateOrder();
              })
              break;
            case "DEFAULT":
            try {
              this.conexion.getOrderData(query).subscribe((order: Order) => {
                this.invoiceData = order.DIAS_FACTURACION;
                this.status = order.ESTATUS_PETICION;
                this._ce.authenticated = true;
                this.validateOrder();
              })
              break;              
            } 
            catch (error) {
              break;
            }
            default:
              if (this.counter < 5) {
                this.checkSCL();
                //this.counter += 1;
              }
              else {
                this._ce.providerSCL = "DEFAULT";
                this._ce.authenticated = true;
                this.validateOrder();
              }
              break;
          }
        }
       }
    })
  }

  // this function look into status and data 
  validateOrder() {
    if((this.status > 5 && this.invoiceData !== null)) {
      if(this.status > 7 || this.invoiceData > 15) {
        this._ce.showClient=false
        this.bcheckSCL=true;
        this.loaded = true;
      }
      else {
        this._ce.showClient=true
        this.bcheckSCL=true;
        this.loaded = true;
      } 
    }
    else {
    this._ce.showClient=true
    this.bcheckSCL=true;
    this.loaded = true;
    }
  }

  ShowLoading(): boolean {
    return (this.SCL === 'NC' && !this._ce.authenticated);
  }

  getSCL(): boolean {
    // qui devi prendere il secondo parametro della queryString e 
    //console.log(this.persistence.get('orden'))
    if (this.persistence.get('BP') == undefined || this.persistence.get('BP') == '') 
      {
        return false;
      } 
    else 
      {
        return true;
      }
      
  }

  // this decide the web method to call
  checkSCL() {
    this.route.queryParams.subscribe(params => {
      if(params !== undefined  && this.route !== undefined) {
        if (this.persistence.get('detalleOrden') == undefined ) {
           this.persistence.set('detalleOrden', '');
           } 
         else {
           this.persistence.set('orden', decodeURIComponent(params['scl']));
           }
        // console.log(decodeURIComponent(params['scl']));

        const query = encodeURIComponent(params['data']);
        if (this._ce.authenticated == false && this._ce.bQuery == false && this.persistence.get('queryString') != undefined ) 
          {
            this._ce.bQuery=true;
          }
          try {
            this.conexion.getClienteData(this.persistence.get('queryString')).subscribe((scl: Person) =>{
              this._ce.providerSCL = scl.DES_SCL
                switch (this._ce.providerSCL) {
                  case "JAZZTEL": {
                    this._ce.providerSCL = "JAZZTEL";
                    this.SCL = "JAZZTEL";
                    break;
                  }
                  case "ESHOP.RESIDENCIAL": 
                  case "TELEVENTA.EMPRESA":
                  case "TELEVENTA.RESIDENCIAL":
                  case "FIDELIZACION.EMPRESA":
                  case "FIDELIZACION.RESIDENCIAL":
                  case "amena":
                  {
                    this._ce.providerSCL = "ORANGE";
                    this.SCL = "ORANGE";
                    break;
                  }
                  case "5":
                  case "17":
                  case "15": {
                    this._ce.providerSCL = "BP";
                    this.SCL = "BP";
                    this.persistence.set("BP", true);
                    break;
                  }
                  default: {
                    this._ce.providerSCL = "DEFAULT";
                    this.SCL = "DEFAULT";
                    break;
                  }
                }
              })
          } catch (error) {
          }


        }
      })
  }

}

