import { Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { LibrosService } from '../../../services/libros.service';

@Component({
  selector: 'app-detalle-libro',
  imports: [RouterLink],
  templateUrl: './detalle-libro.html',
  styleUrl: './detalle-libro.css'
})
export class DetalleLibro {

  id = input<string>();

  private librosService = inject(LibrosService);
  private router = inject(Router);

  libro = computed(() =>
    this.librosService.obtenerPorId(Number(this.id()))
  );

  siguienteLibro() {
    const siguienteId = this.librosService.idSiguiente(Number(this.id()));

    this.router.navigate(['/libros', siguienteId]);
  }

  irAMiCuenta() {
    this.router.navigateByUrl('/mi-cuenta');
  }
}
