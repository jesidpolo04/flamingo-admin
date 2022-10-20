import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { IniciarSesionRespuesta } from '../../modelos/IniciarSesionRespuesta';
import { AutenticacionService } from '../../servicios/autenticacion.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent implements OnInit {

  public usuario:string = ''
  public contrasena:string = ''

  constructor(private servicioAutenticacion:AutenticacionService, private enrutador:Router) { }

  ngOnInit(): void {
  }

  public iniciarSesion(){
    this.servicioAutenticacion.iniciarSesion(this.usuario, this.contrasena).subscribe(respuesta=>{
      this.servicioAutenticacion.guardarInformacionInicioSesion(
        respuesta.token, 
        respuesta.expira, 
        respuesta.nombre, 
        respuesta.identificacion.toString()
      )
      this.enrutador.navigateByUrl('/administrar')
    }, (error:HttpErrorResponse) =>{
      Swal.fire('credenciales incorrectas')
    })
  }

}
