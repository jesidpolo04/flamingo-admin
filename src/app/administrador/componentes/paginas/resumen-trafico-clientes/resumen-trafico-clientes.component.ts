import { Component, OnInit } from '@angular/core';
import { CriteriosBusquedaMarcaciones } from 'src/app/administrador/modelos/trafico/CriteriosBusquedaMarcaciones';
import { Estadisticas } from 'src/app/administrador/modelos/trafico/Estadisticas';
import { CriteriosBusquedaVentas } from 'src/app/administrador/modelos/ventas/CriteriosBusquedaVentas';
import { TraficoService } from 'src/app/administrador/servicios/trafico.service';
import { VentasService } from 'src/app/administrador/servicios/ventas.service';

@Component({
  selector: 'app-resumen-trafico-clientes',
  templateUrl: './resumen-trafico-clientes.component.html',
  styleUrls: ['./resumen-trafico-clientes.component.css']
})
export class ResumenTraficoClientesComponent implements OnInit {
  public estadisticas?:Estadisticas
  public totalVentas?:number

  constructor(private servicioTrafico:TraficoService, private servicioVentas:VentasService) { }

  ngOnInit(): void {
    this.servicioTrafico.obtenerEstadisticasMarcaciones(new CriteriosBusquedaMarcaciones(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      1
    )).subscribe(estadisticas => {
      this.estadisticas = estadisticas
    })

    this.servicioVentas.obtenerTotalVentas(new CriteriosBusquedaVentas(
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined
    )).subscribe(respuesta => {
      this.totalVentas = respuesta.total
    })
  }

}
