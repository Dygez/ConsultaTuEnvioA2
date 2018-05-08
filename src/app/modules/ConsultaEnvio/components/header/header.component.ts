import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MainComponent } from 'app/modules/ConsultaEnvio/components/main/main.component';
import { ConsultaEnvioService } from 'app/modules/ConsultaEnvio/services/consulta-envio.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ConexionsService } from 'app/modules/ConsultaEnvio/services/conexions.service';
import { PersistenceService } from 'angular-persistence/src/services/persistence.service';
import { Logo } from 'app/modules/ConsultaEnvio/model/logo';
import { AppComponent } from 'app/app.component';
import { trigger, state, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  animations: [
    trigger('fadeInAnimation', [
        state('true', style({ opacity: 1 })),
        state('false', style({ opacity: 0 })),
        transition('false <=> true', animate(1000))
      ])
    ]
})
export class HeaderComponent implements OnInit {
  @Input() COLOR_WEB: String;
  @Input() langValue: string = "";

  checked: boolean = false;
  private logoTimer: any;

  public bLogo: any;
  public Logo: String;
  public bLogoICP: Boolean = false;
  

  constructor(private app: AppComponent, public main: MainComponent, public _ce: ConsultaEnvioService, private router: Router, private conexion: ConexionsService, private route: ActivatedRoute, private persistence: PersistenceService) { 
  }

  getLogo() {
    if (this.main.sclSCL !== 0 && this.main.sclSCL !== undefined && this.main.PeticionSCL !== undefined) {
      this.conexion.getLogoSCL(this.persistence.get('queryString'), this.main.PeticionSCL, this.main.sclSCL).subscribe(scl => {
        this.Logo = scl;
      })
    }    
    // to manage Orange and Jazztel
    if (this.main.Logo !== undefined) {
      this.Logo = this.main.Logo;
    }
    else {
      this.bLogo = false;
    }
  }
  
  getLogoICP() {
    if (this.main.sclSCL !== 0 && this.main.sclSCL !== undefined && this.main.PeticionSCL !== undefined) {
      this.conexion.getLogoICP(this.main.sclSCL).subscribe((icp: Logo) => {
        this.bLogoICP = icp.LOGOICP;
        this.bLogo = icp.LOGOSCL;
        this.COLOR_WEB = icp.COLOR_WEB;
      },error => {
        console.log(error);
      }, () => {
        this._ce.showClient = true;
      })
     
      if (this.COLOR_WEB !== "") {
        this.main.colorWeb = this.COLOR_WEB;
      }

      // manage error
      if (this.bLogoICP == undefined || this.bLogo == undefined) {
        this.bLogoICP = true;
        this.bLogo = false;
      }

      // loaded
      if (this.main.colorWeb !== undefined)
        {
          if (this.main.SCL == 'NC') {this.bLogo = true;}
          this.logoTimer.unsubscribe();
          this.logoTimer.closed = true;
          this._ce.showClient = true;
        }


      else {
        this.main.colorWeb = '#707d9a';
      }}
       else {
          this.bLogoICP = true;
          this.bLogo = false;
       };
  }

  isEmptyObject(obj) {
    return (obj && (Object.keys(obj).length === 0));
  }

  public ShowLoading(): boolean {
    return (this.main.SCL === 'NC' && !this._ce.authenticated && !this._ce.showClient);
  }

  ngOnInit() {
      if (!this._ce.authenticated && this.router.url.substr(0, 15) == "/authentication") {
        this.Logo = 'http://intranet.icp.es/img_icp/ec/jazztel_100.png';
      }
      else {
        this.logoTimer = Observable.interval(1000).subscribe(y => {
          this.getLogo();
          this.getLogoICP();
        });
      }
  }

  setLanguage(country: number) {
    this.app.langValue=country;
    this.persistence.set('langValue', country);
  }

  
}
