import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Aliado } from 'src/app/administrador/modelos/aliados/Aliado';
import { PeticionActualizarAliado } from 'src/app/administrador/modelos/aliados/PeticionActualizarAliado';
import { AliadosService } from 'src/app/administrador/servicios/aliados.service';
import { PopupComponent } from '../../../popup/popup.component';

@Component({
  selector: 'app-modal-actualizacion-aliado',
  templateUrl: './modal-actualizacion-aliado.component.html',
  styleUrls: ['./modal-actualizacion-aliado.component.css']
})
export class ModalActualizacionAliadoComponent implements OnInit {
  @ViewChild('popup') popup!:PopupComponent
  @ViewChild('modal') modal!:ElementRef
  @Output('seHaActualizadoUnAliado') seHaActualizadoUnAliado:EventEmitter<void>
  public aliado?:Aliado
  public formulario:FormGroup

  constructor(private servicioModal:NgbModal, private servicioAliados:AliadosService) {
    this.seHaActualizadoUnAliado = new EventEmitter<void>()
    this.formulario = new FormGroup({
      orden: new FormControl(undefined, [Validators.required]),
      nombre: new FormControl('', [Validators.required]), 
      nit: new FormControl('', [Validators.required]), 
      comision: new FormControl('', [Validators.required]), 
      enlaceAmigable: new FormControl('', [Validators.required]), 
      logo: new FormControl('', [Validators.required]),
      recursoLogo: new FormControl('', [Validators.required]),
      tiempo: new FormControl('', [Validators.required]),
    })
  }

  ngOnInit(): void {

  }

  public abrir(aliado:Aliado){
    this.aliado = aliado
    this.servicioModal.open(this.modal, {
      size: 'xl'
    })
    this.rellenarFormulario(aliado)
  }

  public cerrar():void{
    this.servicioModal.dismissAll()
  }

  public limpiarFormulario():void{
    this.formulario.reset()
  }

  public rellenarFormulario(aliado:Aliado){
    this.formulario.reset()
    this.formulario.controls['orden'].setValue(1)
    this.formulario.controls['nombre'].setValue(aliado.nombre)
    this.formulario.controls['nit'].setValue('')
    this.formulario.controls['comision'].setValue(aliado.comision)
    this.formulario.controls['enlaceAmigable'].setValue(aliado.linkAmigable)
    this.formulario.controls['tiempo'].setValue(aliado.tiempo)
  }

  public actualizarAliado(){
    this.servicioAliados.actualizarAliado(this.aliado!.id, new PeticionActualizarAliado(
      this.formulario.controls['orden'].value,
      this.formulario.controls['nombre'].value,
      this.formulario.controls['nit'].value,
      this.formulario.controls['comision'].value,
      this.formulario.controls['enlaceAmigable'].value,
      this.formulario.controls['recursoLogo'].value,
      this.formulario.controls['tiempo'].value
    )).subscribe(respuesta =>{
      this.seHaActualizadoUnAliado.emit()
      this.limpiarFormulario()
      this.cerrar()
      this.popup.abrirPopupExitoso('Guardado con éxito')
    }, (error:HttpErrorResponse)=>{
      this.popup.abrirPopupFallido('Error')
    })
  }
}
