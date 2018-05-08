import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute  } from '@angular/router';
import { ConsultaEnvioService } from 'app/modules/ConsultaEnvio/services/consulta-envio.service';
import { NavigationExtras } from '@angular/router/src/router';
import { ConexionsService } from 'app/modules/ConsultaEnvio/services/conexions.service';
import { MainComponent } from 'app/modules/ConsultaEnvio/components/main/main.component';
import { PersistenceModule } from 'angular-persistence';
import { PersistenceService } from 'angular-persistence/src/services/persistence.service';
import { HeaderComponent } from 'app/modules/ConsultaEnvio/components/header/header.component';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  animations: [
    trigger('fadeInAnimation', [
      // route 'enter' transition
      transition(':enter', [
        // css styles at start of transition
        style({ opacity: 0 }),
        // animation and styles at end of transition
        animate('1s', style({ opacity: 1 }))
      ]),
    ])
  ],

})
export class AuthenticationComponent implements OnInit {

nif: string = '';
cp: string = '';
query: any;
public message: string = '';



  constructor(public router: Router, private conexion: ConexionsService, public _ce: ConsultaEnvioService, private route: ActivatedRoute, public main: MainComponent, private persistence: PersistenceService, public header: HeaderComponent, public activated: ActivatedRoute) {
    this._ce.showClient = true;
   }

  ngOnInit() {
    if (this.persistence.get('queryString') == undefined){
      this.route.queryParams.subscribe(params => {
        const query = encodeURIComponent(params['data']);
        if (this.persistence.get('queryString') !== undefined) 
        {
          this.persistence.get('queryString').replace('52', '')
      }
      });
    }

    this.main.colorWeb = '#707d9a'; 
    this.main.sclSCL = 2;
    this.main.PeticionSCL = '0';
  }

  ngCheck(){
    //this.route.url += this.persistence.get('queryString');
  }

  getValueCP(event: any) {
    this.cp = event.target.value;
  }

  getValueNIF(event: any) {
    this.nif = event.target.value;
  }

  authenticate() {
    if (this.persistence.get('queryString') !== undefined) {
      this.persistence.set('queryString', this.persistence.get('queryString').replace('52', ''));
    } else
    {
      this.activated.queryParams.subscribe(params => {
        this.query = params['data'];
      });
      this.persistence.set('queryString', this.query);
    }
    
      if(this.persistence.get('queryString') !== undefined) 
      {
          this.conexion.authenticateJazztel(this.persistence.get('queryString'), this.nif, this.cp).subscribe((isAuth: number) => {
            if (isAuth > 1) 
            {
              this._ce.authenticated = true;
              this._ce.toAuthenticate = false;
              this.router.navigate(['main'], { queryParams: {data: this.persistence.get('queryString')}});
              return true;
            }
            else 
            {
              this.message = 'Las credenciales no son correctas.'
              return false;
            }
          }),
          isError => {
            this.message = 'There were a problem with the page.'
          }
      }
      else {
        
      };
  }

  navigateTo(text: string) {
    this.router.navigate(['main'], { queryParams: {data: this.persistence.get('queryString')}})}
}

