import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ConsultaEnvioService } from '../../services/consulta-envio.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Order } from '../../model/order';
import { Person } from 'app/modules/ConsultaEnvio/model/person';
import { ConexionsService } from 'app/modules/ConsultaEnvio/services/conexions.service';
import { Observable } from 'rxjs/Observable';
import { OrderJazztel } from 'app/modules/ConsultaEnvio/model/orderJazzTel';
import { OrderOrange } from 'app/modules/ConsultaEnvio/model/orderOrange';
import { OrderBP } from 'app/modules/ConsultaEnvio/model/orderBP';
import { error } from 'selenium-webdriver';
import { AuthenticationComponent } from 'app/modules/ConsultaEnvio/components/authentication/authentication.component';
import { PersistenceModule } from 'angular-persistence';
import { PersistenceService } from 'angular-persistence/src/services/persistence.service';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { tryParse } from 'selenium-webdriver/http';
import { Logo } from 'app/modules/ConsultaEnvio/model/logo';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { SCL } from 'app/modules/ConsultaEnvio/model/scl';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  animations: [
    trigger('fadeInAnimation', [
      // route 'enter' transition
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({ opacity: 1}))
      ])
    ]),
    trigger('fadeInAnimationXS', [
      // route 'enter' transition
      state('true', style({ opacity: 1 })),
      state('false', style({ opacity: 0 })),
      transition('false <=> true', animate(1000))
    ])
],
})

export class MainComponent implements OnInit, OnDestroy {

  public SCL: string = "NC"; // This contains the DES_SCL
  public sclSCL: number; // This contains the ID of SCL
  public loaded: boolean = false; //
  public bcheckSCL: boolean = false;
  public colorWeb: String;
  public PeticionSCL: string;
  
  public Logo: String;
  public modalOpt: number;
  public bShowPastTime: boolean = false;
  public visibleOrderList: boolean = false;
  
  private interval: any;
  private logoTimer: any;


  bLogoSCL: Boolean;
  test: any;
  status: number = 0;
  counter: number = 0;
  invoiceData: number; 
  mayorista: boolean;
  
  flags: {
    id: number;
    nt: string;
    flag: string
  } [] = [];


  constructor(public _ce: ConsultaEnvioService, private router: Router, private conexion: ConexionsService, private route: ActivatedRoute, private persistence: PersistenceService) {
   }

