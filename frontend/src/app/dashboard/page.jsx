'use client';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import Sidebar from '@/components/Sidebar';
import styles from './Dashboard.module.css';
import { useContext, useEffect } from 'react';

export default function Dashboard() {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <div className={styles.dashboardContainer}>
      <Sidebar />
      <div className={styles.mainContent}>
        
     
      </div>
    </div>
  );
}