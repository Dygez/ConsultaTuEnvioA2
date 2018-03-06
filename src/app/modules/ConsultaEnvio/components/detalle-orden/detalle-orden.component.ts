import { Component, OnInit } from '@angular/core';
import { ConsultaEnvioService } from '../../services/consulta-envio.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ConexionsService } from 'app/modules/ConsultaEnvio/services/conexions.service';
import { OrderBP } from 'app/modules/ConsultaEnvio/model/orderBP';
import { MainComponent } from 'app/modules/ConsultaEnvio/components/main/main.component';
import { OrderDetail } from 'app/modules/ConsultaEnvio/model/orderDetail';
import { PersistenceService } from 'angular-persistence/src/services/persistence.service';

@Component({
  selector: 'app-detalle-orden',
  templateUrl: './detalle-orden.component.html'
})
export class DetalleOrdenComponent implements OnInit {

  public orderBP: OrderBP = new OrderBP;
  loaded: boolean = false;

  constructor(private _ce: ConsultaEnvioService, private router: Router, private conexion: ConexionsService, private route: ActivatedRoute, private main: MainComponent, private persistence: PersistenceService) {  
  };


  ngOnInit() {
  }

  ngDoCheck() {
    if (this.loaded == false && this.main.loaded == false && this._ce.providerSCL == "BP") {
      this.loadData()
    }
  }

  loadData() {
    this.route.queryParams.subscribe(params => {
        if(params !== undefined && this.route !== undefined) {
          if (this._ce.showClient == true && this._ce.showClient !== undefined) {
            const query = encodeURIComponent(params['data']);
            this.conexion.getOrderDataBP(this.persistence.get('queryString')).subscribe((order: OrderBP) =>{
              this.orderBP.ORDEN = order.ORDEN
              this.orderBP.MAIL = order.MAIL
              this.orderBP.ESTATUS_PETICION = order.ESTATUS_PETICION;
              this.orderBP.FECHA_ORDEN = order.FECHA_ORDEN;
              this.orderBP.DIVISION = order.DIVISION;
              this.orderBP.IMPORTO_CONTRAREEMBOLSO = order.IMPORTO_CONTRAREEMBOLSO;
              this.orderBP.TRANSPORTISTA = "--"
            },
          error => {
            this._ce.isError = true;
          },
        () => {
          this._ce.isError = false
        }).unsubscribe;
            }
        this._ce.isError = false;
          }
      })
    }
}
