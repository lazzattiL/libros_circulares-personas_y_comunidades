import { Usuario } from '../usuario/entities/usuario.entity';
import { Comunidad } from '../comunidad/entities/comunidad.entity';

export function usuarioView(usuario: Usuario) {
  return {
    usuarioId: usuario.usuarioId,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    correoElectronico: usuario.correoElectronico,
    fechaNacimiento: usuario.fechaNacimiento,
    dni: usuario.dni,
  };
}

export function comunidadView(comunidad: Comunidad) {
  return { comunidadId: comunidad.comunidadId, nombre: comunidad.nombre };
}
