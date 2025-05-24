'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import { Toaster, toast } from 'sonner';

export default function DetalleOrdenPage() {
  const [detalles, setDetalles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    
    const cargarDetalles = async () => {
      try {
        const response = await fetch('http://localhost:5196/api/Detalleservicios');
        if (!response.ok) throw new Error('Error al obtener los detalles');
        const data = await response.json();
        setDetalles(data);
        setError(null);
      } catch (err) {
        console.error('Error al cargar detalles:', err.message);
        setError(err.message);
        toast.error('Error al cargar detalles');
      } finally {
        setIsLoading(false);
      }
    };

    cargarDetalles();
  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="container mx-auto p-4 max-w-6xl mt-20">
        <Toaster richColors position="top-right" />

        <h1 className="text-3xl font-bold mb-2 text-gray-800 text-center">
          Detalles de la Orden de Servicio
        </h1>

        {user && (
          <h2 className="text-md text-gray-600 mb-6 text-center">
            Bienvenido, <span className="font-semibold">{user?.nombre}</span>
          </h2>
        )}

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            Error: {error}
          </div>
        )}

        {isLoading ? (
          <p className="text-gray-600 text-center">Cargando detalles...</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Orden Servicio ID</th>
                  <th className="px-4 py-3 text-left">Servicio ID</th>
                  <th className="px-4 py-3 text-left">Empleado ID</th>
                  <th className="px-4 py-3 text-left">Comentarios</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {detalles.map((detalle) => (
                  <tr key={detalle.id}>
                    <td className="px-4 py-2">{detalle.id}</td>
                    <td className="px-4 py-2">{detalle.ordenServicioId}</td>
                    <td className="px-4 py-2">{detalle.servicioId}</td>
                    <td className="px-4 py-2">{detalle.empleadoId}</td>
                    <td className="px-4 py-2">{detalle.comentarios}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

