import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/administrador/modelos/usuarios/Usuario';
import { UsuariosService } from 'src/app/administrador/servicios/usuarios.service';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { PopupComponent } from '../../../popup/popup.component';

@Component({
  selector: 'app-modal-creacion-usuario',
  templateUrl: './modal-creacion-usuario.component.html',
  styleUrls: ['./modal-creacion-usuario.component.css']
})
export class ModalCreacionUsuarioComponent implements OnInit {
  @Output('seHaCreadoUnUsuario') seHaCreadoUnUsuario:EventEmitter<void>
  @ViewChild('modal') modal!:ElementRef
  @ViewChild('popup') popup!:PopupComponent
  public formulario:FormGroup
  public claveConfirmada:boolean = false;
  constructor(private servicioModal:NgbModal, private servicioUsuarios:UsuariosService) {
    this.seHaCreadoUnUsuario = new EventEmitter<void>()
    this.formulario = new FormGroup({
      identificacion: new FormControl('', [Validators.required]),
      nombre: new FormControl('', [Validators.required]),
      usuario: new FormControl('', Validators.required),
      clave: new FormControl('', Validators.required),
      confirmarClave: new FormControl('', Validators.required)
    })
  }

  ngOnInit(): void {
  }

  public abrir(){
    this.servicioModal.open(this.modal, {
      size: 'xl'
    })
  }

  public cerrar(){
    this.formulario.reset()
    this.servicioModal.dismissAll()
  }

  public crearAdministrador(){
    if(this.formulario.invalid){
      this.formulario = marcarFormularioComoSucio(this.formulario)
      this.popup.abrirPopupFallido("Formulario inválido", "Rellena correctamente todos los campos.")
      return
    }
    if(!this.seConfirmoLaClave()){
      this.popup.abrirPopupFallido("Formulario inválido", "Las contraseñas no coinciden.")
      return
    }
    const identificacion = this.formulario.controls['identificacion']
    const nombre = this.formulario.controls['nombre']
    const usuario = this.formulario.controls['usuario']
    const clave = this.formulario.controls['clave']
    this.servicioUsuarios.crearUsuario(new Usuario(identificacion!.value, nombre!.value, usuario!.value, clave!.value))
      .subscribe(respuesta => {
        this.seHaCreadoUnUsuario.emit()
        this.popup.abrirPopupExitoso("Administrador creado con éxito", "Usuario", usuario!.value)
      }, (error:HttpErrorResponse)=>{
        this.popup.abrirPopupFallido("Error")
      })
  }

  private seConfirmoLaClave():boolean{
    console.log(this.formulario.controls['clave'].value)
    console.log(this.formulario.controls['confirmarClave'].value)
    console.log(this.formulario.controls['clave'].value === this.formulario.controls['confirmarClave'].value)
    this.claveConfirmada = this.formulario.controls['clave'].value === this.formulario.controls['confirmarClave'].value ? true : false
    return this.claveConfirmada
  }
}