  ngOnInit() {  

    this.flags.push({id: 0, nt: 'es', flag:'/WebConsultasEnvioA2/Imagenes/es.png'});
    this.flags.push({id: 1, nt: 'en', flag:'/WebConsultasEnvioA2/Imagenes/en.png'});
    this.flags.push({id: 2, nt: 'pt', flag:'/WebConsultasEnvioA2/Imagenes/pt.png'});
    this.flags.push({id: 3, nt: 'it', flag:'/WebConsultasEnvioA2/Imagenes/it.png'});

    this.interval = Observable.interval(20 * 60).subscribe( x => {
      if (this.bcheckSCL == false && this.loaded == false) {
        debugger;
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
      this.interval.closed = true;
      }  
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  ngOnDestroy() {   }

  checkStatus() {
    this.route.queryParams.subscribe(params => {
      if((params !== undefined || this.persistence.get('queryString') !== undefined) && this.route !== undefined) {
        const query = encodeURIComponent(params['data']);
        if (this._ce.providerSCL !== "NC") {
          if (this.conexion.isTicketJazztel){this._ce.authenticated=true;}
          switch(this._ce.providerSCL) {
            case "JAZZTEL":
            if (this._ce.authenticated==false) {
              this.conexion.getOrderDataJazztel(this.persistence.get('queryString')).subscribe((order: OrderJazztel) => {
                this.invoiceData = order.DIAS_FACTURACION
                this.status = order.ESTATUS_PETICION;
                this.Logo = 'http://intranet.icp.es/img_icp/ec/jazztel_100.png'
                this.colorWeb = '#707d9a';
                //this.sclSCL = 999;
                this.validateOrder();
                this.stopSubs();
                this._ce.showClient = true;
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
                this.Logo = 'http://intranet.icp.es/img_icp/ec/jazztel_100.png'
                this.colorWeb = '#707d9a';
                //this.sclSCL = 999;
                debugger;
                if (this.conexion.isTicketJazztel){this._ce.showClient = true;}
                this.validateOrder();})
            }
              break;              
            case "ORANGE":
              this.conexion.getOrderDataOrange(query).subscribe((order: OrderOrange) => {
                debugger;
                this.invoiceData = order.DIAS_FACTURACION;
                this.status = order.ESTATUS_PETICION;
                this._ce.authenticated = true;
                this.Logo = 'http://intranet.icp.es/img_icp/ec/orange_100.png'
                this.colorWeb = '#707d9a';
                this._ce.showClient = true;
                //this.sclSCL = 999;
                this.visibleOrderList = true;
                this.validateOrder();
              })
              break;
            case "BP":
              try  {
                this.conexion.getOrderDataBP(query).subscribe((order: OrderBP) => {
                  if (order !== null) {
                    if (order.PETICION !== null) 
                      {
                        this.status = order.ESTATUS_PETICION;
                        this.invoiceData = order.DIAS_FACTURACION;
                        this.sclSCL = order.SCL;
                        this._ce.authenticated = true;
                        this._ce.providerSCL = "BP_PETICION";
                      };
                  } else {
                    this._ce.authenticated = true;
                    this._ce.showClient = true;
                    if (this.mayorista == false) {
                      this.validateOrder();
                    }
                    else {
                      this.bcheckSCL=true;
                      this.loaded = true;
                    }
                  }
                });
                this._ce.authenticated = true;
                if (this.mayorista == false) {
                  this.validateOrder();
                }
                else {
                  this.bcheckSCL=true;
                  this.loaded = true;
                }
                break;
              }
              catch {
                this.conexion.getOrderData(query).subscribe((order: Order) => {
                  this.invoiceData = order.DIAS_FACTURACION;
                  this.status = order.ESTATUS_PETICION;
                  this.sclSCL = order.SCL;
                  this._ce.authenticated = true;
                  if (this.mayorista == false) {
                    this.validateOrder();
                  }
                  else {
                    this.bcheckSCL=true;
                    this.loaded = true;
                  }
                })
              }
              break;
            case "DEFAULT":
            try {
              this.conexion.getOrderDataBP(query).subscribe((order: OrderBP) => {
                debugger;
                if (order !== null) {
                  if (order.PETICION !== null) 
                    {
                      this.status = order.ESTATUS_PETICION;
                      this.invoiceData = order.DIAS_FACTURACION;                        
                      this.sclSCL = order.SCL;
                      this._ce.authenticated = true;
                      this._ce.providerSCL = "BP_PETICION";
                      if (this.mayorista == false) {
                        this.validateOrder();
                      }
                      else {
                        this.bcheckSCL=true;
                        this.loaded = true;
                      }
                    }
                }
                else
                {
                  this.conexion.getOrderData(query).subscribe((order: Order) => {
                    debugger;
                    this.invoiceData = order.DIAS_FACTURACION;
                    this.status = order.ESTATUS_PETICION;
                    this.sclSCL = order.SCL;
                    this._ce.authenticated = true;
                    if (this.mayorista == false) {
                      this.validateOrder();
                    }
                    else {
                      this.bcheckSCL=true;
                      this.loaded = true;
                    }
                  })
                }
              });
            debugger;
            if (this.invoiceData == undefined)
            {
              this.conexion.getOrderData(query).subscribe((order: Order) => {
                debugger;
                this.invoiceData = order.DIAS_FACTURACION;
                this.status = order.ESTATUS_PETICION;
                this.sclSCL = order.SCL;
                this._ce.authenticated = true;
                if (this.mayorista == false || (this.invoiceData !== undefined && this.status !== undefined)) {
                  this.validateOrder();
                }
                else {
                  this.bcheckSCL=true;
                  this.loaded = true;
                }
              });
            }
            break;
            } 
            catch (error) {
              break;
            }
            default:
              if (this.counter < 5) {
                this.counter += 1;
                this.checkSCL();
              }
              else {
                debugger;
                this._ce.providerSCL = "DEFAULT";
                this._ce.authenticated = true;
                if (this.mayorista == false) {
                  this.validateOrder();
                }
                else {
                  this.bcheckSCL=true;
                  this.loaded = true;
                }
              }
              break;
          }
        }
       }
    })
  }

  // this function look into status and data 
  validateOrder() {
    // SELECT * FROM DSERVER7.BP.dbo.SCLS WHERE MAYORISTA_ORANGE = 1 
    if (this.sclSCL == 10 || this.sclSCL == 11 || this.sclSCL == 12 || this.sclSCL == 17) {
      this.bShowPastTime = false;
      this.bcheckSCL=true;
      this.loaded = true;         
    }
    else {
      // case ORANGE & JAZZTEL
      if (this.sclSCL = 999) {
        this.bcheckSCL=true;
        this.loaded = true;       
      }

      if(this.sclSCL !== undefined) {
        if((this.status > 5 && this.invoiceData !== null)) {
          if(this.status > 7 || this.invoiceData > 15) {
            this.bShowPastTime = true;
            //this._ce.showClient = false;
            this.bcheckSCL=true;
            this.loaded = true;
          }
          else {
            this.bcheckSCL=true;
            this.loaded = true;
          } 
        }
        else {
        this.bcheckSCL=true;
        this.loaded = true;
        }
      }
    }
  }

  getSCL(): boolean {
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

        const query = encodeURIComponent(params['data']);
        if (this._ce.authenticated == false && this._ce.bQuery == false && this.persistence.get('queryString') != undefined ) 
          {
            this._ce.bQuery=true;
          }
          try {

            //get SCL
            this.conexion.getSCL(this.persistence.get('queryString')).subscribe((scl: SCL) =>{
              debugger;
              if (scl !== null) {
                this.sclSCL = scl.SCL;
                this.mayorista = scl.MAYORISTA;
                debugger;            
              }
            }, error => {
              this.sclSCL = 999;
            })

            this.conexion.getClienteData(this.persistence.get('queryString')).subscribe((scl: Person) =>{
              debugger;
              if (scl !== null)
              {
                this._ce.providerSCL = scl.DES_SCL;
              }
              else {
                this._ce.providerSCL = "5"
              }
                switch (this._ce.providerSCL) {
                  case "JAZZTEL": {
                    this._ce.providerSCL = "JAZZTEL";
                    this.SCL = "JAZZTEL";
                    break;
                  }
                  case "ESHOP.RESIDENCIAL": 
                  case "ESHOP.EMPRESA":
                  case "TELEVENTA.EMPRESA":
                  case "TELEVENTA.RESIDENCIAL":
                  case "FIDELIZACION.EMPRESA":
                  case "FIDELIZACION.RESIDENCIAL":
                  case "amena":
                  {
                    this._ce.providerSCL = "ORANGE";
                    this.SCL = "ORANGE";
                    this.colorWeb = "#707d9a";
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

