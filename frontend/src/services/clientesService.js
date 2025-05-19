const API_URL = 'http://localhost:5196/api/Clientes';

export const getClientes = async () => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('Error al obtener clientes');
    return await response.json();
  } catch (error) {
    console.error('Error en getClientes:', error);
    throw error;
  }
};

export const getClienteById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    if (!response.ok) throw new Error('Error al obtener cliente');
    return await response.json();
  } catch (error) {
    console.error('Error en getClienteById:', error);
    throw error;
  }
};

export const createCliente = async (cliente) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cliente),
    });
    if (!response.ok) throw new Error('Error al crear cliente');
    return await response.json();
  } catch (error) {
    console.error('Error en createCliente:', error);
    throw error;
  }
};

export const updateCliente = async (id, cliente) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cliente),
    });
    if (!response.ok) throw new Error('Error al actualizar cliente');
    return await response.json();
  } catch (error) {
    console.error('Error en updateCliente:', error);
    throw error;
  }
};

export const deleteCliente = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Error al eliminar cliente');
    return true;
  } catch (error) {
    console.error('Error en deleteCliente:', error);
    throw error;
  }
};