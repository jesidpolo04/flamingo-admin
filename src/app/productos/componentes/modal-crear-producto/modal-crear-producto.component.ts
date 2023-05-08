import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { ProductosService } from '../../servicios/productos.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Aliado } from 'src/app/administrador/modelos/aliados/Aliado';
import { AliadosService } from 'src/app/administrador/servicios/aliados.service';

@Component({
  selector: 'app-modal-crear-producto',
  templateUrl: './modal-crear-producto.component.html',
  styleUrls: ['./modal-crear-producto.component.css']
})
export class ModalCrearProductoComponent implements OnInit {
  @ViewChild('popup') popup!: PopupComponent
  @ViewChild('modal') modal!: ElementRef
  formulario: FormGroup
  aliados: Aliado[] = []
  constructor(private servicioModal: NgbModal, private servicioProductos: ProductosService, private servicioAliados: AliadosService) { 
    this.formulario = new FormGroup({
      nombre: new FormControl<string | undefined>(undefined, [ Validators.required ]),
      imagen: new FormControl<File | undefined>(undefined, [ Validators.required ]),
      aliado: new FormControl<string | undefined>(undefined, [ Validators.required ]),
      enlaceAmigable: new FormControl<string | undefined>(undefined, [ Validators.required ]),
    })
  }

  ngOnInit(): void {
    this.obtenerAliados()
  }

  crearProducto(){
    const controls = this.formulario.controls
    if(this.formulario.invalid){
      console.error(this.formulario.controls)
      throw Error('Formulario inválido')
    }
    this.servicioProductos.crearProducto({
      idAliado: controls['aliado'].value,
      nombre: controls['nombre'].value,
      linkAmigable: controls['enlaceAmigable'].value,
      imagen: controls['imagen'].value,
    }).subscribe({
      next: ( respuesta )=>{
        this.popup.abrirPopupExitoso('Se ha creado el producto con éxito.')
      },
      error: ( error: HttpErrorResponse ) => {
        console.log(error.error.message)
        this.popup.abrirPopupFallido('Ha ocurrido un error al momento de crear el producto.')
      }
    })
  }

  obtenerAliados(){
    this.servicioAliados.obtenerAliados().subscribe({
      next: ( respuesta )=>{
        this.aliados = respuesta.aliados
      }
    })
  }

  abrir(){
    this.servicioModal.open(this.modal, {
      size: 'xl'
    })
  }

}
