import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Autenticable } from 'src/app/administrador/servicios/compartido/Autenticable';
import { environment } from 'src/environments/environment';
import { PeticionCrearProducto } from '../modelos/PeticionCrearProducto';
import { Producto } from '../modelos/Producto';
import { Paginacion } from 'src/app/administrador/modelos/compartido/Paginador';
import { PeticionActualizarProducto } from '../modelos/PeticionActualizarProducto';

@Injectable({
  providedIn: 'root'
})
export class ProductosService extends Autenticable {
  private urlBackend:string

  constructor(private clienteHttp:HttpClient) { 
    super()
    this.urlBackend = environment.urlBackend
  }

  crearProducto(peticion: PeticionCrearProducto){
    const endpoint = `/api/v1/productos`
    const formData = new FormData()
    formData.append('imagen', peticion.imagen)
    formData.append('nombre', peticion.nombre)
    formData.append('idAliado', peticion.idAliado)
    formData.append('linkAmigable', peticion.linkAmigable)
    peticion.tags ? formData.append('tags', JSON.stringify(peticion.tags)) : null;
    return this.clienteHttp.post<Producto>(
        `${this.urlBackend}${endpoint}`,
        formData,
        {headers: {Authorization: `Bearer ${this.obtenerTokenAutorizacion()}`} }
    )
  }

  actualizarProducto(peticion: PeticionActualizarProducto, idProducto: string){
    const endpoint = `/api/v1/productos/${idProducto}`
    const formData = new FormData()
    peticion.imagen ? formData.append('imagen', peticion.imagen) : null;
    peticion.nombre ? formData.append('nombre', peticion.nombre) : null;
    peticion.idAliado ? formData.append('idAliado', peticion.idAliado) : null;
    peticion.linkAmigable ? formData.append('linkAmigable', peticion.linkAmigable) : null;
    peticion.tags ? formData.append('tags', JSON.stringify(peticion.tags)) : null;
    return this.clienteHttp.patch<Producto>(
        `${this.urlBackend}${endpoint}`,
        formData,
        {headers: {Authorization: `Bearer ${this.obtenerTokenAutorizacion()}`} }
    )
  }

  cambiarEstadoProducto(idProducto: string){
    const endpoint = `/api/v1/productos/estado/${idProducto}`
    return this.clienteHttp.put<Producto>(
        `${this.urlBackend}${endpoint}`,
        undefined,
        {headers: {Authorization: `Bearer ${this.obtenerTokenAutorizacion()}`} }
    )
  }

  obtenerProductoPorId(idProducto: string){
    const endpoint = `/api/v1/productos/${idProducto}`
    return this.clienteHttp.get<Producto>(
        `${this.urlBackend}${endpoint}`,
        {headers: {Authorization: `Bearer ${this.obtenerTokenAutorizacion()}`} }
    )
  }

  obtenerProductos(pagina: number = 1, limite: number = 5, soloActivos: boolean = true){
    const endpoint = `/api/v1/productos?soloActivos=${soloActivos}&pagina=${pagina}&limite=${limite}`
    return this.clienteHttp.get<{paginacion:Paginacion, productos: Producto[]}>(
        `${this.urlBackend}${endpoint}`,
        {headers: {Authorization: `Bearer ${this.obtenerTokenAutorizacion()}`} }
    )
  }


}
