import { Component, OnInit, OnChanges } from '@angular/core';
import { ConsultaEnvioService } from 'app/modules/ConsultaEnvio/services/consulta-envio.service';
import { Observable } from 'rxjs/Observable';
import * as FileSaver from 'file-saver'; 
import { ConexionsService } from 'app/modules/ConsultaEnvio/services/conexions.service';
import { PersistenceService } from 'angular-persistence/src/services/persistence.service';


@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html'
})
export class DocumentsComponent implements OnInit {

mostrar: boolean = false;
mostrarLoading: boolean = false;
public filePDF: Blob;

  constructor(private _ce: ConsultaEnvioService, private conexion: ConexionsService, private persistence: PersistenceService) { 
  }

ngOnChange() {

}

  ngOnInit() {
    const query = this.persistence.get('queryString');
    this.conexion.getDocument(query).subscribe((t: any[]) => {
      if (t.length > 0) {
        this.mostrar = true;
      }
      else {this.mostrar = false;
      }
    })
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

}
