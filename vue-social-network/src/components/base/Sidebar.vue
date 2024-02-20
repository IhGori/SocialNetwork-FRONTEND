<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<v-navigation-drawer app class="sidebar" width="250" right>
		<v-list dense>
			<v-list-item-group>
				Contatos
				<v-list-item class="sidebar__item" v-for="friend in user.friends" :key="friend.id">
					<v-list-item-content @click="chatFriend(friend)" class="sidebar__item-content">
						<v-list-item-title>
							{{ friend.username }}
						</v-list-item-title>
					</v-list-item-content>
				</v-list-item>
			</v-list-item-group>
		</v-list>
	</v-navigation-drawer>
</template>

<script>
import { useAuthStore } from '../../utils/auth.js'
import axios from 'axios';

export default {
	props: {
		user: {
			type: Object,
			required: true
		}
	},
	methods: {
		logout() {
			console.log('entrou no logout');
			const authStore = useAuthStore();
			authStore.logout();
			this.$router.push('/login');
		},

		chatFriend(data) {
			axios.post(`http://127.0.0.1:8000/api/chat/generate-channel/`, {
				sender_id: this.user.id,
				receiver_id: data.id
			},)
				.then((response) => {
					const chat = {
						friend: data,
						chat_id: response.data
					}
					this.$emit('choosed', chat);
				})
				.catch(error => {
					console.error('Erro ao gerar novo token: ', error);
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.sidebar {
	background: rgb(243, 243, 243);
	padding-left: 12px;
	padding-right: 12px;
	font-weight: bold;
	color: rgb(153, 147, 147);

	&__item {
		cursor: pointer;
		color: black;
		font-weight: 600;
		font-size: 16px;
		&:hover {
			background-color: rgb(227, 227, 228);
		}
	}
}
</style>