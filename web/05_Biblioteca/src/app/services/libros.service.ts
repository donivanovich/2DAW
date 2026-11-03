import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LibrosService {

  private libros = [
    { id: 1, titulo: 'Don Quijote', autor: 'Cervantes', genero: 'novela' },
    { id: 2, titulo: 'La Odisea', autor: 'Homero', genero: 'epica' },
    { id: 3, titulo: 'Cien años de soledad', autor: 'García Márquez', genero: 'novela' },
    { id: 4, titulo: 'El principito', autor: 'Saint-Exupéry', genero: 'fantasia' },
    { id: 5, titulo: 'El Hobbit', autor: 'Tolkien', genero: 'fantasia' },
    { id: 6, titulo: 'La sombra del viento', autor: 'Carlos Ruiz Zafón', genero: 'novela' }
  ];

  obtenerTodos(genero?: string) {
    if (genero) {
      return this.libros.filter(libro => libro.genero === genero);
    }

    return this.libros;
  }

  obtenerPorId(id: number) {
    return this.libros.find(libro => libro.id === id);
  }

  idSiguiente(id: number) {
    const indice = this.libros.findIndex(libro => libro.id === id);

    if (indice === -1) {
      return this.libros[0].id;
    }

    return this.libros[(indice + 1) % this.libros.length].id;
  }
}
