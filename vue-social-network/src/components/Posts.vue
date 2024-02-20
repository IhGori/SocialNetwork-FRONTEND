<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<div>
		<h1>Lista de Postagens</h1>
		<ul>
			<li v-for="post in posts" :key="post.id">
				{{ post.title }}
				{{ post.body }}
			</li>
		</ul>
	</div>
</template>


<script>
// Importe o Axios no seu componente Vue
import axios from 'axios';

export default {
	data() {
		return {
			posts: []
		};
	},

	created() {
		// Faça a solicitação GET para a rota do backend Django
		axios.get('http://localhost:8000/api/posts/')
			.then(response => {
				// Se a solicitação for bem-sucedida, atualize a variável de posts com os dados recebidos
				this.posts = response.data;
				console.log(this.posts);
			})
			.catch(error => {
				// Se ocorrer um erro, exiba o erro no console
				console.error('Houve um erro ao recuperar as postagens:', error);
			});
	}
}

</script>
