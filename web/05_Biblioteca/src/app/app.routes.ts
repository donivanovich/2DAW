import { Routes } from '@angular/router';

import { Inicio } from './pages/inicio/inicio';
import { Autores } from './pages/autores/autores';
import { Libros } from './pages/libros/libros';
import { DetalleLibro } from './pages/libros/detalle-libro/detalle-libro';
import { NoEncontrado } from './pages/no-encontrado/no-encontrado';

import { MiCuenta } from './pages/mi-cuenta/mi-cuenta';
import { Perfil } from './pages/mi-cuenta/perfil/perfil';
import { Prestamos } from './pages/mi-cuenta/prestamos/prestamos';

export const routes: Routes = [

  { path: 'inicio', component: Inicio },

  { path: 'autores', component: Autores },

  { path: 'libros', component: Libros },

  { path: 'libros/:id', component: DetalleLibro },

  {
    path: 'mi-cuenta',
    component: MiCuenta,
    children: [
      { path: '', redirectTo: 'perfil', pathMatch: 'full' },
      { path: 'perfil', component: Perfil },
      { path: 'prestamos', component: Prestamos }
    ]
  },

  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  { path: '**', component: NoEncontrado }

];
