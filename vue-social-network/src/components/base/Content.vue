<!-- eslint-disable vue/multi-word-component-names -->
<template>
	<chat v-if="showChat" :friend="localChat.friend" :chat-id="localChat.chat_id" @close="closeChat" />
	<div class="container">
		<div class="container__divider">
			<div :class="classChooseFollow" @click="choosePosts('follow')">
				Seguindo
			</div>
			<div :class="classChooseGeral" @click="choosePosts('geral')">
				Geral
			</div>
		</div>
		<div class="container__myPost">
			<div class="container__myPost-top">
				<div class="container__myPost-top--profile">
					<img :src="user.picture ? user.picture.replace('minio', '127.0.0.1') : ''" alt="">
				</div>
				<div class="container__myPost-top--message">
					<textarea v-model="myPost" class="textArea" cols="30" rows="1"
						placeholder="No que você está pensando..." />
					<div class="container__myPost-top--message-icon">
						<v-icon class="iconSend" icon="mdi-send" @click="createPost" />
					</div>
				</div>
			</div>
			<v-divider></v-divider>
			<div class="container__myPost-bottom" @dragover.prevent @dragenter.prevent @dragleave.prevent
				@drop.prevent="handleDrop">
				<input type="file" name="myImage" accept="image/jpeg, image/jpg, image/png" @change="handleFileInput" />
				<p>{{ selectedFileName || 'Arraste e solte o arquivo aqui ou clique para selecionar uma imagem' }}</p>
			</div>
		</div>
		<div v-for="post in selectedPosts" :key="post.id" class="container__card">
			<div class="container__card-user">
				<div class="container__card-user--data">
					<div class="container__card-user--data-picture">
						fo
					</div>
					<div class="container__card-user--data-username">
						@{{ post.author }}
					</div>
					<div class="container__card-user--data-date">
						{{ formatCreatedAt(post.created_at) }}
					</div>
				</div>
				<div v-if="showXPost(post)" class="container__card-user--delete" @click="deletePost(post.id)">
					X
				</div>
			</div>
			<div class="container__card-picture">
				<img :src="post.picture ? post.picture.replace('minio', '127.0.0.1') : ''" alt="">
			</div>
			<div class="container__card-body">
				{{ post.body }}
			</div>
			<v-divider></v-divider>
			<div class="container__card-counter">
				<div @click="controlLike(likedByCurrentUser(post), post.id)" class="container__card-counter--likes">
					<v-icon v-if="likedByCurrentUser(post)" class="iconLike" icon="mdi-thumb-up"></v-icon>
					<v-icon v-else class="iconLike" icon="mdi-thumb-up-outline"></v-icon>
					Curtir
				</div>
				<div class="container__card-counter--comments">
					<div class="container__card-counter--coments-totalComment">
						{{ post.comments_count }} comentários
					</div>
					<div class="container__card-counter--coments-totalLikes">
						{{ post.like_count }} curtidas
					</div>
				</div>
			</div>
			<v-divider></v-divider>
			<div>
				<div v-for="comment in post.comments" :key="comment.id" class="container__card-comments">
					<div class="container__card-comments--container">
						<div class="container__card-comments--container-top">
							<div class="container__card-comments--container-top-message">
								<div class="container__card-comments--container-top--picture">
									fotto
								</div>
								<div class="container__card-comments--container-top--body">
									<div class="container__card-comments--container-top--body-username">
										@{{ comment.author.username }}
									</div>
									<div class="container__card-comments--container-top--body-message">
										{{ comment.text }}
									</div>
								</div>
								<div @click="deleteComment(post.id, comment.id)"
									class="container__card-comments--container-top-delete">
									X
								</div>
							</div>
						</div>
						<div class="container__card-comments--container-bottom">
							<div v-if="comment.created_at" class="container__card-comments--time">
								{{ formatCreatedAt(comment.created_at) }}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="container__card-yourComment">
				<div class="container__card-yourComment--picture">
					<img src="" alt="Foto de perfil" class="imgProfile">
				</div>
				<div class="container__card-yourComment--body">
					<div class="container__card-yourComment--body-message">
						<textarea v-model="comments[post.id]" class="textArea" cols="30" rows="1"
							placeholder="Comente..." />
					</div>
					<div class="container__card-yourComment--body-icon">
						<v-icon class="iconSend" icon="mdi-send" @click="postComment(post.id)" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import PostService from '../../services/posts.js';
import TokensService from '../../services/tokens.js';
import moment from 'moment';
import axios from 'axios';
import Chat from '../Chat.vue';
import isEmpty from 'lodash/isEmpty';

