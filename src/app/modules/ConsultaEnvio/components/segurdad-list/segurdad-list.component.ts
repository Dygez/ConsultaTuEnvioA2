// This component should be use to get particular authentication through different customers.
// Should show a modal to let customer insert user and password

import { Component, OnInit } from '@angular/core';
import { ConsultaEnvioService } from '../../services/consulta-envio.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-segurdad-list',
  templateUrl: './segurdad-list.component.html'
})
export class SegurdadListComponent implements OnInit {

  constructor(private _ce: ConsultaEnvioService, private router:Router) {}

  ngOnInit() {}

  navigateTo() {
    this.router.navigate(['main'])
  }

}
