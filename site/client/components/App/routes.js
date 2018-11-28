import HomePage from '../pages/HomePage';
import OrderPage from '../pages/OrderPage';

const routes = [
  {
    exact: true,
    path: '/:language',
    pageName: 'home',
    component: HomePage,
  },
  {
    exact: true,
    path: '/:language/order',
    pageName: 'order',
    component: OrderPage,
  },
];

export default routes;
