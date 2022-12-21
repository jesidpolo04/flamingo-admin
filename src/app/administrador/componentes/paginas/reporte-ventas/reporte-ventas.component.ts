import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {  Chart } from 'chart.js';
import { Aliado } from 'src/app/administrador/modelos/aliados/Aliado';
import { CriteriosBusquedaVentas } from 'src/app/administrador/modelos/ventas/CriteriosBusquedaVentas';
import { TotalVentas } from 'src/app/administrador/modelos/ventas/TotalVentas';
import { Venta } from 'src/app/administrador/modelos/ventas/Venta';
import { AliadosService } from 'src/app/administrador/servicios/aliados.service';
import { CabeceraService } from 'src/app/administrador/servicios/cabecera.service';
import { VentasService } from 'src/app/administrador/servicios/ventas.service';
import { establecerFecha, formatearFecha, MESES } from 'src/app/administrador/utilidades/Fechas';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-reporte-ventas',
  templateUrl: './reporte-ventas.component.html',
  styleUrls: ['./reporte-ventas.component.css']
})
export class ReporteVentasComponent implements OnInit, AfterViewInit {
  @ViewChild('tablaVentas') tablaVentas!:ElementRef
  @ViewChild('baseChart') canvas!:ElementRef
  public descripcionDeFecha:string = ''
  public totalRegistros = 0;
  public totalRegistrosTotalesVentasAliados = 0;
  public totalVentas = 0;
  public pagina = 1;
  public paginaTotalesVentasAliados = 1;
  public porPagina = 10;
  public porPaginaTotalesVentasAliados = 10;
  public ventas:Venta[] = []
  public aliados:Aliado[] = []
  public totalesVentasAliados:TotalVentas[] = []
  public formulario:FormGroup
  public criterios:CriteriosBusquedaVentas
  public grafico?:Chart
  public labels:string[] = []
  public data:number[] = []
  public coloresGrafico: string[] = ['#4E73DF', '#36B9CC', '#1CC88A']

  public constructor(private servicioAliados:AliadosService, private servicioVentas:VentasService, private servicioCabecera:CabeceraService) {
    this.servicioCabecera.actualizarTitulo('Consulta de reporte de ventas')
    const hoy = new Date()
    this.formulario = new FormGroup({
      fechaInicial: new FormControl(`${hoy.getFullYear()}-${hoy.getMonth() + 1}-${hoy.getDate()}`),
      fechaFinal: new FormControl(`${hoy.getFullYear()}-${hoy.getMonth() + 1}-${hoy.getDate()}`),
      asesor: new FormControl(''),
      aliado: new FormControl(''),
      correo: new FormControl(''),
      termino: new FormControl('')
    })
    this.criterios = this.obtenerCriteriosDeBusqueda()
    this.generarDescripcionDeFechas()
  }

  ngOnInit(): void {
    this.servicioAliados.obtenerAliados(1, 10000).subscribe(respuesta=>{
      this.aliados = respuesta.aliados
    })
    this.obtenerTotalesVentasAliados(this.criterios, 1, this.porPagina)
    this.obtenerVentas(this.criterios, 1, this.porPagina)
    this.obtenerTotalVentas(this.criterios)
  }

  ngAfterViewInit(): void {
    this.renderizarGrafico(this.labels, this.data)
  }

  public obtenerVentas(criterios:CriteriosBusquedaVentas, pagina:number, porPagina:number){
    this.servicioVentas.buscarVentas(criterios, pagina, porPagina).subscribe(respuesta => {
      this.ventas = respuesta.ventas.map(venta => {
        venta.fechaOrden = formatearFecha(venta.fechaOrden)
        return venta
      });
      this.totalRegistros = respuesta.paginacion.totalRegistros;
    })
  }

  public cambiarPaginaVentas(pagina:number){
    this.obtenerVentas(this.criterios, pagina, this.porPagina)
  }

  public cambiarPorPaginaVentas(pagina:string){
    this.porPagina = parseInt(pagina)
    this.obtenerVentas(this.criterios, 1, this.porPagina)
  }

  public obtenerTotalVentas(criterios:CriteriosBusquedaVentas){
    this.servicioVentas.obtenerTotalVentas(criterios).subscribe(respuesta=>{
      this.totalVentas = respuesta.total
    })
  }

  public obtenerTotalesVentasAliados(criterios:CriteriosBusquedaVentas, pagina:number, porPagina:number){
    this.servicioVentas.obtenerTotalizados(criterios, pagina, porPagina).subscribe(respuesta => {
      this.totalesVentasAliados = respuesta.totalizados;
      this.totalRegistrosTotalesVentasAliados = respuesta.paginacion.totalRegistros;
      this.labels = this.totalesVentasAliados.map(totalVentaAliado => totalVentaAliado.aliadoNombre)
      this.data = this.totalesVentasAliados.map(totalVentaAliado => totalVentaAliado.totalVentas)
      this.actualizarDataGrafico()
    })
  }

  public cambiarPaginaTotalesVentasAliados(pagina:number){
    this.obtenerTotalesVentasAliados(this.criterios, pagina, this.porPagina)
  }

