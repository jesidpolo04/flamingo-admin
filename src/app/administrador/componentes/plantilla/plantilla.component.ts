import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AutenticacionService } from 'src/app/autenticacion/servicios/autenticacion.service';
import { Modulo } from '../../modelos/menu-lateral/Modulo';
import { Seccion } from '../../modelos/menu-lateral/Seccion';
import { BarraNavegacionComponent } from '../barra-navegacion/barra-navegacion.component';
import { MenuLateralComponent } from '../menu-lateral/menu-lateral.component';

@Component({
  selector: 'app-plantilla',
  templateUrl: './plantilla.component.html',
  styleUrls: ['./plantilla.component.css']
})
export class PlantillaComponent implements OnInit {
  @ViewChild('menuLateral') menuLateral!:MenuLateralComponent
  @ViewChild('barraDeNavegacion') barraDeNavegacion!:BarraNavegacionComponent
  public secciones:Seccion[] = [
    {
      titulo: 'Tableros',
      modulos: [
        {
          nombre: 'Reporte de ventas',
          ruta: '/administrar/ventas'
        },
        {
          nombre: 'Tráfico de clientes',
          ruta: '/administrar/trafico'
        }
      ]
    }
  ]

  constructor(private servicioAutenticacion:AutenticacionService, private enrutador:Router) { }

  ngOnInit(): void {}

  public cerrarSesion():void{
    this.servicioAutenticacion.cerrarSesion();
    this.enrutador.navigateByUrl('/inicio-sesion')
  }

  public abrirMenuLateral(){
    this.menuLateral.abrir()
  }
}
