import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Aliado } from 'src/app/administrador/modelos/aliados/Aliado';
import { Categoria } from 'src/app/administrador/modelos/categorias/Categoria';
import { CriteriosBusquedaMarcaciones } from 'src/app/administrador/modelos/trafico/CriteriosBusquedaMarcaciones';
import { Estadisticas } from 'src/app/administrador/modelos/trafico/Estadisticas';
import { Marcacion } from 'src/app/administrador/modelos/trafico/Marcacion';
import { AliadosService } from 'src/app/administrador/servicios/aliados.service';
import { CabeceraService } from 'src/app/administrador/servicios/cabecera.service';
import { CategoriasService } from 'src/app/administrador/servicios/categorias.service';
import { TraficoService } from 'src/app/administrador/servicios/trafico.service';
import { formatearFecha, MESES } from 'src/app/administrador/utilidades/Fechas';

@Component({
  selector: 'app-trafico-clientes',
  templateUrl: './trafico-clientes.component.html',
  styleUrls: ['./trafico-clientes.component.css']
})
export class TraficoClientesComponent implements OnInit {
  public totalRegistros = 0;
  public pagina = 1;
  public porPagina = 10;
  public estadisticas?:Estadisticas
  public criterios: CriteriosBusquedaMarcaciones
  public formulario:FormGroup
  public marcaciones:Marcacion[] = []
  public categorias:Categoria[] = []
  public aliados:Aliado[] = []
  public descripcionDeFecha:string = ''

  constructor(
    private servicioTrafico:TraficoService, 
    private servicioCategorias:CategoriasService, 
    private servicioAliados:AliadosService,
    private servicioCabecera:CabeceraService) { 
    this.servicioCabecera.actualizarTitulo('Consulta de tráfico de clientes')
    const hoy = new Date()
    this.formulario = new FormGroup({
      fechaInicial: new FormControl(`${hoy.getFullYear()}-${hoy.getMonth() + 1}-${hoy.getDate()}`),
      fechaFinal: new FormControl(`${hoy.getFullYear()}-${hoy.getMonth() + 1}-${hoy.getDate()}`),
      asesor: new FormControl(''),
      aliado: new FormControl(''),
      categoria: new FormControl(''),
      termino: new FormControl('')
    })
    this.criterios = this.obtenerCriteriosDeBusqueda()
    this.generarDescripcionDeFechas()
  }

  ngOnInit(): void {
    this.obtenerAliados()
    this.obtenerCategorias()
    this.obtenerMarcaciones(this.obtenerCriteriosDeBusqueda())
    this.obtenerEstadisticas(this.obtenerCriteriosDeBusqueda())
  }

  public obtenerEstadisticas(criterios:CriteriosBusquedaMarcaciones){
    this.servicioTrafico.obtenerEstadisticasMarcaciones(criterios).subscribe(estadisticas => {
      this.estadisticas = estadisticas
    })
  }

  public obtenerMarcaciones(criterios:CriteriosBusquedaMarcaciones, pagina:number = 1){
    this.servicioTrafico.buscarMarcaciones(criterios, pagina, this.porPagina).subscribe(respuesta => {
      this.marcaciones = respuesta.marcaciones.map(marcacion => {
        marcacion.fecha = formatearFecha(marcacion.fecha)
        return marcacion
      })
      this.totalRegistros = respuesta.paginacion.totalRegistros
    })
  }

  public obtenerCategorias():void{
    this.servicioCategorias.obtenerCategorias().subscribe(respuesta => {
      this.categorias = respuesta.categorias
    })
  }

  public obtenerAliados():void{
    this.servicioAliados.obtenerAliados().subscribe(respuesta => {
      this.aliados = respuesta.aliados
    })
  }

  public cambiarPagina(pagina:number){
    this.obtenerMarcaciones(
      this.criterios,
      pagina
    )
  }

  public cambiarPorPagina(porPagina:string){
    this.porPagina = parseInt(porPagina)
    this.obtenerMarcaciones(this.criterios, 1)
  }

  public obtenerCriteriosDeBusqueda():CriteriosBusquedaMarcaciones{
    const fechaInicial = this.formulario.controls['fechaInicial']
    const fechaFinal = this.formulario.controls['fechaFinal']
    const asesor = this.formulario.controls['asesor']
    const aliado = this.formulario.controls['aliado']
    const categoria = this.formulario.controls['categoria']
    const termino = this.formulario.controls['termino']
    return new CriteriosBusquedaMarcaciones(
      fechaInicial && fechaInicial.value !== '' ? new Date(fechaInicial.value) : undefined,
      fechaFinal && fechaFinal.value !== '' ? new Date(fechaFinal.value) : undefined, 
      undefined,
      asesor && asesor.value !== '' ? asesor.value : undefined, 
      aliado && aliado.value !== '' ? aliado.value : undefined, 
      categoria && categoria.value !== '' ? categoria.value : undefined, 
      termino && termino.value !== '' ? termino.value : undefined,
      2
    )
  }

  public cambiarTermino(termino:string){
    this.formulario.controls['termino'].setValue(termino)
  }

  public aplicarFiltros(){
    this.pagina = 1;
    this.criterios = this.obtenerCriteriosDeBusqueda()
    this.obtenerMarcaciones(this.criterios);
    this.obtenerEstadisticas(this.criterios);
    this.generarDescripcionDeFechas()
  }

  public generarDescripcionDeFechas(){
    const fechaInicial = this.criterios.fechaInicial
    const fechaFinal = this.criterios.fechaFinal
    if(!fechaInicial && !fechaFinal){
      this.descripcionDeFecha = `Desde siempre`
      return
    }
    if(fechaInicial && !fechaFinal){
      this.descripcionDeFecha = `Desde el ${fechaInicial.getUTCDate()} de ${MESES[fechaInicial.getUTCMonth()]} de ${fechaInicial.getUTCFullYear()}`
      return
    }
    if(fechaFinal && !fechaInicial){
      this.descripcionDeFecha = `Hasta el ${fechaFinal.getUTCDate()} de ${MESES[fechaFinal.getUTCMonth()]} de ${fechaFinal.getUTCFullYear()}`
      return
    }
    if(fechaInicial && fechaFinal){
      if( 
          fechaInicial.getUTCFullYear() === fechaFinal.getUTCFullYear() &&
          fechaInicial.getUTCMonth() === fechaFinal.getUTCMonth() &&
          fechaInicial.getUTCDate() === fechaFinal.getUTCDate()
        ){
          console.log('Entro a la condi')
          this.descripcionDeFecha = `${fechaInicial.getUTCDate()} de ${MESES[fechaInicial.getUTCMonth()]} de ${fechaInicial.getUTCFullYear()}`
          return
        }
    }
    if(fechaInicial && fechaFinal){
      this.descripcionDeFecha = `Del ${fechaInicial.getUTCDate()} de ${MESES[fechaInicial.getUTCMonth()]} de ${fechaInicial.getUTCFullYear()}`
      this.descripcionDeFecha += ` hasta el ${fechaFinal.getUTCDate()} de ${MESES[fechaFinal.getUTCMonth()]} de ${fechaFinal.getUTCFullYear()}`
    }
    
  }

}
