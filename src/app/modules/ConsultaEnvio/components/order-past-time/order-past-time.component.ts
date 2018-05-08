import { Component, OnInit, DoCheck } from '@angular/core';
import { ConsultaEnvioService } from 'app/modules/ConsultaEnvio/services/consulta-envio.service';
import { MainComponent } from 'app/modules/ConsultaEnvio/components/main/main.component';

@Component({
  selector: 'app-order-past-time',
  templateUrl: './order-past-time.component.html'
})
export class OrderPastTimeComponent implements OnInit {

  constructor(public _ce: ConsultaEnvioService, public main: MainComponent) { }

  ngOnInit() {
  }

  ngDoCheck() {
    if (this.main.bShowPastTime == true) {
      this._ce.showClient = true;
    }
  }

}
