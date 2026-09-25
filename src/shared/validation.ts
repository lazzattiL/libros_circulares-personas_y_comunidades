import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';

export type RequestBody = Record<string, unknown>;

export function bodyObject(value: unknown): RequestBody {
  if (value === undefined || value === null) {
    throw new BadRequestException('Falta el cuerpo de la solicitud');
  }
  if (typeof value !== 'object' || Array.isArray(value)) {
    throw new UnprocessableEntityException('El cuerpo debe ser un objeto JSON');
  }
  return value as RequestBody;
}

export function required(body: RequestBody, field: string): unknown {
  if (body[field] === undefined || body[field] === null) {
    throw new BadRequestException(`Falta ${field}`);
  }
  return body[field];
}

export function positiveInteger(value: unknown, field: string): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value <= 0) {
    throw new UnprocessableEntityException(
      `${field} debe ser un entero positivo`,
    );
  }
  return value;
}

export function nonEmptyString(value: unknown, field: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new UnprocessableEntityException(
      `${field} debe ser un texto no vacío`,
    );
  }
  return value;
}

export function email(value: unknown): string {
  const text = nonEmptyString(value, 'correoElectronico');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
    throw new UnprocessableEntityException('correoElectronico no es válido');
  }
  return text;
}

export function birthDate(value: unknown): Date {
  if (
    typeof value !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2}))?$/.test(
      value,
    )
  ) {
    throw new UnprocessableEntityException(
      'fechaNacimiento debe ser una fecha ISO válida',
    );
  }
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  const calendarDate = new Date(0);
  calendarDate.setUTCFullYear(year, month - 1, day);
  if (
    calendarDate.getUTCFullYear() !== year ||
    calendarDate.getUTCMonth() + 1 !== month ||
    calendarDate.getUTCDate() !== day
  ) {
    throw new UnprocessableEntityException(
      'fechaNacimiento debe ser una fecha ISO válida',
    );
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new UnprocessableEntityException(
      'fechaNacimiento debe ser una fecha ISO válida',
    );
  }
  return date;
}
