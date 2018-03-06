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

@Component({
  selector: 'app-detalle-tracking',
  templateUrl: './detalle-tracking.component.html'
})

export class DetalleTrackingComponent implements OnInit {
  @ViewChild('contenuto') content: ElementRef;
  @Input() id_Mail: number;
  // @Output() setIDMail = new EventEmitter<number>();

    comp: boolean = false;
    loaded: boolean = false;
    imgComprobante: string = "";
    hide: string = 'hidden';
    link: boolean = false;
    Mail: Email = new Email;
    glyph: string = "glyphicon glyphicon-plus";

    public tracking: Tracking[]=[];
    public innerHTML: Email[] = [];
    public mailList: Array<Email> = [];

  constructor(private _ce: ConsultaEnvioService, private router: Router, private conexion: ConexionsService, private route: ActivatedRoute, private main: MainComponent, private persistence: PersistenceService, private cd: ChangeDetectorRef, private gMail: GiveEmail, private sanitizer: DomSanitizer) {
   }

   sanitizeHTML(value: string): SafeHtml {
     return this.sanitizer.bypassSecurityTrustHtml(value);
   }

  ngOnInit() {
  }
 
  ngDoCheck() {
    if (this.main.loaded == true && this.loaded == false && this._ce.providerSCL !== "NC") {
      this.loaded = true;
      this.loadData();
      // this.loadComprobante();
    }
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
        this.getTextMail(element.ID_TX_MAIL)
        this.tracking.push(element);});
        }
    });}
  }).unsubscribe; // <-- once got datas and showed them I don't need them anymore.
  // this._ce.providerSCL = this.main.SCL;

  this.route.queryParams.subscribe(params => {
    if(params !== undefined && this.route !== undefined && this._ce.isError == false) {
      const query = encodeURIComponent(params['data']);
      this.conexion.getComprobante(query).subscribe((t: any) => {
      if (t.Images.length == 0) {
        this.link = true;
      }
      this.imgComprobante = t.Uri;
      this.comp = true;
    }).unsubscribe;
  }
});

  }

  getTextMail(id_tx_mail: string) {
    if (id_tx_mail !== null) {
      this.innerHTML.push(this.gMail.returnMail(id_tx_mail));
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
