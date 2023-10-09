import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { toString } from '@ng-bootstrap/ng-bootstrap/util/util';
import { CabeceraService } from 'src/app/administrador/servicios/cabecera.service';
import { formatearFecha } from 'src/app/administrador/utilidades/Fechas';
import { Aliado } from '../../../modelos/aliados/Aliado';
import { AliadosService } from '../../../servicios/aliados.service';
import { PopupComponent } from '../../popup/popup.component';
import { ModalActualizacionAliadoComponent } from './modal-actualizacion-aliado/modal-actualizacion-aliado.component';
import { ModalCreacionAliadoComponent } from './modal-creacion-aliado/modal-creacion-aliado.component';
import { ModalGestionCategoriasAliadoComponent } from './modal-gestion-categorias-aliado/modal-gestion-categorias-aliado.component';
import { ModalGestionUbicacionesComponent } from './modal-gestion-ubicaciones/modal-gestion-ubicaciones.component';

@Component({
  selector: 'app-gestion-de-aliados',
  templateUrl: './gestion-de-aliados.component.html',
  styleUrls: ['./gestion-de-aliados.component.css']
})
export class GestionDeAliadosComponent implements OnInit {
  @ViewChild('popup') popup!:PopupComponent
  @ViewChild('modalCreacionAliado') modalCreacionAliado!:ModalCreacionAliadoComponent
  @ViewChild('modalActualizacionAliado') modalActualizacionAliado!:ModalActualizacionAliadoComponent
  @ViewChild('modalGestionCategorias') modalGestionCategorias!:ModalGestionCategoriasAliadoComponent
  @ViewChild('modalGestionUbicaciones') modalGestionUbicaciones!:ModalGestionUbicacionesComponent
  public pagina = 1;
  public limite = 5;
  public total = 0;
  public aliados:Aliado[] = []

  constructor(private servicioAliados:AliadosService, private servicioCabecera:CabeceraService) { 
    this.servicioCabecera.actualizarTitulo('Gestión de aliados')
  }

  ngOnInit(): void {
    this.obtenerAliados(this.pagina, this.limite)
  }
  
  public obtenerAliados(pagina:number, porPagina:number){
    this.servicioAliados.obtenerAliados(pagina, porPagina).subscribe(respuesta =>{
      this.aliados = respuesta.aliados.map(aliado => {
        aliado.creacion = formatearFecha(aliado.creacion)
        return aliado
      });
      this.total = respuesta.paginacion.totalRegistros;
    })
  }

  public cambioDePagina(pagina:number):void{
    this.obtenerAliados(pagina, this.limite)
  }

  public cambiarPaginado(porPagina:string){
    const porPaginaNumero = parseInt(porPagina)
    this.limite = porPaginaNumero;
    this.refrescarListaDeAliados();
  }

  public cambiarEstadoAliado(indexAliado:number):void{
    console.log('cambiando estado aliado', indexAliado)
    this.servicioAliados.cambiarEstadoAliado(this.aliados[indexAliado].id).subscribe((respuesta:any)=>{
      this.aliados[indexAliado].estado = !this.aliados[indexAliado].estado 
      this.popup.abrirPopupExitoso('Guardado con éxito', undefined, undefined)
    }, (error:HttpErrorResponse)=>{
      const mensaje = error.error.mensaje? error.error.mensaje : 'No se pudo actualizar el estado del aliado'
    })
  }

  public refrescarListaDeAliados():void{
    this.obtenerAliados(this.pagina, this.limite)
  }

  public abrirModalCreacionAliado():void{
    this.modalCreacionAliado.abrir()
  }

  public abrirModalActualizacionAliado(aliado:Aliado):void{
    this.modalActualizacionAliado.abrir(aliado)
  }

  public abrirModalGestionCategorias(aliado:Aliado){
    this.modalGestionCategorias.abrir(aliado)
  }

  public abrirModalGestionUbicaciones(aliado: Aliado){
    this.modalGestionUbicaciones.abrir(aliado)
  }

  public copiarAlPortapapeles(texto:string){
    navigator.clipboard.writeText(texto)
    this.popup.abrirPopupExitoso('Copiado al portapapeles')
  }
}
