import { Component, OnInit, Input } from '@angular/core';
import { ConsultaEnvioService } from '../../services/consulta-envio.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Order } from '../../model/order';
import { OrderJazztel } from 'app/modules/ConsultaEnvio/model/orderJazzTel';
import { OrderBP } from 'app/modules/ConsultaEnvio/model/orderBP';
import { ConexionsService } from 'app/modules/ConsultaEnvio/services/conexions.service';
import { debug } from 'util';
import { MainComponent } from 'app/modules/ConsultaEnvio/components/main/main.component';
import { OrderOrange } from 'app/modules/ConsultaEnvio/model/orderOrange';
import { PlataForma } from 'app/modules/ConsultaEnvio/model/plataforma';
import { HeaderComponent } from 'app/modules/ConsultaEnvio/components/header/header.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { PersistenceService } from 'angular-persistence';
import { DepotComponent } from '../depot/depot.component';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  animations: [
    trigger('fadeInAnimation', [
      // route 'enter' transition
        state('true', style({ opacity: 1 })),
        state('false', style({ opacity: 0 })),
        transition('false <=> true', animate(1000))
      ])
    ]
})
export class DetallePedidoComponent implements OnInit {
  @Input() colorFondo: String;

  loaded: boolean = false;
  transportista: string = "";
  codigo_postal: number = 0;
  peticion: string = "";
  plataformaVisible: boolean = false;
  hide: string = 'hidden';
  glyph: string = 'glyphicon glyphicon-plus';
  timer: any;

  public order: Order = new Order;
  public orderJZ: OrderJazztel = new OrderJazztel;
  public orderOR: OrderOrange = new OrderOrange;
  public orderBP: OrderBP = new OrderBP;

  public plataforma: PlataForma = new PlataForma;

  constructor(public _ce: ConsultaEnvioService, private router: Router, private conexion: ConexionsService, private route: ActivatedRoute, public main: MainComponent, private header: HeaderComponent,
    public persistence: PersistenceService, public depot: DepotComponent ) {  };

  ngOnInit() { 

    this.timer = Observable.interval(1000).subscribe( z => {
      if (this.loaded == true && this.main.loaded == true && this._ce.providerSCL !== "NC") {
        this.stopTimer();
      }
      if (this.loaded == false && this.main.loaded == true && this._ce.providerSCL !== "NC") {
        this.loadData();
        this.loadPlataforma();
      }
      this.colorFondo = this.header.COLOR_WEB;      
    })
   }

   stopTimer() {
      this.timer.unsubscribe();
      this.timer = closed;
   }


  changeGlyph() {
      if (this.glyph == 'glyphicon glyphicon-plus') {
        this.glyph = 'glyphicon glyphicon-minus';
      }
      else
      {
        this.glyph = 'glyphicon glyphicon-plus';
      }
      return this.glyph;

  }

