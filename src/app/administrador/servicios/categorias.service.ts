import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { filter, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Categoria } from '../modelos/categorias/Categoria';
import { Paginacion } from '../modelos/compartido/Paginador';
import { Autenticable } from './compartido/Autenticable';
import { firstValueFrom} from 'rxjs';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService extends Autenticable{
  private urlBackend:string
  private cabecerasHttp:HttpHeaders
  
  public constructor(private clienteHttp:HttpClient) {
    super()
    this.urlBackend = environment.urlBackend
    this.cabecerasHttp = new HttpHeaders({
      Authorization: `Bearer ${this.obtenerTokenAutorizacion()}`
    })
  }

  public async buscarCategorias(termino:string):Promise<Categoria[]>{
    const endpoint = `/api/v1/categorias/listar`;
    const observable = this.clienteHttp
            .get<{categorias: Categoria[], paginacion:Paginacion}>(
              `${this.urlBackend}${endpoint}`, 
              { headers: {Authorization: `Bearer ${this.obtenerTokenAutorizacion()}`} })
    const categorias = (await firstValueFrom(observable)).categorias
    return categorias.filter(categoria => {
      return categoria.nombre.includes(termino)
    })
  }

  public obtenerCategorias(pagina?:number, limite?:number):Observable<{categorias: Categoria[], paginacion:Paginacion}>{
    let endpoint = ''
    if(!pagina && !limite) endpoint = `/api/v1/categorias/listar`;
    else endpoint = endpoint = `/api/v1/categorias/listar/${pagina}/${limite}`;
    return this.clienteHttp
            .get<{categorias: Categoria[], paginacion:Paginacion}>(
              `${this.urlBackend}${endpoint}`, 
              { headers: {Authorization: `Bearer ${this.obtenerTokenAutorizacion()}`} })
  }

  public crearCategoria(nombre:string):Observable<any>{
    const endpoint = "/api/v1/categorias?esAdministrador=true"
    return this.clienteHttp.post(
      `${this.urlBackend}${endpoint}`, 
      {nombre} , 
      {headers: {Authorization: `Bearer ${this.obtenerTokenAutorizacion()}`}})
  }

  public actualizarCategoria(id:string, nombre:string):Observable<any>{
    const endpoint = `/api/v1/categorias/${id}?esAdministrador=true`
    return this.clienteHttp.put(
      `${this.urlBackend}${endpoint}`, 
      {nombre}, 
      {headers: {Authorization: `Bearer ${this.obtenerTokenAutorizacion()}`}})
  }
}
