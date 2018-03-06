import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConsultaEnvioModule } from './modules/ConsultaEnvio/consulta-envio.module';
import { ConexionsService } from '../app/modules/ConsultaEnvio/services/conexions.service';
import { AppComponent } from './app.component';
import { PaginationComponent } from 'app/modules/ConsultaEnvio/components/pagination/pagination.component';
import { AlertModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MainComponent } from 'app/modules/ConsultaEnvio/components/main/main.component';
import { PersistenceModule } from 'angular-persistence';
import { HttpModule } from '@angular/http';

// import { MD_SELECT_DIRECTIVES, MdSelectModule } from 'md-select';


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
    AlertModule.forRoot(),
    PersistenceModule,
    HttpModule,
  ],
  providers: [ConexionsService, { provide: LOCALE_ID, useValue: "es"}, PaginationComponent, MainComponent, AppComponent, ],
  bootstrap: [AppComponent],
  
  
})
export class AppModule { }
