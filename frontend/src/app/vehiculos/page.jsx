'use client';
import { useState, useEffect } from 'react';
import { Toaster, toast } from 'sonner';
import Sidebar from '@/components/Sidebar';

const API_URL = 'http://localhost:5196/api/Vehiculoes';

export default function VehiculosPage() {
  const [vehiculos, setVehiculos] = useState([]);
  const [formData, setFormData] = useState({
    clienteId: '',
    marca: '',
    modelo: '',
    año: '',
    placa: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVehiculos();
  }, []);

  const loadVehiculos = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al cargar los vehículos');
      const data = await response.json();
      setVehiculos(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Error al cargar vehículos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = editingId ? 'PUT' : 'POST';
      const url = editingId ? `${API_URL}/${editingId}` : API_URL;

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Error al guardar el vehículo');

      toast.success(`Vehículo ${editingId ? 'actualizado' : 'creado'} correctamente`);
      setFormData({ clienteId: '', marca: '', modelo: '', año: '', placa: '' });
      setEditingId(null);
      await loadVehiculos();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (vehiculo) => {
    setFormData({
      clienteId: vehiculo.clienteId,
      marca: vehiculo.marca,
      modelo: vehiculo.modelo,
      año: vehiculo.año,
      placa: vehiculo.placa
    });
    setEditingId(vehiculo.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este vehículo?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Error al eliminar el vehículo');
        toast.success('Vehículo eliminado correctamente');
        await loadVehiculos();
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="container mx-auto p-4 max-w-6xl mt-20">
        <Toaster richColors position="top-right" />
        
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Gestión de Vehículos</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editingId ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="number"
                name="clienteId"
                value={formData.clienteId}
                onChange={handleChange}
                placeholder="ID del Cliente"
                required
                className="p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                placeholder="Marca"
                required
                className="p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                placeholder="Modelo"
                required
                className="p-2 border border-gray-300 rounded-md"
              />
              <input
                type="number"
                name="año"
                value={formData.año}
                onChange={handleChange}
                placeholder="Año"
                required
                className="p-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                name="placa"
                value={formData.placa}
                onChange={handleChange}
                placeholder="Placa"
                required
                className="p-2 border border-gray-300 rounded-md"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingId ? 'Actualizar Vehículo' : 'Agregar Vehículo'}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-700">Listado de Vehículos</h2>
          </div>
          
          {isLoading ? (
            <div className="p-8 text-center">Cargando vehículos...</div>
          ) : error ? (
            <div className="p-8 text-center text-red-500">{error}</div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th>Cliente ID</th>
                  <th>Marca</th>
                  <th>Modelo</th>
                  <th>Año</th>
                  <th>Placa</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {vehiculos.map((vehiculo) => (
                  <tr key={vehiculo.id}>
                    <td>{vehiculo.clienteId}</td>
                    <td>{vehiculo.marca}</td>
                    <td>{vehiculo.modelo}</td>
                    <td>{vehiculo.año}</td>
                    <td>{vehiculo.placa}</td>
                    <td>
                      <button onClick={() => handleEdit(vehiculo)}>Editar</button>
                      <button onClick={() => handleDelete(vehiculo.id)}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
