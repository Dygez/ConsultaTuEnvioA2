import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HtmlParser } from '@angular/compiler';
import { ParseTreeResult } from '@angular/compiler/src/ml_parser/parser';
import { Email } from 'app/modules/ConsultaEnvio/model/email';
import { browser } from 'protractor';
// import { EventEmitter } from '@angular/core/src/event_emitter';

@Component({
  selector: 'app-email',
  template: '<div [innerHTML]="messaggio"></div>'
})

export class EmailComponent implements OnInit {

@Input() messaggio: string = "";
@Output() onCreate: EventEmitter<string> = new EventEmitter<string>();

constructor() {   }

  ngOnInit() {
    if (this.messaggio !== "")
    {
      this.onCreate.emit(this.messaggio);
    }
  }

}
