import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DetalleServicio() {
  const router = useRouter();
  const { id } = router.query;

  const [servicio, setServicio] = useState({ nombre: "", precio: "" });

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/Servicios/${id}`)
        .then((res) => res.json())
        .then((data) => setServicio(data));
    }
  }, [id]);

  const handleChange = (e) => {
    setServicio({ ...servicio, [e.target.name]: e.target.value });
  };

  const handleGuardar = async () => {
    await fetch(`http://localhost:5000/api/Servicios/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: servicio.nombre,
        precio: parseFloat(servicio.precio),
      }),
    });

    router.push("/servicios");
  };

  const handleEliminar = async () => {
    if (confirm("¿Seguro que deseas eliminar este servicio?")) {
      await fetch(`http://localhost:5000/api/Servicios/${id}`, {
        method: "DELETE",
      });
      router.push("/servicios");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Editar Servicio</h1>
      <input
        type="text"
        name="nombre"
        value={servicio.nombre}
        onChange={handleChange}
        className="border p-2 w-full mb-2"
      />
      <input
        type="number"
        name="precio"
        value={servicio.precio}
        onChange={handleChange}
        className="border p-2 w-full mb-4"
        step="0.01"
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
