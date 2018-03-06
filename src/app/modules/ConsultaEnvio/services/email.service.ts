import { Component, Injectable } from "@angular/core";
import { ConexionsService } from "app/modules/ConsultaEnvio/services/conexions.service";
import { Email } from '../model/email';
import { environment } from '@env/environment';
import { Http } from '@angular/http';


@Injectable()
export class GiveEmail {

    Mail: Email = new Email;

    constructor(private http: Http, private conexion: ConexionsService) {}

    returnMail(id_tx: string): Email {
         if (id_tx !== null) {
            let mailProm = new Promise<Email>((resolve, reject) => {
                const url = `${environment.api}/getmail?urldata=${id_tx}`;
                this.http.get(url).map(this.conexion.obtenerJson).toPromise().then(
                    res => {
                      resolve(res);
                      this.Mail.SCL = res.SCL;
                      this.Mail.DESTINATARIOS = res.DESTINATARIOS;
                      this.Mail.CONTENIDO_MENSAJE = res.CONTENIDO_MENSAJE;
                      this.Mail.TIPO_MAIL = res.TIPO_MAIL;
                    //   return res;
                    },
                    msg => {
                      reject(msg);
                    }
                  ).catch(dError => {
                  });
                });
                return this.Mail;
            }
            else {
                return undefined;
            }
        }






        //     debugger;
        //     this.conexion.getEmailP(id_tx).then((res) => {
        //         debugger;
        //         console.log(res.SCL);
        //         return res.CONTENIDO_MENSAJE;
        //     })

        //     let prom = new Promise<Email>(res => {
        //         debugger;
        //         this.conexion.getEmailP(id_tx).then(f => {
        //             debugger;
        //             return prom.then;
        //             // if (prom.then !== null) {return prom.then;} else {return ''}
        //         });
        //     });




        // debugger;
        // if (id_tx !== null) {

        //     this.conexion.getEmail(id_tx).subscribe((sms: Email) => {
        //         debugger;
        //            this.Mail.SCL = sms.SCL;
        //            this.Mail.DESTINATARIOS = sms.DESTINATARIOS;
        //            this.Mail.TIPO_MAIL = sms.TIPO_MAIL;
        //           this.Mail.CONTENIDO_MENSAJE = sms.CONTENIDO_MENSAJE;
        //         });
        //     return this.Mail.CONTENIDO_MENSAJE; //!(this.Mail.CONTENIDO_MENSAJE);
        // }
        // else {
        //     return ''
        // }
    
}
