import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/administrador/modelos/usuarios/Usuario';
import { UsuariosService } from 'src/app/administrador/servicios/usuarios.service';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { PopupComponent } from '../../../popup/popup.component';

@Component({
  selector: 'app-modal-actualizacion-usuario',
  templateUrl: './modal-actualizacion-usuario.component.html',
  styleUrls: ['./modal-actualizacion-usuario.component.css']
})
export class ModalActualizacionUsuarioComponent implements OnInit {
  @Output('seHaActualizadoUnUsuario') seHaActualizadoUnUsuario:EventEmitter<void>
  @ViewChild('modal') modal!:ElementRef
  @ViewChild('popup') popup!:PopupComponent
  public formulario:FormGroup
  public usuario?: Usuario

  constructor(private servicioModal:NgbModal, private servicioUsuario:UsuariosService) {
    this.seHaActualizadoUnUsuario = new EventEmitter<void>()
    this.formulario = new FormGroup({
      identificacion: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      usuario: new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
  }

  public abrir(usuario:Usuario){
    this.usuario = usuario
    this.rellenarFormulario(usuario)
    this.servicioModal.open(this.modal, {
      size: 'xl'
    })
  }

  public cerrar(){
    this.formulario.reset()
    this.servicioModal.dismissAll()
  }

  public rellenarFormulario(usuario:Usuario){
    this.formulario.controls['identificacion'].setValue(usuario.identificacion)
    this.formulario.controls['nombre'].setValue(usuario.nombre)
    this.formulario.controls['usuario'].setValue(usuario.usuario)
  }

  public actualizarAdministrador(){
    if(this.formulario.invalid){
      this.formulario = marcarFormularioComoSucio(this.formulario)
      this.popup.abrirPopupFallido("Formulario incorrecto", "Rellena correctamente todos los campos")
      return
    }
    const identificacion = this.formulario.controls['identificacion']
    const nombre = this.formulario.controls['nombre']
    const usuario = this.formulario.controls['usuario']
    this.servicioUsuario.actualizarUsuario(this.usuario!.id!, new Usuario(identificacion.value, nombre.value, usuario.value)).subscribe(respuesta => {
      this.seHaActualizadoUnUsuario.emit()
      this.cerrar()
      this.popup.abrirPopupExitoso("Guardado con éxito")
    }, (error:HttpErrorResponse)=>{
      this.popup.abrirPopupFallido("Error")
    })
  }
}
