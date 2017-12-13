import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultaEnvioRouting, components } from './consulta-envio.routing';
import { ConsultaEnvioService } from './services/consulta-envio.service';


@NgModule({
  imports: [
    ConsultaEnvioRouting,
    CommonModule
  ],
  exports:[ ConsultaEnvioRouting, components ],
  declarations: [ components ],
  providers:[ ConsultaEnvioService ]
})
export class ConsultaEnvioModule { }