  loadData() {
    switch (this._ce.providerSCL) {
     
      case "JAZZTEL": 
        this.route.queryParams.subscribe(params => {
            if(params !== undefined && this.route !== undefined && this._ce.isError !== true) {
              const query = encodeURIComponent(params['data']);
              this.conexion.getOrderDataJazztel(query).subscribe((orderJz: OrderJazztel) => {
                this.orderJZ.ALBARAN = orderJz.ALBARAN;
                this.orderJZ.CODIGO_POSTAL = orderJz.CODIGO_POSTAL;
                this.orderJZ.DIVISION = orderJz.DIVISION;
                this.orderJZ.ESTATUS_PETICION = orderJz.ESTATUS_PETICION;
                this.orderJZ.FECHA_ORDEN = orderJz.FECHA_ORDEN;
                this.orderJZ.FECHA_SALIDA = orderJz.FECHA_SALIDA;
                this.orderJZ.NUMERO_EXPEDICION = orderJz.NUMERO_EXPEDICION;
                this.orderJZ.PEDIDO_CLIENTE = orderJz.PEDIDO_CLIENTE;
                this.orderJZ.TRANSPORTISTA = orderJz.TRANSPORTISTA;
                this.orderJZ.DESCRIPCION_ESTADO = orderJz.DESCRIPCION_ESTADO;
                this.orderJZ.TIPO_ENVIO = orderJz.TIPO_ENVIO;
                this.orderJZ.DES_TIPO_ENVIO = orderJz.DES_TIPO_ENVIO;
                this.orderJZ.ALBARAN_VENTA = orderJz.ALBARAN_VENTA;
                this.orderJZ.PETICION = orderJz.PETICION;
                this.orderJZ.DIAS_FACTURACION = orderJz.DIAS_FACTURACION
                
                if (this.order.TRANSPORTISTA !== null && this.transportista == "") {
                  this.transportista = orderJz.TRANSPORTISTA;
                  this.persistence.set('transportista', orderJz.TRANSPORTISTA);
                }
                if (this.order.CODIGO_POSTAL !== undefined && this.codigo_postal == 0) {
                    this.codigo_postal = orderJz.CODIGO_POSTAL;
                    this.persistence.set('codigo_postal', orderJz.CODIGO_POSTAL);
                }
                if (this.order.PETICION !== undefined && this.peticion == "") {
                    this.peticion = orderJz.PETICION;
                    this.persistence.set('peticion', orderJz.PETICION)
                }
                })
              this.order = this.orderJZ;
              this.transportista = this.order.TRANSPORTISTA;
              this.persistence.set('transportista', this.order.TRANSPORTISTA);
              this.loaded = true;
            }
          });
          break;      
      case "ORANGE": 
        this.route.queryParams.subscribe(params => {
          if(params !== undefined && this.route !== undefined && this._ce.isError !== true) {
            const query = encodeURIComponent(params['data']);
            this.conexion.getOrderDataOrange(query).subscribe((orderOr: OrderOrange ) => {  
              this.orderOR.ALBARAN = orderOr.ALBARAN;
              this.orderOR.ALBARAN_VENTA = orderOr.ALBARAN_VENTA;
              this.orderOR.CODIGO_POSTAL = orderOr.CODIGO_POSTAL;
              this.orderOR.DES_TIPO_ENVIO = orderOr.DES_TIPO_ENVIO;
              this.orderOR.DESCRIPCION_ESTADO = orderOr.DESCRIPCION_ESTADO;
              this.orderOR.DIRECCION_ENTREGA = orderOr.DIRECCION_ENTREGA;
              this.orderOR.DIVISION = orderOr.DIVISION;
              this.orderOR.ESTATUS_PETICION = orderOr.ESTATUS_PETICION;
              this.orderOR.FECHA_ORDEN = orderOr.FECHA_ORDEN;
              this.orderOR.FECHA_SALIDA = orderOr.FECHA_SALIDA;
              this.orderOR.NUMERO_DOCUMENTO = orderOr.NUMERO_DOCUMENTO;
              this.orderOR.NUMERO_EXPEDICION = orderOr.NUMERO_EXPEDICION;
              this.orderOR.PEDIDO_CLIENTE = orderOr.PEDIDO_CLIENTE;
              this.orderOR.PETICION = orderOr.PETICION;
              this.orderOR.POBLACION = orderOr.POBLACION;
              this.orderOR.PROVINCIA = orderOr.PROVINCIA;
              this.orderOR.TELEFONO = orderOr.TELEFONO;
              this.orderOR.TIPO_ENVIO = orderOr.TIPO_ENVIO;
              this.orderOR.TRANSPORTISTA = orderOr.TRANSPORTISTA;
              this.orderOR.DIAS_FACTURACION = orderOr.DIAS_FACTURACION;
            })
            this.order = this.orderOR;
            this.loaded = true;
          }
        });
        break;
      case "DEFAULT": 
        this.route.queryParams.subscribe(params => {
          if(params !== undefined && this.route !== undefined && this._ce.isError == false) {
            const query = encodeURIComponent(params['data']);
            this.conexion.getOrderData(query).subscribe((order: Order) =>{
            this.order.ALBARAN = order.ALBARAN;
            this.order.CODIGO_POSTAL = order.CODIGO_POSTAL;
            this.order.DIVISION = order.DIVISION;
            this.order.ESTATUS_PETICION = order.ESTATUS_PETICION;
            this.order.FECHA_ORDEN = order.FECHA_ORDEN;
            this.order.FECHA_SALIDA = order.FECHA_SALIDA;
            this.order.NUMERO_EXPEDICION = order.NUMERO_EXPEDICION;
            this.order.PEDIDO_CLIENTE = order.PEDIDO_CLIENTE;
            this.order.TRANSPORTISTA = order.TRANSPORTISTA;
            this.order.DESCRIPCION_ESTADO = order.DESCRIPCION_ESTADO;
            this.order.TIPO_ENVIO = order.TIPO_ENVIO;
            this.order.DES_TIPO_ENVIO = order.DES_TIPO_ENVIO;
            this.order.ALBARAN_VENTA = order.ALBARAN_VENTA;
            this.order.PETICION = order.PETICION;
            this.order.DIAS_FACTURACION = order.DIAS_FACTURACION;
            this.order.IMPORTO_CONTRAREEMBOLSO = order.IMPORTO_CONTRAREEMBOLSO;
            this.order.SCL = order.SCL;

            if (this.order.SCL !== null ){
              this.main.sclSCL = this.order.SCL
            }

            if (this.order.TRANSPORTISTA !== null && this.transportista == "") {
                this.transportista = order.TRANSPORTISTA;
                this.persistence.set('transportista', order.TRANSPORTISTA);
              }
            if (this.order.CODIGO_POSTAL !== undefined && this.codigo_postal == 0) {
                this.codigo_postal = order.CODIGO_POSTAL;
                this.persistence.set('codigo_postal', order.CODIGO_POSTAL);
            }
            if (this.order.PETICION !== undefined && this.peticion == "") {
                this.peticion = order.PETICION;
                this.persistence.set('peticion', order.PETICION);
                this.main.PeticionSCL = this.peticion;
            }
              });
            }
          });
          break;
        case "BP":
              this.route.queryParams.subscribe(params => {
                if(this.persistence.get('queryString') !== undefined && this.route !== undefined) {
                      this.conexion.getOrderDataBP(this.persistence.get('queryString')).subscribe((order: OrderBP) =>{
                        this.orderBP.ORDEN = order.ORDEN
                        this.orderBP.MAIL = order.MAIL
                        this.orderBP.ESTATUS_PETICION = order.ESTATUS_PETICION;
                        this.orderBP.FECHA_ORDEN = order.FECHA_ORDEN;
                        this.orderBP.DIVISION = order.DIVISION;
                        this.orderBP.IMPORTO_CONTRAREEMBOLSO = order.IMPORTO_CONTRAREEMBOLSO;
                        this.orderBP.TRANSPORTISTA = "--"
                        this._ce.showClient = true;
                        this.loaded = true;
                      },
                    isError => {
                      this.stopTimer();
                      this._ce.isError = true;
                    },
                  () => {
                    this.loaded = true;
                    this._ce.isError = false
                  }).unsubscribe();
                  this._ce.isError = true;
                    }
                })
            break;

            case "BP_PETICION":
            this.route.queryParams.subscribe(params => {
              if(params !== undefined && this.route !== undefined && this._ce.isError == false) {
                const query = encodeURIComponent(params['data']);
                this.conexion.getOrderDataBP(query).subscribe((order: Order) =>{
                this.order.ALBARAN = order.ALBARAN;
                this.order.CODIGO_POSTAL = order.CODIGO_POSTAL;
                this.order.DIVISION = order.DIVISION;
                this.order.ESTATUS_PETICION = order.ESTATUS_PETICION;
                this.order.FECHA_ORDEN = order.FECHA_ORDEN;
                this.order.FECHA_SALIDA = order.FECHA_SALIDA;
                this.order.NUMERO_EXPEDICION = order.NUMERO_EXPEDICION;
                this.order.PEDIDO_CLIENTE = order.PEDIDO_CLIENTE;
                this.order.TRANSPORTISTA = order.TRANSPORTISTA;
                this.order.DESCRIPCION_ESTADO = order.DESCRIPCION_ESTADO;
                this.order.TIPO_ENVIO = order.TIPO_ENVIO;
                this.order.DES_TIPO_ENVIO = order.DES_TIPO_ENVIO;
                this.order.ALBARAN_VENTA = order.ALBARAN_VENTA;
                this.order.PETICION = order.PETICION;
                this.order.DIAS_FACTURACION = order.DIAS_FACTURACION;
                this.order.IMPORTO_CONTRAREEMBOLSO = order.IMPORTO_CONTRAREEMBOLSO;
                this.order.SCL = order.SCL;

                this._ce.showClient = true;
                this.loaded = true;

                if (this.order.TRANSPORTISTA !== null && this.transportista == "") {
                    this.transportista = order.TRANSPORTISTA;
                    this.persistence.set('transportista', order.TRANSPORTISTA);
                  }
                if (this.order.CODIGO_POSTAL !== undefined && this.codigo_postal == 0) {
                    this.codigo_postal = order.CODIGO_POSTAL;
                    this.persistence.set('codigo_postal', order.CODIGO_POSTAL);
                }
                if (this.order.PETICION !== undefined && this.peticion == "") {
                    this.peticion = order.PETICION;
                    this.persistence.set('peticion', order.PETICION);
                    this.main.PeticionSCL = this.peticion;
                }
                  });
                }
              });
          default:
            break;
      }
  }

