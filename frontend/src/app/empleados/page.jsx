'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Toaster, toast } from 'sonner';

export default function EmpleadosPage() {
  const [empleados, setEmpleados] = useState([]);
  const [nombre, setNombre] = useState('');
  const [cargo, setCargo] = useState('');
  const [editando, setEditando] = useState(false);
  const [empleadoId, setEmpleadoId] = useState(null);

  useEffect(() => {
    cargarEmpleados();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const response = await fetch('http://localhost:5196/api/Empleadoes');
      const data = await response.json();
      setEmpleados(Array.isArray(data) ? data : [data]);
    } catch (error) {
      console.error('Error al cargar empleados', error);
    }
  };

  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!nombre || !cargo) {
      toast.warning('Todos los campos son obligatorios');
      return;
    }

    const nuevoEmpleado = {
      nombre,
      cargo,
    };

    try {
      const response = await fetch(
        `http://localhost:5196/api/Empleadoes${editando ? `/${empleadoId}` : ''}`,
        {
          method: editando ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editando ? { id: empleadoId, ...nuevoEmpleado } : nuevoEmpleado),
        }
      );

      if (response.ok) {
        toast.success(`Empleado ${editando ? 'actualizado' : 'registrado'} correctamente`);
        setNombre('');
        setCargo('');
        setEditando(false);
        setEmpleadoId(null);
        cargarEmpleados();
      } else {
        toast.error('Error al guardar empleado');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al guardar');
    }
  };

  const handleEditar = (empleado) => {
    setEditando(true);
    setEmpleadoId(empleado.id);
    setNombre(empleado.nombre);
    setCargo(empleado.cargo);
  };

  const handleEliminar = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este empleado?')) return;

    try {
      const response = await fetch(`http://localhost:5196/api/Empleadoes/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Empleado eliminado correctamente');
        cargarEmpleados();
      } else {
        toast.error('Error al eliminar empleado');
      }
    } catch (error) {
      console.error('Error al eliminar', error);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="container mx-auto px-4 py-8 mt-20 max-w-5xl">
        <Toaster richColors position="top-right" />
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Gestión de Empleados
        </h1>

        <form onSubmit={handleGuardar} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6">
          <div className="mb-4">
            <label className="block text-gray-700">Nombre</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Cargo</label>
            <input
              type="text"
              className="w-full border rounded p-2"
              value={cargo}
              onChange={(e) => setCargo(e.target.value)}
            />
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
              className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
              onClick={() => {
                setEditando(false);
                setNombre('');
                setCargo('');
                setEmpleadoId(null);
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
              <th className="px-4 py-2 border">Nombre</th>
              <th className="px-4 py-2 border">Cargo</th>
              <th className="px-4 py-2 border">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {empleados.map((emp) => (
              <tr key={emp.id} className="text-center border-t">
                <td className="px-4 py-2 border">{emp.id}</td>
                <td className="px-4 py-2 border">{emp.nombre}</td>
                <td className="px-4 py-2 border">{emp.cargo}</td>
                <td className="px-4 py-2 border space-x-2">
                  <button
                    onClick={() => handleEditar(emp)}
                    className="bg-yellow-400 hover:bg-yellow-500 px-2 py-1 rounded text-white"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(emp.id)}
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
