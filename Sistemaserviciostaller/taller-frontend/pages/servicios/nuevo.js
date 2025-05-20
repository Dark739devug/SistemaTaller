import { useState } from "react";
import { useRouter } from "next/router";

export default function NuevoServicio() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:5000/api/Servicios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, precio: parseFloat(precio) }),
    });

    router.push("/servicios");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Nuevo Servicio</h1>
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
          <label className="block">Precio (Q):</label>
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            className="border p-2 w-full"
            required
            step="0.01"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Guardar
        </button>
      </form>
    </div>
  );
}
