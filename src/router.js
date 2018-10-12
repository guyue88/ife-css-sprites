import Vue from 'vue';
import Router from 'vue-router';
import Sprite from './views/Sprite.vue';

Vue.use(Router);

const router = new Router({
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

router.beforeEach((to, from, next) => {
	// 统计代码
	// _hmt.push(['_trackPageview', pageURL]) 必须是以"/"（斜杠）开头的相对路径
	if (to.path) {
		window._hmt.push(['_trackPageview', to.fullPath]);
	}
	next();
});

export default router;
