// components/ModelosComponent.tsx
import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRenderCellParams, GridActionsCellItem } from '@mui/x-data-grid';
import apiService from '../apiService';
import { Modelo } from '../types';
import { Button, Modal, TextField, Box, Select, MenuItem, InputLabel, FormControl, SelectChangeEvent, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatDate } from '../utils/dateUtils'; // Importar la función de utilidad

const ModelosComponent: React.FC = () => {
  const [data, setData] = useState<Modelo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModelo, setCurrentModelo] = useState<Partial<Modelo> | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await apiService.fetchModelos();
        setData(result.result);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const handleCreateClick = () => {
    setCurrentModelo({ id_Modelo: 0, modelo: '', tipo: '', estado: '' });
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEditClick = (modelo: Modelo) => {
    setCurrentModelo(modelo);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentModelo(null);
    setIsEditMode(false);
  };

  const handleSave = async () => {
    try {
      if (isEditMode && currentModelo?.id_Modelo) {
        // Actualizar
        const updatedModelo = await apiService.updateModelo(currentModelo.id_Modelo, currentModelo);
        setData(data.map((modelo) => (modelo.id_Modelo === currentModelo.id_Modelo ? updatedModelo.result : modelo)));
      } else {
        // Crear
        const newModelo: Partial<Modelo> = {
          ...currentModelo,
          fecha_de_ingreso: new Date().toISOString(), // Formato ISO completo
          fecha_de_salida: null,
          fecha_de_reingreso: null
        };
        const createdModelo = await apiService.createModelo(newModelo);
        setData([...data, createdModelo.result]);
      }
      setIsModalOpen(false);
    } catch (error) {
      setError(error as Error);
    }
  };

  const handleDeleteClick = async (id: number) => {
    try {
      await apiService.deleteModelo(id);
      setData(data.filter((modelo) => modelo.id_Modelo !== id));
    } catch (error) {
      setError(error as Error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCurrentModelo({ ...currentModelo, [name]: value });
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setCurrentModelo({ ...currentModelo, [name]: value });
  };

  const columns: GridColDef[] = [
    { field: 'id_Modelo', headerName: 'ID', width: 100 },
    { field: 'modelo', headerName: 'Modelo', width: 70 },
    { field: 'tipo', headerName: 'Tipo', width: 120 },
    { field: 'estado', headerName: 'Estado', width: 90 },
    {
      field: 'fecha_de_ingreso',
      headerName: 'Fecha de Ingreso',
      width: 150,
      renderCell: (params: GridRenderCellParams) => formatDate(params.value as string) // Formatear la fecha
    },
    {
      field: 'fecha_de_salida',
      headerName: 'Fecha de Salida',
      width: 150,
      renderCell: (params: GridRenderCellParams) => formatDate(params.value as string) // Formatear la fecha
    },
    {
      field: 'fecha_de_reingreso',
      headerName: 'Fecha de Reingreso',
      width: 150,
      renderCell: (params: GridRenderCellParams) => formatDate(params.value as string) // Formatear la fecha
    },
    { field: 'actions', headerName: 'Acciones', width: 80,
      renderCell: (params) => (
        <>
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Editar"
            onClick={() => handleEditClick(params.row)}
          />
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Eliminar"
            onClick={() => handleDeleteClick(params.row.id_Modelo)}
          />
        </>
      )
    }
  ];

  const getTipoOptions = () => {
    const tipos = ["Nuevo", "Usado", "Descompuesto"];
    if (currentModelo?.estado === "Reingreso") {
      return tipos.filter(tipo => tipo !== "Nuevo");
    }
    return tipos;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  return (
    <div style={{ height: 400, width: 1055 }}>
      <Grid style={{ marginBottom: '4vh' }}>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreateClick}>
          Crear Modelo
        </Button>
      </Grid>
      <DataGrid 
        rows={data} 
        columns={columns} 
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]} 
        checkboxSelection 
        getRowId={(row) => row.id_Modelo} 
      />
      <Modal
        open={isModalOpen}
        onClose={handleModalClose}
      >
        <Box sx={{ ...modalStyle }}>
          <h2>{isEditMode ? 'Editar Modelo' : 'Crear Modelo'}</h2>
          <TextField
            label="ID Modelo"
            name="id_Modelo"
            value={currentModelo?.id_Modelo || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            disabled={isEditMode} // No editable durante la actualización
          />
          <TextField
            label="Modelo"
            name="modelo"
            value={currentModelo?.modelo || ''}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo</InputLabel>
            <Select
              label="Tipo"
              name="tipo"
              value={currentModelo?.tipo || ''}
              onChange={handleSelectChange}
            >
              {getTipoOptions().map(tipo => (
                <MenuItem key={tipo} value={tipo}>{tipo}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth margin="normal">
            <InputLabel>Estado</InputLabel>
            <Select
              label="Estado"
              name="estado"
              value={currentModelo?.estado || ''}
              onChange={handleSelectChange}
            >
              <MenuItem value="Guardado">Guardado</MenuItem>
              <MenuItem value="Salio">Salio</MenuItem>
              <MenuItem value="Reingreso">Reingreso</MenuItem>
            </Select>
          </FormControl>
          <Button onClick={handleSave} variant="contained" color="primary" fullWidth>
            Guardar
          </Button>
        </Box>
      </Modal>
    </div>
  );
};

export default ModelosComponent;

// Estilo del modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
