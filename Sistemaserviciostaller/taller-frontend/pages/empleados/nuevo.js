'use client';

import React from "react";
import { useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';

import {
  FaHome,
  FaUsers,
  FaCar,
  FaUserTie,
  FaCog,
  FaClipboardList,
  FaChartBar,
  FaFileAlt
} from "react-icons/fa"; // Asegúrate de que todos los íconos estén importados

const ICONS = {
  home: <FaHome />,
  clientes: <FaUsers />,
  vehiculos: <FaCar />,
  empleados: <FaUserTie />,
  ordenes: <FaClipboardList />,
  reportes: <FaChartBar />,
  detalleOrden: <FaFileAlt />,
  settings: <FaCog />
};

const routes = [
  { path: '/dashboard', icon: ICONS.home, title: 'Inicio' },
  { path: '/clientes', icon: ICONS.clientes, title: 'Clientes' },
  { path: '/vehiculos', icon: ICONS.vehiculos, title: 'Vehículos' },
  { path: '/empleados', icon: ICONS.empleados, title: 'Empleados' },
  { path: '/ordenes', icon: ICONS.ordenes, title: 'Órdenes' },
  { path: '/reportes', icon: ICONS.reportes, title: 'Reportes' },
  { path: '/detalle-orden', icon: ICONS.detalleOrden, title: 'Detalle Orden' },
  { path: '/settings', icon: ICONS.settings, title: 'Configuración' },
];

const Sidebar = () => {
  const router = useRouter();

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <div className={styles.sidebarContainer}>
      {routes.map((route, index) => (
        <div
          key={index}
          className={styles.menuItem}
          onClick={() => handleNavigation(route.path)}
        >
          <span className={styles.icon}>{route.icon}</span>
          <span className={styles.title}>{route.title}</span>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
