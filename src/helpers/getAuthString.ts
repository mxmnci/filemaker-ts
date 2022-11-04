import { FMAuth } from '../types/FMAxios.types';

export function getAuthString(auth: FMAuth): string {
  switch (auth.method) {
    case 'BASIC':
      return `Basic ${auth.token}`;

    case 'BEARER':
      return `Bearer ${auth.token}`;

    case 'NONE':
      return '';

    default:
      throw new Error('Invalid auth type');
  }
}
