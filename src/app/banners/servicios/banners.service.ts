import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BannersService extends Autenticable {
  private urlBackend:string

  constructor(private clienteHttp:HttpClient) { 
    super()
    this.urlBackend = environment.urlBackend
  }

  public guardarBannerPrincipal(idAliado: string, imagen: File, imagenMobile: File, linkAmigable: string){
    const endpoint = `/api/v1/banners`
    const formData = new FormData()
    formData.append('imagen', imagen)
    formData.append('idAliado', idAliado)
    formData.append('imagenMobile', imagenMobile)
    formData.append('linkAmigable', linkAmigable)
    return this.clienteHttp.post(
      `${this.urlBackend}${endpoint}`,
      formData,
      { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion() }` }}
    )
  }

}
