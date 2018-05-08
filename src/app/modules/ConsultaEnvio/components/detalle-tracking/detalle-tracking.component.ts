import { Component, OnInit, DoCheck, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, Directive, ViewChild, ElementRef } from '@angular/core';
import { ConsultaEnvioService } from '../../services/consulta-envio.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ConexionsService } from 'app/modules/ConsultaEnvio/services/conexions.service';
import { Tracking } from 'app/modules/ConsultaEnvio/model/tracking';
import { Image } from 'app/modules/ConsultaEnvio/model/image';
import { Email } from 'app/modules/ConsultaEnvio/model/email';
import { HttpResponse } from 'selenium-webdriver/http';
import { HttpModule } from '@angular/http';
import { MainComponent } from 'app/modules/ConsultaEnvio/components/main/main.component';
import { FormsModule } from '@angular/forms';
import { PersistenceService } from 'angular-persistence/src/services/persistence.service';
import { GiveEmail } from 'app/modules/ConsultaEnvio/services/email.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtml } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ModalTemplateComponent} from 'app/modules/ConsultaEnvio/components/modal-template/modal-template.component';
import { MatDialog, MatDialogModule, MatDialogConfig, MatDialogRef, MatDialogContainer } from '@angular/material';
import { BlockScrollStrategy, ViewportRuler, Overlay } from '@angular/cdk/overlay';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-detalle-tracking',
  templateUrl: './detalle-tracking.component.html',
  animations: [
    trigger('fadeInAnimation', [
      // route 'enter' transition
        state('true', style({ opacity: 1 })),
        state('false', style({ opacity: 0 })),
        transition('false <=> true', animate(1000))
      ])
      ,
      trigger('dialog', [
        transition('void => *', [
          style({ transform: 'scale3d(.3, .3, .3)' }),
          animate(400)
        ]),
        transition('* => void', [
          animate(400, style({ transform: 'scale3d(.0, .0, .0)' }))
        ])
      ])

    ]
})

export class DetalleTrackingComponent implements OnInit {
  @ViewChild('contenuto') content: ElementRef;
  @Input() id_Mail: number;
  
    comp: boolean = false;
    loaded: boolean = false;
    imgComprobante: string = "";
    hide: string = 'hidden';
    link: boolean = false;
    Mail: Email = new Email;
    mailCounter: number = 0;
    glyph: string = "glyphicon glyphicon-plus";
    timer: any;

    public tracking: Tracking[]=[];
    public innerHTML: Email[] = [];
    public mailList: Array<Email> = [];

  constructor(public _ce: ConsultaEnvioService, private router: Router, private conexion: ConexionsService, private route: ActivatedRoute, public main: MainComponent, private persistence: PersistenceService, 
      private cd: ChangeDetectorRef, private gMail: GiveEmail, private sanitizer: DomSanitizer, public dialog: MatDialog) {

   }

  
   sanitizeHTML(value: string): SafeHtml {
     return this.sanitizer.bypassSecurityTrustHtml(value);
   }

   // fromcase: 0 = html, 1 = image, 2 = pdf
  openDialog(id: number, fromcase: any, url: string): void {

    this.persistence.set('modalOpt', fromcase);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = { 
        top: '15%', 
        left: '48%'
      }

    dialogConfig.maxHeight = 500;
    dialogConfig.maxWidth = 550;

    switch (fromcase) {
      case 0:
        let message = this.mailList.filter(x => x.ID === id);
        dialogConfig.data = message[0].CONTENIDO_MENSAJE;
        let popUp = this.dialog.open(ModalTemplateComponent, dialogConfig,);
        popUp.afterClosed().subscribe(ret => {
          // console.log('This was closed.')
        });
        break;
      case 1:
          let message1 = this.mailList.filter(x => x.ID === id);
          dialogConfig.data = this.imgComprobante;
          let popUp1 = this.dialog.open(ModalTemplateComponent, dialogConfig);
          popUp1.afterClosed().subscribe(ret => {
          //  console.log('This was closed.')
          });
          break;
      case 3:
          let message3 = this.mailList.filter(x => x.ID === id);
          dialogConfig.data = this.imgComprobante;
          let popUp3 = this.dialog.open(ModalTemplateComponent, dialogConfig);
          popUp3.afterClosed().subscribe(ret => {
            // console.log('This was closed.')
          });
          // let popUp3 = this.dialog.open(ModalTemplateComponent, {
          //   height: '500px',
          //   width: '400px',
          //   data: this.imgComprobante,
          //   hasBackdrop: true
          //   })
          break;
      default:
          console.log('uh oh, something went wrong...')
          break;
    }
    
  }
   
