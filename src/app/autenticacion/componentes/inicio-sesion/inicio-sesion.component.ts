import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AliadosService } from 'src/app/administrador/servicios/aliados.service';
import Swal from 'sweetalert2';
import { IniciarSesionRespuesta } from '../../modelos/IniciarSesionRespuesta';
import { AutenticacionService } from '../../servicios/autenticacion.service';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent implements OnInit {
  public hayVpn = false
  public usuario:string = ''
  public contrasena:string = ''

  constructor(private servicioAutenticacion:AutenticacionService, private http:HttpClient, private enrutador:Router) { }

  ngOnInit(): void {
    this.http.get(`http://172.16.8.34:8100`).subscribe(respuesta => {
      this.hayVpn = true
    },(error:HttpErrorResponse)=>{
      if(error.status != 200){
        console.log(error.status)
        location.href = "https://aliadosflamingo.flamingo.com.co:99/Marketing-Aliados-Frontend/dist/landing/browser/"
      }else{
        this.hayVpn = true
      }
    })
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
