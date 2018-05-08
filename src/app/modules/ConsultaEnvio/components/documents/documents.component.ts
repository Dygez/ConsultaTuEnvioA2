import { Component, OnInit, OnChanges } from '@angular/core';
import { ConsultaEnvioService } from 'app/modules/ConsultaEnvio/services/consulta-envio.service';
import { Observable } from 'rxjs/Observable';
import * as FileSaver from 'file-saver'; 
import { ConexionsService } from 'app/modules/ConsultaEnvio/services/conexions.service';
import { PersistenceService } from 'angular-persistence/src/services/persistence.service';
import { MainComponent } from 'app/modules/ConsultaEnvio/components/main/main.component';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { Router, ActivatedRoute } from '@angular/router';
import { Image } from 'app/modules/ConsultaEnvio/model/image';
import { Email } from 'app/modules/ConsultaEnvio/model/email';
import { HttpResponse } from 'selenium-webdriver/http';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { GiveEmail } from 'app/modules/ConsultaEnvio/services/email.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtml } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { ModalTemplateComponent} from 'app/modules/ConsultaEnvio/components/modal-template/modal-template.component';
import { MatDialog, MatDialogModule, MatDialogConfig } from '@angular/material';
import { BlockScrollStrategy, ViewportRuler } from '@angular/cdk/overlay';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  animations: [
    trigger('fadeInAnimation', [
      // route 'enter' transition
        state('true', style({ opacity: 1 })),
        state('false', style({ opacity: 0 })),
        transition('false <=> true', animate(1000))
      ])
    ]
})
export class DocumentsComponent implements OnInit {

mostrar: boolean = false;
mostrarLoading: boolean = false;
imgComprobante: string = "";
comp: boolean = false;
loaded: boolean = false;
hide: string = 'hidden';
link: boolean = false;

loadComp: boolean = false;
loadDoc: boolean = false;

timer: any;

public mailList: Array<Email> = [];
public filePDF: Blob;

  constructor(private _ce: ConsultaEnvioService, private route: ActivatedRoute, private conexion: ConexionsService, private persistence: PersistenceService, public main: MainComponent,  private sanitizer: DomSanitizer, private x: MatDialogModule, public dialog: MatDialog) { 
    this.timer = Observable.interval(1000).subscribe(y => {
      this.loadDocument()
      this.loadComprobante()
    });

  }

  loadDocument() {
    this.conexion.getDocument(this.persistence.get('queryString')).subscribe((t: any[]) => {
      if (t.length > 0) {
        this.mostrar = true;
      }
      else {this.mostrar = false;
      }
    },
    isError => {
      this.mostrar = false;
    })
    
  }

ngOnChange() { }

  ngOnInit() {

    // this.conexion.getDocument(this.persistence.get('queryString')).subscribe((t: any[]) => {
    //   if (t.length > 0) {
    //     this.mostrar = true;
    //   }
    //   else {this.mostrar = false;
    //   }
    // },
    // isError => {
    //   this.mostrar = false;
    // })
  }

  loadComprobante() {
    if (this.loaded == false && this.main.loaded == true && this._ce.providerSCL !== "NC") {
      if (!this.loadComp) {
            this.route.queryParams.subscribe(params => {
              if(params !== undefined && this.route !== undefined && this._ce.isError == false) {
                const query = encodeURIComponent(params['data']);
                this.conexion.getComprobante(this.persistence.get('queryString')).subscribe((t: any) => {
                  debugger;
                if (t.Images.length == 0) {
                  this.link = true;
                }
                this.imgComprobante = t.Uri;
                this.comp = true;
                this.loadComp = false;
                this.stopTimer();
              },
            isError => {
              this.loadComp = false;
              this.stopTimer();
            }).unsubscribe;
            }
          }).unsubscribe;
        }
     }
  }

  stopTimer() {
    this.timer.unsubscribe();
    this.timer.closed = true;
  }


callPDF() {
  this.mostrarLoading = true;
  this._ce.downloadPDF().subscribe(
    ((res) => {

      let byteCharacters = atob(res.Bytes);
      let byteNumbers = new Array(byteCharacters.length)

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      let byteArray = new Uint8Array(byteNumbers);
      let blob = new Blob([byteArray], { type: 'application/pdf' });

      // this.persistence.set('blob', blob);
      // EDGE only: this is a workaround about the blob management in EDGE. For Chrome or Firefox just use the standard "else"
      if (window.navigator.msSaveOrOpenBlob) {
        this.mostrarLoading=false;
        window.navigator.msSaveOrOpenBlob(blob)
      } else {
        var fileURL = URL.createObjectURL(blob);
        this.mostrarLoading=false;
        window.open(fileURL);        
      }

    })
  );
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
     left: '48%',
   }

 dialogConfig.maxHeight = 500;
 dialogConfig.maxWidth = 400;


 switch (fromcase) {
   case 0:
     let message = this.mailList.filter(x => x.ID === id);
     dialogConfig.data = message[0].CONTENIDO_MENSAJE;
     let popUp = this.dialog.open(ModalTemplateComponent, dialogConfig);
     popUp.afterClosed().subscribe(ret => {
      //  console.log('This was closed.')
     });
     break;
   case 1:
       let message1 = this.mailList.filter(x => x.ID === id);
       dialogConfig.data = this.imgComprobante;
       let popUp1 = this.dialog.open(ModalTemplateComponent, dialogConfig);
       popUp1.afterClosed().subscribe(ret => {
        // console.log('This was closed.')
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

}
