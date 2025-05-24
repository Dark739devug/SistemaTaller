'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Toaster, toast } from 'sonner';

export default function ReportesPage() {
  const [ordenesPorMes, setOrdenesPorMes] = useState([]);
  const [serviciosSolicitados, setServiciosSolicitados] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
      const [ordenesRes, serviciosRes] = await Promise.all([
        fetch('http://localhost:5196/api/Reportes/ordenes-mes'),
        fetch('http://localhost:5196/api/Reportes/servicios-mas-solicitados')
      ]);

      if (!ordenesRes.ok || !serviciosRes.ok) {
        throw new Error('Error al obtener los reportes');
      }

      const ordenesData = await ordenesRes.json();
      const serviciosData = await serviciosRes.json();

      setOrdenesPorMes(ordenesData);
      setServiciosSolicitados(Array.isArray(serviciosData) ? serviciosData : [serviciosData]);
    } catch (err) {
      console.error('Error al cargar reportes:', err.message);
      setError(err.message);
      toast.error('No se pudieron cargar los reportes');
    }
  };

  const obtenerNombreMes = (mes) => {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mes - 1] || `Mes ${mes}`;
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="container mx-auto p-6 max-w-5xl mt-20">
        <Toaster richColors position="top-right" />

        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Reportes del Sistema
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-4">
            Error: {error}
          </div>
        )}

       
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-3 text-gray-700">Órdenes por Mes</h2>
          <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">Mes</th>
                <th className="px-4 py-2 text-left">Total de Órdenes</th>
              </tr>
            </thead>
            <tbody>
              {ordenesPorMes.map((orden, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-2">{obtenerNombreMes(orden.mes)}</td>
                  <td className="px-4 py-2">{orden.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Reporte de servicios más solicitados */}
        <div>
          <h2 className="text-2xl font-semibold mb-3 text-gray-700">Servicios Más Solicitados</h2>
          <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">ID del Servicio</th>
                <th className="px-4 py-2 text-left">Cantidad de Solicitudes</th>
              </tr>
            </thead>
            <tbody>
              {serviciosSolicitados.map((servicio, index) => (
                <tr key={index} className="border-t border-gray-200">
                  <td className="px-4 py-2">{servicio.servicioId}</td>
                  <td className="px-4 py-2">{servicio.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
