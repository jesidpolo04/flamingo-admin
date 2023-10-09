import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Aliado } from 'src/app/administrador/modelos/aliados/Aliado';
import { Ciudad } from 'src/app/administrador/modelos/ubicaciones/Ciudad';
import { Departamento } from 'src/app/administrador/modelos/ubicaciones/Departamento';
import { ServicioUbicaciones } from 'src/app/administrador/servicios/ubicaciones.service';
import { ModalActualizarUbicacionComponent } from '../modal-actualizar-ubicacion/modal-actualizar-ubicacion.component';
import { Ubicacion } from 'src/app/administrador/modelos/ubicaciones/Ubicacion';
import { Paginador } from 'src/app/compartido/Paginador';
import { FiltrosUbicaciones } from 'src/app/administrador/modelos/ubicaciones/FiltrosUbicaciones';
import { Observable } from 'rxjs';
import { Paginacion } from 'src/app/administrador/modelos/compartido/Paginador';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';


@Component({
  selector: 'app-modal-gestion-ubicaciones',
  templateUrl: './modal-gestion-ubicaciones.component.html',
  styleUrls: ['./modal-gestion-ubicaciones.component.css']
})
export class ModalGestionUbicacionesComponent implements OnInit {
  @ViewChild('popup') popup!: PopupComponent
  @ViewChild('modal') modal!: ElementRef
  @ViewChild('modalActualizarUbicacion') modalActualizarUbicacion!: ModalActualizarUbicacionComponent
  formulario: FormGroup
  aliado?: Aliado
  departamentos: Departamento[] = []
  ciudades: Ciudad[] = []
  ubicaciones: Ubicacion[] = []
  paginador: Paginador<FiltrosUbicaciones>

  constructor(private servicioModal: NgbModal, private servicioUbicacion: ServicioUbicaciones) {
    this.paginador = new Paginador<FiltrosUbicaciones>(this.obtenerUbicaciones)
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
    this.formulario.controls['departamento'].valueChanges.subscribe({
      next: (valor)=>{
        if(valor && valor !== ""){
          this.obtenerCiudades(valor)
        }else{
          this.ciudades = []
        }
      }
    })
  }

  abrir(aliado: Aliado){
    this.aliado = aliado
    this.paginador.inicializar(1, 5, {
      idAliado: aliado.id
    })
    this.servicioModal.open(this.modal, {
      size: 'xl',
      modalDialogClass: 'modal-dividido'
    })
    this.limpiarFormulario()
  }

  abrirModalActualizar(aliado: Aliado, ubicacion: Ubicacion){
    this.modalActualizarUbicacion.abrir(ubicacion, aliado)
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

  cambiarEstadoUbicacion(ubicacion: Ubicacion){
    this.servicioUbicacion.cambiarEstadoUbicacion(ubicacion.id).subscribe({
      next: (ubicacion)=>{
        this.popup.abrirPopupExitoso('Guardado con éxito.')
        this.paginador.refrescar()
      },
      error: ()=>{
        this.popup.abrirPopupFallido('Ocurrió un error.', 'Intentalo más tarde.')
      }
    })
  }

  guardarUbicacion(){
    if(this.formulario.invalid){
      marcarFormularioComoSucio(this.formulario)
      return;
    }
    const controles = this.formulario.controls
    this.servicioUbicacion.guardarUbicacion({
      idAliado: this.aliado!.id,
      codigoCiudad: controles['ciudad'].value,
      codigoDepartamento: controles['departamento'].value,
      latitud: controles['latitud'].value,
      longitud: controles['longitud'].value,
      nombre: controles['nombre'].value
    }).subscribe({
      next: (ubicacion)=>{
        this.paginador.refrescar()
        this.popup.abrirPopupExitoso('Guardado con éxito.')
        this.limpiarFormulario()
      },
      error: ()=>{
        this.popup.abrirPopupFallido('Ocurrio un error', 'Intentalo más tarde.')
      }
    })
  }

  limpiarFormulario(){
    this.formulario.reset()
    const controls = this.formulario.controls
    controls['departamento'].setValue("")
    controls['ciudad'].setValue("")
  }

  obtenerUbicaciones = (pagina: number, limite: number, filtros?: FiltrosUbicaciones): Observable<Paginacion> =>{
    return new Observable( subscripcion => {
      if(!filtros){
        throw Error('Los filtros para consultar las ubicaciones son obligatorios.')
      }
      this.servicioUbicacion.listarUbicaciones(pagina, limite, filtros).subscribe({
        next: (respuesta)=>{
          this.ubicaciones = respuesta.ubicaciones
          subscripcion.next(respuesta.paginacion)
        }
      })
    })
  }

  manejarUbicacionActualizada(){
    this.paginador.refrescar()
  }

}
