import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paginacion } from '../modelos/compartido/Paginador';
import { Autenticable } from './compartido/Autenticable';
import { Departamento } from '../modelos/ubicaciones/Departamento';
import { Ciudad } from '../modelos/ubicaciones/Ciudad';
import { Ubicacion } from '../modelos/ubicaciones/Ubicacion';
import { FiltrosUbicaciones } from '../modelos/ubicaciones/FiltrosUbicaciones';
import { PeticionGuardarUbicacion } from '../modelos/ubicaciones/PeticionGuardarUbicacion';
import { PeticionActualizarUbicacion } from '../modelos/ubicaciones/PeticionActualizarUbicacion';

@Injectable({
  providedIn: 'root'
})
export class ServicioUbicaciones extends Autenticable {
  private urlBackend:string

  constructor(private http:HttpClient) { 
    super()
    this.urlBackend = environment.urlBackend
  }

  public guardarUbicacion(peticion: PeticionGuardarUbicacion){
    const endpoint = `/api/v1/ubicaciones`;
    return this.http.post<Ubicacion>(`${this.urlBackend}${endpoint}`, peticion, {
      headers: {
        Authorization: `Bearer ${this.obtenerTokenAutorizacion()}`
      }
    })  
  }

  public actualizarUbicacion(idUbicacion: string, peticion: PeticionActualizarUbicacion){
    const endpoint = `/api/v1/ubicaciones/${idUbicacion}`;
    return this.http.patch<Ubicacion>(`${this.urlBackend}${endpoint}`, peticion, {
      headers: {
        Authorization: `Bearer ${this.obtenerTokenAutorizacion()}`
      }
    })  
  }

  public obtenerDepartamentos(): Observable<Departamento[]> {
    const endpoint = `/api/v1/departamentos`;  
    return this.http.get<Departamento[]>(`${this.urlBackend}${endpoint}`, {
        headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` },
    });
  }

  public obtenerTodasLasCiudades(): Observable<Ciudad[]>{
    const endpoint = `/api/v1/ciudades`;
    return this.http.get<Ciudad[]>(`${this.urlBackend}${endpoint}`, {
        headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` },
    });
  }

  public obtenerCiudadesPorDepartamento(codigoDepartamento: string): Observable<Ciudad[]>{
    const endpoint = `/api/v1/ciudades/${codigoDepartamento}`;  
    return this.http.get<Ciudad[]>(`${this.urlBackend}${endpoint}`, {
      headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` },
    });
  }

  public obtenerUbicaciones(filtros: FiltrosUbicaciones): Observable<Ubicacion[]>{
    const endpoint = `/api/v1/ubicaciones/buscar`;  
    return this.http.post<Ubicacion[]>(`${this.urlBackend}${endpoint}`, filtros, {
        headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` },
    });
  }

  public listarUbicaciones(pagina: number, limite: number, filtros: FiltrosUbicaciones): Observable<{paginacion: Paginacion, ubicaciones: Ubicacion[]}>{
    const endpoint = `/api/v1/ubicaciones/listar/${pagina}/${limite}`;  
    return this.http.post<{paginacion: Paginacion, ubicaciones: Ubicacion[]}>(`${this.urlBackend}${endpoint}`, filtros, {
        headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` },
    });
  }

  public obtenerCiudadesDeUnAliado(idAliado: string): Observable<Ciudad[]>{
    const endpoint = `/api/v1/ubicaciones/ciudades-aliado/${idAliado}`;  
    return this.http.get<Ciudad[]>(`${this.urlBackend}${endpoint}`, {
        headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` },
    });
  }

  public cambiarEstadoUbicacion(idUbicacion: string): Observable<Ubicacion>{
    const endpoint = `/api/v1/ubicaciones/${idUbicacion}`;  
    return this.http.put<Ubicacion>(`${this.urlBackend}${endpoint}`, undefined, {
        headers: { Authorization: `Bearer ${this.obtenerTokenAutorizacion()}` },
    });
  }
}
