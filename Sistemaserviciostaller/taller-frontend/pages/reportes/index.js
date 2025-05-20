import { useEffect, useState } from "react";
import {
  Bar,
  Pie
} from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export default function Reportes() {
  const [ordenesMes, setOrdenesMes] = useState([]);
  const [serviciosMasSolicitados, setServiciosMasSolicitados] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/reportes/ordenes-mes")
      .then((res) => res.json())
      .then(setOrdenesMes);

    fetch("http://localhost:5000/api/reportes/servicios-mas-solicitados")
      .then((res) => res.json())
      .then(setServiciosMasSolicitados);
  }, []);

  const ordenesMesData = {
    labels: ordenesMes.map((o) => o.mes),
    datasets: [
      {
        label: "Órdenes por Mes",
        data: ordenesMes.map((o) => o.total),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  };

  const serviciosData = {
    labels: serviciosMasSolicitados.map((s) => s.nombre),
    datasets: [
      {
        label: "Servicios más solicitados",
        data: serviciosMasSolicitados.map((s) => s.total),
        backgroundColor: [
          "#60A5FA",
          "#34D399",
          "#FBBF24",
          "#F87171",
          "#A78BFA",
          "#F472B6",
        ],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reportes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Órdenes por Mes</h2>
          <Bar data={ordenesMesData} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Servicios más Solicitados</h2>
          <Pie data={serviciosData} />
        </div>
      </div>
    </div>
  );
}
