import Vue from 'vue';
import App from './App';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import goods from 'components/goods/goods';
import seller from 'components/seller/seller';
import ratings from 'components/ratings/ratings';
import 'common/scss/index.scss';

Vue.use(VueRouter);
Vue.use(VueResource);

const routes = [
  {path: '/goods', component: goods},
  {path: '/seller', component: seller},
  {path: '/ratings', component: ratings}
];

const router = new VueRouter({
  mode: 'abstract',
  base: __dirname,
  linkActiveClass: 'active',
  routes
});

/* eslint-disable no-new */
const app = new Vue({
  router,
  render: h => h(App)
}).$mount('#app');

router.push('/goods');
