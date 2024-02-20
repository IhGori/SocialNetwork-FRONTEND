<template>
	<div>
		<header-home />
		<content-home />
		<sidebar-home />
	</div>
</template>

<script>
import axios from 'axios';
import HeaderHome from './base/Header.vue';
import ContentHome from './base/Content.vue';
import SidebarHome from './base/Sidebar.vue';

export default {
	components: {
		HeaderHome,
		ContentHome,
		SidebarHome,
	},

	data() {
		return {
		posts: [],
		};
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
};
</script>
