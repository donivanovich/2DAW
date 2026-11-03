import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LibrosService } from '../../services/libros.service';

@Component({
  selector: 'app-libros',
  imports: [RouterLink],
  templateUrl: './libros.html',
  styleUrl: './libros.css'
})
export class Libros {

  private librosService = inject(LibrosService);

  genero = input<string>();

  libros = computed(() =>
    this.librosService.obtenerTodos(this.genero())
  );
}
