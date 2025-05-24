'use client';
import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/context/AuthContext';
import styles from './LoginForm.module.css';

export default function LoginForm() {
  const [formData, setFormData] = useState({
    Email: '',
    Password: ''
  });

  const [message, setMessage] = useState({ text: '', isError: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', isError: false });

    try {
      const response = await fetch('http://localhost:5196/api/Auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Email: formData.Email,
          Password: formData.Password
        }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Respuesta inesperada: ${text}`);
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el servidor');
      }

      
      login(data.token, formData.Email);
      
      document.cookie = `token=${data.token}; path=/; max-age=86400`;
      
      setMessage({ 
        text: 'Inicio de sesión exitoso. Redirigiendo...', 
        isError: false 
      });
      
      setTimeout(() => router.push('/dashboard'), 1000);
      
    } catch (error) {
      console.error('Error en el login:', error);
      
      let errorMessage = 'Error en el servidor';
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Error de conexión con el servidor';
      } else if (error.message.includes('Respuesta inesperada')) {
        errorMessage = 'Error en el formato de respuesta del servidor';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessage({ 
        text: errorMessage, 
        isError: true 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2 className={styles.title}>Iniciar Sesión</h2>
      
      <div className={styles.formGroup}>
        <input
          type="email"
          name="Email"
          placeholder="Correo electrónico"
          value={formData.Email}
          onChange={handleChange}
          required
          className={styles.input}
        />
      </div>
      
      <div className={styles.formGroup}>
        <input
          type="password"
          name="Password"
          placeholder="Contraseña"
          value={formData.Password}
          onChange={handleChange}
          required
          className={styles.input}
          minLength="6"
        />
      </div>
      
      <button 
        type="submit" 
        className={styles.button}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </button>
      
      {message.text && (
        <p className={`${styles.message} ${message.isError ? styles.error : styles.success}`}>
          {message.text}
        </p>
      )}
      
    
    </form>
  );
}