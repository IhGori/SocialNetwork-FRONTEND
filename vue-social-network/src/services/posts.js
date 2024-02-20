import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const ApiPostsService = {
	// Recupera uma lista de todas as postagens
	getAllPosts() {
		return axios.get(`${API_URL}/posts/`);
	},

	// Cria uma nova postagem (autenticação necessária)
	createPost(postData, token) {
	return axios.post(`${API_URL}/posts/`, postData, {
		headers: {
		Authorization: `Bearer ${token}`
		}
	});
	},

	// Recupera detalhes de uma postagem específica
	getPostById(postId) {
		return axios.get(`${API_URL}/posts/${postId}/`);
	},

	// Atualiza uma postagem existente (autenticação e propriedade necessárias)
	updatePost(postId, postData, token) {
	return axios.put(`${API_URL}/posts/${postId}/`, postData, {
		headers: {
		Authorization: `Bearer ${token}`
		}
	});
	},

	// Exclui uma postagem (autenticação e propriedade necessárias)
	deletePost(postId, token) {
	return axios.delete(`${API_URL}/posts/${postId}/`, {
		headers: {
		Authorization: `Bearer ${token}`
		}
	});
	}
};

export default ApiPostsService;
