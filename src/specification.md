# Especificación del sistema de gestión de usuarios

## Contexto global

El proyecto **"Libros Circulares"** promueve el préstamo de libros entre personas, incluso sin necesidad de que el ejemplar vuelva a su dueño original y sin que este pierda su propiedad.

Esto significa que, si una persona A presta un libro a B, B puede prestárselo a C y C a D. Sin embargo, la propiedad continúa perteneciendo a A hasta que este decida cederla a otra persona.

Las operaciones permitidas son el préstamo, la devolución, la cesión de la propiedad y la baja del ejemplar.

## Contexto local

Un usuario puede ser miembro de un máximo de **3 comunidades simultáneamente**.

Las operaciones solo pueden realizarse entre miembros de una misma comunidad.

No puede existir más de un usuario con el mismo DNI.

DNI significa **Documento Nacional de Identidad**.

## Restricciones técnicas

El proyecto utiliza **NestJS** y el protocolo HTTP.

Las entradas y salidas utilizan formato **JSON**.

No se utilizan bases de datos. La información se almacena únicamente mediante repositorios persistentes en memoria.

No es necesario completar los tests ni agregar comentarios innecesarios.

Todos los identificadores enviados en una solicitud forman parte de su cuerpo JSON, nunca de la ruta ni de parámetros de consulta. Las consultas por identificador utilizan POST y responden con estado 200. Las bajas utilizan DELETE con cuerpo JSON. Los identificadores y el DNI son enteros positivos; `fechaNacimiento` se envía como fecha ISO válida y se devuelve como cadena ISO.

Para dar de baja un usuario, este servicio consulta `GET /ejemplar` de gestión de ejemplares mediante `EJEMPLARES_SERVICE_URL`. La baja se rechaza si el usuario posee algún ejemplar o si no puede verificarse la propiedad.

## Entidades a implementar

### Clase `Comunidad`

```typescript
export class Comunidad {
  comunidadId: number;
  nombre: string;
  miembros: Usuario[] = [];
}
```

### Clase `Usuario`

```typescript
export class Usuario {
  usuarioId: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  fechaNacimiento: Date;
  dni: number;
  comunidades: Comunidad[] = [];
}
```

## Operaciones / flujos permitidos

### Obtener los participantes registrados de una comunidad

* HTTP Request: POST

* Endpoint: `/comunidad/miembros/consulta`

* Cuerpo:

  * `comunidadId`

* Salida: todos los `usuarioId`, `nombre`, `apellido`, `correoElectronico`, `fechaNacimiento` y `dni` registrados en la comunidad.

* Códigos de estado:

  * Operación exitosa: 200
  * Faltan valores: 400
  * La comunidad no existe: 404
  * Datos no procesables: 422

### Registrar una comunidad

* HTTP Request: POST

* Endpoint: `/comunidad`

* Cuerpo:

  * `nombre`

* Salida: `comunidadId`

* Códigos de estado:

  * Operación exitosa: 201
  * Faltan valores: 400
  * El nombre ya está en uso: 409
  * Datos no procesables: 422

### Dar de baja una comunidad

* HTTP Request: DELETE

* Endpoint: `/comunidad`

* Cuerpo:

  * `comunidadId`

* Salida: `comunidadId`

* Códigos de estado:

  * Operación exitosa: 200
  * Faltan valores: 400
  * La comunidad no existe: 404
  * Datos no procesables: 422

### Cambiar el nombre de una comunidad

* HTTP Request: PATCH

* Endpoint: `/comunidad`

* Cuerpo:

  * `comunidadId`
  * `nombre`

* Salida: `comunidadId`, `nombre`

* Códigos de estado:

  * Operación exitosa: 200
  * Faltan valores: 400
  * El nombre ya está en uso: 409
  * Datos no procesables: 422
  * La comunidad no existe: 404

### Eliminar un usuario de una comunidad

* HTTP Request: DELETE

* Endpoint: `/comunidad/miembros`

* Cuerpo:

  * `comunidadId`
  * `usuarioId`

* Salida: `comunidadId`, `usuarioId`

* Códigos de estado:

  * Operación exitosa: 200
  * Faltan valores: 400
  * Datos no procesables: 422
  * La comunidad no existe: 404
  * El usuario no existe: 404
  * El usuario no pertenece a la comunidad: 404

### Registrar un usuario en una comunidad

* HTTP Request: POST

* Endpoint: `/comunidad/miembros`

* Cuerpo:

  * `comunidadId`
  * `usuarioId`

* Salida: `comunidadId`, `usuarioId`

