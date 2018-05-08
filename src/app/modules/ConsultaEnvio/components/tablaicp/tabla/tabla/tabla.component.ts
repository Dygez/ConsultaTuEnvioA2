import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslationService } from '../../../../services/translation.service'

// import { TooltipModule } from 'primeng/primeng';

declare var $: any;
declare var Table2Excel: any;

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {

  // Datos Excel
  @Input() DatosExcel: Array<any> = [];

  @Input() tablaS: string;
  @Input() noData: boolean;
  @Input() colspan: number;
  // Table values
  @Input() public rows: Array<any> = [];

  @Input()
  public set config(conf: any) {
    if (!conf.className) {
      conf.className = 'table-striped table-bordered';
    }
    if (conf.className instanceof Array) {
      conf.className = conf.className.join(' ');
    }

    this._config = conf;
  }

  // Outputs (Events)
  @Output() public tableChanged: EventEmitter<any> = new EventEmitter();
  @Output() public cellClicked: EventEmitter<any> = new EventEmitter();
  @Output() public cellSelected: EventEmitter<any> = new EventEmitter();

  public showFilterRow: Boolean = false;
  public falta: string;
  public danado: string;

  p = '<img style="width:20px;cursor:pointer" src="./assets/basura.png"/>';

  @Input()
  public set columns(values: Array<any>) {
    this._columns = [];
    values.forEach((value: any) => {
      if (value.filtering) {
        this.showFilterRow = true;
      }
      if (value.className && value.className instanceof Array) {
        value.className = value.className.join(' ');
      }
      const column = this._columns.find((col: any) => col.name === value.name);
      if (column) {
        Object.assign(column, value);
      }
      if (!column) {
        this._columns.push(value);
      }
    });
  }

  private _columns: Array<any> = [];
  private _config: any = {};

  public constructor(private sanitizer: DomSanitizer) {
  }

  ngOnInit() {

  }

  public sanitize(html: string, e: any): SafeHtml {
    const parent = $()
    const s = this.sanitizer.bypassSecurityTrustHtml(html);
    return s;
  }

  public get columns(): Array<any> {
    return this._columns;
  }

  public get config(): any {
    return this._config;
  }

  public get configColumns(): any {
    const sortColumns: Array<any> = [];
    // console.log(this.columns);
    this.columns.forEach((column: any) => {
      if (column.sort) {
        sortColumns.push(column);
      }
    });

    return { columns: sortColumns };
  }

  public onChangeTable(column: any): void {
    this._columns.forEach((col: any) => {
      if (col.name !== column.name && col.sort !== false) {
        col.sort = '';
      }
    });
    this.tableChanged.emit({ sorting: this.configColumns });
  }

  public getData(row: any, propertyName: string): string {
    if (propertyName === undefined) { return ''; }
    const j = propertyName.split('.').reduce((prev: any, curr: string) =>
      prev[curr], row
    );
    return j;
  }

  public getDatoClass(row: any) {
    return row.CLASE;
  }

  public getFlecha(titulo: string, config: any, orden: string) {
    let response = '';
    if (orden === 'asc') {
      response = `<span>${ titulo } <i class="pull-right fas fa-angle-up" > </i></span>`;
    } else if (orden === 'desc') {
      response = `<span>${ titulo } <i class="pull-right fas fa-angle-down" > </i></span>`;
    } else {
      response = `<span>${ titulo }  </span>`;
    }
    return response;

  };

  public cellClick(e, row: any, column: any): void {
    this.cellClicked.emit({ row, column, e });
  }

  // public cellChange(e, row: any, column: any): void {
  //   this.cellSelected.emit({ row, column, e });
  // }
  // public oncellChange(e, row: any, column: any): void {
  //   e.preventDefault();
  //   // this.cellSelected.emit({ row, column, e });
  // }


  public exportarExcel() {
    const table2excel = new Table2Excel();
    if (!this.config.nombreExcel) {
      this.config.nombreExcel = 'Export';
    }
    // tabla
    const tabla = $('#tablaExcel').attr({ 'data-excel-name': this.config.nombreExcel });
    tabla.empty();
    tabla.css('display', 'block');
    // Cabecera
    const trHead = $('<thead>');

    const trCabecera = $('<tr>');
    this.columns.map((o) => {
      if (!o.noExcel) {
        const th = $('<th>').text(o.title);
        trCabecera.append(th);
      }
    });
    trHead.append(trCabecera);
    // Body
    const trBody = $('<tbody>');
    this.DatosExcel.map((row) => {
      const tr = $('<tr>');
      this.columns.map((col) => {
        let dato = this.getData(row, col.name);
        if (col.isDate) {
          dato = this.formatFecha(dato);
        }
        const td = $('<td>');
        const aplicar = col.applyFormtExcel;
        const noExcel = col.noExcel;
        if (!noExcel) {
          if (aplicar) {
            const text = dato == null ? '' : dato.toString();
            td.text(`${text}`);
            td.attr({ 'title': 'APLICAR' });
          } else {
            const text = dato == null ? '' : dato.toString();
            td.text(text);
          }
          tr.append(td);
        }
      });
      trBody.append(tr);
    });
    // Añado la cabecera y el body a la tabla
    tabla.append(trHead);
    tabla.append(trBody);
    const fecha = new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
    const fechaActual = fecha.format(new Date());


    table2excel.export(document.getElementById('tablaExcel'), `${this.config.nombreExcel}-${fechaActual}`);
    tabla.css('display', 'none');
  };

  idAux(id: number, name: string) {
    return `${name}-${id}`;
  }

  private formatFecha(dato: string): string {
    const fechaDate = new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const nuevaFecha = Date.parse(dato);
    return fechaDate.format(nuevaFecha);
  }

}
