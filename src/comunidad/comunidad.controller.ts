import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
} from '@nestjs/common';
import { ComunidadService } from './comunidad.service';

@Controller('comunidad')
export class ComunidadController {
  constructor(private readonly comunidades: ComunidadService) {}

  @Post()
  crear(@Body() body: unknown) {
    return this.comunidades.crear(body);
  }

  @Get()
  listar() {
    return this.comunidades.listar();
  }

  @Post('consulta')
  @HttpCode(200)
  consultar(@Body() body: unknown) {
    return this.comunidades.consultar(body);
  }

  @Post('miembros/consulta')
  @HttpCode(200)
  consultarMiembros(@Body() body: unknown) {
    return this.comunidades.consultarMiembros(body);
  }

  @Post('miembros')
  @HttpCode(200)
  agregarMiembro(@Body() body: unknown) {
    return this.comunidades.agregarMiembro(body);
  }

  @Delete('miembros')
  quitarMiembro(@Body() body: unknown) {
    return this.comunidades.quitarMiembro(body);
  }

  @Patch()
  renombrar(@Body() body: unknown) {
    return this.comunidades.renombrar(body);
  }

  @Delete()
  eliminar(@Body() body: unknown) {
    return this.comunidades.eliminar(body);
  }
}