  public cambiarPorPaginaTotalesVentasAliados(pagina:string){
    this.porPaginaTotalesVentasAliados = parseInt(pagina)
    this.obtenerVentas(this.criterios, 1, this.porPaginaTotalesVentasAliados)
  }

  public obtenerCriteriosDeBusqueda():CriteriosBusquedaVentas{
    const fechaInicial = this.formulario.controls['fechaInicial']
    const fechaFinal = this.formulario.controls['fechaFinal']
    const asesor = this.formulario.controls['asesor']
    const aliado = this.formulario.controls['aliado']
    const correo = this.formulario.controls['correo']
    const termino = this.formulario.controls['termino']
    return new CriteriosBusquedaVentas(
      fechaInicial && fechaInicial.value !== '' ? establecerFecha(fechaInicial.value, 0, 0, 0, 0) : undefined,
      fechaFinal && fechaFinal.value !== '' ? establecerFecha(fechaFinal.value, 23, 59, 59, 999) : undefined, 
      correo && correo.value !== '' ? correo.value : undefined,
      asesor && asesor.value !== '' ? asesor.value : undefined, 
      aliado && aliado.value !== '' ? aliado.value : undefined,
      undefined,
      termino && termino.value !== '' ? termino.value : undefined
    )
  }

  public cambiarTermino(termino:string){
    this.formulario.controls['termino'].setValue(termino)
  }

  public generarDescripcionDeFechas(){
    const fechaInicial = this.criterios.fechaInicial
    const fechaFinal = this.criterios.fechaFinal
    if(!fechaInicial && !fechaFinal){
      this.descripcionDeFecha = `Desde siempre`
    }
    if(fechaInicial && !fechaFinal){
      this.descripcionDeFecha = `Desde el ${fechaInicial.getDate()} de ${MESES[fechaInicial.getMonth()]} de ${fechaInicial.getFullYear()}`
    }
    if(fechaFinal && !fechaInicial){
      this.descripcionDeFecha = `Hasta el ${fechaFinal.getDate()} de ${MESES[fechaFinal.getMonth()]} de ${fechaFinal.getFullYear()}`
    }
    if(fechaInicial && fechaFinal){
      if( 
          fechaInicial.getFullYear() === fechaFinal.getFullYear() &&
          fechaInicial.getMonth() === fechaFinal.getMonth() &&
          fechaInicial.getDate() === fechaFinal.getDate()
        ){
          console.log('Entro a la condi')
          this.descripcionDeFecha = `${fechaInicial.getDate()} de ${MESES[fechaInicial.getMonth()]} de ${fechaInicial.getFullYear()}`
          return
        }
    }
    if(fechaInicial && fechaFinal){
      this.descripcionDeFecha = `Del ${fechaInicial.getDate()} de ${MESES[fechaInicial.getMonth()]} de ${fechaInicial.getFullYear()}`
      this.descripcionDeFecha += ` hasta el ${fechaFinal.getDate()} de ${MESES[fechaFinal.getMonth()]} de ${fechaFinal.getFullYear()}`
    }
    
  }

  public aplicarFiltros():void{
    this.criterios = this.obtenerCriteriosDeBusqueda()
    this.obtenerVentas(this.criterios, 1, this.porPagina)
    this.obtenerTotalesVentasAliados(this.criterios, 1, this.porPaginaTotalesVentasAliados)
    this.obtenerTotalVentas(this.criterios)
    this.generarDescripcionDeFechas()
  }

  public renderizarGrafico(labels:string[], data:number[]){
    this.grafico = new Chart(this.canvas.nativeElement , {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: this.obtenerColoresDeBarras(this.labels, this.coloresGrafico)
        }]
      },
      options: {
        plugins:{
          legend: {
            display: false
          }
        },
        scales: {
          xAxis: {
            grid:{
              display: false
            }
          }
        }
      },
    })
  }

  public actualizarDataGrafico(){
    this.grafico!.data.labels = this.labels;
    this.grafico!.data.datasets = [{data: this.data, backgroundColor: this.obtenerColoresDeBarras(this.labels, this.coloresGrafico)}]
    this.grafico!.update()
  }

  private obtenerColoresDeBarras(labels:string[], colores:string[]):string[]{
    let coloresDeBarras:string[] = []
    let indice = 0;
    if(labels.length === 0) return [];
    for(let i = 0 ; i < labels.length ; i++){
      coloresDeBarras.push(colores[indice])
      indice ++;
      if(indice === colores.length) indice = 0;
    }
    return coloresDeBarras;
  }

  public exportarExcel(){
    let nombre = "Reporte de ventas.xlsx"
    if(this.formulario.controls['fechaInicial'].value === this.formulario.controls['fechaFinal'].value){
      nombre = `Reporte de ventas ${this.formulario.controls['fechaInicial'].value}.xlsx`
    }
    nombre = `Reporte de ventas de ${this.formulario.controls['fechaInicial'].value} a ${this.formulario.controls['fechaFinal'].value}.xlsx`
    let element = this.tablaVentas.nativeElement
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    const book: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(book, worksheet, 'Sheet1');

    XLSX.writeFile(book, nombre);
  }

}
