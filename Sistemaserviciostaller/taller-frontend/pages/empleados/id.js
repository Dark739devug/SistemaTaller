import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DetalleEmpleado() {
  const router = useRouter();
  const { id } = router.query;

  const [empleado, setEmpleado] = useState({ nombre: "", cargo: "" });

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/Empleados/${id}`)
        .then((res) => res.json())
        .then((data) => setEmpleado(data));
    }
  }, [id]);

  const handleChange = (e) => {
    setEmpleado({ ...empleado, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    await fetch(`http://localhost:5000/api/Empleados/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empleado),
    });

    router.push("/empleados");
  };

  const handleEliminar = async () => {
    if (confirm("¿Seguro que deseas eliminar este empleado?")) {
      await fetch(`http://localhost:5000/api/Empleados/${id}`, {
        method: "DELETE",
      });
      router.push("/empleados");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Editar Empleado</h1>
      <input
        type="text"
        name="nombre"
        value={empleado.nombre}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />
      <input
        type="text"
        name="cargo"
        value={empleado.cargo}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
      />
      <button onClick={handleGuardar} className="bg-green-500 text-white px-4 py-2 rounded mr-2">
        Guardar cambios
      </button>
      <button onClick={handleEliminar} className="bg-red-500 text-white px-4 py-2 rounded">
        Eliminar
      </button>
    </div>
  );
}
