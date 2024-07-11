import Vue from 'vue';
import Router from 'vue-router';
import DefaultLayout from '@/layouts/defaultLayout.vue';

Vue.use(Router);

const router = new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: DefaultLayout,
            children: [
                {
                    path: '',
                    name: 'Home',
                    component: () => import('@/views/HomePage.vue'),
                },
                {
                    path: 'test',
                    name: 'Test',
                    component: () => import('@/views/TestView/TestPage.vue'),
                },
                {
                    path: 'player-list',
                    name: 'PlayerList',
                    component: () => import('@/views/PlayerView/PlayerList.vue'),
                },
                {
                    path: '/player-display/:playerId', // 添加 playerId 参数
                    name: 'PlayerDisplay',
                    component: () => import('@/views/PlayerView/PlayerDisplay.vue'),
                },

            ],
        },
    ],
});

export default router;

