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
      quienesSomos: new FormControl<string | undefined>(''),
      transaccional: new FormControl<boolean>(false),
      servicios: new FormControl<string | undefined>(''),
      linea: new FormControl<string | undefined>(''),
      whatsapp: new FormControl<string | undefined>(''),
      imagenPersonalizada: new FormControl<boolean>(false),
      imagenDesktop: new FormControl<File | undefined>(undefined),
      imagenMobile: new FormControl<File | undefined>(undefined),
      elfiao: new FormControl<boolean>(false),
      mefia: new FormControl<boolean>(false)
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
    this.formulario.controls['nit'].setValue(aliado.nit)
    this.formulario.controls['comision'].setValue(aliado.comision)
    this.formulario.controls['enlaceAmigable'].setValue(aliado.linkAmigable)
    this.formulario.controls['tiempo'].setValue(aliado.tiempo)
    this.formulario.controls['transaccional'].setValue(aliado.transaccional)
    this.formulario.controls['servicios'].setValue(aliado.servicios)
    this.formulario.controls['quienesSomos'].setValue(aliado.quienesSomos)
    this.formulario.controls['linea'].setValue(aliado.linea)
    this.formulario.controls['whatsapp'].setValue(aliado.whatsapp)
    this.formulario.controls['imagenPersonalizada'].setValue(aliado.imgModal)
    this.formulario.controls['elfiao'].setValue(aliado.fiao)
    this.formulario.controls['mefia'].setValue(aliado.mefia)
  }

  public actualizarAliado(){
    console.log(this.formulario.controls)
    this.servicioAliados.actualizarAliado(this.aliado!.id, new PeticionActualizarAliado(
      this.formulario.controls['orden'].value,
      this.formulario.controls['nombre'].value,
      this.formulario.controls['nit'].value,
      this.formulario.controls['comision'].value,
      this.formulario.controls['enlaceAmigable'].value,
      this.formulario.controls['recursoLogo'].value,
      this.formulario.controls['tiempo'].value,
      this.formulario.controls['transaccional'].value,
      this.formulario.controls['servicios'].value,
      this.formulario.controls['quienesSomos'].value,
      this.formulario.controls['linea'].value,
      this.formulario.controls['whatsapp'].value,
      this.formulario.controls['imagenPersonalizada'].value,
      this.formulario.controls['imagenDesktop'].value,
      this.formulario.controls['imagenMobile'].value,
      this.formulario.controls['elfiao'].value,
      this.formulario.controls['mefia'].value
    )).subscribe({
      next: () =>{
        this.seHaActualizadoUnAliado.emit()
        this.limpiarFormulario()
        this.cerrar()
        this.popup.abrirPopupExitoso('Guardado con éxito')
      },
      error: (error:HttpErrorResponse)=>{
        this.popup.abrirPopupFallido('Error', error.error.mensaje)
      }
    })
  }

  public cambioDeLogo(event:Event){
    const target = event.target as HTMLInputElement;
    if(!target) return;
    if(!target.files) return;
    if (target.files.length > 0) {
      const file = target.files[0];
      this.formulario.patchValue({
        recursoLogo: file
      });
    }
  }
}
