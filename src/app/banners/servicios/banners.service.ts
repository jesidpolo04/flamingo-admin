import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { environment } from 'src/environments/environment';
import { Banner } from '../modelos/Banner';

@Injectable({
  providedIn: 'root'
})
export class BannersService extends Autenticable {
  private urlBackend:string

  constructor(private clienteHttp:HttpClient) { 
    super()
    this.urlBackend = environment.urlBackend
  }

  public obtenerBannerPrincipal(){
    const endpoint = '/api/v1/banners/obtener'
    return this.clienteHttp.get<{bannerDesktop: Banner, bannerMobile: Banner}>(
      `${this.urlBackend}${endpoint}`,
      { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion() }` }}
    )
  }

  public guardarBannerPrincipal(idAliado: string, linkAmigable: string, imagen?: File, imagenMobile?: File){
    const endpoint = `/api/v1/banners`
    const formData = new FormData()
    imagen ? formData.append('imagen', imagen) : undefined;
    imagenMobile ? formData.append('imagenMobile', imagenMobile) : undefined;
    formData.append('idAliado', idAliado)
    formData.append('linkAmigable', linkAmigable)
    return this.clienteHttp.post(
      `${this.urlBackend}${endpoint}`,
      formData,
      { headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion() }` }}
    )
  }

}
