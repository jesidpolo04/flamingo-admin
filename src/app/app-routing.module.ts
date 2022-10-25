import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GestionDeAliadosComponent } from './administrador/componentes/paginas/gestion-de-aliados/gestion-de-aliados.component';
import { GestionDeCategoriasComponent } from './administrador/componentes/paginas/gestion-de-categorias/gestion-de-categorias.component';
import { ReporteVentasComponent } from './administrador/componentes/paginas/reporte-ventas/reporte-ventas.component';
import { ResumenTraficoClientesComponent } from './administrador/componentes/paginas/resumen-trafico-clientes/resumen-trafico-clientes.component';
import { PlantillaComponent } from './administrador/componentes/plantilla/plantilla.component';
import { InicioSesionComponent } from './autenticacion/componentes/inicio-sesion/inicio-sesion.component';
import { AutenticacionGuard } from './guards/autenticacion.guard';

const routes: Routes = [
  {
    path: 'administrar',
    component: PlantillaComponent,
    children: [
      {
        path:'',
        redirectTo: 'aliados',
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
        component: ResumenTraficoClientesComponent
      },
      {
        path: 'ventas',
        component: ReporteVentasComponent
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
