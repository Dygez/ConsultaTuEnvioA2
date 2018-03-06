import { Pipe, PipeTransform } from "@angular/core"
import { TranslationService } from "app/modules/ConsultaEnvio/services/translation.service";

@Pipe({
    name: 'Translate',
    pure: false
})
export class TranslationPipe implements PipeTransform{

    constructor(private translationService: TranslationService){}

    transform(value: string, args: string[]): any {
        if (this.translationService.translate(value) == undefined) {
            return value;
        }
        else {
            return this.translationService.translate(value);
        }
        
     }
}