import { Component, OnInit, DoCheck } from '@angular/core';
import { ConsultaEnvioService } from '../../services/consulta-envio.service';
import { TranslationService } from '../../services/translation.service';
import { OrderDetail } from '../../model/orderDetail';
import { Router, ActivatedRoute } from '@angular/router';
import { ConexionsService } from '../../services/conexions.service';
import { Person } from 'app/modules/ConsultaEnvio/model/person';
import { MainComponent } from 'app/modules/ConsultaEnvio/components/main/main.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Observable } from 'rxjs/Observable';



@Component({
  selector: 'app-detalle-order-list',
  templateUrl: './detalle-order-list.component.html',
  animations: [
    trigger('fadeInAnimation', [
      // route 'enter' transition
      state('true', style({ opacity: 1 })),
      state('false', style({ opacity: 0 })),
      transition('false <=> true', animate(1000))
    ])
  ]
})
export class DetalleOrderListComponent implements OnInit {

  i: number = 0;
  loaded: boolean = false;
  showPagination: boolean = false;
  p: number = 1;
  timer: any;

  public pedidos: OrderDetail[] = [];
  public showComp: boolean = true;

  // region TABLA ICP
public ShowTablaICP = false;
public MoreThanTen = false;
public ShowDetalleEntrega = false;
public rows: Array<any> = [];
public columns: Array<any> = [
  { title: 'Descripción', name: 'DES_REFERENCIA', classTD: '', classHijos: '' },
  { title: 'Cantidad', name: 'CANTIDAD', classTD: 'text-center' }
];

public config: any = {
  paginPaddingPages: 3,
  itemsPerPage: 10,
  paging: true,
  excel: false,
  sorting: { columns: this.columns },
  filtering: { filterString: '' },
  className: ['table-striped', 'table-bordered'],
};
public data = new Array<any>();

// endregion








  constructor(public _ce: ConsultaEnvioService, private router: Router, private conexion: ConexionsService, private route: ActivatedRoute, public main: MainComponent) { }

  ngOnInit() {
    this.timer = Observable.interval(1000).subscribe(x => {
      if (this.main.loaded == true && this.loaded == true && this._ce.providerSCL !== "NC") {
        this.stopTimer();
      };

      if (this.main.loaded == true && this.loaded == false && this._ce.providerSCL !== "NC") {
        this.loaded = true;
        this.loadData();
      }
    })
   }


   stopTimer() {
     this.timer.unsubscribe();
     this.timer = closed;
   }

  ngDoCheck() {
    // if (this.main.loaded == true && this.loaded == false && this._ce.providerSCL !== "NC") {
    //   this.loaded = true;
    //   this.loadData();
    // }
  }

  loadData() {
    debugger;
    this.route.queryParams.subscribe(params => {
      if (params !== undefined && this.route !== undefined && this._ce.isError == false) {
        const query = encodeURIComponent(params['data']);
        this.conexion.getOrderDetailData_a2(query).subscribe((p: OrderDetail[]) => {
          if (p.length>0) {
            debugger;
            this.data = this.setDatos(p);
            this.ShowTablaICP = true;
            this.main.visibleOrderList = true;
          }
          else {
            debugger;
            this.main.visibleOrderList = false;
          }
        });
      }
    }).unsubscribe; // <-- once got datas and showed them I don't need them anymore.
    if (this.data.length > 10) {
      this.MoreThanTen = true;
    }
  }

  setDatos(datos): OrderDetail[] {
    const lista = [];
    datos.map((o) => {
      const detalle = {
        'DES_REFERENCIA': o.DES_REFERENCIA,
        'CANTIDAD': o.CANTIDAD
      }
      lista.push(detalle);
    });
    return lista;
  };


  getQueryString() {
    let url_string = window.location.href;
    let url = new URL(url_string);
    return url.searchParams.get("data");

  };

}
