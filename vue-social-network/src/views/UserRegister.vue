<template>
	<div class="registration-form">
		<h2>Registro de Usuário</h2>
		<form @submit.prevent="registerUser">
			<div class="form-group">
				<label for="username">Nome de Usuário:</label>
				<input type="text" id="username" v-model="userData.username" class="form-control" required>
			</div>
			<div class="form-group">
				<label for="password">Senha:</label>
				<input type="password" id="password" v-model="userData.password" class="form-control" required>
			</div>
			<div class="form-group">
				<label for="password2">Confirmar Senha:</label>
				<input type="password" id="password2" v-model="password2" class="form-control" required>
				<span v-if="passwordMismatch" class="error-msg">As senhas não coincidem.</span>
			</div>
			<div class="form-group">
				<label for="email">Email:</label>
				<input type="email" id="email" v-model="userData.email" class="form-control">
			</div>
			<div class="form-group">
				<label for="phone">Telefone:</label>
				<input type="text" id="phone" v-model="userData.phone" class="form-control">
			</div>
			<div class="form-group">
				<label for="gender">Gênero:</label>
				<select id="gender" v-model="userData.gender" class="form-control">
					<option value="F">Feminino</option>
					<option value="M">Masculino</option>
					<option value="N">Neutro</option>
				</select>
			</div>
			<div class="form-group" @dragover.prevent @dragenter.prevent @dragleave.prevent @drop.prevent="handleDrop">
				<input type="file" name="myImage" accept="image/jpeg, image/jpg, image/png" @change="handleFileInput" />
				<p>{{ selectedFileName || 'Arraste e solte o arquivo aqui ou clique para selecionar uma imagem' }}</p>
			</div>
			<div class="form-group">
				<button type="submit" :disabled="passwordMismatch" class="btn btn-primary">Registrar</button>
			</div>
		</form>
	</div>
</template>

<script>
import axios from 'axios';
export default {
	data() {
		return {
			userData: {
				username: '',
				password: '',
				email: '',
				phone: '',
				gender: '',
			},
			password2: '',
			picture: '',
		};
	},
	computed: {
		passwordMismatch() {
			return this.userData.password !== this.password2;
		}
	},
	methods: {
		async registerUser() {
			const formData = new FormData();
			formData.append('username', this.userData.username);
			formData.append('password', this.userData.password);
			formData.append('password2', this.password2);
			formData.append('email', this.userData.email);
			formData.append('phone', this.userData.phone);
			formData.append('gender', this.userData.gender);

			for (let i = 0; i < this.picture.length; i++) {
				formData.append('picture', this.picture[i]);
			}
			console.log(formData);
			axios.post(`http://127.0.0.1:8000/api/user/register`, formData)
				.then(response => {
					console.log(response);
					this.$router.push('/login');
				})
				.catch(error => {
					console.error('Erro ao registrar usuário: ', error);
				});
		},


		handleFileInput(event) {
			const files = event.target.files;
			console.log('FILESSS: ', files);
			this.picture = files;
			console.log('foto perfil: ', this.picture);
			const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
			let isValid = false;

			for (let i = 0; i < files.length; i++) {
				if (allowedTypes.includes(files[i].type)) {
					isValid = true;
				} else {
					isValid = false;
					break;
				}
			}

			if (!isValid) {
				alert('Por favor, selecione apenas arquivos nos formatos JPG, JPEG ou PNG.');
				event.target.value = '';
				this.selectedFileName = '';
			} else {
				this.selectedFileName = files[0].name;
			}
		},
	}
};
</script>

<style scoped>
.registration-form {
	max-width: 400px;
	margin: 0 auto;
	padding: 20px;
	border: 1px solid #ccc;
	border-radius: 5px;
	background-color: #f9f9f9;
}

.form-group {
	margin-bottom: 20px;
}

label {
	font-weight: bold;
}

.error-msg {
	color: red;
}

.form-control {
	width: 100%;
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 5px;
}

.btn {
	padding: 10px 20px;
	background-color: #007bff;
	border: none;
	color: #fff;
	border-radius: 5px;
	cursor: pointer;
}

.btn-primary {
	background-color: #007bff;
}

.btn-primary:hover {
	background-color: #0056b3;
}

.form-control-file {
	padding: 10px;
	border: 1px solid #ccc;
	border-radius: 5px;
	background-color: #fff;
	cursor: pointer;
}
</style>
