'use client';

import React from "react";
import { useRouter } from 'next/navigation';
import styles from './Sidebar.module.css';

import { FaHome, FaUsers, FaCar, FaUserCircle, FaCog } from "react-icons/fa";

const ICONS = {
  "home": <FaHome />,
  "clientes": <FaUsers />,
  "vehiculos": <FaCar />,
  "profile": <FaUserCircle />,
  "settings": <FaCog />,
};

const routes = [
  { path: '/dashboard', icon: ICONS.home, title: 'Inicio' },
  { path: '/clientes', icon: ICONS.clientes, title: 'Clientes' },
  { path: '/vehiculos', icon: ICONS.vehiculos, title: 'Vehículos' },
  { path: '/profile', icon: ICONS.profile, title: 'Perfil' },
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