  loadPlataforma () {
    if (this.transportista !== "" && this.codigo_postal !== 0 && this.peticion !== ""){
      this.route.queryParams.subscribe(params => {
        if(params !== undefined && this.route !== undefined && this._ce.isError !== true) {
          const query = encodeURIComponent(params['data']);
          this.conexion.getPlataforma(this.peticion, this.transportista, this.codigo_postal).subscribe((plataForma: PlataForma) => {
              this.plataforma.ID = plataForma.ID;
              this.plataforma.TRANSPORTISTA = plataForma.TRANSPORTISTA;
              this.plataforma.CODIGO_OFICINA = plataForma.CODIGO_OFICINA;
              this.plataforma.NOMBRE_OFICINA = plataForma.NOMBRE_OFICINA;
              this.plataforma.DIRECCION_OFICINA = plataForma.DIRECCION_OFICINA;
              this.plataforma.POBLACION_OFICINA = plataForma.POBLACION_OFICINA;
              this.plataforma.CP_OFICINA = plataForma.CP_OFICINA;
              this.plataforma.PROVINCIA = plataForma.PROVINCIA;
              this.plataforma.TELEFONO = plataForma.TELEFONO;
              this.plataforma.EMAIL = plataForma.EMAIL;
              this.plataforma.HORARIO= plataForma.HORARIO;
              this.plataforma.FAX = plataForma.FAX;
              this.plataforma.OBSERVACIONES = plataForma.OBSERVACIONES;
              this.plataforma.PLAZA = plataForma.PLAZA;
              this.plataforma.NUMERO_ENVIO_CORREOS = plataForma.NUMERO_ENVIO_CORREOS
          }, 
          error => {
            this.plataformaVisible = false;
          },
          () => {
            if (this.plataforma.ID !== undefined) {this.plataformaVisible=true;}
          }
        )
        }})
        if (this.plataforma.ID !== undefined) {this.plataformaVisible=true;} else {this.plataformaVisible=false}
        this.loaded=true;
    }
  }

  getQueryString(){
     let url_string = window.location.href;
     let url = new URL(url_string);
     return url.searchParams.get("data");
   
  };

  navigateTo() {
    this.router.navigate(['seguridad-list'])
  }

  hideShow() {
    if (this.hide == 'hidden') {
      this.hide = 'visible';
    }
    else
    {
      this.hide = 'hidden';
    }
    return this.hide;
  }


}
