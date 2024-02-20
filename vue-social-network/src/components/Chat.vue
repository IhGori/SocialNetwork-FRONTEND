<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<div class="chat">
		<div class="chat__header">
			<div class="chat__header-user">
				<div class="chat__header-user--profile">
					fotto
				</div>
				<div v-if="friend" class="chat__header-user--username">
					@{{ friend.username }}
				</div>
			</div>
			<div @click="closeChat" class="chat_header-x">
				X
			</div>
		</div>
		<div class="chat-messages" ref="messages">
			<div class="message" v-for="(message, index) in messages" :key="index"
				:class="message.sender === 'Você' ? 'sent-message' : 'received-message'">
				<div class="message-sender">{{ message.sender }}</div>
				<div class="message-content">{{ message.content }}</div>
			</div>
		</div>
		<div class="chat-input">
			<input type="text" v-model="newMessage" @keyup.enter="sendMessage" placeholder="Digite sua mensagem...">
			<button @click="sendMessage">Enviar</button>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import TokensService from '../services/tokens.js';

export default {
	props: {
		friend: {
			type: Object,
			required: true
		},
		chatId: {
			type: String,
			default: '',
			required: true,
		}
	},
	data() {
		return {
			newMessage: '',
			messages: [],
			signals: [],
			user: {},
			access: '',
			refresh: '',
			chatSocket: null,
			messageToSend: '',
		};
	},
	mounted() {
		const storedUserData = localStorage.getItem('authData');
		if (storedUserData) {
			const storedUser = JSON.parse(storedUserData);
			this.user = storedUser.user;
			this.access = storedUser.access;
			this.refresh = storedUser.refresh;
		}

		const roomName = this.chatId.channel_id;
		this.chatSocket = new WebSocket(`ws://127.0.0.1:8000/ws/chat/${roomName}/`);
		this.chatSocket.onmessage = (event) => {
			const receivedMessage = JSON.parse(event.data).message;
			const userSendMessage = JSON.parse(event.data).username;
			console.log('JSON.parse(event.data): ', JSON.parse(event.data));
			console.log('mensagem recebida: ', receivedMessage);
			this.messageToSend = receivedMessage;
			this.writeMessageReceived(receivedMessage, userSendMessage);
		}
	},
	methods: {
		sendMessage() {
			if (this.newMessage.trim() !== '') {
				if (this.chatSocket.readyState === WebSocket.OPEN) {
					const messageData = {
						username: this.user.username,
						message: this.newMessage
					};
					this.chatSocket.send(JSON.stringify(messageData));
					this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
					const channel_id = this.chatId.channel_id;
					TokensService.refreshToken(this.refresh)
						.then(response => {
							axios.post(`http://localhost:8000/api/chat/${channel_id}/`, {
								text: this.messageToSend,
								receiver: this.friend.id
							}, {
								headers: {
									Authorization: `Bearer ${response.data.access}`
								}
							}).catch(error => {
								console.error('Erro ao gerar novo token: ', error);
							});
						})
						.catch(error => {
							console.error('Error ao atualizar token: ', error);
						});
					this.newMessage = '';
					this.messageToSend = '';
				} else {
					console.error('Conexão com websocket ainda não estabelecida.');
				}
			}
		},

		writeMessageReceived(message, user) {
			const sender = this.user.username === user ? 'Você' : user;
			this.messages.push({
				sender: sender,
				content: message
			});
			this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight;
		},

		closeChat() {
			this.chatSocket.close();
			this.$emit('close', true);
		}
	},

	beforeUnmount() {
		if (this.chatSocket) {
			this.chatSocket.close();
		}
	}
};
</script>


<style lang="scss" scoped>
.chat {
	display: flex;
	flex-direction: column;
	position: fixed;
	background-color: rgb(247, 245, 245);
	border-bottom: none;
	height: 400px;
	bottom: 0;
	width: 300px !important;
	right: 20px;
	z-index: 999;
	-webkit-box-shadow: -3px 4px 11px 0px rgba(0, 0, 0, 0.75);
	-moz-box-shadow: -3px 4px 11px 0px rgba(0, 0, 0, 0.75);
	box-shadow: -3px 4px 11px 0px rgba(0, 0, 0, 0.75);

	&__header {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 8px 8px;
		background-color: rgb(240, 243, 243);
		border-bottom: 1px solid rgb(226, 226, 226);

		&-user {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-items: center;
			gap: 4px;

			&--profile {
				width: 35px !important;
				height: 35px !important;
				border-radius: 50%;
				background-color: purple;
			}

			&--username {
				color: rgb(106, 107, 109);
			}
		}
	}
}

.chat-messages {
	flex-grow: 1;
	overflow-y: auto;
}

.chat-input {
	height: 10%;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px;
	background-color: white;
	border-top: 1px solid rgb(226, 226, 226);
}

.sent-message {
	align-self: flex-end;
	background-color: #DCF8C6;
	border-radius: 10px;
	margin: 5px;
	padding: 8px;
}

.received-message {
	align-self: flex-start;
	background-color: #E5E5EA;
	border-radius: 10px;
	margin: 5px;
	padding: 8px;
}

input {
	border: none;
	outline: none;
}
</style>
