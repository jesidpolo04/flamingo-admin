import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paginacion } from '../modelos/compartido/Paginador';
import { CriteriosBusquedaVentas } from '../modelos/ventas/CriteriosBusquedaVentas';
import { TotalVentas } from '../modelos/ventas/TotalVentas';
import { Venta } from '../modelos/ventas/Venta';
import { Autenticable } from './compartido/Autenticable';

@Injectable({
  providedIn: 'root'
})
export class VentasService extends Autenticable{
  private urlBackend:string
  constructor(private clienteHttp:HttpClient) {
    super()
    this.urlBackend = environment.urlBackend
  }

  public obtenerTotalVentas(criterios:CriteriosBusquedaVentas)
  :Observable<{total:number}>{
    const endpoint = `/api/v1/ventas/total`;
    return this.clienteHttp
      .post<{total:number}>
      (
        `${this.urlBackend}${endpoint}`,
        {
          "fechaInicial": criterios.fechaInicial ? criterios.fechaInicial.toISOString() : null,
          "fechaFinal" : criterios.fechaFinal ? criterios.fechaFinal.toISOString() : null,
          "correoCliente": criterios.correoCliente,
          "asesor": criterios.asesor,
          "aliadoId": criterios.aliadoId,
          "categoriaId": criterios.categoriaId,
          "termino": criterios.termino
        },
        {headers: {Authorization: `Bearer ${this.obtenerTokenAutorizacion()}`}}
      )
  }

  
  public buscarVentas(criterios:CriteriosBusquedaVentas, pagina:number = 1, porPagina:number = 5)
  :Observable<{paginacion:Paginacion, ventas:Venta[]}>{
    const endpoint = `/api/v1/ventas/buscar?pagina=${pagina}&porPagina=${porPagina}`
    return this.clienteHttp
      .post<{paginacion:Paginacion, ventas:Venta[]}>
      (
        `${this.urlBackend}${endpoint}`,
        {
          "fechaInicial": criterios.fechaInicial ? criterios.fechaInicial.toISOString() : null,
          "fechaFinal" : criterios.fechaFinal ? criterios.fechaFinal.toISOString() : null,
          "correoCliente": criterios.correoCliente,
          "asesor": criterios.asesor,
          "aliadoId": criterios.aliadoId,
          "categoriaId": criterios.categoriaId,
          "termino": criterios.termino
        },
        {headers: {Authorization: `Bearer ${this.obtenerTokenAutorizacion()}`}}
      )
  }

  public obtenerTotalizados(criterios:CriteriosBusquedaVentas, pagina:number = 1, porPagina:number = 5)
  :Observable<{paginacion:Paginacion, totalizados:TotalVentas[]}>{
    const endpoint = `/api/v1/ventas/totales?pagina=${pagina}&porPagina=${porPagina}`
    return this.clienteHttp
      .post<{paginacion:Paginacion, totalizados:TotalVentas[]}>
      (
        `${this.urlBackend}${endpoint}`,
        {
          "fechaInicial": criterios.fechaInicial ? criterios.fechaInicial.toISOString() : null,
          "fechaFinal" : criterios.fechaFinal ? criterios.fechaFinal.toISOString() : null,
          "correoCliente": criterios.correoCliente,
          "asesor": criterios.asesor,
          "aliadoId": criterios.aliadoId,
          "categoriaId": criterios.categoriaId,
          "termino": criterios.termino
        },
        {headers: {Authorization: `Bearer ${this.obtenerTokenAutorizacion()}`}}
      )
  }
}
