import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { EjemplaresClient } from '../ejemplares/ejemplares.client';
import { PersonasStore } from '../shared/personas.store';
import {
  birthDate,
  bodyObject,
  email,
  nonEmptyString,
  positiveInteger,
  required,
  RequestBody,
} from '../shared/validation';
import { usuarioView } from '../shared/views';
import { Usuario } from './entities/usuario.entity';

const camposUsuario = [
  'nombre',
  'apellido',
  'correoElectronico',
  'fechaNacimiento',
  'dni',
] as const;

type DatosUsuario = Pick<Usuario, (typeof camposUsuario)[number]>;

@Injectable()
export class UsuarioService {
  constructor(
    private readonly store: PersonasStore,
    private readonly ejemplaresClient: EjemplaresClient,
  ) {}

  crear(value: unknown) {
    const body = bodyObject(value);
    const datos = this.validarDatos(body, true) as DatosUsuario;
    this.verificarDni(datos.dni);

    const usuario = new Usuario();
    usuario.usuarioId = this.store.nuevoUsuarioId();
    Object.assign(usuario, datos);
    this.store.usuarios.set(usuario.usuarioId, usuario);
    return { usuarioId: usuario.usuarioId };
  }

  listar() {
    return [...this.store.usuarios.values()].map(usuarioView);
  }

  consultar(value: unknown) {
    const body = bodyObject(value);
    const usuarioId = positiveInteger(required(body, 'usuarioId'), 'usuarioId');
    return usuarioView(this.buscar(usuarioId));
  }

  consultarVarios(value: unknown) {
    const body = bodyObject(value);
    const ids = required(body, 'ids');
    if (!Array.isArray(ids)) {
      throw new UnprocessableEntityException('ids debe ser un arreglo');
    }
    if (ids.length === 0) {
      throw new BadRequestException('Faltan ids');
    }
    const validIds = ids.map((id: unknown) => positiveInteger(id, 'ids'));
    return validIds.map((id: number) => usuarioView(this.buscar(id)));
  }

  reemplazar(value: unknown) {
    const body = bodyObject(value);
    const usuarioId = positiveInteger(required(body, 'usuarioId'), 'usuarioId');
    const datos = this.validarDatos(body, true) as DatosUsuario;
    const usuario = this.buscar(usuarioId);
    this.verificarDni(datos.dni, usuarioId);
    Object.assign(usuario, datos);
    return { usuarioId };
  }

  modificar(value: unknown) {
    const body = bodyObject(value);
    const usuarioId = positiveInteger(required(body, 'usuarioId'), 'usuarioId');
    if (!camposUsuario.some((campo) => body[campo] !== undefined)) {
      throw new BadRequestException('Faltan campos para modificar');
    }
    const datos = this.validarDatos(body, false);
    const usuario = this.buscar(usuarioId);
    if (datos.dni !== undefined) {
      this.verificarDni(datos.dni, usuarioId);
    }
    Object.assign(usuario, datos);
    return { usuarioId };
  }

  async eliminar(value: unknown) {
    const body = bodyObject(value);
    const usuarioId = positiveInteger(required(body, 'usuarioId'), 'usuarioId');
    const usuario = this.buscar(usuarioId);
    if (await this.ejemplaresClient.tieneEjemplares(usuarioId)) {
      throw new ConflictException('El usuario posee ejemplares');
    }
    for (const comunidad of usuario.comunidades) {
      comunidad.miembros = comunidad.miembros.filter(
        (miembro) => miembro.usuarioId !== usuarioId,
      );
    }
    this.store.usuarios.delete(usuarioId);
    return { usuarioId };
  }

  private buscar(usuarioId: number): Usuario {
    const usuario = this.store.usuarios.get(usuarioId);
    if (!usuario) {
      throw new NotFoundException('El usuario no existe');
    }
    return usuario;
  }

  private verificarDni(dni: number, usuarioId?: number): void {
    if (
      [...this.store.usuarios.values()].some(
        (usuario) => usuario.dni === dni && usuario.usuarioId !== usuarioId,
      )
    ) {
      throw new ConflictException('El DNI ya está en uso');
    }
  }

  private validarDatos(
    body: RequestBody,
    completos: boolean,
  ): Partial<DatosUsuario> {
    const datos: Partial<DatosUsuario> = {};
    for (const campo of camposUsuario) {
      const value = completos ? required(body, campo) : body[campo];
      if (value === undefined) continue;
      switch (campo) {
        case 'nombre':
        case 'apellido':
          datos[campo] = nonEmptyString(value, campo);
          break;
        case 'correoElectronico':
          datos.correoElectronico = email(value);
          break;
        case 'fechaNacimiento':
          datos.fechaNacimiento = birthDate(value);
          break;
        case 'dni':
          datos.dni = positiveInteger(value, 'dni');
          break;
      }
    }
    return datos;
  }
}
