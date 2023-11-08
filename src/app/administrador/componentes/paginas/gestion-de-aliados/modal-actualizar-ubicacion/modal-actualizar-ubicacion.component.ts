import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Aliado } from 'src/app/administrador/modelos/aliados/Aliado';
import { Ciudad } from 'src/app/administrador/modelos/ubicaciones/Ciudad';
import { Departamento } from 'src/app/administrador/modelos/ubicaciones/Departamento';
import { Ubicacion } from 'src/app/administrador/modelos/ubicaciones/Ubicacion';
import { ServicioUbicaciones } from 'src/app/administrador/servicios/ubicaciones.service';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';

@Component({
  selector: 'app-modal-actualizar-ubicacion',
  templateUrl: './modal-actualizar-ubicacion.component.html',
  styleUrls: ['./modal-actualizar-ubicacion.component.css']
})
export class ModalActualizarUbicacionComponent implements OnInit {
  @ViewChild('modal') modal!: ElementRef
  @ViewChild('popup') popup!: PopupComponent
  @Output() ubicacionActualizada: EventEmitter<void>
  formulario: FormGroup
  ubicacion?: Ubicacion
  aliado?: Aliado
  departamentos: Departamento[] = []
  ciudades: Ciudad[] = []
  referenciaModal?: NgbModalRef
  

  constructor(private servicioModal: NgbModal, private servicioUbicacion: ServicioUbicaciones) {
    this.ubicacionActualizada = new EventEmitter<void>(); 
    this.formulario = new FormGroup({
      nombre: new FormControl("", [ Validators.required ]),
      departamento: new FormControl("", [ Validators.required ]),
      ciudad: new FormControl("", [ Validators.required ]),
      latitud: new FormControl("", [ Validators.required ]),
      longitud: new FormControl("", [ Validators.required ]),
    })
  }

  ngOnInit(): void {
    this.obtenerDepartamentos()
  }

  abrir(ubicacion: Ubicacion, aliado: Aliado){
    this.ubicacion = ubicacion
    this.aliado = aliado
    this.limpiarFormulario()
    this.rellenarInformacion()
    this.referenciaModal = this.servicioModal.open(this.modal, {
      size: 'xl'
    })
  }

  cerrar(){
    this.referenciaModal!.close()
  }

  rellenarInformacion(){
    const controls = this.formulario.controls
    controls['nombre'].setValue(this.ubicacion!.nombre)
    controls['departamento'].setValue(this.ubicacion!.codigoDepartamento)
    if(this.ubicacion!.codigoDepartamento !== ""){
      this.servicioUbicacion.obtenerCiudadesPorDepartamento(this.ubicacion!.codigoDepartamento).subscribe({
        next: (ciudades)=>{
          this.ciudades = ciudades
          controls['ciudad'].setValue(this.ubicacion!.codigoCiudad)
        }
      })
    }
    controls['latitud'].setValue(this.ubicacion!.latitud)
    controls['longitud'].setValue(this.ubicacion!.longitud)
  }

  limpiarFormulario(){
    this.formulario.reset()
  }

  actualizarUbicacion(){
    if(this.formulario.invalid){
      marcarFormularioComoSucio(this.formulario)
      return;
    }
    const controles = this.formulario.controls
    this.servicioUbicacion.actualizarUbicacion(this.ubicacion!.id, {
      codigoCiudad: controles['ciudad'].value,
      codigoDepartamento: controles['departamento'].value,
      latitud: controles['latitud'].value,
      longitud: controles['longitud'].value,
      nombre: controles['nombre'].value
    }).subscribe({
      next: (respuesta)=>{
        this.cerrar()
        this.popup.abrirPopupExitoso('Guardado con éxito.')
        this.ubicacionActualizada.emit()
      },
      error: ()=>{
        this.popup.abrirPopupFallido('Ocurrió un error', 'Intentalo más tarde.')
      }
    })
  }

  obtenerDepartamentos(){
    this.servicioUbicacion.obtenerDepartamentos().subscribe({
      next: (departamentos)=>{
        this.departamentos = departamentos
      }
    })
  }

  obtenerCiudades(codigoDepartamento: string){
    this.servicioUbicacion.obtenerCiudadesPorDepartamento(codigoDepartamento).subscribe({
      next: (ciudades)=>{
        this.ciudades = ciudades
      }
    })
  }

}
