import { Component, OnInit } from '@angular/core';
import { Seccion } from '../../modelos/menu-lateral/Seccion';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit {

  isCollapsed = false;
  desplegado = true
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
    },
    {
      titulo: 'Gestión',
      modulos: [
        {
          nombre: 'Aliados',
          ruta: '/administrar/aliados'
        },
        {
          nombre: 'Categorías',
          ruta: '/administrar/categorias'
        },
        {
          nombre: 'Administradores',
          ruta: '/administrar/administradores'
        },
        {
          nombre: 'Productos',
          ruta: '/administrar/productos'
        },
        {
          nombre: 'Banners',
          ruta: '/administrar/banners'
        },
        {
          nombre: 'Configurar',
          ruta: '/administrar/configuraciones'
        }
      ]
    }
  ]

  constructor() { }

  ngOnInit(): void {
  }

  public abrir():void{
    this.desplegado = true
  }

  public cerrar():void{
    this.desplegado = false
  }

}
