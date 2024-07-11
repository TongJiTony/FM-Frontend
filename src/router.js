import Vue from 'vue';
import Router from 'vue-router';
import Login from './views/common/login.vue';
import DefaultLayout from './layouts/defaultLayout.vue';

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
            ],
        },
        {
            path: '/login',
            component: Login
        },
        // 其他路由记录...
    ]
});

export default router;