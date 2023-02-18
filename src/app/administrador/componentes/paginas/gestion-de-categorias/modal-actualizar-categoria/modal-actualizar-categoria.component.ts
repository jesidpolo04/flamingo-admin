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

  @ViewChild('popup') popup!: PopupComponent
  @ViewChild('modal') modal!: ElementRef
  @Output('seHaActualizadoUnaCategoria') seHaActualizadoUnaCategoria: EventEmitter<void>
  public formulario: FormGroup
  public categoria?: Categoria
  public categoriasPadre: Categoria[] = []

  constructor(private servicioModal: NgbModal, private servicioCategorias: CategoriasService) {
    this.seHaActualizadoUnaCategoria = new EventEmitter<void>()
    this.formulario = new FormGroup({
      nombre: new FormControl<string>('', [Validators.required]),
      subcategoria: new FormControl<string>('false', [Validators.required]),
      padre: new FormControl<string>(''),
    })
  }

  ngOnInit(): void {
    this.formulario.get('subcategoria')?.valueChanges.subscribe(esSubcategoria => {
      const control = this.formulario.get('padre')
      if (esSubcategoria === 'true') {
        control?.setValidators([Validators.required])
        control?.updateValueAndValidity()
      } else {
        control?.clearValidators()
        control?.updateValueAndValidity()
      }
    })
    this.obtenerCategoriasPadre(1, 100)
  }

  public obtenerCategoriasPadre(pagina: number, limite: number) {
    this.servicioCategorias.obtenerCategoriasPadre(pagina, limite).subscribe(respuesta => {
      this.categoriasPadre = respuesta.categorias_padre
    })
  }

  public abrir(categoria: Categoria): void {
    this.servicioModal.open(this.modal, { size: 'lg' })
    this.categoria = categoria
    this.rellenarFormulario(categoria)
  }

  public cerrar(): void {
    this.servicioModal.dismissAll()
  }

  public limpiarFormulario(): void {
    this.formulario.reset()
  }

  public rellenarFormulario(categoria: Categoria) {
    const nombre = this.formulario.controls['nombre']
    const padre = this.formulario.controls['padre']
    const subcategoria = this.formulario.controls['subcategoria']
    nombre.setValue(categoria.nombre)
    if (categoria.padre) {
      subcategoria.setValue('true')
      padre.setValue(categoria.padre)
    } else {
      subcategoria.setValue('false')
    }
  }

  public actualizarCategoria() {
    if (this.formulario.invalid) return;
    let peticion;
    if (this.formulario.controls['subcategoria'].value === 'true') {
      peticion = {
        id: this.categoria!.id,
        nombre: this.formulario.controls['nombre'].value,
        idPadre: this.formulario.controls['padre'].value
      }
    } else {
      peticion = {
        id: this.categoria!.id,
        nombre: this.formulario.controls['nombre'].value
      }
    }
    this.servicioCategorias.actualizarCategoria(peticion).subscribe(respuesta => {
      this.seHaActualizadoUnaCategoria.emit()
      this.cerrar()
      this.popup.abrirPopupExitoso('Guardado con éxito')
      this.limpiarFormulario()
    }, (error: HttpErrorResponse) => {
      this.popup.abrirPopupFallido('Error')
    })
  }

}
