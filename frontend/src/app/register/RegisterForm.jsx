'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './RegisterForm.module.css';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    Nombre: '',
    Email: '',
    Password: ''
  });

  const [message, setMessage] = useState({ text: '', isError: false });
  const [fieldErrors, setFieldErrors] = useState({
    Nombre: '',
    Email: '',
    Password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setFieldErrors({
      ...fieldErrors,
      [e.target.name]: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', isError: false });

    try {
      const response = await fetch('http://localhost:5196/api/Auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // Verificar el tipo de contenido
      const contentType = response.headers.get('content-type');
      let data;

      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const textResponse = await response.text();
        throw new Error(`El servidor respondió con: ${textResponse}`);
      }

      if (response.ok) {
        setMessage({ text: data.message, isError: false });
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        // Manejar errores de validación
        if (data.errors) {
          const newFieldErrors = { ...fieldErrors };
          if (Array.isArray(data.errors)) {
            data.errors.forEach(error => {
              if (error.includes("Nombre")) newFieldErrors.Nombre = error;
              else if (error.includes("Email")) newFieldErrors.Email = error;
              else if (error.includes("Password")) newFieldErrors.Password = error;
            });
          }
          setFieldErrors(newFieldErrors);
          setMessage({ 
            text: data.message || 'Por favor corrige los errores en el formulario', 
            isError: true 
          });
        } else {
          setMessage({ 
            text: data.message || `Error al registrar: ${response.statusText}`, 
            isError: true 
          });
        }
      }
    } catch (error) {
      console.error('Error completo:', error);
      setMessage({ 
        text: error.message.startsWith('El servidor respondió con') 
          ? 'Error en el formato de respuesta del servidor' 
          : 'Error en la conexión con el servidor. Por favor intenta nuevamente.', 
        isError: true 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2 className={styles.title}>Registro</h2>

      <div className={styles.formGroup}>
        <input
          type="text"
          name="Nombre"
          placeholder="Nombre de usuario"
          value={formData.Nombre}
          onChange={handleChange}
          className={`${styles.input} ${fieldErrors.Nombre ? styles.errorInput : ''}`}
          required
        />
        {fieldErrors.Nombre && <p className={styles.errorText}>{fieldErrors.Nombre}</p>}
      </div>

      <div className={styles.formGroup}>
        <input
          type="email"
          name="Email"
          placeholder="Correo electrónico"
          value={formData.Email}
          onChange={handleChange}
          className={`${styles.input} ${fieldErrors.Email ? styles.errorInput : ''}`}
          required
        />
        {fieldErrors.Email && <p className={styles.errorText}>{fieldErrors.Email}</p>}
      </div>

      <div className={styles.formGroup}>
        <input
          type="password"
          name="Password"
          placeholder="Contraseña"
          value={formData.Password}
          onChange={handleChange}
          className={`${styles.input} ${fieldErrors.Password ? styles.errorInput : ''}`}
          required
          minLength="6"
        />
        {fieldErrors.Password && <p className={styles.errorText}>{fieldErrors.Password}</p>}
      </div>

      <button 
        type="submit" 
        className={styles.button}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Registrando...' : 'Registrarse'}
      </button>

      {message.text && (
        <p className={`${styles.message} ${message.isError ? styles.error : styles.success}`}>
          {message.text}
        </p>
      )}
    </form>
  );
}
