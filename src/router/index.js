import Vue from 'vue';
import Router from 'vue-router';
import E1 from 'components/experiment/e1';
import E2 from 'components/experiment/e2';
import E3 from 'components/experiment/e3';

Vue.use(Router);

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/e3'
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
