<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<v-app-bar app color="secondary" class="header">
		<v-toolbar-title>
			<span class="font-weight-bold">SocialNetwork</span>
		</v-toolbar-title>
		<v-spacer></v-spacer>
		<div class="user">
			<v-menu offset-y>
				<template v-slot:activator="{ on }">
					<v-avatar v-on="on" class="user__picture" :size="40">
						<img :src="user.picture ? user.picture.replace('minio', '127.0.0.1') : ''" alt="">
					</v-avatar>
				</template>
			</v-menu>
			<span class="user__username">{{ user.username }}</span>
		</div>
		<v-btn @click="logout" icon>
			<v-icon>mdi-exit-to-app</v-icon>
		</v-btn>
	</v-app-bar>
</template>

<script>
import { useAuthStore } from '../../utils/auth.js'
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
	}
};
</script>

<style lang="scss" scoped>
.header {
	background-color: #5b2dc4;
}

.user {
	display: flex;
	flex-direction: row;
	gap: 16px;
	justify-content: center;
	align-items: center;

	&__username {
		margin-right: 42px;
	}
}
</style>
