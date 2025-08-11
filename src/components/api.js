import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/todos';

export const getTodos = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

export const addTodo = async (todo) => {
  try {
    const response = await axios.post(API_URL, {
      title: todo.name,
      completed: todo.status === 'Done',
      userId: 1, 
    });
    return response.data;
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

  export const updateTodo = async (id, todo) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, {
        id,
        title: todo.name,
        completed: todo.status === 'Done',
        userId: 1,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating todo:', error);
      throw error;
    }
  };

export const deleteTodo = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return id;
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};