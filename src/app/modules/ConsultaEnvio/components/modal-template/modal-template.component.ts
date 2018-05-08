import {
  Component, Input, Output, OnChanges, EventEmitter,
  trigger, state, style, animate, transition, OnInit, HostListener, Inject
} from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtml, SafeResourceUrl } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgSwitch } from '@angular/common';
import { MainComponent } from '../main/main.component';
import { PersistenceService } from 'angular-persistence';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-modal-template',
  templateUrl: './modal-template.component.html',
  animations: [
    trigger('dialog', [
      transition('void => *', [
        animate(400), style({ transform: 'scale3d(.3, .3, .3)' })
      ]),
      transition('* => void', [
        animate(200, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
})
export class ModalTemplateComponent implements OnInit, OnChanges {

  @Input() closable = true;
  @Input() visible: boolean = true;
  @Input() NombreCliente: string;
  @Input() uriPDF: string;
  @Input() urlPDF: string;

  isIE = false;
  customData = '';
  inner: string;
  imgUrl: string;
  imgLink: SafeResourceUrl;

  public modalCase: number;

  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  constructor(private sanitizer: DomSanitizer, public main: MainComponent, public persistence: PersistenceService,
    public dialogRef: MatDialogRef<ModalTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      switch (this.persistence.get('modalOpt')) {
        case 0:
          //html
          this.inner = data;
          break;
        case 1:
          //img
          this.imgUrl = data;
          break;
        case 2:
          //pdf
          break;
        case 3:
          //link
          this.imgLink = this.sanitizer.bypassSecurityTrustResourceUrl(data);
        default:
          break;
      }

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      this.isIE = true;
    }
    
  }

  ngOnInit() { 
  };

  ngOnChanges() {
    if (this.visible) {
      this.viewPdf();
    }
  };

  viewPdf() {
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      this.verPdf();
    } else {
      this.customData = this.uriPDF;
    }
  };

    verPdf() {
    let data = '';
    data = this.uriPDF;
    let fileName = '';
    if (this.NombreCliente) {
      fileName = `Documento${this.NombreCliente}.pdf`;
    } else {
      fileName = `Informe de Discrepancia.pdf`;
    }
    let byteCharacters = atob(data);
    let byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    let byteArray = new Uint8Array(byteNumbers);
    let blob = new Blob([byteArray], { type: 'application/pdf' });
    this.close();

    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      let downloadLink = document.createElement('a');
      downloadLink.target = '_blank';
      downloadLink.download = fileName;
      let URL = window.URL;
      let downloadUrl = URL.createObjectURL(blob);
      downloadLink.href = downloadUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadUrl);
    }
  };

  close() {
    this.dialogRef.close('Cerrado');
    this.visible = false;
  };

  // PDF
  sanitize(url: string) {
    const dataPdf = 'data:application/pdf;base64,' + url;
    return this.sanitizer.bypassSecurityTrustResourceUrl(dataPdf);
  };

  sanitizeHTML(value: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(value);
  };

}

