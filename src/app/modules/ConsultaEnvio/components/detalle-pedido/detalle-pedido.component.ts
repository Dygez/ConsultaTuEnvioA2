import { Component, OnInit } from '@angular/core';
import { ConsultaEnvioService } from '../../services/consulta-envio.service';
import { Person } from '../../model/person';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html'
})
export class DetallePedidoComponent implements OnInit {

  public person: Person;
  public myRequestObj: any;
  constructor(private _ce: ConsultaEnvioService, private router: Router) { }

  ngOnInit() {
    console.log(this._ce.isProduction);

    this.person = new Person();
    this.person.Age = 24;
    this.person.Name = 'Juan';

    console.log(this.person);

    this._ce.getInfo().subscribe(
      okResponse => {
        console.log(okResponse);
        this.myRequestObj = okResponse;
      },
      errorRes => {
        // show message of error
      }
    ); // listener

  }

  changeText() {
    this._ce.setText('Hello im Detalle Pedido');
  }

  showText() {
    console.log(this._ce.getText());
  }

  navigateTo() {
    this.router.navigate(['seguridad-list'])
  }

}
