// services/apiService.tsx
import axios from 'axios';
import { Modelo } from '../src/types'; // Asegúrate de que la ruta es correcta

const API_URL = 'https://localhost:7023/Terminales'; // Cambia esta URL por la de tu API

export const fetchModelos = async (): Promise<{ succeded: boolean; message: string | null; result: Modelo[] }> => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching data from API', error);
    throw error;
  }
};

export const createModelo = async (modelo: Partial<Modelo>) => {
  try {
    const formattedModelo = {
      ...modelo,
      fecha_de_ingreso: new Date().toISOString(), // Formato ISO completo
      fecha_de_salida: null,
      fecha_de_reingreso: null
    };
    const response = await axios.post(API_URL, formattedModelo);
    return response.data;
  } catch (error) {
    console.error('Error creating data', error);
    throw error;
  }
};

export const updateModelo = async (id: number, modelo: Partial<Modelo>) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, modelo);
    return response.data;
  } catch (error) {
    console.error('Error updating data', error);
    throw error;
  }
};

export const deleteModelo = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting data', error);
    throw error;
  }
};

export default {
  fetchModelos,
  createModelo,
  updateModelo,
  deleteModelo
};