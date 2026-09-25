import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { UsuarioService } from './usuario.service';

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarios: UsuarioService) {}

  @Post()
  crear(@Body() body: unknown) {
    return this.usuarios.crear(body);
  }

  @Get()
  listar() {
    return this.usuarios.listar();
  }

  @Post('consulta')
  @HttpCode(200)
  consultar(@Body() body: unknown) {
    return this.usuarios.consultar(body);
  }

  @Post('por-ids')
  @HttpCode(200)
  consultarVarios(@Body() body: unknown) {
    return this.usuarios.consultarVarios(body);
  }

  @Put()
  reemplazar(@Body() body: unknown) {
    return this.usuarios.reemplazar(body);
  }

  @Patch()
  modificar(@Body() body: unknown) {
    return this.usuarios.modificar(body);
  }

  @Delete()
  eliminar(@Body() body: unknown) {
    return this.usuarios.eliminar(body);
  }
}
