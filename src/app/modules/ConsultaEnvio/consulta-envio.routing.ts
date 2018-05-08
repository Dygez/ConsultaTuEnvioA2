// Ogni nuovo componente deve essere importato e dichiarato qui dentro.
// non è importante, se non serve, introdurre le rotte, l'importante è che siano dichiarati in import ed export.

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DetallePedidoComponent } from './components/detalle-pedido/detalle-pedido.component';
import { DetalleTrackingComponent } from  './components/detalle-tracking/detalle-tracking.component';
import { DetalleClientComponent } from './components/detalle-client/detalle-client.component';
import { DetalleOrderListComponent } from './components/detalle-order-list/detalle-order-list.component';
import { MainComponent } from './components/main/main.component'
import { TranslationPipe } from 'app/modules/ConsultaEnvio/pipes/translation.pipe';
import { TranslationService } from 'app/modules/ConsultaEnvio/services/translation.service';
import { AuthenticationComponent } from 'app/modules/ConsultaEnvio/components/authentication/authentication.component';
import { EmailComponent } from "app/modules/ConsultaEnvio/components/email/email.component";
import { ComprobanteComponent } from 'app/modules/ConsultaEnvio/components/comprobante/comprobante.component';
import { OrderPastTimeComponent } from 'app/modules/ConsultaEnvio/components/order-past-time/order-past-time.component';
import { HeaderComponent } from 'app/modules/ConsultaEnvio/components/header/header.component';
import { ModalTemplateComponent } from 'app/modules/ConsultaEnvio/components/modal-template/modal-template.component';
import { FormsModule } from '@angular/forms';
import { DepotComponent } from 'app/modules/ConsultaEnvio/components/depot/depot.component';

export const components = [
  DetalleClientComponent,
  DetalleTrackingComponent,
  DetallePedidoComponent,
  DetalleOrderListComponent,
  MainComponent,
  TranslationPipe,
  AuthenticationComponent,
  EmailComponent,
  ModalTemplateComponent,
  DepotComponent
]
const consultaEnvioRoutes: Routes = [
  { path: '',  redirectTo: '/main?data=',  pathMatch: 'full'},
  { path: 'main', component: MainComponent },
  { path: 'main/?data&scl', component: MainComponent }, // per specificare più di un parametro in queryString, utilizzare questa sintassi.
  { path: 'main/?ticket_jazztel', redirectTo: 'main?ticket_jazztel=', pathMatch: 'full' },
  { path: 'detalle-pedido', component: DetallePedidoComponent },
  { path: 'detalle-pedido/:id/', component: DetallePedidoComponent },
  { path: 'seguridad-list', component: MainComponent },
  { path: 'detalle-tracking', component: DetalleTrackingComponent },
  { path: 'detalle-client', component: DetalleClientComponent },
  { path: 'detalle-order-list', component: DetalleOrderListComponent },
  { path: 'comprobante', component: ComprobanteComponent},
  { path: 'authentication', component: AuthenticationComponent },
  { path: 'email', component: EmailComponent},
  { path: 'order-past-time', component: OrderPastTimeComponent},
  { path: 'header', component: HeaderComponent},
  { path: 'modal-template', component: ModalTemplateComponent},
  { path: 'depot', component: DepotComponent}
    ];
 
@NgModule({
    declarations: [ ],
    imports: [
      // questo determina il collegamento con router-outlet visibile in app.component.html. Sostanzialmente reindirizza qui per prendere la tabella di routing.
      RouterModule.forChild(consultaEnvioRoutes),
      RouterModule.forRoot(consultaEnvioRoutes, {useHash:true}
      )
    ],
    exports: [ ]
  })
export class ConsultaEnvioRouting { }