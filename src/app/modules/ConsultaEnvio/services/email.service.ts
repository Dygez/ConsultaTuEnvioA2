import { Component, Injectable } from "@angular/core";
import { ConexionsService } from "app/modules/ConsultaEnvio/services/conexions.service";
import { Email } from '../model/email';
import { environment } from '@env/environment';
import { Http } from '@angular/http';


@Injectable()
export class GiveEmail {

    //Mail: Email = new Email;
    public BunchMail: Email[] = Array<Email>();

    constructor(private http: Http, private conexion: ConexionsService) {}

    returnMail(id_tx: string, index: number): Email {
            if (id_tx !== null) {
                let Mail: Email = new Email;
                const url = `${environment.api}/getmail?urldata=${id_tx}`;
                this.http.get(url).map(this.conexion.obtenerJson).subscribe(mail => {
                    Mail.SCL = mail.SCL;
                    Mail.DESTINATARIOS = mail.DESTINATARIOS;
                    Mail.CONTENIDO_MENSAJE = mail.CONTENIDO_MENSAJE;
                    Mail.TIPO_MAIL = mail.TIPO_MAIL;
                    Mail.ID = index;                        
                });
                this.BunchMail.push(Mail);
                return Mail;
            }
        }
}                


                // let mailProm = new Promise<Email>((resolve, reject) => {
                //     const url = `${environment.api}/getmail?urldata=${id_tx}`;
                //     this.http.get(url).map(this.conexion.obtenerJson).toPromise().then(
                //         async res => {
                //         await resolve(res);
                //         this.Mail.SCL = res.SCL;
                //         this.Mail.DESTINATARIOS = res.DESTINATARIOS;
                //         this.Mail.CONTENIDO_MENSAJE = res.CONTENIDO_MENSAJE;
                //         this.Mail.TIPO_MAIL = res.TIPO_MAIL;
                //         this.Mail.ID = index;
                //         //   return res;
                //         },
                //         msg => {
                //         reject(msg);
                //         }
                //     ).catch(dError => {
                //     });
                //     });
                //     //this.BunchMail.push(this.Mail);
                //     //console.log(this.Mail);
                //     return this.Mail;
                // }
                // else {
                //     return undefined;
                // }
