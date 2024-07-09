import Vue from 'vue';
import VueRouter from 'vue-router';
import Test from './components/test.vue';

Vue.use(VueRouter);

const router = new VueRouter({
    routes: [
        {
            path: '/test',
            component: Test
        }
        // 其他路由记录...
    ]
});

export default router;