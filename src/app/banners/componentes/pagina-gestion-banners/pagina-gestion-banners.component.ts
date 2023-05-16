import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Aliado } from 'src/app/administrador/modelos/aliados/Aliado';
import { AliadosService } from 'src/app/administrador/servicios/aliados.service';
import { BannersService } from '../../servicios/banners.service';
import { PopupComponent } from 'src/app/alertas/componentes/popup/popup.component';
import { marcarFormularioComoSucio } from 'src/app/administrador/utilidades/Utilidades';

@Component({
  selector: 'app-pagina-gestion-banners',
  templateUrl: './pagina-gestion-banners.component.html',
  styleUrls: ['./pagina-gestion-banners.component.css']
})
export class PaginaGestionBannersComponent implements OnInit {
  @ViewChild('popup') popup!:PopupComponent
  formulario: FormGroup
  aliados: Aliado[] = []

  constructor(private servicioAliados: AliadosService, private servicioBanners: BannersService) { 
    this.formulario = new FormGroup({
      imagen: new FormControl<File | undefined>(undefined, [Validators.required]),
      imagenMobile: new FormControl<File | undefined>(undefined, [Validators.required]),
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
        const controls = this.formulario.controls
        controls['aliado'].setValue(banners.bannerDesktop.idAliado)
        controls['linkAmigable'].setValue(banners.bannerDesktop.linkAmigable)
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
      controls['imagen'].value,
      controls['imagenMobile'].value,
      controls['linkAmigable'].value
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
