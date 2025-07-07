import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export const getPhotographers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/photographers`);
    return response.data;
  } catch (error) {
    console.error('Error fetching photographers:', error);
    throw error;
  }
};

export const getPhotographerById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/photographers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching photographer:', error);
    throw error;
  }
};