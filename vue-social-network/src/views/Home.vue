<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<div>
		<header-home :user="user" />
		<content-home :user="user" :chat="data" />
		<sidebar-home :user="user" @choosed="chatFriend" />
	</div>
</template>

<script>
import axios from 'axios';
import HeaderHome from '../components/base/Header.vue';
import ContentHome from '../components/base/Content.vue';
import SidebarHome from '../components/base/Sidebar.vue';

export default {
	components: {
		HeaderHome,
		ContentHome,
		SidebarHome,
	},

	data() {
		return {
			posts: [],
			user: {},
			data: {},
			isAuthenticated: false,
		};
	},

	mounted() {
		const storedUserData = localStorage.getItem('authData');
		if (storedUserData) {
			const storedUser = JSON.parse(storedUserData);
			this.user = storedUser.user;
			// this.fetchUser(this.user.id);
		}
	},

	created() {
		// Faça a solicitação GET para a rota do backend Django
		axios
			.get('http://localhost:8000/api/posts/')
			.then((response) => {
				// Se a solicitação for bem-sucedida, atualize a variável de posts com os dados recebidos
				this.posts = response.data;
				console.log(this.posts);
			})
			.catch((error) => {
				// Se ocorrer um erro, exiba o erro no console
				console.error('Houve um erro ao recuperar as postagens:', error);
			});
	},

	methods: {
		fetchUser(user_id) {
			console.log(user_id);
			axios
				.get(`http://localhost:8000/api/user/info/${user_id}`)
				.then((response) => {
					console.log('consulta perfil: ', response);
				})
				.catch((error) => {
					console.error('Houve um erro ao recuperar as postagens:', error);
				});
		},

		chatFriend(dataChat) {
			this.data = dataChat;
		},
	},
};
</script>

<style lang="scss" scoped></style>