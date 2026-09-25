import { Module } from '@nestjs/common';
import { ComunidadController } from './comunidad/comunidad.controller';
import { ComunidadService } from './comunidad/comunidad.service';
import { EjemplaresClient } from './ejemplares/ejemplares.client';
import { PersonasStore } from './shared/personas.store';
import { UsuarioController } from './usuario/usuario.controller';
import { UsuarioService } from './usuario/usuario.service';

@Module({
  controllers: [UsuarioController, ComunidadController],
  providers: [
    PersonasStore,
    EjemplaresClient,
    UsuarioService,
    ComunidadService,
  ],
})
export class PersonasModule {}
