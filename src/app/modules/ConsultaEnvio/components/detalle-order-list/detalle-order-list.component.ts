import { Component, OnInit, DoCheck } from '@angular/core';
import { ConsultaEnvioService } from '../../services/consulta-envio.service';
import { TranslationService } from '../../services/translation.service';
import { OrderDetail } from '../../model/orderDetail';
import { Router,ActivatedRoute } from '@angular/router';
import { ConexionsService } from '../../services/conexions.service';
import { Person } from 'app/modules/ConsultaEnvio/model/person';
import { MainComponent } from 'app/modules/ConsultaEnvio/components/main/main.component';
import { PaginationComponent } from 'app/modules/ConsultaEnvio/components/pagination/pagination.component';

@Component({
  selector: 'app-detalle-order-list',
  templateUrl: './detalle-order-list.component.html'
})
export class DetalleOrderListComponent implements OnInit {

  i: number = 0;
  loaded: boolean = false;
  public pedidos: OrderDetail[]=[];


  constructor(private _ce: ConsultaEnvioService, private router: Router, private conexion: ConexionsService, private route: ActivatedRoute, private main: MainComponent, private pag: PaginationComponent) {}

  ngOnInit() {}

  ngDoCheck() {
    if (this.main.loaded == true && this.loaded == false && this._ce.providerSCL !== "NC") {
      this.loaded = true;
      this.loadData();
      }
  }

  loadData() {
    this.route.queryParams.subscribe(params => {
      if(params !== undefined && this.route !== undefined && this._ce.isError == false) {
      const query = encodeURIComponent(params['data']);
      this.conexion.getOrderDetailData_a2(query).subscribe((p: OrderDetail[]) => 
        {
          if(p) 
            {
              p.forEach(element => {
                this.pedidos.push(element); 
                this.i++;
              });
              // manage pagination values
              this.pag.count = this.i;
              this.pag.pagesToShow = 1;
              this.pag.perPage = 5;
              this.pag.page = 1
            }
        }); 
      }
    }).unsubscribe; // <-- once got datas and showed them I don't need them anymore.

  }  
  
  getQueryString(){
    let url_string = window.location.href;
    let url = new URL(url_string);
    return url.searchParams.get("data");
    
  };

}
