import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CabeceraService {

  private cambioDeTitulo = new Subject<string>()

  constructor() {}

  public actualizarTitulo(titulo:string):void{
    this.cambioDeTitulo.next(titulo)
  }

  public suscribirseACambioDeTitulo():Observable<string>{
    return this.cambioDeTitulo.asObservable()
  }
}
