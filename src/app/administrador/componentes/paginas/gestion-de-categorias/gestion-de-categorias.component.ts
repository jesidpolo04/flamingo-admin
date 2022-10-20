import { Component, OnInit, ViewChild } from '@angular/core';
import { Categoria } from 'src/app/administrador/modelos/categorias/Categoria';
import { CategoriasService } from 'src/app/administrador/servicios/categorias.service';
import { ModalActualizarCategoriaComponent } from './modal-actualizar-categoria/modal-actualizar-categoria.component';
import { ModalCreacionCategoriaComponent } from './modal-creacion-categoria/modal-creacion-categoria.component';

@Component({
  selector: 'app-gestion-de-categorias',
  templateUrl: './gestion-de-categorias.component.html',
  styleUrls: ['./gestion-de-categorias.component.css']
})
export class GestionDeCategoriasComponent implements OnInit {
  @ViewChild('modalCreacionCategoria') modalCreacionCategoria!:ModalCreacionCategoriaComponent
  @ViewChild('modalActualizarCategoria') modalActualizarCategoria!:ModalActualizarCategoriaComponent
  public pagina = 1;
  public total = 10;
  public limite = 5;
  public filtro:string = '';
  public categorias:Categoria[] = []

  constructor(private servicioCategorias:CategoriasService) { }

  ngOnInit(): void {
    this.obtenerListaDeCategorias()
  }

  public obtenerListaDeCategorias(){
    this.servicioCategorias.obtenerCategorias(this.pagina, this.limite).subscribe(respuesta => {
      this.categorias = respuesta.categorias
      this.total = respuesta.paginacion.totalRegistros
    })
  }
  public refrescarListaDeCategorias():void{
    this.servicioCategorias.obtenerCategorias(this.pagina, this.limite).subscribe(respuesta => {
      this.categorias = this.filtrarCategorias(this.filtro, respuesta.categorias) 
      this.total = respuesta.paginacion.totalRegistros
    })
  }

  public filtrarCategorias(termino:string, categorias:Categoria[]):Categoria[]{
    if(termino === '') return categorias;
    else return categorias.filter(categoria => categoria.nombre.includes(termino));
  }

  public obtenerCategoriasPorFiltro():void{
    if(this.filtro === ''){
      this.obtenerListaDeCategorias();
      return;
    } 
    this.servicioCategorias.obtenerCategorias().subscribe(respuesta => {
      let empieza = (this.pagina - 1) * this.limite;
      let termina = this.pagina * this.limite
      const categoriasFiltradas = this.filtrarCategorias(this.filtro, respuesta.categorias)
      this.total = categoriasFiltradas.length
      this.categorias = categoriasFiltradas.slice(empieza, termina)
    })
  }

  public cambioDePagina(pagina:number){
    this.pagina = pagina
    this.obtenerCategoriasPorFiltro()
  }

  public abrirModalCreacionCategoria(){
    this.modalCreacionCategoria.abrir()
  }

  public abrirModalActualizarCategoria(categoria:Categoria){
    this.modalActualizarCategoria.abrir(categoria)
    
  }
}
