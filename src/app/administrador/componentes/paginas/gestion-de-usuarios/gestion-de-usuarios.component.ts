import { Component, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/administrador/modelos/usuarios/Usuario';
import { CabeceraService } from 'src/app/administrador/servicios/cabecera.service';
import { UsuariosService } from 'src/app/administrador/servicios/usuarios.service';
import { ModalActualizacionUsuarioComponent } from './modal-actualizacion-usuario/modal-actualizacion-usuario.component';
import { ModalCreacionUsuarioComponent } from './modal-creacion-usuario/modal-creacion-usuario.component';

@Component({
  selector: 'app-gestion-de-usuarios',
  templateUrl: './gestion-de-usuarios.component.html',
  styleUrls: ['./gestion-de-usuarios.component.css']
})
export class GestionDeUsuariosComponent implements OnInit {
  @ViewChild('modalCreacionUsuario') modalCreacionUsuario!:ModalCreacionUsuarioComponent
  @ViewChild('modalActualizacionUsuario') modalActualizacionUsuario!:ModalActualizacionUsuarioComponent
  public totalRegistros = 0;
  public usuarios:Usuario[] = []
  public pagina = 1;
  public porPagina = 10;

  constructor(private servicioUsuarios:UsuariosService, private servicioCabecera:CabeceraService) { 
    this.servicioCabecera.actualizarTitulo('Gestión de administradores')
  }

  ngOnInit(): void {
    this.obtenerUsuarios(1, this.porPagina)
  }

  public abrirModalCreacionUsuario(){
    this.modalCreacionUsuario.abrir()
  }

  public abrirModalActualizacionUsuario(usuario:Usuario){
    this.modalActualizacionUsuario.abrir(usuario)
  }

  public cambioDePagina(pagina:number){
    this.obtenerUsuarios(pagina, this.porPagina)
  }

  public cambiarPorPagina(porPagina:string){
    this.porPagina = parseInt(porPagina);
    this.obtenerUsuarios(1, this.porPagina)
  }

  public obtenerUsuarios(pagina:number, porPagina:number){
    this.servicioUsuarios.obtenerUsuarios(pagina, porPagina).subscribe(respuesta => {
      this.usuarios = respuesta.usuarios
      this.totalRegistros = respuesta.paginacion.totalRegistros
    })
  }
}
