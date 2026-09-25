import { Injectable, ServiceUnavailableException } from '@nestjs/common';

@Injectable()
export class EjemplaresClient {
  async tieneEjemplares(usuarioId: number): Promise<boolean> {
    const baseUrl = process.env.EJEMPLARES_SERVICE_URL;
    if (!baseUrl) {
      throw new ServiceUnavailableException('Falta EJEMPLARES_SERVICE_URL');
    }

    try {
      const url = new URL(`${baseUrl.replace(/\/+$/, '')}/ejemplar`);
      const response = await fetch(url, { signal: AbortSignal.timeout(3000) });
      if (!response.ok) {
        throw new Error('No se pudo consultar gestión de ejemplares');
      }
      const data: unknown = await response.json();
      if (
        !Array.isArray(data) ||
        !data.every(
          (item: unknown) =>
            item !== null &&
            typeof item === 'object' &&
            'duenioId' in item &&
            typeof item.duenioId === 'number' &&
            Number.isSafeInteger(item.duenioId) &&
            item.duenioId > 0,
        )
      ) {
        throw new Error('Respuesta inválida de gestión de ejemplares');
      }
      return data.some(
        (item: { duenioId: number }) => item.duenioId === usuarioId,
      );
    } catch {
      throw new ServiceUnavailableException(
        'No se pudo verificar la propiedad de ejemplares',
      );
    }
  }
}
