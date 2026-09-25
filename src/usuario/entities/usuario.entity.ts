import type { Comunidad } from '../../comunidad/entities/comunidad.entity';

export class Usuario {
  usuarioId: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  fechaNacimiento: Date;
  dni: number;
  comunidades: Comunidad[] = [];
}
