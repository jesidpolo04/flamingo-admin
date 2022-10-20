import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Aliado } from '../modelos/aliados/Aliado';
import { CategoriaAliado } from '../modelos/aliados/CategoriaAliado';
import { PeticionActualizarAliado } from '../modelos/aliados/PeticionActualizarAliado';
import { PeticionActualizarCategoriaAliado } from '../modelos/aliados/PeticionActualizarCategoriaAliado';
import { PeticionAsignarCategorias } from '../modelos/aliados/PeticionAsignarCategoria';
import { PeticionCrearAliado } from '../modelos/aliados/PeticionCrearAliado';
import { Paginacion } from '../modelos/compartido/Paginador';
import { Autenticable } from './compartido/Autenticable';

@Injectable({
  providedIn: 'root'
})
export class AliadosService extends Autenticable {
  private urlBackend:string
  private cabecerasHttp:HttpHeaders

  constructor(private clienteHttp:HttpClient) { 
    super()
    this.urlBackend = environment.urlBackend
    this.cabecerasHttp = new HttpHeaders({
      Authorization: `Bearer ${this.obtenerTokenAutorizacion()}`
    })
  }

  public obtenerAliados(pagina:number, limite:number):Observable<{aliados: Aliado[], paginacion:Paginacion}>{
    const endpoint = `/api/v1/aliados/listar/${pagina}/${limite}?esAdministrador=true`
    return this.clienteHttp
            .get<{aliados: Aliado[], paginacion:Paginacion}>(`${this.urlBackend}${endpoint}`, { headers: this.cabecerasHttp })
  }

  public crearAliado(aliado:PeticionCrearAliado):Observable<any>{
    const endpoint = `/api/v1/aliados?esAdministrador=true`
    const formulario = new FormData()

    formulario.append('orden', aliado.orden.toString())
    formulario.append('nombre', aliado.nombre)
    formulario.append('nit', aliado.nit.toString())
    formulario.append('comision', aliado.comision)
    formulario.append('linkAmigable',  aliado.linkAmigable)
    formulario.append('logo', aliado.logo)
    formulario.append('tiempo', aliado.tiempo.toString())

    return this.clienteHttp.post<any>(`${this.urlBackend}${endpoint}`, formulario, { headers: this.cabecerasHttp })
  }

  public cambiarEstadoAliado(idAliado:string):Observable<any>{
    const endpoint = `/api/v1/aliados/estado/${idAliado}?esAdministrador=true`
    return this.clienteHttp.put<any>(`${this.urlBackend}${endpoint}`, undefined, {headers: this.cabecerasHttp})
  }

  public actualizarAliado(id:string, aliado:PeticionActualizarAliado):Observable<any>{
    const endpoint = `/api/v1/aliados/${id}?esAdministrador=true`
    const formulario = new FormData()
    for (const key in aliado) {
      let valor = aliado[key as keyof PeticionActualizarAliado];
      if(valor != '' && valor){
          if(typeof(valor) == 'number'){
            formulario.append(key, valor.toString())
          }else{
            formulario.append(key, valor)
          }
      }
    }
    return this.clienteHttp.put<any>(`${this.urlBackend}${endpoint}`, formulario, {headers: this.cabecerasHttp})
  }

  public listarCategorias(idAliado:string){
    const endpoint = `/api/v1/aliados/buscar/${idAliado}`
    return this.clienteHttp.get<{categorias:CategoriaAliado[]}>(`${this.urlBackend}${endpoint}`, {headers: this.cabecerasHttp})
  }

  public asignarCategoria(peticion:PeticionAsignarCategorias):Observable<any>{
    const endpoint = `/api/v1/categorias/asignar`
    const formulario = new FormData()
    console.log(peticion)
    formulario.append('imagen', peticion.imagen)
    formulario.append('categoria_id', peticion.categoriaId)
    formulario.append('aliado_id', peticion.aliadoId)
    formulario.append('link_amigable_aliado', peticion.linkAmigableAliado)
    formulario.append('destacada', peticion.destacada === true ? 'true' : 'false')
    console.log(formulario)
    return this.clienteHttp.post<any>(`${this.urlBackend}${endpoint}`, formulario, {headers: this.cabecerasHttp})
  }

  public cambiarEstadoCategoriaAliado(idAliado:string, idCategoria:string):Observable<any>{
    const endpoint = `/api/v1/aliados/categoria/${idAliado}/${idCategoria}?esAdministrador=true`
    return this.clienteHttp.put<any>(`${this.urlBackend}${endpoint}`, undefined, {headers: this.cabecerasHttp})
  }

  public actualizarCategoriaAliado(
    idAliado:string, 
    idCategoria:string, 
    peticion:PeticionActualizarCategoriaAliado
  ):Observable<any>{
    const formulario = new FormData()
    console.log(peticion)
    for (const key in peticion) {
      let valor = peticion[key as keyof PeticionActualizarCategoriaAliado];
      if(valor != '' && valor){
          if(typeof(valor) == 'number' || typeof(valor) == 'boolean'){
            formulario.append(key, valor.toString())
          }else{
            formulario.append(key, valor)
          }
      }
    }
    const endpoint = `/api/v1/categorias/editar/${idAliado}/${idCategoria}?esAdministrador=true`
    return this.clienteHttp.put<any>(`${this.urlBackend}${endpoint}`, formulario, {headers: this.cabecerasHttp})
  }
}