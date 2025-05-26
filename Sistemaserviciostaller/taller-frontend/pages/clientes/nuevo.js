import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function NuevoCliente() {
  const router = useRouter();
  const [cliente, setCliente] = useState({ nombre: "", telefono: "", email: "" });

  const handleChange = (e) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post("/api/clientes", cliente);
    router.push("/clientes");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Agregar Cliente</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="nombre" placeholder="Nombre" className="border p-2 w-full" onChange={handleChange} />
        <input name="telefono" placeholder="Teléfono" className="border p-2 w-full" onChange={handleChange} />
        <input name="email" placeholder="Email" className="border p-2 w-full" onChange={handleChange} />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Guardar</button>
      </form>
    </div>
  );
}
