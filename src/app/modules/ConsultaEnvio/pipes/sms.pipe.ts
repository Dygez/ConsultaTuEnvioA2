import { Pipe, PipeTransform } from '@angular/core';
import { Input } from '@angular/core';
import { Email } from 'app/modules/ConsultaEnvio/model/email';
import { GiveEmail } from 'app/modules/ConsultaEnvio/services/email.service';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({
  name: 'sms',
  pure: false
})
export class SmsPipe implements PipeTransform {
  @Input() id_Mail: string = '';

  mailHTML: Promise<string>|null=null;
  Mail: Email = new Email;

  constructor(private gMail: GiveEmail, private sanitized: DomSanitizer){}

 transform(value: string, args: string[]) {
   if (value !== null) {
     return this.sanitized.bypassSecurityTrustHtml(this.gMail.returnMail(value,0).CONTENIDO_MENSAJE)
    }
    else {
      return '' 
    }
  }

}
