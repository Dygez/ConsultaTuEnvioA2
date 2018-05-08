import { Component, OnInit, DoCheck, Input } from '@angular/core';
import { ConsultaEnvioService } from '../../services/consulta-envio.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Order } from '../../model/order';
import { OrderJazztel } from 'app/modules/ConsultaEnvio/model/orderJazzTel';
import { ConexionsService } from 'app/modules/ConsultaEnvio/services/conexions.service';
import { debug } from 'util';
import { MainComponent } from 'app/modules/ConsultaEnvio/components/main/main.component';
import { OrderOrange } from 'app/modules/ConsultaEnvio/model/orderOrange';
import { PlataForma } from 'app/modules/ConsultaEnvio/model/plataforma';
import { HeaderComponent } from 'app/modules/ConsultaEnvio/components/header/header.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { PersistenceService } from 'angular-persistence';

@Component({
  selector: 'app-depot',
  templateUrl: './depot.component.html',
  animations: [
    trigger('fadeInAnimation', [
      // route 'enter' transition
        state('true', style({ opacity: 1 })),
        state('false', style({ opacity: 0 })),
        transition('false <=> true', animate(1000))
      ])
    ]
})
export class DepotComponent implements OnInit {

  loaded: boolean = false;
  transportista: string = "";
  codigo_postal: number = 0;
  peticion: string = "";
  plataformaVisible: boolean = false;
  glyph: string = 'glyphicon glyphicon-plus';

  public plataforma: PlataForma = new PlataForma;

  constructor(public _ce: ConsultaEnvioService, private router: Router, private conexion: ConexionsService, private route: ActivatedRoute, public main: MainComponent, private header: HeaderComponent,
  public persistence: PersistenceService) { }

  ngOnInit() {
  }

  ngDoCheck() {
    if (this.loaded == false && this.main.loaded == true && this._ce.providerSCL !== "NC") {
      this.loadPlataforma();
    }
  }

  public loadPlataforma () {
    if (this.persistence.get('transportista') !== "" && this.persistence.get('codigo_postal') !== 0 && this.persistence.get('peticion') !== ""){
      this.route.queryParams.subscribe(params => {
        if(params !== undefined && this.route !== undefined && this._ce.isError !== true) {
          // const query = encodeURIComponent(params[this.getQueryString()]);
          const query = encodeURIComponent(this.persistence.get('queryString'));
          this.conexion.getPlataforma(this.persistence.get('peticion'), this.persistence.get('transportista'), this.persistence.get('codigo_postal')).subscribe((plataForma: PlataForma) => {
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
          isError => {
            this.plataformaVisible = false;
          },
          () => {
            if (this.plataforma.ID !== undefined) {this.plataformaVisible=true;}
          }
        )
        }}).unsubscribe();
        if (this.plataforma.ID !== undefined) {
          this.plataformaVisible=true; 
          this.loaded=true;
          } 
        else {
          if (this.persistence.get('peticion') !== "" && this.persistence.get('transportista') !== "" && this.persistence.get('codigo_postal') !== "")
          {
            this.plataformaVisible=false;
          }
          else {this.loaded=true;}
        }
        //this.loaded=true;
    }
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

getQueryString(){
  let url_string = window.location.href;
  let url = new URL(url_string);
  return url.searchParams.get("data");
};

// public loadPlataforma() {
//   if (this.persistence.get('transportista') !== "" && this.persistence.get('codigo_postal') !== 0 && this.persistence.get('peticion') !== "")
//   {
//     this.conexion.getPlataforma(this.persistence.get('peticion'), this.persistence.get('transportista'), this.persistence.get('codigo_postal')).subscribe((plataForma: PlataForma) => {
//       this.plataforma.ID = plataForma.ID;
//       this.plataforma.TRANSPORTISTA = plataForma.TRANSPORTISTA;
//       this.plataforma.CODIGO_OFICINA = plataForma.CODIGO_OFICINA;
//       this.plataforma.NOMBRE_OFICINA = plataForma.NOMBRE_OFICINA;
//       this.plataforma.DIRECCION_OFICINA = plataForma.DIRECCION_OFICINA;
//       this.plataforma.POBLACION_OFICINA = plataForma.POBLACION_OFICINA;
//       this.plataforma.CP_OFICINA = plataForma.CP_OFICINA;
//       this.plataforma.PROVINCIA = plataForma.PROVINCIA;
//       this.plataforma.TELEFONO = plataForma.TELEFONO;
//       this.plataforma.EMAIL = plataForma.EMAIL;
//       this.plataforma.HORARIO= plataForma.HORARIO;
//       this.plataforma.FAX = plataForma.FAX;
//       this.plataforma.OBSERVACIONES = plataForma.OBSERVACIONES;
//       this.plataforma.PLAZA = plataForma.PLAZA;
//       this.plataforma.NUMERO_ENVIO_CORREOS = plataForma.NUMERO_ENVIO_CORREOS
//       },
//       error => {
//         this.plataformaVisible = false;
//       },
//       () => {
//         if (this.plataforma.ID !== undefined) {this.plataformaVisible=true; this.loaded=true}
//       });
    
//   }
//   console.log(this.plataforma.ID)
// }

}