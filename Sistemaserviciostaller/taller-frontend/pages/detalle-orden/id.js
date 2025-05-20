import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DetalleOrden() {
  const router = useRouter();
  const { id } = router.query;
  const [detalle, setDetalle] = useState([]);
  const [nuevoServicio, setNuevoServicio] = useState({
    servicioId: "",
    empleadoId: "",
    comentarios: "",
    costo: ""
  });
  const [servicios, setServicios] = useState([]);
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/DetalleServicio?ordenId=${id}`)
        .then((res) => res.json())
        .then((data) => setDetalle(data));

      fetch("http://localhost:5000/api/Servicios")
        .then((res) => res.json())
        .then(setServicios);

      fetch("http://localhost:5000/api/Empleados")
        .then((res) => res.json())
        .then(setEmpleados);
    }
  }, [id]);

  const agregarServicio = async () => {
    await fetch("http://localhost:5000/api/DetalleServicio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...nuevoServicio,
        ordenId: id,
      }),
    });
    router.reload();
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Detalle de Orden #{id}</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Servicios asignados</h2>
        {detalle.length === 0 ? (
          <p>No hay servicios aún.</p>
        ) : (
          <ul className="space-y-2">
            {detalle.map((d) => (
              <li key={d.id} className="border p-2 rounded">
                <p><strong>Servicio:</strong> {d.servicioNombre}</p>
                <p><strong>Empleado:</strong> {d.empleadoNombre}</p>
                <p><strong>Comentarios:</strong> {d.comentarios}</p>
                <p><strong>Costo:</strong> Q{d.costo}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-2">Agregar servicio a la orden</h2>
        <div className="space-y-2">
          <select
            value={nuevoServicio.servicioId}
            onChange={(e) =>
              setNuevoServicio({ ...nuevoServicio, servicioId: e.target.value })
            }
            className="border p-2 w-full"
          >
            <option value="">-- Selecciona un servicio --</option>
            {servicios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>

          <select
            value={nuevoServicio.empleadoId}
            onChange={(e) =>
              setNuevoServicio({ ...nuevoServicio, empleadoId: e.target.value })
            }
            className="border p-2 w-full"
          >
            <option value="">-- Selecciona un empleado --</option>
            {empleados.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Comentarios"
            value={nuevoServicio.comentarios}
            onChange={(e) =>
              setNuevoServicio({ ...nuevoServicio, comentarios: e.target.value })
            }
            className="border p-2 w-full"
          />

          <input
            type="number"
            placeholder="Costo"
            value={nuevoServicio.costo}
            onChange={(e) =>
              setNuevoServicio({ ...nuevoServicio, costo: e.target.value })
            }
            className="border p-2 w-full"
          />

          <button
            onClick={agregarServicio}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Agregar servicio
          </button>
        </div>
      </div>
    </div>
  );
}
