import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const E1 = resolve => {
    require.ensure([], () => {
        resolve(require('components/experiment/e1.vue'));
    });
};

const E2 = resolve => {
    require.ensure([], () => {
        resolve(require('components/experiment/e2.vue'));
    });
};

const E3 = resolve => {
    require.ensure([], () => {
        resolve(require('components/experiment/e3.vue'));
    });
};

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/e1'
        },
        {
            path: '/e1',
            component: E1
        },
        {
            path: '/e2',
            component: E2
        },
        {
            path: '/e3',
            component: E3
        }
    ]
});
