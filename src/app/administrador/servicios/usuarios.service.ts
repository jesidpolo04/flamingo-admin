import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paginacion } from '../modelos/compartido/Paginador';
import { Usuario } from '../modelos/usuarios/Usuario';
import { Autenticable } from './compartido/Autenticable';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService extends Autenticable{
  private urlBackend:string
  constructor(private clienteHttp:HttpClient) { 
    super()
    this.urlBackend = environment.urlBackend
  }

  public obtenerUsuarios(pagina:number = 1, porPagina:number = 10):Observable<{usuarios:Usuario[], paginacion:Paginacion}>{
    const endpoint = `/api/v1/usuarios/listar?pagina=${pagina}&porPagina=${porPagina}`
    return this.clienteHttp
      .get<{usuarios:Usuario[], paginacion:Paginacion}>(`${this.urlBackend}${endpoint}`, {headers: {Authorization: `Bearer ${this.obtenerTokenAutorizacion()}`}})
  }

  public crearUsuario(usuario:Usuario):Observable<any>{
    const endpoint = `/api/v1/usuarios`
    return this.clienteHttp
      .post(`${this.urlBackend}${endpoint}`, usuario, {headers: {Authorization: `Bearer ${this.obtenerTokenAutorizacion()}`}})
  }

  public actualizarUsuario(idUsuario:string, usuario:Usuario):Observable<any>{
    const endpoint = `/api/v1/usuarios/${idUsuario}`
    return this.clienteHttp
      .put(`${this.urlBackend}${endpoint}`, usuario, {headers: {Authorization: `Bearer ${this.obtenerTokenAutorizacion()}`}})

  }
}
