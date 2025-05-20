import { useEffect, useState } from "react";
import Link from "next/link";

export default function ListaServicios() {
  const [servicios, setServicios] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/Servicios")
      .then((res) => res.json())
      .then((data) => setServicios(data))
      .catch((err) => console.error("Error cargando servicios:", err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Lista de Servicios</h1>
      <Link href="/servicios/nuevo" className="text-blue-500 underline">+ Agregar nuevo servicio</Link>
      <ul className="mt-4 space-y-2">
        {servicios.map((serv) => (
          <li key={serv.id} className="border p-2 rounded">
            <Link href={`/servicios/${serv.id}`}>
              <strong>{serv.nombre}</strong> - Q{serv.precio}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
