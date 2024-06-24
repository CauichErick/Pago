// types.ts (o types.tsx)
export interface Modelo {
    id_Modelo: number;
    modelo: string;
    tipo: string;
    estado: string;
    fecha_de_ingreso: string;
    fecha_de_salida: string | null;
    fecha_de_reingreso: string | null;
  }
  