  ngOnInit() {

    this.timer = Observable.interval(1000).subscribe( x => {
      if (this.main.loaded == true && this.loaded == true && this._ce.providerSCL !== "NC") {
        this.stopTimer();
      }
      if (this.main.loaded == true && this.loaded == false && this._ce.providerSCL !== "NC") {
        this.loaded = true;
        this.loadData();
      }
    })
  }

  stopTimer() {
    this.timer.unsubscribe();
    this.timer = closed;
  }
 
  ngDoCheck() {
  }

  public writeMailId(tx_mail: number): number {
      return tx_mail;
  }

  loadData() {
    this.route.queryParams.subscribe(params => {
    if(params !== undefined && this.route !== undefined && this._ce.isError == false) {
    const query = encodeURIComponent(params['data']);
    this.conexion.getTrackingData(query).subscribe((t: Tracking[]) => {
      if(t){

        t.sort(function(a: Tracking, b: Tracking) {
          if (a.ID_SEGUIMIENTO < b.ID_SEGUIMIENTO) {
            return 1
          }
          else {
            return -1
          }
          });

        t.forEach(element => {
        this.getTextMail(element.ID_TX_MAIL, this.mailCounter);
        this.mailCounter += 1;
        this.tracking.push(element);});
        }
    });}
  }).unsubscribe; // <-- once got datas and showed them I don't need them anymore.

    this.route.queryParams.subscribe(params => {
      if(params !== undefined && this.route !== undefined && this._ce.isError == false) {
        const query = encodeURIComponent(params['data']);
        this.conexion.getComprobante(query).subscribe((t: any) => {
        if (t.Images.length == 0) {
          this.link = true;
        }
        this.imgComprobante = t.Uri;
        this.comp = true;
      },
    isError => {
      this.comp = false;
    }).unsubscribe;
    }
  });

  }

  getTextMail(id_tx_mail: string, index: number) {
    if (id_tx_mail !== null) {
      this.innerHTML.push(this.gMail.returnMail(id_tx_mail, index));
      this.mailList = Array.from(this.innerHTML);
    }
  }

   getQueryString(){
    let url_string = window.location.href;
    let url = new URL(url_string);
    return url.searchParams.get("data");
  };

  hideShow() {
    if (this.hide == 'hidden') {
      this.hide = 'visible';
      this.glyph = 'glyphicon glyphicon-minus'
    }
    else
    {
      this.hide = 'hidden';
      this.glyph = 'glyphicon glyphicon-plus'
    }
    return this.hide;
  }


  // this shows or not the comprobante panel.
  // it's not always an image, sometimes it's a link (eg Tourline), need to manage this
  loadComprobante() {
    this.conexion.getComprobante(this.persistence.get('queryString')).subscribe((t: any) => {
      if (t.Images.length == 0) {
        this.link = true;
      }}).unsubscribe;
    this.route.queryParams.subscribe(params => {
      if(params !== undefined && this.route !== undefined && this._ce.isError == false) {
        const query = encodeURIComponent(params['data']);
        this.conexion.getComprobante(query).subscribe((t: any) => {
        if (t.Images.length == 0) {
          this.link = true;
        }
        this.imgComprobante = t.Uri;
        this.comp = true;
      }).unsubscribe();
    }
  });
 }

}
