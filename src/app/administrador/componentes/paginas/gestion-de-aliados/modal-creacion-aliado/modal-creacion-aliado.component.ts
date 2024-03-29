import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PeticionCrearAliado } from 'src/app/administrador/modelos/aliados/PeticionCrearAliado';
import { AliadosService } from 'src/app/administrador/servicios/aliados.service';
import { PopupComponent } from '../../../popup/popup.component';

@Component({
  selector: 'app-modal-creacion-aliado',
  templateUrl: './modal-creacion-aliado.component.html',
  styleUrls: ['./modal-creacion-aliado.component.css']
})
export class ModalCreacionAliadoComponent implements OnInit {
  @ViewChild('popup') popup!:PopupComponent
  @ViewChild('modalCreacionAliado') modalCreacionAliado!:ElementRef
  @Output('seHaCreadoUnAliado') seHaCreadoUnAliado:EventEmitter<void>
  public formulario:FormGroup

  constructor(private servicioModal:NgbModal, private servicioAliados:AliadosService) {
    this.seHaCreadoUnAliado = new EventEmitter<void>()
    this.formulario = new FormGroup({
      orden: new FormControl(1, [Validators.required]),
      nombre: new FormControl('', [Validators.required]), 
      nit: new FormControl('', [Validators.required]), 
      comision: new FormControl('', [Validators.required]), 
      enlaceAmigable: new FormControl('', [Validators.required]), 
      logo: new FormControl('', [Validators.required]),
      recursoLogo: new FormControl('', [Validators.required]),
      tiempo: new FormControl('', [Validators.required]),
      quienesSomos: new FormControl<string | undefined>(''),
      transaccional: new FormControl<boolean>(false, []),
      servicios: new FormControl<string | undefined>(''),
      linea: new FormControl<string | undefined>(''),
      whatsapp: new FormControl<string | undefined>(''),
      imagenPersonalizada: new FormControl<boolean>(false , []),
      imagenDesktop: new FormControl<File | undefined>(undefined),
      imagenMobile: new FormControl<File | undefined>(undefined),
      mefia: new FormControl<boolean>(false),
      elfiao: new FormControl<boolean>(false),
    })
  }

  ngOnInit(): void {
  }

  public abrir():void{
    this.limpiarFormulario()
    this.formulario.controls['orden'].setValue(1)
    this.servicioModal.open(this.modalCreacionAliado, {
      size: 'xl'
    })
  }

  public cerrar():void{
    this.servicioModal.dismissAll('Aliado creado');
  }

  public cambioDeLogo(event:Event):void{
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
  
  public crearAliado(){
    if(this.formulario.invalid){
      this.popup.abrirPopupFallido('Formulario Inválido', 'Rellena correctamente todos los campos.')
      this.marcarFormularioComoSucio()
    }
    if(this.formulario.valid){
      this.servicioAliados.crearAliado(new PeticionCrearAliado(
        this.formulario.controls['orden'].value,
        this.formulario.controls['nombre'].value,
        this.formulario.controls['nit'].value,
        this.formulario.controls['comision'].value,
        this.formulario.controls['enlaceAmigable'].value,
        this.formulario.controls['recursoLogo'].value,
        this.formulario.controls['tiempo'].value,
        this.formulario.controls['transaccional'].value ?? false,
        this.formulario.controls['servicios'].value,
        this.formulario.controls['quienesSomos'].value,
        this.formulario.controls['linea'].value,
        this.formulario.controls['whatsapp'].value,
        this.formulario.controls['imagenPersonalizada'].value ?? false,
        this.formulario.controls['imagenDesktop'].value,
        this.formulario.controls['imagenMobile'].value,
        this.formulario.controls['elfiao'].value,
        this.formulario.controls['mefia'].value
      )).subscribe({
        next: ()=>{
          this.seHaCreadoUnAliado.emit()
          this.popup.abrirPopupExitoso('Aliado creado con éxito', 'Nombre', this.formulario.controls['nombre'].value)
          this.limpiarFormulario()
          this.cerrar();
        },
        error: (error:HttpErrorResponse)=>{
          this.popup.abrirPopupFallido('Error', error.error.mensaje)
        }
      })
    }
  }

  public limpiarFormulario(){
    this.formulario.reset()
  }

  public marcarFormularioComoSucio():void{
    (<any>Object).values(this.formulario.controls).forEach((control:FormControl) => {
      control.markAsDirty();
      if (control) {
        control.markAsDirty()
      }
    });
  }

}
