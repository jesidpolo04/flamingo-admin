import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalCrearProductoComponent } from '../modal-crear-producto/modal-crear-producto.component';
import { Producto } from '../../modelos/Producto';
import { ProductosService } from '../../servicios/productos.service';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { ModalActualizarProductoComponent } from '../modal-actualizar-producto/modal-actualizar-producto.component';

@Component({
  selector: 'app-pagina-gestion-productos',
  templateUrl: './pagina-gestion-productos.component.html',
  styleUrls: ['./pagina-gestion-productos.component.css']
})
export class PaginaGestionProductosComponent implements OnInit {
  @ViewChild('popup') popup!:PopupComponent
  @ViewChild('modalCrear') modalCrear!: ModalCrearProductoComponent
  @ViewChild('modalActualizar') modalActualizar!: ModalActualizarProductoComponent

  productos:Producto[] = []

  constructor(private servicioProductos: ProductosService) { }

  ngOnInit(): void {
    this.obtenerProductos()
  }

  cambiarEstadoProducto(idProducto: string){
    this.servicioProductos.cambiarEstadoProducto(idProducto).subscribe({
      next: ( producto )=>{
        this.popup.abrirPopupExitoso('Actualizado con éxito.')
      }
    })
  }

  obtenerProductos(){
    this.servicioProductos.obtenerProductos(false).subscribe({
      next: ( respuesta )=>{
        this.productos = respuesta.productos
      }
    })
  }

  abrirModalCrear(){
    this.modalCrear.abrir()
  }
  
  abrirModalActualizar(producto: Producto){
    this.modalActualizar.abrir(producto)
  }

}
