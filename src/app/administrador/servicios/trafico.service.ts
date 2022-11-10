import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { end } from '@popperjs/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paginacion } from '../modelos/compartido/Paginador';
import { CriteriosBusquedaMarcaciones } from '../modelos/trafico/CriteriosBusquedaMarcaciones';
import { Estadisticas } from '../modelos/trafico/Estadisticas';
import { Marcacion } from '../modelos/trafico/Marcacion';
import { Autenticable } from './compartido/Autenticable';

@Injectable({
  providedIn: 'root'
})
export class TraficoService extends Autenticable{
  private urlBackend:string
  constructor(private clienteHttp:HttpClient) {
    super()
    this.urlBackend = environment.urlBackend
  }

  public obtenerEstadisticasMarcaciones(criterios: CriteriosBusquedaMarcaciones):Observable<Estadisticas>{
    const endpoint = `/api/v1/marcacion/estadisticas`
    return this.clienteHttp
      .post<Estadisticas>(
        `${this.urlBackend}${endpoint}`,
        {
          "fechaInicial": criterios.fechaInicial ? criterios.fechaInicial.toISOString() : null,
          "fechaFinal" : criterios.fechaFinal ? criterios.fechaFinal.toISOString() : null,
          "correoCliente": criterios.correoCliente,
          "asesor": criterios.asesor,
          "aliadoId": criterios.aliadoId,
          "categoriaId": criterios.categoriaId,
          "termino": criterios.termino,
          "tipo": criterios.tipo
        },
        {headers: {Authorization: `Bearer ${this.obtenerTokenAutorizacion()}`}}
      )
  }

  public buscarMarcaciones(criterios:CriteriosBusquedaMarcaciones, pagina:number, limite:number)
  :Observable<{paginacion: Paginacion, marcaciones:Marcacion[]}>{
    const endpoint = `/api/v1/marcacion/busqueda?pagina=${pagina}&porPagina=${limite}`;
    return this.clienteHttp
      .post<{paginacion:Paginacion, marcaciones:Marcacion[]}>
      (
        `${this.urlBackend}${endpoint}`,
        {
          "fechaInicial": criterios.fechaInicial ? criterios.fechaInicial.toISOString() : null,
          "fechaFinal" : criterios.fechaFinal ? criterios.fechaFinal.toISOString() : null,
          "correoCliente": criterios.correoCliente,
          "asesor": criterios.asesor,
          "aliadoId": criterios.aliadoId,
          "categoriaId": criterios.categoriaId,
          "termino": criterios.termino,
          "tipo": criterios.tipo
        },
        {headers: {Authorization: `Bearer ${this.obtenerTokenAutorizacion()}`}}
      )
  }
}
