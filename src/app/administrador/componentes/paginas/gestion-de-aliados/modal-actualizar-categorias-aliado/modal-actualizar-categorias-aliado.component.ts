import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Aliado } from 'src/app/administrador/modelos/aliados/Aliado';
import { CategoriaAliado } from 'src/app/administrador/modelos/aliados/CategoriaAliado';
import { PeticionActualizarCategoriaAliado } from 'src/app/administrador/modelos/aliados/PeticionActualizarCategoriaAliado';
import { AliadosService } from 'src/app/administrador/servicios/aliados.service';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { PopupComponent } from '../../../popup/popup.component';

@Component({
  selector: 'app-modal-actualizar-categorias-aliado',
  templateUrl: './modal-actualizar-categorias-aliado.component.html',
  styleUrls: ['./modal-actualizar-categorias-aliado.component.css']
})
export class ModalActualizarCategoriasAliadoComponent implements OnInit {
  @ViewChild('popup') popup!:PopupComponent
  @ViewChild('modal') modal!:ElementRef
  @Output('seHaActualizadoUnaCategoriaAliado') seHaActualizadoUnaCategoriaAliado:EventEmitter<void> 
  public aliado?:Aliado
  public formulario: FormGroup
  public categoria?:CategoriaAliado

  constructor(private servicioModal:NgbModal, private servicioCategorias:AliadosService) {
    this.seHaActualizadoUnaCategoriaAliado = new EventEmitter<void>() 
    this.formulario = new FormGroup({
      imagen: new FormControl('', [Validators.required]),
      recursoImagen: new FormControl('', [Validators.required]),
      enlaceAmigable: new FormControl('', [Validators.required]),
      destacada: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit(): void {
  }

  public abrir(aliado:Aliado, categoria:CategoriaAliado){
    this.aliado = aliado
    this.categoria = categoria
    this.formulario.reset()
    this.rellenarFormulario(categoria)
    this.servicioModal.open(this.modal, {
      size: 'xl'
    })
  }

  public cerrar():void{
    this.servicioModal.dismissAll()
  }

  public limpiarFormulario():void{
    this.formulario.reset()
  }

  public rellenarFormulario(categoria:CategoriaAliado){
    this.formulario.controls['enlaceAmigable'].setValue(categoria.linkAmigableAliado)
    this.formulario.controls['destacada'].setValue(categoria.destacada)
  }

  public actualizarCategoria(){
    if(this.formulario.invalid){
      this.popup.abrirPopupFallido('Formulario inválido', 'Rellena todos los campos correctamente.')
      this.formulario = marcarFormularioComoSucio(this.formulario)
      return;
    }
    this.servicioCategorias.actualizarCategoriaAliado(
      this.aliado!.id,
      this.categoria!.id, new PeticionActualizarCategoriaAliado(
        this.formulario.controls['recursoImagen'].value,
        this.formulario.controls['enlaceAmigable'].value,
        this.formulario.controls['destacada'].value
      )).subscribe(respuesta => {
        this.seHaActualizadoUnaCategoriaAliado.emit()
        this.limpiarFormulario()
        this.cerrar()
        this.popup.abrirPopupExitoso('Guardado con éxito')
      }, (error:HttpErrorResponse)=>{
        this.popup.abrirPopupFallido('Error')
      })
  }

  public cambioDeImagen(event:Event){
    const target = event.target as HTMLInputElement;
    if(!target) return;
    if(!target.files) return;
    if (target.files.length > 0) {
      const file = target.files[0];
      this.formulario.patchValue({
        recursoImagen: file
      });
    }
  }
}
