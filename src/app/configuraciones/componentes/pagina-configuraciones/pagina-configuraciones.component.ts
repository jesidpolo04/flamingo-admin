import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { ConfiguracionesService } from '../../servicios/configuraciones.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-pagina-configuraciones',
  templateUrl: './pagina-configuraciones.component.html',
  styleUrls: ['./pagina-configuraciones.component.css']
})
export class PaginaConfiguracionesComponent implements OnInit {
  @ViewChild('popup') popup!: PopupComponent
  formularioImagenDesktop: FormGroup
  formularioImagenMobile: FormGroup
  vitrinaActiva: boolean = false 
  bannerPrincipalActivo: boolean = false

  constructor(private servicio: ConfiguracionesService) { 
    this.formularioImagenDesktop = new FormGroup({
      imagenDesktop: new FormControl<File | undefined>(undefined, [ Validators.required ])
    })

    this.formularioImagenMobile = new FormGroup({
      imagenMobile: new FormControl<File | undefined>(undefined, [ Validators.required ])
    })
  }

  ngOnInit(): void {
    this.obtenerEstadosVitrinaYBannerPrincipal()
  }

  guardarImagenDesktop(){
    const controls = this.formularioImagenDesktop.controls
    if(this.formularioImagenDesktop.invalid){
      this.popup.abrirPopupFallido('Error', 'La imagen es requerida.')
      throw Error('Formulario inválido')
    }
    this.servicio.guardarImagenModalRedireccionDesktop(controls['imagenDesktop'].value).subscribe({
      next: ()=>{
        this.popup.abrirPopupExitoso('Guardado correctamente.')
      },
      error: (error: HttpErrorResponse) =>{
        this.popup.abrirPopupFallido('Error', 'Algo salió mal durante la actualización de la imagen.')
      }
    })
  }

  guardarImagenMobile(){
    const controls = this.formularioImagenMobile.controls
    if(this.formularioImagenMobile.invalid){
      this.popup.abrirPopupFallido('Error', 'La imagen es requerida.')
      throw Error('Formulario inválido')
    }
    this.servicio.guardarImagenModalRedireccionMobile(controls['imagenMobile'].value).subscribe({
      next: ()=>{
        this.popup.abrirPopupExitoso('Guardado correctamente.')
      },
      error: (error: HttpErrorResponse) =>{
        this.popup.abrirPopupFallido('Error', 'Algo salió mal durante la actualización de la imagen.')
      }
    })
  }

  obtenerEstadosVitrinaYBannerPrincipal(){
    this.servicio.obtenerConfiguracionVitrinaYBannerPrincipal().subscribe({
      next: (respuesta)=>{
        this.bannerPrincipalActivo = respuesta.banner
        this.vitrinaActiva = respuesta.vitrina
      }
    })
  }

  cambiarEstadoVitrina(){
    this.servicio.cambiarEstadoVitrina().subscribe({
      next: ()=>{
        this.popup.abrirPopupExitoso("Guardado con éxito.")
      },
      error: ()=>{
        this.popup.abrirPopupFallido("Error.", "Algo salió mal al momento de actualizar.")
      }
    })
  }

  cambiarEstadoBannerPrincipal(){
    this.servicio.cambiarEstadoBannerPrincipal().subscribe({
      next: ()=>{
        this.popup.abrirPopupExitoso("Guardado con éxito.")
      },
      error: ()=>{
        this.popup.abrirPopupFallido("Error.", "Algo salió mal al momento de actualizar.")
      }
    })

  }

}
