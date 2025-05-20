import { useState } from "react";
import { useRouter } from "next/router";

export default function NuevoEmpleado() {
  const [nombre, setNombre] = useState("");
  const [cargo, setCargo] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/Empleados", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, cargo }),
    });

    router.push("/empleados");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Nuevo Empleado</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block">Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <label className="block">Cargo:</label>
          <input
            type="text"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            className="border p-2 w-full"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Guardar
        </button>
      </form>
    </div>
  );
}
