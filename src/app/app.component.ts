import { Component, Input } from '@angular/core';
import { environment } from '@env/environment';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from 'app/modules/ConsultaEnvio/components/main/main.component';
import { PersistenceService } from 'angular-persistence/src/services/persistence.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
@Input() langValue: number = 0;

  title = 'Consulta Pedidos';

  flags: {
    id: number;
    nt: string;
    flag: string
  } [] = [];

    
  constructor(public main: MainComponent, private persistence: PersistenceService) {
  }

  ngOnInit () {

    //this.flags.push({id: 0, nt: 'es', flag:'/WebConsultasEnvioA2/Imagenes/es.png'});
    this.flags.push({id: 0, nt: 'es', flag:'https://logistica.icp.es/WebConsultasEnvioA2/Imagenes/es.png'});
    this.flags.push({id: 1, nt: 'en', flag:'https://logistica.icp.es/WebConsultasEnvioA2/Imagenes/en.png'});
    this.flags.push({id: 2, nt: 'pt', flag:'https://logistica.icp.es/WebConsultasEnvioA2/Imagenes/pt.png'});
    this.flags.push({id: 3, nt: 'it', flag:'https://logistica.icp.es/WebConsultasEnvioA2/Imagenes/it.png'});

  }

  setValueLang() {
    this.persistence.set('langValue', this.langValue);
    // this.persistence.set('langValue', lang);
  }

}
