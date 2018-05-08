import { Component, OnInit, Input, Output, OnChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tablaicp',
  templateUrl: './tablaicp.component.html'
})
export class TablaicpComponent implements OnInit {

  @Input() scrollVar: string;

  @Input() rows: Array<any>;
  @Input() columns: Array<any>;
  @Input() itemsPerPage: number;
  @Input() config: any;
  @Input() data: Array<any>;
  @Input() datosExcel: Array<any>;
  @Output() onClickItem = new EventEmitter<any>();
  @Output() onSelectedItem = new EventEmitter<any>();

  page: number;
  pageSliceStart: number;
  maxPageShow: number;
  paddingPages: number;
  numPages: number;
  numPagesObjList = [{ page: 1, textPage: '1' }];
  public records: number;
  showBtnStart = false;
  showBtnNext = false;
  showBtnPrev = false;
  showBtnEnd = false;

  noData: boolean;
  hidePaginator = false;
  //currentSort = 'asc';
  currentSort = 'desc';

  // private _tabla: TablaIcpService
  constructor() {
    
    this.page = 1;
    this.pageSliceStart = 0;

    // this._tabla.getDataTableRes().subscribe(
    //   dataRes => {
    //     // console.log('Escuchador', this.data);
    //     this.data = dataRes;
    //     this.onChangeTable(this.config);
    //   },
    //   err => console.error(err)
    // );
  }

  ngOnChanges() {
        this.iniciarCarga();

  }

  ngOnInit() {
    if (this.data.length === 0) {
      this.noData = true;
    }
    this.iniciarCarga();
  }

  iniciarCarga() {
    this.onChangeTable(this.config);
    this.records = this.data.length;
    this.numPages = Math.ceil(this.data.length / this.config.itemsPerPage);

    this.showBtnNext = this.records > this.config.itemsPerPage ? true : false;
    this.paddingPages = this.config.paginPaddingPages ? this.config.paginPaddingPages : 3;
    this.maxPageShow = this.paddingPages * 2 > this.numPages ? this.numPages : this.paddingPages * 2;
  }

  public changePage(page: any, data: Array<any> = this.data): Array<any> {
    const start = (page.page - 1) * page.itemsPerPage;
    const end = page.itemsPerPage > -1 ? (start + page.itemsPerPage) : data.length;
    return data.slice(start, end);
  }




