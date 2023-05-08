import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopupComponent } from './componentes/popup/popup.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';



@NgModule({
  declarations: [
    PopupComponent
  ],
  imports: [
    CommonModule,
    SweetAlert2Module.forRoot()
  ],
  exports: [
    PopupComponent
  ]
})
export class AlertasModule { }
