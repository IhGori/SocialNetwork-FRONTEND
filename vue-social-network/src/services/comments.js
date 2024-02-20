import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

const ApiCommentsService = {
	// Recupera comentários para uma postagem específica
	getCommentsForPost(postId) {
		return axios.get(`${API_URL}/posts/${postId}/comments/`);
	},

	// Adicione um novo comentário a uma postagem (é necessária autenticação)
	addCommentToPost(payload) {
		return axios.post(`${API_URL}/posts/${payload.post_id}/comments/`, {
			text: payload.text
		}, {
			headers: {
				Authorization: `Bearer ${payload.token}`
			}
		});
	},

	// Atualize um comentário existente (autenticação e propriedade necessárias)
	updateComment(postId, commentId, commentData, token) {
		return axios.put(`${API_URL}/posts/${postId}/comments/${commentId}/`, commentData, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
	},

	// Exclua um comentário (autenticação e propriedade necessárias)
	deleteComment(postId, commentId, token) {
		return axios.delete(`${API_URL}/posts/${postId}/comments/${commentId}/`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
	}
};

export default ApiCommentsService;
