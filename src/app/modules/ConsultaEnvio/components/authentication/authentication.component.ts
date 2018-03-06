import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { ConsultaEnvioService } from 'app/modules/ConsultaEnvio/services/consulta-envio.service';
import { NavigationExtras } from '@angular/router/src/router';
import { ConexionsService } from 'app/modules/ConsultaEnvio/services/conexions.service';
import { MainComponent } from 'app/modules/ConsultaEnvio/components/main/main.component';
import { PersistenceModule } from 'angular-persistence';
import { PersistenceService } from 'angular-persistence/src/services/persistence.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html'
})
export class AuthenticationComponent implements OnInit {

nif: string = '';
cp: string = '';
query: string;


  constructor(public router: Router, private conexion: ConexionsService, public _ce: ConsultaEnvioService, private route: ActivatedRoute, private main: MainComponent, private persistence: PersistenceService) {
   }

  ngOnInit() {
  }

  ngCheck(){
    this.route.url += this.persistence.get('queryString');
  }

  getValueCP(event: any) {
    this.cp = event.target.value;
  }

  getValueNIF(event: any) {
    this.nif = event.target.value;
  }

  authenticate() {
      if(this.persistence.get('queryString') !== undefined && this.route !== undefined) 
      {
          this.conexion.authenticateJazztel(this.persistence.get('queryString'), this.nif, this.cp).subscribe((isAuth: number) => {
            if (isAuth > 1) 
            {
              this._ce.authenticated = true;
              this.router.navigate(['main'], { queryParams: {data: this.persistence.get('queryString')}});
              return true;
            }
            else 
            {
              return false;
            }
          })
      };
  }

  navigateTo(text: string) {
    this.router.navigate(['main'], { queryParams: {data: this.persistence.get('queryString')}})}
}

