import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginaGestionProductosComponent } from './componentes/pagina-gestion-productos/pagina-gestion-productos.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AlertasModule } from '../alertas/alertas.module';
import { InputsModule } from '../inputs/inputs.module';
import { ModalCrearProductoComponent } from './componentes/modal-crear-producto/modal-crear-producto.component';
import { ModalActualizarProductoComponent } from './componentes/modal-actualizar-producto/modal-actualizar-producto.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PaginaGestionProductosComponent,
    ModalCrearProductoComponent,
    ModalActualizarProductoComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,

    NgbModule,
    AlertasModule,
    InputsModule
  ]
})
export class ProductosModule { }
