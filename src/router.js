import Vue from 'vue';
import Router from 'vue-router';
import DefaultLayout from '@/layouts/defaultLayout.vue';

Vue.use(Router);

export default new Router({
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
                    path: 'team',
                    name: 'Team',
                    component: () => import('@/views/TeamView/TeamList.vue'),
                },
            ],
        },
    ],
});