export default {
	components: {
		Chat,
	},

	props: {
		user: {
			type: Object,
			required: true
		},
		chat: {
			type: Object,
			default: () => ({}),
		},
	},
	data() {
		return {
			posts: {},
			postsFriends: {},
			localChat: {},
			postsSelect: 'follow',
			newComment: '',
			comments: {},
			myPost: '',
			access: '',
			refresh: '',
			selectedFileName: '',
			startChat: false,
		};
	},

	computed: {
		classChooseFollow() {
			return this.postsSelect === 'follow'
				? 'container__dividerChoosed' : 'container__choose'
		},

		classChooseGeral() {
			return this.postsSelect === 'geral'
				? 'container__dividerChoosed' : 'container__choose'
		},

		selectedPosts() {
			return this.postsSelect === 'follow' ? this.postsFriends : this.posts;
		},

		showChat() {
			return !isEmpty(this.localChat);
		},

		likedByCurrentUser() {
			return post => {
				return post.likes.some(like => like.user.username === this.user.username);
			};
		},
	},

	mounted() {
		const storedUserData = localStorage.getItem('authData');
		if (storedUserData) {
			const storedToken = JSON.parse(storedUserData);
			this.access = storedToken.access;
			this.refresh = storedToken.refresh;
		}
		this.fetchPosts();
		this.fetchPostsFriends();

		this.chatSocket = new WebSocket(`ws://127.0.0.1:8000/ws/post_updates/`);
		this.chatSocket.onmessage = (event) => {
			const receivedData = JSON.parse(event.data);
			this.fetchPosts();
			this.fetchPostsFriends();
			console.log(receivedData);
		}
	},

	watch: {
		chat: {
			handler(newValue) {
				this.localChat = newValue;
			},
			immediate: true,
			deep: true,
			picture: '',
		},
	},

	methods: {
		fetchPosts() {
			PostService.getAllPosts()
				.then(response => {
					this.posts = response.data;
				}).catch(error => {
					console.error('Erro ao buscar posts: ', error);
				});
		},

		fetchPostsFriends() {
			TokensService.refreshToken(this.refresh)
				.then(response => {
					axios.get(`http://127.0.0.1:8000/api/posts/friends/`, {
						headers: {
							Authorization: `Bearer ${response.data.access}`
						}
					})
						.then(response => {
							this.postsFriends = response.data;
						})
						.catch(error => {
							console.error('Erro ao obter postagens de amigos: ', error);
						});
				})
				.catch(error => {
					console.error('Erro ao gerar novo token: ', error);
				});
		},


		createPost() {
			TokensService.refreshToken(this.refresh)
				.then(response => {
					const formData = new FormData();
					formData.append('body', this.myPost);
					if (this.picture.length > 0) {
						for (let i = 0; i < this.picture.length; i++) {
							formData.append('picture', this.picture[i]);
						}
					}
					axios.post(`http://127.0.0.1:8000/api/posts/`, formData, {
						headers: {
							Authorization: `Bearer ${response.data.access}`
						}
					})
						.then(() => {
							this.fetchPosts();
							this.fetchPostsFriends();
							this.myPost = '';
						})
						.catch(error => {
							console.error('Erro ao gerar novo token: ', error);
						});
				})
				.catch(error => {
					console.error('Error ao atualizar token: ', error);
				});
		},

		deletePost(post_id) {
			TokensService.refreshToken(this.refresh)
				.then(response => {
					axios.delete(`http://127.0.0.1:8000/api/posts/${post_id}/`, {
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
		},

		postComment(post_id) {
			TokensService.refreshToken(this.refresh)
				.then(response => {
					const payload = {
						post_id: post_id,
						text: this.comments[post_id],
						access: response.data.access
					};
					axios.post(`http://127.0.0.1:8000/api/posts/${payload.post_id}/comments/`, {
						text: payload.text
					}, {
						headers: {
							Authorization: `Bearer ${payload.access}`
						}
					}).then(() => {
						this.comments[post_id] = '';
					})
						.catch(error => {
							console.error('Erro ao gerar novo token: ', error);
						});
				})
				.catch(error => {
					console.error('Error ao atualizar token: ', error);
				});
		},

		showXPost(post) {
			return post.author === this.user.username;
		},

		deleteComment(post_id, comment_id) {
			TokensService.refreshToken(this.refresh)
				.then(response => {
					axios.delete(`http://127.0.0.1:8000/api/posts/${post_id}/comments/${comment_id}/`, {
						headers: {
							Authorization: `Bearer ${response.data.access}`
						}
					})
						.catch(error => {
							console.error('Erro ao excluir comentário: ', error);
						});
				})
				.catch(error => {
					console.error('Error ao atualizar token: ', error);
				});
		},

		formatCreatedAt(created_at) {
			const now = moment();
			const postDate = moment(created_at);
			const diffInMinutes = now.diff(postDate, 'minutes');

			if (diffInMinutes < 60) {
				return `${diffInMinutes} min`;
			} else if (diffInMinutes < 1440) {
				return `${Math.floor(diffInMinutes / 60)}h`;
			} else {
				return postDate.format('DD MMM');
			}
		},

		choosePosts(type) {
			this.postsSelect = type;
		},

		handleFileInput(event) {
			const files = event.target.files;
			this.picture = files;
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

		controlLike(status, post_id) {
			TokensService.refreshToken(this.refresh)
				.then(response => {
					const method = status ? 'delete' : 'post';
					const url = `http://127.0.0.1:8000/api/posts/${post_id}/like/`;

					axios({
						method: method,
						url: url,
						headers: {
							Authorization: `Bearer ${response.data.access}`
						}
					})
						.then(() => { })
						.catch(error => {
							console.error(`Erro ao ${status ? 'remover' : 'dar'} like: `, error); // Use o template string para exibir o verbo correto
						});
				})
				.catch(error => {
					console.error('Error ao atualizar token: ', error);
				});
		},

		closeChat() {
			this.showChat = false;
			this.localChat = {};
		},

	},
};
</script>

<style lang="scss" scoped>
.container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 32px;
	padding: 0px 200px;

	&__divider {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: center;
		gap: 32px;
		font-size: 18px;
		font-weight: bold;
		margin-bottom: 42px;
		position: relative;
		cursor: pointer,
	}

	&__myPost {
		display: flex;
		flex-direction: column;
		gap: 12px;
		width: 100%;
		border: 1px solid rgb(218, 217, 217);
		border-radius: 12px;
		margin-bottom: 42px;
		padding: 12px 24px;

		&-top {
			display: flex;
			flex-direction: row;
			gap: 12px;

			&--profile {
				width: 35px !important;
				height: 35px !important;
				border-radius: 50%;

				img {
					width: 35px !important;
					height: 35px !important;
					border-radius: 50%;
				}
			}

			&--message {
				width: 100%;
				background: rgb(234, 236, 236);
				border-radius: 12px;
				padding: 12px 24px;
				display: flex;
				flex-direction: column;
				align-items: end;
				gap: 12px;

				&-icon {
					color: gray;
				}
			}
		}

		&-bottom {
			position: relative;
			width: 100%;
			height: 70px;
			border: 2px dashed #ccc;
			border-radius: 12px;
			text-align: center;
			overflow: hidden;
			color: rgb(185, 185, 185);
			padding-top: 20px;

			input[type=file] {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				opacity: 0;
			}
		}
	}

	&__card {
		width: 100%;

		&-user {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			gap: 5px;

			&--data {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				align-items: center;

				&-picture {
					width: 35px !important;
					height: 35px !important;
					background: red;
					border-radius: 50%;
				}

				&-username {
					font-weight: bold;
				}

				&-date {
					color: gray;
				}
			}

			&--delete {
				font-weight: bold;
				color: rgb(129, 129, 131);
				cursor: pointer;
			}
		}

		&-title {
			margin-top: 12px;
			font-weight: bold;
			font-size: 18px;
		}

		&-picture {
			display: flex;
			align-items: center;
			justify-content: center;
			margin-top: 12px;
			width: 100%;
			height: auto;
			max-width: 100%;
			max-height: 100%;

			img {
				max-width: 100%;
				max-height: 100%;
				object-fit: contain;
				border-radius: 12px;
			}
		}

		&-body {
			margin: 8px 0;
			text-align: justify;
		}

		&-counter {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			padding: 12px 32px;

			&--likes {
				color: rgb(148, 144, 144);
			}

			&--comments {
				color: rgb(148, 144, 144);
				display: flex;
				flex-direction: row;
				gap: 14px;
			}
		}

		&-comments {
			display: flex;
			flex-direction: row;
			gap: 12px;
			padding: 6px 32px;

			&--container {
				display: flex;
				flex-direction: column;
				width: 100%;

				&-top {
					&-message {
						display: flex;
						flex-direction: row;
						gap: 12px;
					}

					&--picture {
						width: 35px !important;
						height: 35px !important;
						background: red;
						border-radius: 50%;
					}

					&--body {
						border-radius: 12px;
						background-color: rgb(239, 240, 240);
						padding: 4px 16px;
						width: 100%;

						&-username {
							font-size: 16px;
							font-weight: bold;
						}
					}

					&--time {
						margin-top: -10px;
						padding: 0 84px;
						font-size: 12px;
						color: rgb(155, 155, 154);
					}
				}

				&-bottom {
					margin-top: 6px;
					margin-left: 50px;
				}
			}
		}

		&-yourComment {
			display: flex;
			flex-direction: row;
			gap: 12px;
			padding: 12px 32px;

			&--picture {
				width: 35px !important;
				height: 35px !important;
				background: red;
				border-radius: 50%;
			}

			&--body {
				border-radius: 12px;
				background-color: rgb(239, 240, 240);
				padding: 6px 12px;
				width: 100%;
				display: flex;
				flex-direction: column;
				align-items: end;
				gap: 12px;
				position: relative;

				&-message {
					width: 100% !important;
					border: none;

					textarea {
						padding: 4px;
						width: 100%;
						border: none;
						outline: none;
					}
				}

				&-icon {
					color: gray;
				}
			}
		}
	}
}

.container__dividerChoosed {
	color: #48a9a6;
	border-bottom: 2px solid #48a9a6;
}

.textArea {
	border: none;
	outline: none;
	width: 100%;
}

.iconLike {
	color: #48a9a6;
}

.imgProfile {
	width: 35px;
	height: 35px;
	border-radius: 50%;
}
</style>