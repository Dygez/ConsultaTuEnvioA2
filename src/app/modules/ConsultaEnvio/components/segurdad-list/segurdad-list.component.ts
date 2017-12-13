import { Component, OnInit } from '@angular/core';
import { ConsultaEnvioService } from '../../services/consulta-envio.service';
import { Router }       from '@angular/router';

@Component({
  selector: 'app-segurdad-list',
  templateUrl: './segurdad-list.component.html'
})
export class SegurdadListComponent implements OnInit {

  constructor(private _ce: ConsultaEnvioService, private router:Router) { }

  ngOnInit() {
  }

  changeText() {
    this._ce.setText('Hello im Seguridad');
  }

  showText() {
    console.log(this._ce.getText());
  }

  changeTextLocalStorage() {
    this._ce.setTextLocalStorage();
  }

  showTextLocalStorage() {
    console.log(this._ce.getTextLocalStorage());
  }

  navigateTo() {
    this.router.navigate(['detalle-pedido'])
  }


}
