import type { Usuario } from '../../usuario/entities/usuario.entity';

export class Comunidad {
  comunidadId: number;
  nombre: string;
  miembros: Usuario[] = [];
}
