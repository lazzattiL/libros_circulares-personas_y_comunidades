import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PersonasStore } from '../shared/personas.store';
import {
  bodyObject,
  nonEmptyString,
  positiveInteger,
  required,
} from '../shared/validation';
import { comunidadView, usuarioView } from '../shared/views';
import { Comunidad } from './entities/comunidad.entity';

@Injectable()
export class ComunidadService {
  constructor(private readonly store: PersonasStore) {}

  crear(value: unknown) {
    const body = bodyObject(value);
    const nombre = nonEmptyString(required(body, 'nombre'), 'nombre');
    this.verificarNombre(nombre);
    const comunidad = new Comunidad();
    comunidad.comunidadId = this.store.nuevaComunidadId();
    comunidad.nombre = nombre;
    this.store.comunidades.set(comunidad.comunidadId, comunidad);
    return { comunidadId: comunidad.comunidadId };
  }

  listar() {
    return [...this.store.comunidades.values()].map(comunidadView);
  }

  consultar(value: unknown) {
    const body = bodyObject(value);
    const comunidadId = positiveInteger(
      required(body, 'comunidadId'),
      'comunidadId',
    );
    return comunidadView(this.buscar(comunidadId));
  }

  consultarMiembros(value: unknown) {
    const body = bodyObject(value);
    const comunidadId = positiveInteger(
      required(body, 'comunidadId'),
      'comunidadId',
    );
    return this.buscar(comunidadId).miembros.map(usuarioView);
  }

  renombrar(value: unknown) {
    const body = bodyObject(value);
    const comunidadId = positiveInteger(
      required(body, 'comunidadId'),
      'comunidadId',
    );
    const nombre = nonEmptyString(required(body, 'nombre'), 'nombre');
    const comunidad = this.buscar(comunidadId);
    this.verificarNombre(nombre, comunidadId);
    comunidad.nombre = nombre;
    return comunidadView(comunidad);
  }

  eliminar(value: unknown) {
    const body = bodyObject(value);
    const comunidadId = positiveInteger(
      required(body, 'comunidadId'),
      'comunidadId',
    );
    const comunidad = this.buscar(comunidadId);
    for (const usuario of comunidad.miembros) {
      usuario.comunidades = usuario.comunidades.filter(
        (item) => item.comunidadId !== comunidadId,
      );
    }
    this.store.comunidades.delete(comunidadId);
    return { comunidadId };
  }

  agregarMiembro(value: unknown) {
    const body = bodyObject(value);
    const comunidadId = positiveInteger(
      required(body, 'comunidadId'),
      'comunidadId',
    );
    const usuarioId = positiveInteger(required(body, 'usuarioId'), 'usuarioId');
    const comunidad = this.buscar(comunidadId);
    const usuario = this.store.usuarios.get(usuarioId);
    if (!usuario) {
      throw new NotFoundException('El usuario no existe');
    }
    if (comunidad.miembros.some((miembro) => miembro.usuarioId === usuarioId)) {
      throw new ConflictException('El usuario ya pertenece a la comunidad');
    }
    if (usuario.comunidades.length >= 3) {
      throw new ConflictException('El usuario ya pertenece a 3 comunidades');
    }
    comunidad.miembros.push(usuario);
    usuario.comunidades.push(comunidad);
    return { comunidadId, usuarioId };
  }

  quitarMiembro(value: unknown) {
    const body = bodyObject(value);
    const comunidadId = positiveInteger(
      required(body, 'comunidadId'),
      'comunidadId',
    );
    const usuarioId = positiveInteger(required(body, 'usuarioId'), 'usuarioId');
    const comunidad = this.buscar(comunidadId);
    const usuario = this.store.usuarios.get(usuarioId);
    if (!usuario) {
      throw new NotFoundException('El usuario no existe');
    }
    if (
      !comunidad.miembros.some((miembro) => miembro.usuarioId === usuarioId)
    ) {
      throw new NotFoundException('El usuario no pertenece a la comunidad');
    }
    comunidad.miembros = comunidad.miembros.filter(
      (miembro) => miembro.usuarioId !== usuarioId,
    );
    usuario.comunidades = usuario.comunidades.filter(
      (item) => item.comunidadId !== comunidadId,
    );
    return { comunidadId, usuarioId };
  }

  private buscar(comunidadId: number): Comunidad {
    const comunidad = this.store.comunidades.get(comunidadId);
    if (!comunidad) {
      throw new NotFoundException('La comunidad no existe');
    }
    return comunidad;
  }

  private verificarNombre(nombre: string, comunidadId?: number): void {
    if (
      [...this.store.comunidades.values()].some(
        (comunidad) =>
          comunidad.nombre === nombre && comunidad.comunidadId !== comunidadId,
      )
    ) {
      throw new ConflictException('El nombre ya está en uso');
    }
  }
}
