import Vue from 'vue';
import Router from 'vue-router';
import Sprite from './views/Sprite.vue';

Vue.use(Router);

export default new Router({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: [
		{
			path: '/',
			redirect: '/css-sprite',
		}, {
			path: '/css-sprite',
			component: Sprite,
			name: 'sprite',
		},
	],
});