  public changeSort(data: any, config: any): any {
    debugger;
    if (!config.sorting) {
      return data;
    }
    const columns = this.config.sorting.columns || [];
    let columnName: string = void 0;
    let sort: string = void 0;
    let volverPaginaUno = false;
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].sort !== '' && columns[i].sort !== false) {
        columnName = columns[i].name;
        sort = columns[i].sort;
        debugger;
      }
    }

    if (this.currentSort !== sort && sort !== undefined) { volverPaginaUno = true;  }
    if (!sort) {
      columnName = columns[0].name;
      sort = 'asc'
     }
    this.currentSort = sort

    if (!columnName) {
      return data;
    }


    let result = data.sort((previous: any, current: any) => {
      if (previous[columnName] > current[columnName]) {
        return sort === 'desc' ? -1 : 1;
      } else if (previous[columnName] < current[columnName]) {
        return sort === 'asc' ? -1 : 1;
      }
      return 0;
    });

    result = this.setPaginator(result, volverPaginaUno);

    // simple sorting
    return result;
  }

  public changeFilter(data: any, config: any): any {
    let filteredData: Array<any> = data;
    this.columns.forEach((column: any) => {

      if (column.filtering) {
        filteredData = filteredData.filter((item: any) => {
          const texto1 = item[column.name] == null ? '' : item[column.name].toString();
          return this.getCleanText(texto1).match(this.getCleanText(column.filtering.filterString));
        });
      }
    });

    if (!config.filtering) {
      return filteredData;
    }

    if (config.filtering.columnName) {
      return filteredData.filter((item: any) =>
        this.getCleanText(item[config.filtering.columnName].toString()).match(this.getCleanText(this.config.filtering.filterString)));

    }

    const tempArray: Array<any> = [];
    filteredData.forEach((item: any) => {
      let flag = false;
      this.columns.forEach((column: any) => {
        const texto = item[column.name] == null ? '' : item[column.name].toString();
        if (this.getCleanText(texto).match(this.getCleanText(this.config.filtering.filterString))) {
          flag = true;
        }
      });
      if (flag) {
        tempArray.push(item);
      }
    });
    filteredData = tempArray;

    filteredData = this.setPaginator(filteredData, false);

    return filteredData;
  }

  setPaginator(data, sorting: boolean): any {
    this.records = data.length;
    const currentNumPages = this.numPages;
    this.numPages = Math.ceil(data.length / this.config.itemsPerPage);

    if (this.numPages < currentNumPages || sorting) {
      this.showSelectedPage(1);
    }

    this.sliceStartPaginatorCalculator();
    this.setPagiatorObjectList();
  
    // this.showBtnNext = this.records >= this.itemsPerPage ? true : false;
    this.showBtnNext = this.page < this.numPages;
    this.showBtnEnd = this.page < this.numPages;
    this.showBtnPrev = this.page > 1;
    this.showBtnStart = this.page > 1;

    

    if (data.length === 0) {
      this.hidePaginator = true;
    } else {
      this.hidePaginator = false;
    }

    return data;

  }

  private getCleanText(texto: string): string {
    let textClean = '';
    textClean = texto.toLocaleLowerCase();
    textClean = textClean.replace('á', 'a');
    textClean = textClean.replace('é', 'e');
    textClean = textClean.replace('í', 'i');
    textClean = textClean.replace('ó', 'o');
    textClean = textClean.replace('ú', 'u');
    textClean = textClean.replace('ü', 'u');
    textClean = textClean.replace('à', 'a');
    textClean = textClean.replace('è', 'e');
    textClean = textClean.replace('ì', 'i');
    textClean = textClean.replace('ò', 'o');
    textClean = textClean.replace('ù', 'u');
    return textClean;
  }

  public onChangeTable(config: any, page: any = { page: this.page, itemsPerPage: this.config.itemsPerPage }): any {
    if (config.filtering) {
      Object.assign(this.config.filtering, config.filtering);
    }

    if (config.sorting) {
      Object.assign(this.config.sorting, config.sorting);
      if (config.sorting.columns) {
      }
    }

    const filteredData = this.changeFilter(this.data, this.config);
    const sortedData = this.changeSort(filteredData, this.config);

    if (this.config.excel) { this.datosExcel = sortedData; }

    if (this.page === 1) { page.page = 1 } // Ñapa -> Existen muchos emiters que llaman a este metodo y uno de ellos tiene en su contexto la pagina actual al filtrar o sortear
    this.rows = page && config.paging ? this.changePage(page, sortedData) : sortedData;
  }

  public onCellClick(data: any): any {
    this.onClickItem.emit(data);
  }
  public onCellChange(data: any): any {
    this.onSelectedItem.emit(data);
  }
  sliceStartPaginatorCalculator() {
    if ((this.page + this.paddingPages) > this.numPages) {
      this.maxPageShow = this.numPages;
      this.pageSliceStart = this.numPages - this.paddingPages;
    } else {
      this.maxPageShow = this.page + this.paddingPages;
      this.pageSliceStart = this.page - this.paddingPages;
    }

    if (this.maxPageShow === this.numPages) {
      this.pageSliceStart = this.numPages - this.paddingPages * 2;
    }
    if (this.pageSliceStart < 0) {
      this.maxPageShow = this.paddingPages * 2;
      this.pageSliceStart = 0;
    }
  }

  setPagiatorObjectList() {
    // Cargamos las paginas en una lista de objetos para mostrar en el paginador
    this.numPagesObjList = [];
    for (let i = 1; i <= this.numPages; i++) {
      this.numPagesObjList.push({ page: i, textPage: `${i}` })
    }
  }

  paginatorGridNext() {
    this.page++;
    this.sliceStartPaginatorCalculator();
    this.onChangeTable(this.config, { page: this.page, itemsPerPage: this.config.itemsPerPage });
    this.showBtnsPrevNext();
  }

  paginatorGridPrev() {
    this.page--;
    this.sliceStartPaginatorCalculator();
    this.onChangeTable(this.config, { page: this.page, itemsPerPage: this.config.itemsPerPage });
    this.showBtnsPrevNext();
  }

  paginatorGridStart() {
    this.page = 1;
    this.sliceStartPaginatorCalculator();
    this.onChangeTable(this.config, { page: this.page, itemsPerPage: this.config.itemsPerPage });
    this.showBtnsPrevNext();
  }

  paginatorGridEnd() {
    this.page = this.numPages;
    this.sliceStartPaginatorCalculator();
    this.onChangeTable(this.config, { page: this.page, itemsPerPage: this.config.itemsPerPage });
    this.showBtnsPrevNext();
  }

  showSelectedPage(selectedPage: number) {
    this.page = selectedPage;
    this.sliceStartPaginatorCalculator();
    this.onChangeTable(this.config, { page: this.page, itemsPerPage: this.config.itemsPerPage });
    this.showBtnsPrevNext();
  }

  showBtnsPrevNext() {
    this.showBtnNext = this.page < this.numPages;
    this.showBtnEnd = this.page < this.numPages;
    this.showBtnPrev = this.page > 1;
    this.showBtnStart = this.page > 1;
  }



}
