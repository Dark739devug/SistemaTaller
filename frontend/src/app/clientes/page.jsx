'use client';
import { useState, useEffect } from 'react';
import { 
  getClientes, 
  createCliente, 
  updateCliente, 
  deleteCliente 
} from '@/services/clientesService';
import { Toaster, toast } from 'sonner';
import Sidebar from '@/components/Sidebar';
import styles from './Clientes.module.css';

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      setIsLoading(true);
      const data = await getClientes();
      setClientes(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      toast.error('Error al cargar clientes');
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
      if (editingId) {
        await updateCliente(editingId, formData);
        toast.success('Cliente actualizado correctamente');
      } else {
        await createCliente(formData);
        toast.success('Cliente creado correctamente');
      }
      setFormData({ nombre: '', telefono: '', email: '' });
      setEditingId(null);
      await loadClientes();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleEdit = (cliente) => {
    setFormData({
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      email: cliente.email
    });
    setEditingId(cliente.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await deleteCliente(id);
        toast.success('Cliente eliminado correctamente');
        await loadClientes();
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
        
        <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
          Gestión de Clientes
        </h1>
        
        {/* Formulario */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            {editingId ? 'Editar Cliente' : 'Agregar Nuevo Cliente'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
               className={`${styles.input}`}

                placeholder="Nombre Completo"
                required
              />
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                className={`${styles.input}`}
                placeholder="Teléfono"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`${styles.input}`}
                placeholder="Correo Electrónico"
                required
              />
            </div>
            
            <div className="flex space-x-3 pt-2">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                {editingId ? 'Actualizar Cliente' : 'Agregar Cliente'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ nombre: '', telefono: '', email: '' });
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </div>

       
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">Nombre</th>
                <th className="px-6 py-3">Teléfono</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clientes.map((cliente) => (
                <tr key={cliente.id}>
                  <td className="px-6 py-4">{cliente.nombre}</td>
                  <td className="px-6 py-4">{cliente.telefono}</td>
                  <td className="px-6 py-4">{cliente.email}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => handleEdit(cliente)} className="editar">Editar</button>
                    <button onClick={() => handleDelete(cliente.id)} className="bg-red-300 p-1 rounded">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

