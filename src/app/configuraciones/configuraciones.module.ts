import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginaConfiguracionesComponent } from './componentes/pagina-configuraciones/pagina-configuraciones.component';
import { AlertasModule } from '../alertas/alertas.module';
import { InputsModule } from '../inputs/inputs.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PaginaConfiguracionesComponent
  ],
  imports: [
    CommonModule,
    AlertasModule,
    InputsModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class ConfiguracionesModule { }
