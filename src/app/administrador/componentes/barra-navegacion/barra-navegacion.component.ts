import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { TitleStrategy } from '@angular/router';
import { AutenticacionService } from 'src/app/autenticacion/servicios/autenticacion.service';
import { CabeceraService } from '../../servicios/cabecera.service';

@Component({
  selector: 'app-barra-navegacion',
  templateUrl: './barra-navegacion.component.html',
  styleUrls: ['./barra-navegacion.component.css']
})
export class BarraNavegacionComponent implements OnInit {
  @Output() usuarioQuiereCerrarSesion:EventEmitter<void>
  @Output() menuLateralDesplegado:EventEmitter<void>
  public nombreDeUsuario = ''
  public tituloSeccion = '';
  public menuOpcionesDeUsuarioColapsado = true;

  constructor(private servicioCabecera:CabeceraService, private servicioAutenticacion:AutenticacionService) {
    this.usuarioQuiereCerrarSesion = new EventEmitter<void>()
    this.menuLateralDesplegado = new EventEmitter<void>()
    this.servicioCabecera.suscribirseACambioDeTitulo().subscribe(tituloSeccion =>{
      this.tituloSeccion = tituloSeccion;
    })
  }

  ngOnInit(): void {
    this.nombreDeUsuario = this.obtenerNombreDeUsuario()
  }

  public abrirMenuLateral(){
    this.menuLateralDesplegado.emit()
  }

  public cerrarSesion(){
    this.usuarioQuiereCerrarSesion.emit()
  }

  public obtenerNombreDeUsuario():string{
    const nombreUsuario = localStorage.getItem(this.servicioAutenticacion.llaveNombreUsuarioLocalStorage)
    if(!nombreUsuario) return 'Usuario';
    else return nombreUsuario;
  }
}
