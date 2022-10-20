import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriasService } from 'src/app/administrador/servicios/categorias.service';
import { PopupComponent } from '../../../popup/popup.component';

@Component({
  selector: 'app-modal-creacion-categoria',
  templateUrl: './modal-creacion-categoria.component.html',
  styleUrls: ['./modal-creacion-categoria.component.css']
})
export class ModalCreacionCategoriaComponent implements OnInit {
  @ViewChild('popup') popup!:PopupComponent
  @ViewChild('modal') modal!:ElementRef
  @Output('seHaCreadoUnaCategoria') seHaCreadoUnaCategoria:EventEmitter<void>
  public formulario:FormGroup

  constructor(private servicioModal:NgbModal, private servicioCategorias:CategoriasService) { 
    this.seHaCreadoUnaCategoria = new EventEmitter<void>()
    this.formulario = new FormGroup({
      nombre: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
  }

  public abrir():void{
    this.servicioModal.open(this.modal, {size: 'lg'})
  }

  public cerrar():void{
    this.servicioModal.dismissAll()
  }

  public limpiarFormulario():void{
    this.formulario.reset()
  }

  public crearCategoria(){
    if(this.formulario.invalid) return;
    this.servicioCategorias.crearCategoria(this.formulario.controls['nombre'].value).subscribe(respuesta => {
      this.seHaCreadoUnaCategoria.emit()
      this.cerrar()
      this.popup.abrirPopupExitoso('Categoría creada con éxito', 'Nombre', this.formulario.controls['nombre'].value)
      this.limpiarFormulario()
    }, (error:HttpErrorResponse) =>{
      this.popup.abrirPopupFallido('Error')
    })
  }

}
