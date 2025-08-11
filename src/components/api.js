import axios from "axios";

const API_URL = "https://jsonplaceholder.typicode.com/todos";

export const getTodos = async (page = 1, limit = 10) => {
  const response = await axios.get(`${API_URL}?_limit=${limit}&_page=${page}`);
  return {
    data: response.data,
    total: parseInt(response.headers["x-total-count"], 5),
  };
};


export const addTodo = async (todo) => {
  const response = await axios.post(API_URL, todo);
  return response.data;
};

export const updateTodo = async (id, todoData) => {
  const response = await axios.put(`${API_URL}/${id}`, todoData);
  return response.data;
};

export const deleteTodo = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
  return id;
};
