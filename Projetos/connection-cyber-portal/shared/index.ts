/**
 * CONNECTION CYBER PORTAL | SHARED DNA
 * Centralização de Tipos e Contratos Enterprise
 */

export * from './types';
export * from './constants';

// Interface Primordial de Curso (Base para a triagem de IA)
export interface BaseCourse {
  id: string;
  title: string;
  domain: 'TEOLOGIA' | 'EXCEL' | 'TI' | 'OFFICE' | 'HARDWARE' | 'DESENVOLVIMENTO';
  description: string;
  createdAt: Date;
}