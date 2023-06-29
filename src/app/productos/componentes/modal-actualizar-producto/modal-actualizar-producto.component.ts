import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Aliado } from 'src/app/administrador/modelos/aliados/Aliado';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { Producto } from '../../modelos/Producto';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductosService } from '../../servicios/productos.service';
import { AliadosService } from 'src/app/administrador/servicios/aliados.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-modal-actualizar-producto',
  templateUrl: './modal-actualizar-producto.component.html',
  styleUrls: ['./modal-actualizar-producto.component.css']
})
export class ModalActualizarProductoComponent implements OnInit {
  @ViewChild('popup') popup!: PopupComponent
  @ViewChild('modal') modal!: ElementRef
  producto?: Producto
  formulario: FormGroup
  aliados: Aliado[] = []

  constructor(private servicioModal: NgbModal, private servicioProductos: ProductosService, private servicioAliados: AliadosService) { 
    this.formulario = new FormGroup({
      nombre: new FormControl<string | undefined>(undefined, [ Validators.required ]),
      imagen: new FormControl<File | undefined>(undefined),
      aliado: new FormControl<string | undefined>(undefined, [ Validators.required ]),
      enlaceAmigable: new FormControl<string | undefined>(undefined, [ Validators.required ]),
    })
  }

  ngOnInit(): void {
    this.obtenerAliados()
  }

  obtenerAliados(){
    this.servicioAliados.obtenerAliados().subscribe({
      next: ( respuesta )=>{
        this.aliados = respuesta.aliados
      }
    })
  }

  abrir(producto: Producto){
    this.limpiarFormulario()
    this.producto = producto
    this.rellenarCampos(producto)
    this.servicioModal.open(this.modal, {
      size: 'xl'
    })
  }

  cerrar(){
    this.servicioModal.dismissAll()
  }


  limpiarFormulario(){
    this.formulario.reset()
  }

  rellenarCampos(producto: Producto){
    const controls = this.formulario.controls
    controls['nombre'].setValue(producto.nombre)
    controls['aliado'].setValue(producto.idAliado)
    controls['enlaceAmigable'].setValue(producto.linkAmigable)
  }

  actualizarProducto(){
    const controls = this.formulario.controls
    if(this.formulario.invalid){
      console.error(this.formulario.controls)
      this.popup.abrirPopupFallido('Formulario inválido.', 'Rellena correctamente todos los campos.')
      throw Error('Formulario inválido')
    }
    this.servicioProductos.actualizarProducto({
      idAliado: controls['aliado'].value,
      nombre: controls['nombre'].value,
      linkAmigable: controls['enlaceAmigable'].value,
      imagen: controls['imagen'].value,
    }, this.producto!.id).subscribe({
      next: ( respuesta )=>{
        this.cerrar()
        this.popup.abrirPopupExitoso('Se ha actualizado el producto con éxito.')
      },
      error: ( error: HttpErrorResponse ) => {
        console.log(error.error.message)
        this.popup.abrirPopupFallido('Ha ocurrido un error al momento de actualizar el producto.')
      }
    })
  }

}
