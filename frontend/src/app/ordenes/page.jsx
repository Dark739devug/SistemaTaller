'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Toaster, toast } from 'sonner';

export default function OrdenesPage() {
  const [ordenes, setOrdenes] = useState([]);
  const [vehiculoId, setVehiculoId] = useState('');
  const [fecha, setFecha] = useState('');
  const [estado, setEstado] = useState('Pendiente');
  const [editando, setEditando] = useState(false);
  const [ordenId, setOrdenId] = useState(null);

  useEffect(() => {
    cargarOrdenes();
  }, []);

  const cargarOrdenes = async () => {
    try {
      const res = await fetch('http://localhost:5196/api/Ordenservicios');
      const data = await res.json();
      setOrdenes(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Error al cargar órdenes', error);
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!vehiculoId || !fecha || !estado) {
      toast.warning('Todos los campos son requeridos');
      return;
    }

    const nuevaOrden = {
      vehiculoId: parseInt(vehiculoId),
      fecha,
      estado,
    };

    try {
      const res = await fetch(`http://localhost:5196/api/Ordenservicios${editando ? `/${ordenId}` : ''}`, {
        method: editando ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editando ? { id: ordenId, ...nuevaOrden } : nuevaOrden),
      });

      if (res.ok) {
        toast.success(`Orden ${editando ? 'actualizada' : 'registrada'} correctamente`);
        setVehiculoId('');
        setFecha('');
        setEstado('Pendiente');
        setEditando(false);
        setOrdenId(null);
        cargarOrdenes();
      } else {
        toast.error('Error al guardar la orden');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditar = (orden) => {
    setEditando(true);
    setOrdenId(orden.id);
    setVehiculoId(orden.vehiculoId);
    setFecha(orden.fecha.split('T')[0]);
    setEstado(orden.estado);
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar esta orden de servicio?')) return;

    try {
      const res = await fetch(`http://localhost:5196/api/Ordenservicios/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Orden eliminada');
        cargarOrdenes();
      } else {
        toast.error('Error al eliminar');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="container mx-auto px-4 py-8 mt-20 max-w-5xl">
        <Toaster richColors position="top-right" />
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Órdenes de Servicio
        </h1>

        <form onSubmit={handleGuardar} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
          <div className="mb-4">
            <label className="block text-gray-700">Vehículo ID</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={vehiculoId}
              onChange={(e) => setVehiculoId(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Fecha</label>
            <input
              type="date"
              className="w-full border rounded p-2"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Estado</label>
            <select
              className="w-full border rounded p-2"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
            >
              <option value="Pendiente">Pendiente</option>
              <option value="En proceso">En proceso</option>
              <option value="Finalizado">Finalizado</option>
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mr-2"
          >
            {editando ? 'Actualizar' : 'Guardar'}
          </button>

          {editando && (
            <button
              type="button"
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              onClick={() => {
                setEditando(false);
                setVehiculoId('');
                setFecha('');
                setEstado('Pendiente');
                setOrdenId(null);
              }}
            >
              Cancelar
            </button>
          )}
        </form>

        <table className="min-w-full bg-white border border-gray-300 rounded-md shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Vehículo ID</th>
              <th className="px-4 py-2 border">Fecha</th>
              <th className="px-4 py-2 border">Estado</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.id} className="text-center border-t">
                <td className="px-4 py-2 border">{orden.id}</td>
                <td className="px-4 py-2 border">{orden.vehiculoId}</td>
                <td className="px-4 py-2 border">{orden.fecha.split('T')[0]}</td>
                <td className="px-4 py-2 border">{orden.estado}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => handleEditar(orden)}
                    className="bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded text-white"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(orden.id)}
                    className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-white"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
