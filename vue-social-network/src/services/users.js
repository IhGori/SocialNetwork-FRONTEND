import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const ApiService = {
	registerUser(userData) {
		return axios.post(`${API_URL}/user/register`, userData);
	},

	loginUser(userData) {
		return axios.post(`${API_URL}/user/login`, userData);
	},

	updateUser(userId, userData) {
		return axios.patch(`${API_URL}/user/${userId}`, userData);
	},

	deleteUser(userId) {
		return axios.delete(`${API_URL}/user/${userId}`);
	}
};

export default ApiService;

