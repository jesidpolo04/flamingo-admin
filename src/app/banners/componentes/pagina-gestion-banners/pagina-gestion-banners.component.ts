import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Aliado } from 'src/app/administrador/modelos/aliados/Aliado';
import { AliadosService } from 'src/app/administrador/servicios/aliados.service';
import { BannersService } from '../../servicios/banners.service';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';
import { Banner } from '../../modelos/Banner';

@Component({
  selector: 'app-pagina-gestion-banners',
  templateUrl: './pagina-gestion-banners.component.html',
  styleUrls: ['./pagina-gestion-banners.component.css']
})
export class PaginaGestionBannersComponent implements OnInit {
  @ViewChild('popup') popup!:PopupComponent
  formulario: FormGroup
  aliados: Aliado[] = []
  banners?: {bannerDesktop: Banner | null, bannerMobile: Banner | null}

  constructor(private servicioAliados: AliadosService, private servicioBanners: BannersService) { 
    this.formulario = new FormGroup({
      imagen: new FormControl<File | undefined>(undefined),
      imagenMobile: new FormControl<File | undefined>(undefined),
      aliado: new FormControl<string | undefined>(undefined, [Validators.required]),
      linkAmigable: new FormControl<string | undefined>(undefined, [Validators.required])
    })
  }

  ngOnInit(): void {
    this.obtenerAliados()
    this.cargarBanner()
  }

  obtenerAliados(){
    this.servicioAliados.obtenerAliados().subscribe({
      next: ( respuesta ) => {
        this.aliados = respuesta.aliados
      }
    })
  }

  cargarBanner(){
    this.servicioBanners.obtenerBannerPrincipal().subscribe({
      next: (banners)=>{
        this.banners = banners
        const controls = this.formulario.controls
        if(banners.bannerDesktop){
          controls['aliado'].setValue(banners.bannerDesktop.idAliado)
          controls['linkAmigable'].setValue(banners.bannerDesktop.linkAmigable)
        }
        if(!banners.bannerDesktop || !banners.bannerDesktop.imagen){
          controls['imagen'].addValidators([Validators.required])
          controls['imagen'].updateValueAndValidity()
        }
        if(!banners.bannerMobile || !banners.bannerMobile.imagen){
          controls['imagenMobile'].addValidators([Validators.required])
          controls['imagenMobile'].updateValueAndValidity()
        }
        console.log(controls)
      }
    })
  }

  guardarBannerPrincipal(){
    if(this.formulario.invalid){
      console.error(this.formulario.controls)
      this.popup.abrirPopupFallido('Formulario inválido.', 'Rellena correctamente todos los campos.')
      marcarFormularioComoSucio(this.formulario)
      throw new Error('Formulario inválido')
    }
    const controls = this.formulario.controls
    this.servicioBanners.guardarBannerPrincipal(
      controls['aliado'].value,
      controls['linkAmigable'].value,
      controls['imagen'].value,
      controls['imagenMobile'].value
    ).subscribe({
      next: ()=>{
        this.popup.abrirPopupExitoso('Se ha guardado el banner con éxito.')
      },
      error: ()=>{
        this.popup.abrirPopupFallido('Error', 'No fue posible guardar el banner.')
      }
    })
  }

}
