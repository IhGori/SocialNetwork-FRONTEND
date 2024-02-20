
import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
	id: 'auth',
	state: () => ({
		isAuthenticated: false,
		accessToken: '',
		refreshToken: '',
		user: null,
	}),

	actions: {
		initialize() {
			const storedAuthData = JSON.parse(localStorage.getItem('authData'));
			if (storedAuthData) {
				const { access, refresh, user } = storedAuthData;
				this.isAuthenticated = true;
				this.accessToken = access;
				this.refreshToken = refresh;
				this.user = user;
			}
		},

		login({ access, refresh, user }) {
			this.isAuthenticated = true;
			this.accessToken = access;
			this.refreshToken = refresh;
			this.user = user;

			localStorage.setItem('authData', JSON.stringify({ access, refresh, user }));
		},

		logout() {
			this.isAuthenticated = false;
			this.accessToken = '';
			this.refreshToken = '';
			this.user = null;

			this.clearStorage();
		},

		clearStorage() {
			localStorage.removeItem('authData');
		},
	},
	persist: true,
});
