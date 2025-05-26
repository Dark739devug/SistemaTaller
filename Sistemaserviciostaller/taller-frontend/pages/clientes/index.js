import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    axios.get("/api/clientes").then((res) => setClientes(res.data));
  }, []);

  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>

      <input
        type="text"
        placeholder="Buscar por nombre..."
        className="border p-2 w-full mb-4"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <Link href="/clientes/nuevo" className="bg-blue-600 text-white px-4 py-2 rounded mb-4 inline-block">
        Agregar Cliente
      </Link>

      <ul className="mt-4">
        {clientesFiltrados.map((cliente) => (
          <li key={cliente.id} className="border p-4 mb-2 rounded shadow">
            <p className="font-semibold">{cliente.nombre}</p>
            <p>{cliente.email}</p>
            <div className="mt-2 flex gap-2">
              <Link href={`/clientes/${cliente.id}`} className="text-blue-500">Detalles</Link>
              <Link href={`/clientes/${cliente.id}/editar`} className="text-green-500">Editar</Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
