import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultaEnvioRouting, components } from './consulta-envio.routing';
import { ConsultaEnvioService } from './services/consulta-envio.service';
import { MainComponent } from './components/main/main.component';
import { TranslationService } from './services/translation.service';
import { TranslationPipe } from 'app/modules/ConsultaEnvio/pipes/translation.pipe';
import { GiveEmail } from './services/email.service';
import { PaginationComponent } from './components/pagination/pagination.component';
import { OrderPastTimeComponent } from './components/order-past-time/order-past-time.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { DetalleOrdenComponent } from './components/detalle-orden/detalle-orden.component';
import { ComprobanteComponent } from './components/comprobante/comprobante.component';
import { EmailComponent } from './components/email/email.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SmsPipe } from './pipes/sms.pipe';
import { DocumentsComponent } from './components/documents/documents.component'

@NgModule({
  imports: [
    ConsultaEnvioRouting,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[ ConsultaEnvioRouting, components ],
  declarations: [ components, OrderPastTimeComponent, DetalleOrdenComponent, ComprobanteComponent, EmailComponent, SmsPipe, DocumentsComponent ],
  providers:[ ConsultaEnvioService, TranslationService, TranslationPipe, GiveEmail ]
})
export class ConsultaEnvioModule { }
