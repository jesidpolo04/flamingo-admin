import { Component, Input, OnInit } from '@angular/core';
import { Modulo } from 'src/app/administrador/modelos/menu-lateral/Modulo';

@Component({
  selector: 'app-seccion-de-menu',
  templateUrl: './seccion-de-menu.component.html',
  styleUrls: ['./seccion-de-menu.component.css']
})
export class SeccionDeMenuComponent implements OnInit {
  @Input('titulo') titulo!:string;
  @Input('modulos') modulos!:Modulo[]
  public colapsado = false;

  constructor() {}

  ngOnInit(): void {
  }

}
