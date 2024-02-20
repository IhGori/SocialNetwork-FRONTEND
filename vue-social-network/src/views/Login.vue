<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<v-container>
		<v-row justify="center">
			<v-col cols="12" sm="8" md="6">
				<v-card class="elevation-12">
					<v-toolbar color="primary" dark>
						<v-toolbar-title>Login</v-toolbar-title>
					</v-toolbar>
					<v-card-text>
						<v-form @submit.prevent="login">
							<v-text-field v-model="username" label="Usuário" outlined prepend-icon="mdi-account" required />
							<v-text-field v-model="password" label="Senha" outlined prepend-icon="mdi-lock" type="password"
								required />
							<v-btn color="primary" dark block type="submit">Entrar</v-btn>
						</v-form>
					</v-card-text>
				</v-card>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import UserService from '../services/users.js';
import { useAuthStore } from '../utils/auth.js';

export default {
	data() {
		return {
			username: '',
			password: ''
		};
	},

	methods: {
		login() {
			console.log('useAuth', useAuthStore)
			UserService.loginUser({
				username: this.username,
				password: this.password
			}).then(response => {
				const access = response.data.tokens.access;
				const refresh = response.data.tokens.refresh;
				const user = response.data.user

				this.storeData(access, refresh, user);
			}).catch(error => {
				console.error('Erro ao fazer login:', error);
			});
		},

		storeData(access, refresh, user) {
			const authStore = useAuthStore();
			authStore.login({ access, refresh, user });

			if (authStore.isAuthenticated) {
				this.$router.push('/social');
			} else {
				console.log('Erro ao salvar os dados de autenticação');
			}
		}
	}
};
</script>
