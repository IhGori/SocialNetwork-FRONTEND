import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const JwtTokenService = {
	refreshToken(refreshToken) {
		return axios.post(`${API_URL}/token/refresh/`, { refresh: refreshToken });
	},

	getToken(username, password) {
		return axios.post(`${API_URL}/token/`, { username, password });
	}
};

export default JwtTokenService;
