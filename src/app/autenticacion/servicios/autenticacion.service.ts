import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IniciarSesionRespuesta } from '../modelos/IniciarSesionRespuesta';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  private urlBackend:string
  public readonly llaveTokenLocalStorage = 'jwt'
  public readonly llaveExpiraLocalStorage = 'expira'
  public readonly llaveNombreUsuarioLocalStorage = 'nombreUsuario'
  public readonly llaveDocumentoUsuarioLocalStorage = 'documentoUsuario'

  constructor(private clientHttp:HttpClient) { 
    this.urlBackend = environment.urlBackend
  }

  public iniciarSesion(documento:string, clave:string):Observable<IniciarSesionRespuesta>{
    const endpoint = '/api/v1/usuarios/logueo'
    return this.clientHttp.post<IniciarSesionRespuesta>(`${this.urlBackend}${endpoint}`, {usuario: documento, clave})
  }

  public cerrarSesion(){
    localStorage.removeItem(this.llaveDocumentoUsuarioLocalStorage)
    localStorage.removeItem(this.llaveExpiraLocalStorage)
    localStorage.removeItem(this.llaveNombreUsuarioLocalStorage)
    localStorage.removeItem(this.llaveTokenLocalStorage)
  }

  public guardarInformacionInicioSesion(jwt:string, expira:number, nombreUsuario:string, documentoUsuario:string):void{
    console.log('Guardando Información de inicio de sesión')
    console.log('Nuevo token', jwt)
    const diferenciaDeMilisegundos = expira * 60 * 1000;
    const fechaActual = new Date().getTime()
    const fechaExpiracion = new Date(fechaActual + diferenciaDeMilisegundos)

    localStorage.setItem(this.llaveDocumentoUsuarioLocalStorage, documentoUsuario)
    localStorage.setItem(this.llaveNombreUsuarioLocalStorage, nombreUsuario)
    localStorage.setItem(this.llaveExpiraLocalStorage, fechaExpiracion.getTime().toString())
    localStorage.setItem(this.llaveTokenLocalStorage, jwt)
  }
}
