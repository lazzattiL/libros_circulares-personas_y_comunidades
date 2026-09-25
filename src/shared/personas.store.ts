import { Injectable } from '@nestjs/common';
import { Comunidad } from '../comunidad/entities/comunidad.entity';
import { Usuario } from '../usuario/entities/usuario.entity';

@Injectable()
export class PersonasStore {
  readonly usuarios = new Map<number, Usuario>();
  readonly comunidades = new Map<number, Comunidad>();
  private siguienteUsuarioId = 1;
  private siguienteComunidadId = 1;

  nuevoUsuarioId(): number {
    return this.siguienteUsuarioId++;
  }

  nuevaComunidadId(): number {
    return this.siguienteComunidadId++;
  }
}
