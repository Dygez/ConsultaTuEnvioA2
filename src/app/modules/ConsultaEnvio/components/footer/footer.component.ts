import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { ConsultaEnvioService } from 'app/modules/ConsultaEnvio/services/consulta-envio.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  animations: [
    trigger('fadeInAnimation', [
      // route 'enter' transition
        state('true', style({ opacity: 1 })),
        state('false', style({ opacity: 0 })),
        transition('false <=> true', animate(1000))
      ])
    ]
})
export class FooterComponent implements OnInit {

  constructor(public _ce: ConsultaEnvioService) { }

  ngOnInit() {
  }


}
