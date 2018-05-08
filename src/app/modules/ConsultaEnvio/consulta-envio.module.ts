import { LOCALE_ID, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsultaEnvioRouting, components } from './consulta-envio.routing';
import { ConsultaEnvioService } from './services/consulta-envio.service';
import { MainComponent } from './components/main/main.component';
import { TranslationService } from './services/translation.service';
import { TranslationPipe } from 'app/modules/ConsultaEnvio/pipes/translation.pipe';
import { GiveEmail } from './services/email.service';
import { OrderPastTimeComponent } from './components/order-past-time/order-past-time.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { ComprobanteComponent } from './components/comprobante/comprobante.component';
import { EmailComponent } from './components/email/email.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SmsPipe } from './pipes/sms.pipe';
import { DocumentsComponent } from './components/documents/documents.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { ModalTemplateComponent } from './components/modal-template/modal-template.component';
import { TablaicpComponent } from './components/tablaicp/tablaicp.component';
import { NgTableFilteringDirective } from './directives/ng-table-filtering.directive';
import { NgTableSortingDirective } from './directives/ng-table-sorting.directive';
import { TablaComponent } from './components/tablaicp/tabla/tabla/tabla.component';
import { DepotComponent } from './components/depot/depot.component';


@NgModule({
  imports: [
    ConsultaEnvioRouting,
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports:[ ConsultaEnvioRouting, components ],
  declarations: [ components, OrderPastTimeComponent, ComprobanteComponent, EmailComponent, SmsPipe, DocumentsComponent, HeaderComponent, FooterComponent, ModalTemplateComponent, TablaicpComponent, NgTableFilteringDirective, NgTableSortingDirective, TablaComponent, DepotComponent ],
  providers:[ ConsultaEnvioService, TranslationService, TranslationPipe, GiveEmail, HeaderComponent ]
})
export class ConsultaEnvioModule { }
