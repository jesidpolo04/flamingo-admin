import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TitleStrategy } from '@angular/router';
import { CabeceraService } from '../../servicios/cabecera.service';

@Component({
  selector: 'app-barra-navegacion',
  templateUrl: './barra-navegacion.component.html',
  styleUrls: ['./barra-navegacion.component.css']
})
export class BarraNavegacionComponent implements OnInit {
  @Output() usuarioQuiereCerrarSesion:EventEmitter<void>
  @Output() menuLateralDesplegado:EventEmitter<void>

  public tituloSeccion = '';
  public menuOpcionesDeUsuarioColapsado = true;

  constructor(private servicioCabecera:CabeceraService) {
    this.usuarioQuiereCerrarSesion = new EventEmitter<void>()
    this.menuLateralDesplegado = new EventEmitter<void>()
    this.servicioCabecera.suscribirseACambioDeTitulo().subscribe(tituloSeccion =>{
      this.tituloSeccion = tituloSeccion;
    })
  }

  ngOnInit(): void {
  }

  public abrirMenuLateral(){
    this.menuLateralDesplegado.emit()
  }

  public cerrarSesion(){
    this.usuarioQuiereCerrarSesion.emit()
  }
}
