import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoriasService } from 'src/app/administrador/servicios/categorias.service';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { PopupComponent } from '../../../popup/popup.component';
import { Categoria } from 'src/app/administrador/modelos/categorias/Categoria';
import { requeridoSi } from 'src/app/validadores/Validadores';

@Component({
  selector: 'app-modal-creacion-categoria',
  templateUrl: './modal-creacion-categoria.component.html',
  styleUrls: ['./modal-creacion-categoria.component.css']
})
export class ModalCreacionCategoriaComponent implements OnInit {
  @ViewChild('popup') popup!: PopupComponent
  @ViewChild('modal') modal!: ElementRef
  @Output('seHaCreadoUnaCategoria') seHaCreadoUnaCategoria: EventEmitter<void>
  public formulario: FormGroup
  public categoriasPadre: Categoria[] = []
  constructor(private servicioModal: NgbModal, private servicioCategorias: CategoriasService) {
    this.seHaCreadoUnaCategoria = new EventEmitter<void>()
    this.formulario = new FormGroup({
      nombre: new FormControl<string>('', [Validators.required]),
      subcategoria: new FormControl<string>('', [Validators.required]),
      padre: new FormControl<string | undefined>(undefined),
    })
  }

  ngOnInit(): void {
    this.formulario.get('subcategoria')?.valueChanges.subscribe( esSubcategoria => {
      const control =  this.formulario.get('padre')
      if(esSubcategoria === 'true'){
        control?.setValidators([Validators.required])
        control?.updateValueAndValidity()
      }else{
        control?.clearValidators()
        control?.updateValueAndValidity()
      }
    })
    this.obtenerCategoriasPadre(1, 100)
  }

  public abrir(): void {
    this.limpiarFormulario()
    this.servicioModal.open(this.modal, { size: 'lg' })
  }

  public cerrar(): void {
    this.servicioModal.dismissAll()
  }

  public limpiarFormulario(): void {
    this.formulario.reset()
  }

  public obtenerCategoriasPadre(pagina: number, limite: number) {
    this.servicioCategorias.obtenerCategoriasPadre(pagina, limite).subscribe(respuesta => {
      this.categoriasPadre = respuesta.categorias_padre
    })
  }

  public crearCategoria() {
    if (this.formulario.invalid) {
      console.log(this.formulario.controls)
      this.popup.abrirPopupFallido('Formulario inválido', 'Rellena todos los campos correctamente.')
      this.formulario = marcarFormularioComoSucio(this.formulario)
      return
    };
    let peticion;
    if (this.formulario.controls['subcategoria'].value === 'true') {
      peticion = {
        nombre: this.formulario.controls['nombre'].value,
        idPadre: this.formulario.controls['padre'].value
      }
    } else {
      peticion = {
        nombre: this.formulario.controls['nombre'].value
      }
    }
    this.servicioCategorias.crearCategoria(peticion).subscribe(respuesta => {
      this.seHaCreadoUnaCategoria.emit()
      this.cerrar()
      this.popup.abrirPopupExitoso('Categoría creada con éxito', 'Nombre', this.formulario.controls['nombre'].value)
      this.limpiarFormulario()
    }, (error: HttpErrorResponse) => {
      this.popup.abrirPopupFallido('Error')
    })
  }

}
