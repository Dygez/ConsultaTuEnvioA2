import { Component, Injectable } from "@angular/core";
import * as en from '../translations/translation_en-EN';
import * as es from '../translations/translation_es-ES';
import * as it from '../translations/translation_it-IT';
import * as pt from '../translations/translation_pt-PT';
import { MainComponent } from "app/modules/ConsultaEnvio/components/main/main.component";
import { AppComponent } from "app/app.component";
import { PersistenceService } from "angular-persistence/src/services/persistence.service";

@Injectable()
export class TranslationService {
    public userLang = navigator.language;
    public language = this.userLang;

    constructor(public app: AppComponent, private persistence: PersistenceService) {}

    translate(key: string): string {
        if (this.persistence.get('langValue') != null) {
            switch(this.persistence.get('langValue')) {
                case 0: {
                    return es.default[key]
                }
                case 1: {
                    if (en.default[key] != null) {
                        return en.default[key]
                    }
                    else { return es.default[key]}
                }
                case 2: {
                    if (pt.default[key] != null){
                        return pt.default[key] 
                    }
                    else {return es.default[key]}
                }
                case 3: {
                    if (it.default[key] != null) {
                        return it.default[key]
                    }
                    else {return es.default[key]}
                }
                default: {
                    return es.default[key]
                }
            }
        }
        else {
            return es.default[key]
        }
    }
}