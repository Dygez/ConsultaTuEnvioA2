import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ConsultaEnvioService } from '../../services/consulta-envio.service';
import { MainComponent } from 'app/modules/ConsultaEnvio/components/main/main.component';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatDialog, MatDialogModule, MatDialogConfig } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ConexionsService } from 'app/modules/ConsultaEnvio/services/conexions.service';
import { Image } from 'app/modules/ConsultaEnvio/model/image';
import { Email } from 'app/modules/ConsultaEnvio/model/email';
import { HttpResponse } from 'selenium-webdriver/http';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { PersistenceService } from 'angular-persistence/src/services/persistence.service';
import { ModalTemplateComponent} from 'app/modules/ConsultaEnvio/components/modal-template/modal-template.component';

@Component({
  selector: 'app-comprobante',
  templateUrl: './comprobante.component.html',
  animations: [
    trigger('fadeInAnimation', [
      // route 'enter' transition
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s', style({ opacity: 1}))
      ])
    ])
  ],
})

export class ComprobanteComponent implements OnInit {

  comp: boolean = false;
  hide: string = 'hidden';
  glyph: string = "glyphicon glyphicon-plus";
  link: boolean = false;
  imgComprobante: string = "";

  public mailList: Array<Email> = [];

  constructor(public _ce: ConsultaEnvioService, private router: Router, private conexion: ConexionsService, private route: ActivatedRoute, public main: MainComponent, private persistence: PersistenceService, 
    private cd: ChangeDetectorRef, private x: MatDialogModule, public dialog: MatDialog) { }

  ngOnInit() {
    this.loadComprobante()
  }

  loadComprobante() {
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
      this.comp=false;
    }).unsubscribe;
    }
  });
  }

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

   // fromcase: 0 = html, 1 = image, 2 = pdf
   openDialog(id: number, fromcase: any, url: string): void {

    this.persistence.set('modalOpt', fromcase);

    const dialogConfig = new MatDialogConfig();
    dialogConfig.position = { 
        top: 'auto', 
        left: 'auto',
      }

    dialogConfig.maxHeight = 500;
    dialogConfig.maxWidth = 400;
    dialogConfig.hasBackdrop = true;


    switch (fromcase) {
      case 0:
        let message = this.mailList.filter(x => x.ID === id);
        dialogConfig.data = message[0].CONTENIDO_MENSAJE;
        let popUp = this.dialog.open(ModalTemplateComponent, dialogConfig);
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
            //  console.log('This was closed.')
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


