import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultaEnvioModule } from './modules/ConsultaEnvio/consulta-envio.module';
import { ConexionsService } from '../app/modules/ConsultaEnvio/services/conexions.service';
import { AppComponent } from './app.component';
import { AlertModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from 'app/modules/ConsultaEnvio/components/main/main.component';
import { PersistenceModule } from 'angular-persistence';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, state, style, animate, transition} from '@angular/animations';
import { ModalTemplateComponent } from 'app/modules/ConsultaEnvio/components/modal-template/modal-template.component';
import { MatDialog, MatDialogModule } from '@angular/material';
import { registerLocaleData } from '@angular/common';
import { DetallePedidoComponent } from './modules/ConsultaEnvio/components/detalle-pedido/detalle-pedido.component';
import { DepotComponent } from './modules/ConsultaEnvio/components/depot/depot.component';

import localeEs from '@angular/common/locales/es';
import localeEn from '@angular/common/locales/en';
import localePt from '@angular/common/locales/pt';
import localeIt from '@angular/common/locales/it';


registerLocaleData(localeEs);
registerLocaleData(localeEn);
registerLocaleData(localePt);
registerLocaleData(localeIt);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ConsultaEnvioModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserModule,
    BrowserAnimationsModule,
    AlertModule.forRoot(),
    PersistenceModule,
    HttpModule,
    MatDialogModule,
  ],
  exports: [  ],
  entryComponents: [ModalTemplateComponent],
  providers: [ConexionsService, { provide: LOCALE_ID, useValue: "es"}, MainComponent, AppComponent, MatDialogModule, MatDialog, BrowserAnimationsModule, DepotComponent],
  bootstrap: [AppComponent],
  
  
})

export class AppModule { 
}


