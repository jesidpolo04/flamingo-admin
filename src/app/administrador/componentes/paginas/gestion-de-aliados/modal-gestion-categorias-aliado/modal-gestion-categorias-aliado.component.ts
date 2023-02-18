import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Aliado } from 'src/app/administrador/modelos/aliados/Aliado';
import { CategoriaAliado } from 'src/app/administrador/modelos/aliados/CategoriaAliado';
import { PeticionAsignarCategorias } from 'src/app/administrador/modelos/aliados/PeticionAsignarCategoria';
import { Categoria } from 'src/app/administrador/modelos/categorias/Categoria';
import { AliadosService } from 'src/app/administrador/servicios/aliados.service';
import { CategoriasService } from 'src/app/administrador/servicios/categorias.service';
import { PopupComponent } from '../../../popup/popup.component';
import { ModalActualizarCategoriasAliadoComponent } from '../modal-actualizar-categorias-aliado/modal-actualizar-categorias-aliado.component';

@Component({
  selector: 'app-modal-gestion-categorias-aliado',
  templateUrl: './modal-gestion-categorias-aliado.component.html',
  styleUrls: ['./modal-gestion-categorias-aliado.component.css']
})
export class ModalGestionCategoriasAliadoComponent implements OnInit {
  @ViewChild('popup') popup!: PopupComponent
  @ViewChild('modal') modal!: ElementRef
  @ViewChild('modalActualizarCategoria') modalActualizarCategoria!: ModalActualizarCategoriasAliadoComponent
  public aliado?: Aliado
  public categoriasPadre: Categoria[] = []
  public categorias: Categoria[] = []
  public categoriasDeAliado: CategoriaAliado[] = []
  public formulario: FormGroup

  constructor(
    private servicioModal: NgbModal,
    private servicioAliados: AliadosService,
    private servicioCategorias: CategoriasService
  ) {
    this.formulario = new FormGroup({
      categoria: new FormControl('', [Validators.required]),
      imagen: new FormControl('', [Validators.required]),
      recursoImagen: new FormControl('', [Validators.required]),
      enlaceAmigable: new FormControl('', [Validators.required]),
      destacada: new FormControl(false),
    })
  }

  ngOnInit(): void {
    this.obtenerCategoriasPadre(1, 100);
  }

  refrescarCategorias(idCategoriaPadre: string){
    this.servicioCategorias.obtenerCategoriasHijas(1, 100, idCategoriaPadre).subscribe( respuesta => {
      this.categorias = respuesta.categorias
    })
  }

  public obtenerCategoriasPadre(pagina: number, limite: number) {
    this.servicioCategorias.obtenerCategoriasPadre(pagina, limite).subscribe(respuesta => {
      this.categoriasPadre = respuesta.categorias_padre
    })
  }

  public abrir(aliado: Aliado) {
    this.limpiarFormulario()
    this.aliado = aliado
    this.servicioAliados.listarCategorias(this.aliado.id).subscribe(respuesta => {
      this.categoriasDeAliado = respuesta.categorias
    })
    this.servicioModal.open(this.modal, {
      size: 'xl',
      modalDialogClass: 'modal-dividido'
    })
  }

  public cerrar(): void {
    this.servicioModal.dismissAll()
  }

  public cambioDeImagen(event: Event) {
    const target = event.target as HTMLInputElement;
    if (!target) return;
    if (!target.files) return;
    if (target.files.length > 0) {
      const file = target.files[0];
      this.formulario.patchValue({
        recursoImagen: file
      });
    }
  }

  public limpiarFormulario(): void {
    this.formulario.reset()
    this.formulario.controls['categoria'].setValue('');
    this.formulario.controls['destacada'].setValue(false)
  }

  public marcarFormularioComoSucio(): void {
    (<any>Object).values(this.formulario.controls).forEach((control: FormControl) => {
      control.markAsDirty();
      if (control) {
        control.markAsDirty()
      }
    });
  }

  public refrescarListaDeCategorias(): void {
    if (this.aliado) {
      this.servicioAliados.listarCategorias(this.aliado.id).subscribe(respuesta => {
        this.categoriasDeAliado = respuesta.categorias
      })
    }
  }

  public asignarCategoria(): void {
    if (this.formulario.invalid) {
      this.popup.abrirPopupFallido('Formulario inválido', 'rellena todos los campos correctamente.')
      this.marcarFormularioComoSucio()
      return;
    }
    console.log(this.formulario.controls['destacada'].value)
    this.servicioAliados.asignarCategoria(new PeticionAsignarCategorias(
      this.formulario.controls['recursoImagen'].value,
      this.formulario.controls['categoria'].value,
      this.aliado!.id,
      this.formulario.controls['enlaceAmigable'].value,
      this.formulario.controls['destacada'].value,
    )).subscribe(respuesta => {
      this.refrescarListaDeCategorias()
      this.popup.abrirPopupExitoso('Guardado con éxito')
    }, (error: HttpErrorResponse) => {
      this.popup.abrirPopupFallido('Error', error.error.mensaje)
    })
  }

  public cambiarEstadoCategoria(indiceCategoria: number) {
    this.servicioAliados.cambiarEstadoCategoriaAliado(this.aliado!.id, this.categoriasDeAliado[indiceCategoria].id).subscribe(respuesta => {
      this.categoriasDeAliado[indiceCategoria].estado = !this.categoriasDeAliado[indiceCategoria].estado
    }, (error: HttpErrorResponse) => {
      this.popup.abrirPopupFallido('Error')
    })
  }

  public abrirModalActualizarCategoria(categoria: CategoriaAliado) {
    this.modalActualizarCategoria.abrir(this.aliado!, categoria)
  }

  public copiarAlPortapapeles(texto: string) {
    navigator.clipboard.writeText(texto)
    this.popup.abrirPopupExitoso('Copiado al portapapeles')
  }

  public debugDestacada() {
    console.log(this.formulario.controls['destacada'].value)
  }

}
