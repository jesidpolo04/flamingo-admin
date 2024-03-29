import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionDeAliadosComponent } from './administrador/componentes/paginas/gestion-de-aliados/gestion-de-aliados.component';
import { GestionDeCategoriasComponent } from './administrador/componentes/paginas/gestion-de-categorias/gestion-de-categorias.component';
import { GestionDeUsuariosComponent } from './administrador/componentes/paginas/gestion-de-usuarios/gestion-de-usuarios.component';
import { ReporteVentasComponent } from './administrador/componentes/paginas/reporte-ventas/reporte-ventas.component';
import { ResumenTraficoClientesComponent } from './administrador/componentes/paginas/resumen-trafico-clientes/resumen-trafico-clientes.component';
import { TraficoClientesComponent } from './administrador/componentes/paginas/trafico-clientes/trafico-clientes.component';
import { PlantillaComponent } from './administrador/componentes/plantilla/plantilla.component';
import { InicioSesionComponent } from './autenticacion/componentes/inicio-sesion/inicio-sesion.component';
import { AutenticacionGuard } from './guards/autenticacion.guard';
import { PaginaGestionBannersComponent } from './banners/componentes/pagina-gestion-banners/pagina-gestion-banners.component';
import { PaginaGestionProductosComponent } from './productos/componentes/pagina-gestion-productos/pagina-gestion-productos.component';
import { PaginaConfiguracionesComponent } from './configuraciones/componentes/pagina-configuraciones/pagina-configuraciones.component';

const routes: Routes = [
  {
    path: 'administrar',
    component: PlantillaComponent,
    children: [
      {
        path:'',
        redirectTo: 'trafico',
        pathMatch: 'full' 
      },
      {
        path: 'aliados',
        component: GestionDeAliadosComponent
      },
      {
        path: 'categorias',
        component: GestionDeCategoriasComponent
      },
      {
        path: 'trafico',
        component: ResumenTraficoClientesComponent,
      },
      {
        path: 'trafico/detalle',
        component: TraficoClientesComponent
      },
      {
        path: 'ventas',
        component: ReporteVentasComponent
      },
      {
        path: 'administradores',
        component: GestionDeUsuariosComponent
      },
      {
        path: 'banners',
        component: PaginaGestionBannersComponent
      },
      {
        path: 'productos',
        component: PaginaGestionProductosComponent
      },
      {
        path: 'configuraciones',
        component: PaginaConfiguracionesComponent
      }
    ],
    canActivate: [AutenticacionGuard]
  },
  {
    path: 'inicio-sesion',
    component: InicioSesionComponent
  },
  {
    path: '**',
    pathMatch: 'full',
    redirectTo: 'administrar'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
