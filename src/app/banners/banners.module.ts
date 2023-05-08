import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginaGestionBannersComponent } from './componentes/pagina-gestion-banners/pagina-gestion-banners.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InputsModule } from '../inputs/inputs.module';
import { AlertasModule } from '../alertas/alertas.module';



@NgModule({
  declarations: [
    PaginaGestionBannersComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgbModule,
    InputsModule,
    AlertasModule
  ]
})
export class BannersModule { }