* Códigos de estado:

  * Operación exitosa: 200
  * Faltan valores: 400
  * Datos no procesables: 422
  * La comunidad no existe: 404
  * El usuario no existe: 404
  * El usuario ya pertenece a 3 comunidades: 409
  * El usuario ya pertenece a la comunidad: 409

### Obtener todas las comunidades

* HTTP Request: GET

* Endpoint: `/comunidad`

* Salida:
  * `comunidadId`
  * nombre de todas las comunidades encontradas.

* Códigos de estado:

  * Operación exitosa: 200

### Obtener el nombre de una comunidad

* HTTP Request: POST

* Endpoint: `/comunidad/consulta`

* Cuerpo:

  * `comunidadId`

* Salida: `comunidadId`, `nombre`

* Códigos de estado:

  * Operación exitosa: 200
  * Faltan valores: 400
  * Datos no procesables: 422
  * La comunidad no existe: 404

### Obtener determinados usuarios

* HTTP Request: POST

* Endpoint: `/usuario/por-ids`

* Cuerpo:

  * `ids`: arreglo de `usuarioId`

* Salida: `usuarioId`, `nombre`, `apellido`, `correoElectronico`, `fechaNacimiento` y `dni` de los usuarios especificados.

* Códigos de estado:

  * Operación exitosa: 200
  * El usuario no existe: 404
  * Faltan valores: 400
  * Datos no procesables: 422

### Obtener los datos de todos los usuarios

* HTTP Request: GET

* Endpoint: `/usuario`

* Salida: `usuarioId`, `nombre`, `apellido`, `correoElectronico`, `fechaNacimiento` y `dni` de todos los usuarios.

* Códigos de estado:

  * Operación exitosa: 200

### Obtener los datos de un usuario

* HTTP Request: POST

* Endpoint: `/usuario/consulta`

* Cuerpo:

  * `usuarioId`

* Salida:

  * `usuarioId`
  * `nombre`
  * `apellido`
  * `correoElectronico`
  * `fechaNacimiento`
  * `dni`

* Códigos de estado:

  * Operación exitosa: 200
  * Faltan valores: 400
  * El usuario no existe: 404
  * Datos no procesables: 422

### Registrar un usuario

* HTTP Request: POST

* Endpoint: `/usuario`

* Cuerpo:

  * `nombre`
  * `apellido`
  * `correoElectronico`
  * `fechaNacimiento`
  * `dni`

* Salida: `usuarioId`

* Códigos de estado:

  * Operación exitosa: 201
  * Faltan valores: 400
  * El DNI ya está en uso: 409
  * Datos no procesables: 422

### Dar de baja un usuario

* HTTP Request: DELETE

* Endpoint: `/usuario`

* Cuerpo:

  * `usuarioId`

* Salida: `usuarioId`

* Códigos de estado:

  * Operación exitosa: 200
  * Faltan valores: 400
  * El usuario no existe: 404
  * Datos no procesables: 422
  * El usuario posee ejemplares: 409
  * No se pudo consultar gestión de ejemplares: 503

### Modificar el nombre, apellido, correo electrónico, fecha de nacimiento y DNI de un usuario

* HTTP Request: PUT

* Endpoint: `/usuario`

* Cuerpo:

  * `usuarioId`
  * `nombre`
  * `apellido`
  * `correoElectronico`
  * `fechaNacimiento`
  * `dni`

* Salida: `usuarioId`

* Códigos de estado:

  * Operación exitosa: 200
  * El usuario no existe: 404
  * Faltan valores: 400
  * El DNI ya está en uso: 409
  * Datos no procesables: 422

### Modificar algunos datos de un usuario

* HTTP Request: PATCH

* Endpoint: `/usuario`

* Cuerpo: `usuarioId` y uno o más de los siguientes valores:

  * `nombre`
  * `apellido`
  * `correoElectronico`
  * `fechaNacimiento`
  * `dni`

* Salida: `usuarioId`

* Códigos de estado:

  * Operación exitosa: 200
  * Faltan valores: 400
  * Datos no procesables: 422
  * El DNI ya está en uso: 409
  * El usuario no existe: 404

## Casos de uso conflictivos

* Registrar un usuario con un DNI que ya se encuentra en uso.
* Modificar el DNI de un usuario por uno que ya pertenece a otro usuario.
* Registrar una comunidad con un nombre que ya se encuentra en uso.
* Modificar el nombre de una comunidad por uno que ya pertenece a otra comunidad.
* Registrar un usuario en una comunidad a la que ya pertenece.
* Registrar un usuario en una cuarta comunidad cuando ya pertenece a 3.
* Eliminar de una comunidad a un usuario que no pertenece a ella.
* Operar sobre un usuario inexistente.
* Operar sobre una comunidad inexistente.
* Enviar un PATCH sin ningún campo para modificar.
