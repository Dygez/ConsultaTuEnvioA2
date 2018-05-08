import { Component, Input } from '@angular/core';
import { environment } from '@env/environment';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'app/modules/ConsultaEnvio/components/main/main.component';
import { PersistenceService } from 'angular-persistence/src/services/persistence.service';
import { ConexionsService } from 'app/modules/ConsultaEnvio/services/conexions.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DetalleClientComponent } from 'app/modules/ConsultaEnvio/components/detalle-client/detalle-client.component';
import { DetallePedidoComponent } from 'app/modules/ConsultaEnvio/components/detalle-pedido/detalle-pedido.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
@Input() langValue: number = 0;

  title = 'Consulta Tu Envio';
  lang: string = "";
  private logo: String; 
    
  constructor(public main: MainComponent, private router: Router, private persistence: PersistenceService, private route: ActivatedRoute, private conexion: ConexionsService) {  }

  ngOnInit () { 
        // default language (doesn't work with EDGE)
        this.lang = window.navigator.language
        //set english as default
        this.persistence.set('langValue', 1)

        if (this.lang.length > 0) {
          if (this.lang.match('en|en-GB|en-US')) {
            this.persistence.set('langValue', 1)
          }
          if (this.lang.match('es|es-ES|es-AR')) {
            this.persistence.set('langValue', 0)
          }
          if (this.lang.match('pt|pt-PT|pt-BR')) {
            this.persistence.set('langValue', 2)
          }
          if (this.lang.match('it|it-IT|it-CH')) {
            this.persistence.set('langValue', 3)
          }
        }
   }

  setValueLang() {
    this.persistence.set('langValue', this.langValue);
  }

}
