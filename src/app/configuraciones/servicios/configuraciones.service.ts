import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracionesService extends Autenticable {
  private urlBackend:string

  constructor(private clienteHttp:HttpClient) { 
    super()
    this.urlBackend = environment.urlBackend
  }

  guardarImagenModalRedireccionDesktop(imagen: File){
    const endpoint = `/api/v1/configuraciones/imagen-modal-desktop`
    const formData = new FormData()
    formData.append('imagen', imagen)
    return this.clienteHttp.patch(
        `${this.urlBackend}${endpoint}`, 
        formData,
        { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion() }` }} 
    )
  }

  guardarImagenModalRedireccionMobile(imagen: File){
    const endpoint = `/api/v1/configuraciones/imagen-modal-mobile`
    const formData = new FormData()
    formData.append('imagen', imagen)
    return this.clienteHttp.patch(
        `${this.urlBackend}${endpoint}`, 
        formData,
        { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion() }` }} 
    )
  }

}
