import { Component, OnInit, DoCheck, ChangeDetectionStrategy } from '@angular/core';
import { ConsultaEnvioService } from '../../services/consulta-envio.service';
import { TranslationService } from '../../services/translation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Connection } from '@angular/http/src/interfaces';
import { ConexionsService } from 'app/modules/ConsultaEnvio/services/conexions.service';
import { Person } from 'app/modules/ConsultaEnvio/model/person';
import { HttpModule } from '@angular/http/src/http_module';
import { MainComponent } from 'app/modules/ConsultaEnvio/components/main/main.component';
import { PersistenceService } from 'angular-persistence/src/services/persistence.service';
import { SCL } from 'app/modules/ConsultaEnvio/model/scl';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-detalle-client',
  templateUrl: './detalle-client.component.html',
  animations: [
    trigger('fadeInAnimation', [
      // route 'enter' transition
        state('true', style({ opacity: 1 })),
        state('false', style({ opacity: 0 })),
        transition('false <=> true', animate(1000))
      ])
    ]
})
export class DetalleClientComponent implements OnInit {

  public person: Person = new Person;
  public scl: SCL = new SCL;

  loaded: boolean = false;
  bcheckSCL: boolean = false;  
  timer: any;

  constructor(public _ce: ConsultaEnvioService, private router: Router, private conexion: ConexionsService, private route: ActivatedRoute, public main: MainComponent, private persistence: PersistenceService) 
    {}

  ngOnInit() {

    this.timer = Observable.interval(1000).subscribe(params => {
      
      if (this.loaded == true && this.main.loaded == true && this._ce.providerSCL !== "NC") {
        this.stopTimer();
      }

      if (this.loaded == false && this.main.loaded == true && this._ce.providerSCL !== "NC") {
        this.loaded = true;
        this.loadData();
        this.getSCL();
      }

      if (this._ce.providerSCL == "BP") {
        this.loaded = true;
        this.loadData();
        this.getSCL();
      }      



    })

  }

  stopTimer() {
    this.timer.unsubscribe();
    this.timer = closed;
  }

  ngDoCheck() {
    // if (this.loaded == false && this.main.loaded == true && this._ce.providerSCL !== "NC") {
    //   this.loaded = true;
    //   this.loadData();
    //   this.getSCL();
    // }
    // if (this._ce.providerSCL == "BP") {
    //   this.loaded = true;
    //   this.loadData();
    //   this.getSCL();
    // }
  }

  getQueryString(){
    let url_string = window.location.href;
    let url = new URL(url_string);
    return url.searchParams.get("data");
    
  };

  getSCL() {
    // this.route.queryParams.subscribe(params => {
      if(this.persistence.get('queryString') !== undefined && this.route !== undefined) {
        this.conexion.getSCL(this.persistence.get('queryString')).subscribe((scl: SCL) =>{
          if (scl !== null) {
            this.scl.FACTURA = scl.FACTURA;
            this.scl.SCL = scl.SCL;
            this.scl.MAYORISTA = scl.MAYORISTA;
            this.main.sclSCL = this.scl.SCL;
            debugger;            
          }
        }, error => {
          this.main.sclSCL = 2;
        })
      };
    // });
  }

  loadData() {
    this.route.queryParams.subscribe(params => {
      if(this.persistence.get('queryString') !== undefined && this.route !== undefined) {
          // if (this._ce.showClient !== undefined) {
            //const query = encodeURIComponent(params['data']);
            this.conexion.getClienteData(this.persistence.get('queryString')).subscribe((client: Person) =>{
              this.person.CODIGO_POSTAL = client.CODIGO_POSTAL;
              this.person.DIRECCION_ENTREGA = client.DIRECCION_ENTREGA;
              this.person.NOMBRE_CLIENTE = client.NOMBRE_CLIENTE;
              this.person.NUMERO_DOCUMENTO = client.NUMERO_DOCUMENTO;
              this.person.PERSONA_CONTACTO = client.PERSONA_CONTACTO;
              this.person.POBLACION = client.POBLACION;
              this.person.PROVINCIA = client.PROVINCIA;
              this.person.TELEFONO = client.TELEFONO;
              //this.person.TELEFONO_APROVISIONAMIENTO = client.TELEFONO_APROVISIONAMIENTO;
              this.person.DES_SCL = client.DES_SCL;
            }).unsubscribe;
            // }
          this._ce.isError = false;
          }
      })
    }
}
