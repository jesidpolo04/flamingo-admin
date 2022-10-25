import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministradorRoutingModule } from './administrador-routing.module';
import { PlantillaComponent } from './componentes/plantilla/plantilla.component';
import { MenuLateralComponent } from './componentes/menu-lateral/menu-lateral.component';
import { BarraNavegacionComponent } from './componentes/barra-navegacion/barra-navegacion.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { GestionDeAliadosComponent } from './componentes/paginas/gestion-de-aliados/gestion-de-aliados.component';
import { ModalCreacionAliadoComponent } from './componentes/paginas/gestion-de-aliados/modal-creacion-aliado/modal-creacion-aliado.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalActualizacionAliadoComponent } from './componentes/paginas/gestion-de-aliados/modal-actualizacion-aliado/modal-actualizacion-aliado.component';
import { ModalGestionCategoriasAliadoComponent } from './componentes/paginas/gestion-de-aliados/modal-gestion-categorias-aliado/modal-gestion-categorias-aliado.component';
import { ModalActualizarCategoriasAliadoComponent } from './componentes/paginas/gestion-de-aliados/modal-actualizar-categorias-aliado/modal-actualizar-categorias-aliado.component';
import { GestionDeCategoriasComponent } from './componentes/paginas/gestion-de-categorias/gestion-de-categorias.component';
import { ModalCreacionCategoriaComponent } from './componentes/paginas/gestion-de-categorias/modal-creacion-categoria/modal-creacion-categoria.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { PopupComponent } from './componentes/popup/popup.component';
import { ModalActualizarCategoriaComponent } from './componentes/paginas/gestion-de-categorias/modal-actualizar-categoria/modal-actualizar-categoria.component';
import { ResumenTraficoClientesComponent } from './componentes/paginas/resumen-trafico-clientes/resumen-trafico-clientes.component';
import { TraficoClientesComponent } from './componentes/paginas/trafico-clientes/trafico-clientes.component';
import { ReporteVentasComponent } from './componentes/paginas/reporte-ventas/reporte-ventas.component';



@NgModule({
  declarations: [
    PlantillaComponent,
    MenuLateralComponent,
    BarraNavegacionComponent,
    GestionDeAliadosComponent,
    ModalCreacionAliadoComponent,
    ModalActualizacionAliadoComponent,
    ModalGestionCategoriasAliadoComponent,
    ModalActualizarCategoriasAliadoComponent,
    GestionDeCategoriasComponent,
    ModalCreacionCategoriaComponent,
    PopupComponent,
    ModalActualizarCategoriaComponent,
    ResumenTraficoClientesComponent,
    TraficoClientesComponent,
    ReporteVentasComponent,
  ],
  imports: [
    CommonModule,
    AdministradorRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    SweetAlert2Module.forRoot()
  ]
})
export class AdministradorModule { }
