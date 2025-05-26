import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
   
    axios.get('/api/clientes').then(res => setClientes(res.data));
  }, []);

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Clientes</h1>
      <input
        type="text"
        placeholder="Buscar cliente por nombre"
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        className="border p-2 mb-4 w-full"
      />

      <button className="bg-green-500 text-white px-4 py-2 rounded mb-4">
        Agregar nuevo cliente
      </button>

      <div className="grid gap-4">
        {clientesFiltrados.map(cliente => (
          <div key={cliente.id} className="border p-4 rounded shadow">
            <h2 className="text-lg font-semibold">{cliente.nombre}</h2>
            <p>Tel: {cliente.telefono}</p>
            <p>Email: {cliente.email}</p>
            <div className="flex gap-2 mt-2">
              <button className="bg-blue-500 text-white px-2 py-1 rounded">
                Ver detalles
              </button>
              <button className="bg-yellow-500 text-white px-2 py-1 rounded">
                Editar
              </button>
              <button className="bg-red-500 text-white px-2 py-1 rounded">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
