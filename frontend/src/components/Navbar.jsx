'use client';
import Link from "next/link";
import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { Bebas_Neue } from 'next/font/google';
import { FaUserCircle } from 'react-icons/fa';

const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'] });

export default function Navbar() {
  const { isAuthenticated, userEmail, logout, loading } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (loading) return null;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <span className={`${bebas.className} text-white text-6xl ml-2`}>
          Soluciones Vehiculares
        </span>

        <div className="auth-buttons">
          {!isAuthenticated ? (
            <>
              <Link href="/register">
                <button className="register-btn">Registrarse</button>
              </Link>
              <Link href="/login">
                <button className="login-btn">Iniciar Sesión</button>
              </Link>
            </>
          ) : (
            <>
             {userEmail && (
                <span className="text-white flex items-center mr-4">
                  <FaUserCircle size={30} className="mr-2" />
                  <span className="text-sm">{userEmail}</span> {/* Aplicado el tamaño aquí directamente */}
                </span>
              )}

             
              <button onClick={handleLogout} className="logout-btn">
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

