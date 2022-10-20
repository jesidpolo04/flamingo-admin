import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Categoria } from 'src/app/administrador/modelos/categorias/Categoria';
import { CategoriasService } from 'src/app/administrador/servicios/categorias.service';
import { PopupComponent } from '../../../popup/popup.component';

@Component({
  selector: 'app-modal-actualizar-categoria',
  templateUrl: './modal-actualizar-categoria.component.html',
  styleUrls: ['./modal-actualizar-categoria.component.css']
})
export class ModalActualizarCategoriaComponent implements OnInit {

  @ViewChild('popup') popup!:PopupComponent
  @ViewChild('modal') modal!:ElementRef
  @Output('seHaActualizadoUnaCategoria') seHaActualizadoUnaCategoria:EventEmitter<void>
  public formulario:FormGroup
  public categoria?:Categoria

  constructor(private servicioModal:NgbModal, private servicioCategorias:CategoriasService) { 
    this.seHaActualizadoUnaCategoria = new EventEmitter<void>()
    this.formulario = new FormGroup({
      nombre: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
  }

  public abrir(categoria:Categoria):void{
    this.servicioModal.open(this.modal, {size: 'lg'})
    this.categoria = categoria
    this.rellenarFormulario(categoria)
  }

  public cerrar():void{
    this.servicioModal.dismissAll()
  }

  public limpiarFormulario():void{
    this.formulario.reset()
  }

  public rellenarFormulario(categoria:Categoria){
    this.formulario.controls['nombre'].setValue(categoria.nombre)
  }

  public actualizarCategoria(){
    if(this.formulario.invalid) return;
    this.servicioCategorias.actualizarCategoria(this.categoria!.id, this.formulario.controls['nombre'].value).subscribe(respuesta => {
      this.seHaActualizadoUnaCategoria.emit()
      this.cerrar()
      this.popup.abrirPopupExitoso('Guardado con éxito')
      this.limpiarFormulario()
    }, (error:HttpErrorResponse) =>{
      this.popup.abrirPopupFallido('Error')
    })
  }

}
