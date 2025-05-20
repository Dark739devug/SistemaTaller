import { useEffect, useState } from "react";
import Link from "next/link";

export default function ListaEmpleados() {
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/Empleados") // cambia si es otro puerto
      .then((res) => res.json())
      .then((data) => setEmpleados(data))
      .catch((err) => console.error("Error cargando empleados:", err));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Lista de Empleados</h1>
      <Link href="/empleados/nuevo" className="text-blue-500 underline">+ Agregar nuevo empleado</Link>
      <ul className="mt-4 space-y-2">
        {empleados.map((emp) => (
          <li key={emp.id} className="border p-2 rounded">
            <Link href={`/empleados/${emp.id}`}>
              <strong>{emp.nombre}</strong> - {emp.cargo}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
