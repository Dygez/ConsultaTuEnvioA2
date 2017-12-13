import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DetallePedidoComponent } from './components/detalle-pedido/detalle-pedido.component';
import { SegurdadListComponent } from './components/segurdad-list/segurdad-list.component';

export const components = [
  DetallePedidoComponent,
  SegurdadListComponent
]


const consultaEnvioRoutes: Routes = [
  { path: 'detalle-pedido', component: DetallePedidoComponent },
  { path: 'seguridad-list', component: SegurdadListComponent },
  { path: 'detalle-pedido/:id', component: DetallePedidoComponent },
  { path: '',  redirectTo: '/detalle-pedido',  pathMatch: 'full'},
  { path: '**', component: DetallePedidoComponent }
  ];

@NgModule({
    imports: [
      RouterModule.forRoot( consultaEnvioRoutes, { enableTracing: true } // <-- debugging purposes only
      )
    ],
    exports: [  ]
  })
export class ConsultaEnvioRouting { }